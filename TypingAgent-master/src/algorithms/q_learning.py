import logging
import numpy as np
import pandas as pd
from os import path


class QLearningTable:
    """
    Class that implements Q-Learning algorithm.
    This part of code is the agent brain. All decisions are made in here.
    """

    def __init__(self, actions, learning_rate=0.01, reward_decay=0.9, e_greedy=0.9, filename='vision_q_table.csv'):
        self.logger = logging.getLogger(__name__)
        self.actions = list(range(actions))  # a list
        self.filename = filename
        self.lr = learning_rate
        self.gamma = reward_decay
        self.epsilon = e_greedy
        self.q_table = pd.DataFrame(columns=self.actions, dtype=np.float64)

    def choose_action(self, observation):
        """
        Function to perform epsilon-greedy action selection.
        :param observation: current state of agent in which the action is to be selected.
        :return: the action to perform.
        """
        self.check_state_exist(observation)
        # action selection
        if np.random.uniform() < self.epsilon:
            # choose best action
            state_action = self.q_table.loc[observation, :]
            # some actions may have the same value, randomly choose on in these actions
            action = np.random.choice(state_action[state_action == np.max(state_action)].index)
        else:
            # choose random action
            action = np.random.choice(self.actions)
        return action

    def learn(self, s, a, r, s_, done):
        """
        Function to perform a one step TD update on the q-table.
        :param done: flag for terminal action.
        :param s: current agent state.
        :param a: current action the agent took in state s.
        :param r: the reward agent received for taking action a.
        :param s_: the next state agent transit to on taking action a.
        """
        self.logger.debug("Updating the q-value for state {%s}, action {%d}, with reward {%.2f} and next state {%s}" %
                          (s, a, r, s_))
        self.check_state_exist(s_)
        q_predict = self.q_table.loc[s, a]
        if not done:
            q_target = r + self.gamma * self.q_table.loc[s_, :].max()  # next state is not terminal
        else:
            q_target = r  # next state is terminal
        self.q_table.loc[s, a] += round(self.lr * (q_target - q_predict), 2)  # update
        self.logger.debug("Updated Q[%s, %d] with td-error %.2f and learning rate %.2f" %
                          (s, a, (q_target - q_predict), self.lr))

        return q_target - q_predict

    def check_state_exist(self, state):
        """
        Function to check if the state already exists in the q-table.
        :param state: current agent state.
        """
        if state not in self.q_table.index:
            self.logger.info("state {%s} not in q-table. Adding it to the table.")
            # append new state to q table
            self.q_table = self.q_table.append(
                pd.Series(
                    [0] * len(self.actions),
                    index=self.q_table.columns,
                    name=state,
                )
            )

    def get_max_q(self, state):
        """
        Function returns max q value for given state.
        :param state:
        :return: scalar q value.
        """
        self.check_state_exist(float(state))

        # choose best action
        state_action = self.q_table.loc[float(state), :]
        # some actions may have the same value, randomly choose on in these actions
        return np.max(state_action)



    def save(self):
        """
        Function to save the q-table.
        """
        self.q_table.to_csv(path.join('data', 'models', self.filename))
        self.logger.info("Saved the q table at {%s}" % path.join('data', 'models', self.filename))

    def load(self):
        """
        Function to load the saved q-table
        """
        self.q_table = pd.read_csv(path.join('data', 'models', self.filename), index_col=0)
        self.logger.info('Initialised Q-table from file {%s}' % self.filename)
