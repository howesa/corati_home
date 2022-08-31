import csv
import tqdm
import random
import logging
import numpy as np
import pandas as pd
from os import path
from datetime import datetime

import chainer
import chainerrl
import chainer.links as L
from chainerrl import misc
import chainer.functions as F
from chainer import serializers
from chainerrl.agents import PPO
from chainer.backends import cuda
from chainerrl import experiments
from chainer.backends import cuda

from src.abstract.agent import Agent
from src.visualise.visualise import visualise_agent
from src.supervisor.supervisor_agent_environment import SupervisorEnvironment
from src.supervisor.supervisor_agent_two_finger_env import SupervisorEnvironment_


class SupervisorAgent(Agent):

    def __init__(self, layout_config, agent_params, train, finger_two, verbose=False):
        self.logger = logging.getLogger(__name__)

        self.layout_config = layout_config
        self.agent_params = agent_params
        self.train_model = train
        self.finger_two = finger_two
        self.verbose = verbose

        if finger_two:
            self.env = SupervisorEnvironment_(self.layout_config, self.agent_params, self.train_model)
        else:
            self.env = SupervisorEnvironment(self.layout_config, self.agent_params, self.train_model)

        optimizer_name = 'Adam' if agent_params is None else agent_params['supervisor']['optimizer_name']
        lr = 0.001 if agent_params is None else agent_params['supervisor']['learning_rate']
        n_units = 512 if agent_params is None else int(agent_params['supervisor']['n_units'])
        device_id = 0 if agent_params is None else int(agent_params['supervisor']['device_id'])
        pre_load = False if agent_params is None else bool(agent_params['supervisor']['pre_load'])
        self.gpu = True if agent_params is None else bool(agent_params['supervisor']['gpu'])
        self.save_path = path.join('data', 'models', 'supervisor') if agent_params is None \
            else agent_params['supervisor']['save_path']
        self.episodes = 1000000 if agent_params is None else int(agent_params['supervisor']['episodes'])
        self.log_interval = 1000 if agent_params is None else int(agent_params['supervisor']['log_interval'])
        self.log_filename = agent_params['supervisor']['log_file']

        winit_last = chainer.initializers.LeCunNormal(1e-2)

        self.model = chainer.Sequential(
            L.Linear(None, n_units),
            F.relu,
            L.Linear(None, n_units),
            F.relu,
            chainerrl.links.Branched(
                chainer.Sequential(
                    L.Linear(None, self.env.action_space.n, initialW=winit_last),
                    chainerrl.distribution.SoftmaxDistribution,
                ),
                L.Linear(None, 1)
            )
        )

        if pre_load:
            serializers.load_npz(path.join(self.save_path, 'best', 'model.npz'), self.model)

        if self.gpu:
            self.model.to_gpu(device_id)

        if optimizer_name == 'Adam':
            self.optimizer = chainer.optimizers.Adam(alpha=lr)
        elif optimizer_name == 'RMSprop':
            self.optimizer = chainer.optimizers.RMSprop(lr=lr)
        else:
            self.optimizer = chainer.optimizers.MomentumSGD(lr=lr)

        self.optimizer.setup(self.model)

        self.optimizer.add_hook(chainer.optimizer.GradientClipping(1.0))

        phi = lambda x: x.astype(np.float32, copy=False)

        self.agent = PPO(
            self.model,
            self.optimizer,
            phi=phi,
            update_interval=1000,
            standardize_advantages=True,
            entropy_coef=1e-2,
            recurrent=False,
        )

        if train:
            chainer.config.train = True
            if self.verbose:
                self.pbar = tqdm.tqdm(total=self.episodes, ascii=True, bar_format='{l_bar}{n}, {remaining}\n')
            else:
                self.pbar = tqdm.tqdm(total=self.episodes)
        else:
            chainer.config.train = False
            self.agent.act_deterministically = False

    def train(self, episodes):
        """
        Trains the model for given number of episodes.
        """

        progress_bar = ProgressBar(self.pbar, episodes)

        experiments.train_agent_with_evaluation(
            self.agent, self.env,
            steps=episodes,  # Train the agent for 2000 steps
            eval_n_steps=None,  # We evaluate for episodes, not time
            eval_n_episodes=10,  # 10 episodes are sampled for each evaluation
            train_max_episode_len=100,  # Maximum length of each episode
            eval_interval=self.log_interval,  # Evaluate the agent after every 1000 steps
            step_hooks=[progress_bar],  # add hooks
            logger=self.logger,
            outdir=self.save_path)  # Save everything to 'supervisor' directory

    def evaluate(self, sentence, batch, n_users, **kwargs):
        """
        Function to evaluate trained agent.
        :param sentence: sentence to type.
        :param batch: run evaluation in batch mode.
        :param n_users: number of users to simulate.
        """

        done = False
        if not (sentence == "" or sentence is None):
            self.env.sentences = [sentence]
            self.env.sentences_bkp = [sentence]

        if batch:
            sentence_agg_data = [["sentence.id", "agent.id", "target.sentence", "wpm", "lev.distance",
                                  "gaze.shift", "bs", "immediate.bs", "delayed.bs",
                                  "gaze.keyboard.ratio", "fix.count", "finger.travel", "iki", "correct.error",
                                  "uncorrected.error", "fix.duration", "chunk.length"]]
            if self.verbose:
                iter = tqdm.tqdm(iterable=range(n_users), ascii=True,
                                 bar_format='{l_bar}{n}, {remaining}\n')
            else:
                iter = tqdm.tqdm(range(n_users))
            for i in iter:

                if self.finger_two:
                    self.env = SupervisorEnvironment_(self.layout_config, self.agent_params, self.train_model)
                else:
                    self.env = SupervisorEnvironment(self.layout_config, self.agent_params, self.train_model)
                self.env.agent_id = i

                # reinitialise random seed.
                np.random.seed(datetime.now().microsecond)
                random.seed(datetime.now().microsecond)

                while len(self.env.sentences) > 0:
                    state = self.env.reset()
                    done = False
                    while not done:
                        action = self.agent.act(state)
                        state, reward, done, info = self.env.step(action)

                sentence_agg_data += self.env.sentence_test_data

            with open(path.join("data", "output", "SupervisorAgent_sentence_test.csv"), "w", newline="",
                      encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerows(sentence_agg_data)

            if not self.finger_two:
                with open(path.join("data", "output", "SupervisorAgent_Vision_Viz.csv"), "w", newline="") as f:
                    writer = csv.writer(f)
                    writer.writerows(self.env.eye_viz_log)

                with open(path.join("data", "output", "SupervisorAgent_Finger_Viz.csv"), "w", newline="") as f:
                    writer = csv.writer(f)
                    writer.writerows(self.env.finger_viz_log)

                with open(path.join("data", "output", "SupervisorAgent_Typing_Viz.csv"), "w", newline="") as f:
                    writer = csv.writer(f)
                    writer.writerows(self.env.typing_viz_log)

        else:
            self.env.sentence_test_data.append(["sentence.id", "agent.id", "target.sentence", "wpm", "lev.distance",
                                                "gaze.shift", "bs", "immediate.bs", "delayed.bs",
                                                "gaze.keyboard.ratio", "fix.count", "finger.travel", "iki",
                                                "correct.error",
                                                "uncorrected.error", "fix.duration", "chunk.length"])
            state = self.env.reset()
            while not done:
                action = self.agent.act(state)
                state, reward, done, info = self.env.step(action)

            with open(path.join("data", "output", "SupervisorAgent_vision_test.csv"), "w", newline="") as f:
                writer = csv.writer(f)
                writer.writerows(self.env.eye_test_data)

            with open(path.join("data", "output", "SupervisorAgent_finger_test.csv"), "w", newline="") as f:
                writer = csv.writer(f)
                writer.writerows(self.env.finger_test_data)

            with open(path.join("data", "output", "SupervisorAgent_sentence_test.csv"), "w", newline="",
                      encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerows(self.env.sentence_test_data)

            # TODO: This is from legacy code. Need to update.
            visualise_agent(True, True, path.join("data", "output", "SupervisorAgent_vision_test.csv"),
                            path.join("data", "output", "SupervisorAgent_finger_test.csv"),
                            path.join("data", "output", "SupervisorAgent.mp4"))

        self.save_senetence_agg_data(path.join("data", "output", "SupervisorAgent_sentence_test.csv"))
        self.save_user_agg_data(path.join("data", "output", "SupervisorAgent_sentence_test.csv"))

    def save_senetence_agg_data(self, filename):
        """
        generates sentence level aggregate data.
        :param filename: raw data file path.
        """
        data = pd.read_csv(filename, sep=',', encoding='utf-8')
        data = data.groupby("target.sentence").agg(['mean', 'std'])
        data.to_csv(path.join("data", "output", "SupervisorAgent_sentence_aggregate.csv"), encoding='utf-8')

    def save_user_agg_data(self, filename):
        """
        generates user level aggregate data.
        :param filename: raw data file path.
        """
        data = pd.read_csv(filename, sep=',', encoding='utf-8')
        data = data.groupby("agent.id").agg(['mean', 'std'])
        data.to_csv(path.join("data", "output", "SupervisorAgent_user_aggregate.csv"), encoding='utf-8')


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
