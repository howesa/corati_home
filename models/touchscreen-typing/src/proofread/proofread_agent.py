import csv
import tqdm
import logging
import numpy as np
from os import path
from collections import deque

from src.abstract.agent import Agent

from src.algorithms.q_learning import QLearningTable
from src.visualise.visualise import visualise_agent
from src.proofread.proofread_agent_environment import ProofreadAgentEnv


class ProofreadAgent(Agent):

    def evaluate(self, sentence, **kwargs):
        pass

    def __init__(self, layout_config, agent_params, verbose=False):
        self.logger = logging.getLogger(__name__)

        self.env = ProofreadAgentEnv(layout_config, agent_params)
        self.discount_factor = agent_params['discount']
        self.learning_rate = agent_params['learning_rate']
        self.epsilon = agent_params['epsilon']
        self.episodes = agent_params['episodes']
        self.log_interval = agent_params['log_interval']
        self.log_filename = agent_params['log_file']
        self.agent = QLearningTable(actions=self.env.action_space.n, learning_rate=self.learning_rate,
                                    reward_decay=self.discount_factor, e_greedy=self.epsilon,
                                    filename='proofread_q_table.csv')
        self.error_list = deque([0], maxlen=1000)
        self.reward_list = deque([0], maxlen=1000)
        self.verbose = verbose

    def train(self, episodes):
        """
        Function to start agent training. Proofread agent uses Tabular Q-learning.
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

    def save_log_data(self, data, mode='w'):
        """
        Function to save intermediate training logs.
        :param data: list of training data to save for evaluation later.
        :param mode: open file in write or append mode.
        """
        with open(path.join("data", "training", self.log_filename), mode) as f:
            writer = csv.writer(f)
            writer.writerow(data)

    def get_q_value(self):
        """
        Function to get the current q-value for the state.
        :return: q_val: scalar q-value.
        """
        return self.agent.get_max_q(self.env.belief_state)

    def proofread_text(self, eye_location):
        """
        Proofread current text typed.
        """

        self.env.eye_location = eye_location
        _, _, _, info = self.env.step(0)

        return info['encoding'], info['mt'], self.env.eye_location
