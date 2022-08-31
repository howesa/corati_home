import csv
import tqdm
import logging
import numpy as np
from os import path
from collections import deque

import chainer
import chainerrl
from chainer import serializers
from chainer.backends import cuda

from src.abstract.agent import Agent
from src.finger.model import QFunction
from src.utilities.behaviour import AgentBehaviour
from src.visualise.visualise import visualise_agent
from src.finger.finger_agent_environment import FingerAgentEnv


class FingerAgent(Agent):

    def __init__(self, layout_config, agent_params, finger, train, verbose=True):
        self.logger = logging.getLogger(__name__)

        self.env = FingerAgentEnv(layout_config, agent_params, finger, train)

        # Agent Configuration.
        optimizer_name = 'Adam' if agent_params is None else agent_params['optimizer_name']
        lr = 0.001 if agent_params is None else agent_params['learning_rate']
        dropout_ratio = 0.2 if agent_params is None else int(agent_params['dropout_ratio'])
        n_units = 512 if agent_params is None else int(agent_params['n_units'])
        device_id = 0 if agent_params is None else int(agent_params['device_id'])
        pre_load = False if agent_params is None else bool(agent_params['pre_load'])
        self.gpu = True if agent_params is None else bool(agent_params['gpu'])
        self.save_path = path.join('data', 'models', 'finger') if agent_params is None \
            else agent_params['save_path']
        gamma = 0.99 if agent_params is None else float(agent_params['discount'])
        replay_size = 10 ** 6 if agent_params is None else int(agent_params['replay_buffer'])
        self.episodes = 1000000 if agent_params is None else int(agent_params['episodes'])
        self.log_interval = 1000 if agent_params is None else int(agent_params['log_interval'])
        self.log_filename = agent_params['log_file']
        self.verbose = verbose

        self.q_func = QFunction(embed_size=self.env.observation_space.shape[0],
                                dropout_ratio=dropout_ratio,
                                n_actions=self.env.action_space.n, n_hidden_channels=n_units)

        if pre_load:
            serializers.load_npz(path.join(self.save_path, 'best', 'model.npz'), self.q_func)

        if self.gpu:
            self.q_func.to_gpu(device_id)

        if optimizer_name == 'Adam':
            self.optimizer = chainer.optimizers.Adam(alpha=lr)
        elif optimizer_name == 'RMSprop':
            self.optimizer = chainer.optimizers.RMSprop(lr=lr)
        else:
            self.optimizer = chainer.optimizers.MomentumSGD(lr=lr)

        self.optimizer.setup(self.q_func)

        # Use epsilon-greedy for exploration/exploitation with linear decay.
        explorer = chainerrl.explorers.LinearDecayEpsilonGreedy(start_epsilon=0.1, end_epsilon=0.01,
                                                                decay_steps=int(self.episodes / 4),
                                                                random_action_func=self.env.action_space.sample)

        # DQN uses Experience Replay.
        replay_buffer = chainerrl.replay_buffers.prioritized.PrioritizedReplayBuffer(capacity=replay_size)

        phi = lambda x: x.astype(np.float32, copy=False)

        # Now create an agent that will interact with the environment.
        self.agent = chainerrl.agents.DoubleDQN(q_function=self.q_func, optimizer=self.optimizer,
                                                replay_buffer=replay_buffer, gamma=gamma, explorer=explorer,
                                                replay_start_size=50000, update_interval=1000,
                                                target_update_interval=1000,
                                                target_update_method='soft', phi=phi)

        self.error_list = deque([0], maxlen=1000)
        self.reward_list = deque([0], maxlen=1000)

        if train:
            chainer.config.train = True
            if self.verbose:
                self.pbar = tqdm.tqdm(total=self.episodes, ascii=True,
                                 bar_format='{l_bar}{n}, {remaining}\n')
            else:
                self.pbar = tqdm.tqdm(total=self.episodes)
        else:
            chainer.config.train = False
            self.behaviour_log = AgentBehaviour("finger")

    def train(self, episodes):
        """
        Function to start agent training. Finger agent uses Double DQN with Prioritised Experience Reply.
        :param episodes: number of training trials to run.
        """
        progress_bar = ProgressBar(self.pbar, episodes)

        chainerrl.experiments.train_agent_with_evaluation(
            agent=self.agent,
            env=self.env,
            steps=episodes,  # Train the agent for n steps
            eval_n_steps=None,  # We evaluate for episodes, not time
            eval_n_episodes=10,  # 10 episodes are sampled for each evaluation
            eval_interval=self.log_interval,  # Evaluate the agent after every 1000 steps
            outdir=self.save_path,  # Save everything to 'data/models' directory
            train_max_episode_len=5,  # Maximum length of each episode
            successful_score=4.5,  # Stopping rule
            logger=self.logger,
            step_hooks=[progress_bar]
        )

    def save_log_data(self, data, mode='w'):
        """
        Function to save intermediate training logs.
        :param data: list of training data to save for evaluation later.
        :param mode: open file in write or append mode.
        """
        with open(path.join("data", "training", self.log_filename), mode) as f:
            writer = csv.writer(f)
            writer.writerow(data)

    def evaluate(self, sentence, **kwargs):
        sat_desired = kwargs['sat_desired']
        # run the sentence.
        eval_log = self.type_sentence(sentence, sat_desired, True)

        with open(path.join("data", "output", self.log_filename), "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerows(eval_log)

        self.behaviour_log.save()

        self.logger.info("Generating Video.")

        # TODO: This is from legacy code. Need to update.
        visualise_agent(True, False, path.join("data", "output", self.log_filename), None,
                        path.join("data", "output", "FingerAgent.mp4"))

    def type_char(self, char, sat_d, is_eye_present=False):
        """
        finger movement to a single character.
        :param char: character to type.
        :param sat_d: desired SAT to type with.
        :param is_eye_present: true if eyes are on target else false
        """

        # set target char key to press.
        self.env.target = char

        self.env.hit = 0

        # set the desired sat to use.
        self.env.sat_desired = self.env.sat_desired_list.index(sat_d)

        # set vision status.
        self.env.vision_status = is_eye_present

        # calculate finger location estimate.
        self.env.calc_max_finger_loc()

        # set belief with current evidence.
        self.env.set_belief()

        # choose the best action with max Q-values
        action, q_val = self.choose_best_action()

        # act on the action.
        _, reward, done, info = self.env.step(action)

        return info['mt'], reward, done, q_val

    def type_sentence(self, sentence, sat_desired, is_eye_present=False):
        """
        Types the sentence using only the finger.
        :param is_eye_present: true if eyes are on target else false
        :param sat_desired: hwo accurately to type. value between 0 (low accuracy) to 1 (high accuracy).
        :param sentence: string to be typed with finger.
        :return: test_data : list with eye and action data for the typed sentence.
        """

        self.env.reset()
        test_data = []
        self.logger.debug("Typing: %s" % sentence)

        # Initial data to append to the test data which will be saved and used in visualization
        test_data.append(["model time", "fingerloc x", "fingerloc y", "action x", "action y", "type"])
        test_data.append([round(self.env.model_time, 4), self.env.finger_location[0], self.env.finger_location[1],
                          "", "", "start"])
        self.behaviour_log.clear_data()

        for char in sentence:
            self.env.action_type = 0  # setting ballistic action

            # Keep taking actions with same target until peck or max step reached.
            for i in range(10):
                mt, reward, done, q_val = self.type_char(char, sat_desired, is_eye_present)

                self.behaviour_log.add_datapoint(time=self.env.model_time, char=char, sentence=sentence,
                                                 sat_true=self.env.sat_true_list[self.env.sat_true],
                                                 sat_desired=sat_desired, qval=q_val, actiontype=self.env.action_type,
                                                 reward=reward, entropy=self.env.finger_loc_entropy,
                                                 accuracy=self.env.hit)

                if self.env.action_type == 0:
                    test_data.append([round(self.env.model_time, 4), self.env.finger_location[0],
                                      self.env.finger_location[1], "", "", 'move'])
                else:
                    test_data.append([round(self.env.model_time, 4), self.env.finger_location[0],
                                      self.env.finger_location[1], self.env.finger_location[0],
                                      self.env.finger_location[1], 'peck'])

                if done:
                    break

        return test_data

    def choose_best_action(self):
        """
        Function to choose best action given action-value map.
        """

        state = self.env.preprocess_belief()
        if self.gpu:
            q_values = cuda.to_cpu(chainer.as_array(
                self.q_func(cuda.to_gpu(state.reshape((1, self.env.observation_space.shape[0])), device=0))
                    .q_values).reshape((-1,)))
        else:
            q_values = chainer.as_array(self.q_func(state.reshape((1, self.env.observation_space.shape[0])))
                                        .q_values).reshape((-1,))

        best_action = np.where(q_values == np.amax(q_values))[0]

        return np.random.choice(best_action), np.amax(q_values)

    def calculate_Qvalue(self):
        """
        Function that calculates MaxQ for actions.
        Choose the best action type by comparing the maximum q values for both action types "move" and "peck"
        :return: action-value map.
        """

        action_value = {}

        for action in self.env.actions:
            action_value[action] = {}
            action_value[action]["SAT"] = {}
            action_value[action]["best_q"] = -np.inf

            for sat in self.env.sat_true_list:
                self.env.action_type = self.env.actions.index(action)
                self.env.sat_true = self.env.sat_true_list.index(sat)

                # set belief with current evidence.
                self.env.set_belief()

                state = self.env.preprocess_belief()

                if self.gpu:
                    q_values = cuda.to_cpu(chainer.as_array(
                        self.q_func(cuda.to_gpu(state.reshape((1, self.env.observation_space.shape[0])), device=0))
                            .q_values).reshape((-1,)))
                else:
                    q_values = chainer.as_array(self.q_func(state.reshape((1, self.env.observation_space.shape[0])))
                                                .q_values).reshape((-1,))

                action_value[action]["SAT"][self.env.sat_true] = {"q_values": q_values, "max_q": np.max(q_values)}

                if np.max(q_values) > action_value[action]["best_q"]:
                    action_value[action]["best_q"] = np.max(q_values)

        return action_value

    def load(self):
        """
        Function to load pre-trained data.
        """
        serializers.load_npz(path.join(self.save_path, 'best', 'model.npz'), self.q_func)
        chainer.config.train = False


class ProgressBar(chainerrl.experiments.hooks.StepHook):
    """
    Hook class to update progress bar.
    """

    def __init__(self, pbar, max_length):
        self.pbar = pbar
        self.max = max_length

    def __call__(self, env, agent, step):
        self.pbar.update()
        if self.max <= step:
            self.pbar.close()
