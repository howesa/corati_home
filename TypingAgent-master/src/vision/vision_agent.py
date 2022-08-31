import csv
import tqdm
import logging
import numpy as np
from os import path
from collections import deque

from src.abstract.agent import Agent

from src.algorithms.q_learning import QLearningTable
from src.visualise.visualise import visualise_agent
from src.vision.vision_agent_environment import VisionAgentEnv


class VisionAgent(Agent):

    def __init__(self, layout_config, agent_params, verbose=False):
        self.logger = logging.getLogger(__name__)

        self.env = VisionAgentEnv(layout_config, agent_params)
        self.discount_factor = agent_params['discount']
        self.learning_rate = agent_params['learning_rate']
        self.epsilon = agent_params['epsilon']
        self.episodes = agent_params['episodes']
        self.log_interval = agent_params['log_interval']
        self.log_filename = agent_params['log_file']
        self.agent = QLearningTable(actions=self.env.action_space.n, learning_rate=self.learning_rate,
                                    reward_decay=self.discount_factor, e_greedy=self.epsilon)
        self.error_list = deque([0], maxlen=1000)
        self.reward_list = deque([0], maxlen=1000)
        self.verbose = verbose

    def train(self, episodes):
        """
        Function to start agent training. Vision agent uses Tabular Q-learning.
        :param episodes: number of training trials to run.
        """

        field = ["episode", "mean_reward", "sd_reward", "min_reward", "max_reward", "mean_td_error", "sd_td_error",
                 "min_td_error", "max_td_error"]
        self.save_log_data(field, "w")

        if self.verbose:
            iter = tqdm.tqdm(iterable=range(episodes), ascii=True,
                             bar_format='{l_bar}{n}, {remaining}\n')
        else:
            iter = tqdm.tqdm(range(episodes))


        for ep in iter:
            s = self.env.reset()
            done = False
            while not done:
                a = int(self.agent.choose_action(s))
                s_, r, d, _ = self.env.step(a)
                self.reward_list.append(r)
                td_error = self.agent.learn(s, a, r, s_, d)
                self.error_list.append(td_error)
                done = d
                s = s_

            if ep % self.log_interval == 0:
                field = [ep, np.mean(self.reward_list), np.std(self.reward_list), np.min(self.reward_list),
                         np.max(self.reward_list), np.mean(self.error_list), np.std(self.error_list),
                         np.min(self.error_list), np.max(self.error_list)]
                self.save_log_data(field, "a")

        self.agent.save()

    def evaluate(self, sentence):
        # load the saved model.
        self.agent.load()

        # run the sentence.
        eval_log = self.type_sentence(sentence)

        with open(path.join("data", "output", self.log_filename), "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerows(eval_log)

        self.logger.info("Generating Video.")

        # TODO: This is from legacy code. Need to update.
        visualise_agent(True, False, path.join("data", "output", self.log_filename), None,
                        path.join("data", "output", "VisionAgent.mp4"))

    def save_log_data(self, data, mode='w'):
        """
        Function to save intermediate training logs.
        :param data: list of training data to save for evaluation later.
        :param mode: open file in write or append mode.
        """
        with open(path.join("data", "training", self.log_filename), mode) as f:
            writer = csv.writer(f)
            writer.writerow(data)

    def type_char(self, char, eye_loc):
        """
        eye movement to a single character.
        :param char: character to type.
        :param eye_loc: current eye position.
        """
        self.env.eye_location = eye_loc
        self.env.target = char
        self.env.set_belief()
        a = int(self.agent.choose_action(self.env.belief_state))
        (mt_enc, mt_exec, mt_enc_l), mt, moved = self.env.move_eyes(a)
        coord = self.env.device.convert_to_ij(a)

        return (mt_enc, mt_exec, mt_enc_l), mt, self.env.eye_location, coord, moved

    def type_sentence(self, sentence):
        """
        generate sequence of eye movements for a sentence.
        :param sentence: string for which eye movements have to be made.
        :return: test_data: list with eye and action data for the typed sentence.
        """
        # do the initialisation step.
        self.env.reset()
        test_data = []
        self.logger.debug("Typing: %s" % sentence)

        # append log header.
        test_data.append(["model time", "eyeloc x", "eyeloc y", "action x", "action y", "type"])
        test_data.append([round(self.env.model_time, 4), self.env.eye_location[0], self.env.eye_location[1], "", "",
                          "start"])

        for char in sentence:
            self.env.target = char
            (_, mt_exec, mt_enc_l), mt, _, action, _ = self.type_char(char, self.env.eye_location)

            test_data.append(
                [round(self.env.model_time - mt_enc_l*1000 - mt_exec*1000 + 50, 4), self.env.prev_eye_loc[0],
                 self.env.prev_eye_loc[0], "", "", 'encoding'])
            test_data.append(
                [round(self.env.model_time - mt_enc_l*1000, 4), self.env.eye_location[0], self.env.eye_location[1],
                 action[0], action[1], 'saccade'])

            if mt_enc_l > 0:
                test_data.append([round(self.env.model_time, 4), self.env.eye_location[0], self.env.eye_location[0], "",
                                  "", 'late encoding'])

        return test_data
