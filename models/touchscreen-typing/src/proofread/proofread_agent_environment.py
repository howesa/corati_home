import sys
import gym
import yaml
import logging
import random
import numpy as np
from os import path

from src.abstract.environment import AgentEnv
from src.display.touchscreendevice import TouchScreenDevice

from src.utilities.utils import distance, visual_distance, EMMA_fixation_time


class ProofreadAgentEnv(AgentEnv):

    def __init__(self, layout_config, agent_params):

        self.logger = logging.getLogger(__name__)
        self.config_file = None
        if path.exists(path.join('configs', layout_config)):
            with open(path.join("configs", layout_config), 'r') as file:
                self.config_file = yaml.load(file, Loader=yaml.FullLoader)
                self.logger.info("Device Configurations loaded.")
        else:
            self.logger.error("File doesn't exist: Failed to load %s file under configs folder." % layout_config)
            sys.exit(0)

        if self.config_file:
            self.device = TouchScreenDevice(self.config_file['layout_file'], self.config_file['config'])
            self.user_distance = self.device.device_params['user_distance']
        else:
            self.device = None

        self.eye_location = None
        self.prev_eye_loc = None
        self.target = None
        self.belief_state = None
        self.error_found = None
        self.task_reward = agent_params['reward']
        self.observation_probability = agent_params['observation_probability']
        self.sat_true_list = agent_params['sat_true']
        self.error_probability_list = agent_params['error_probability']
        self.actions = agent_params['action_type']
        self.model_time = 0.0
        self.error_prob = 0.05
        self.proof_locs = [(-5, 2), (-5, 3), (-5, 4), (-5, 5), (-6, 2), (-6, 3), (-6, 4), (-6, 5)]

        self.observation_space = gym.spaces.Box(low=0.0, high=1.0, shape=(1,))
        self.logger.debug("State Space: %s" % repr(self.observation_space))
        self.action_space = gym.spaces.Discrete(len(self.actions))
        self.logger.debug("Action Space: %s" % repr(self.action_space))

    def update_model_time(self, delta):
        """
        Function to update model runtime.
        :param delta: time to increment in sec.
        """
        self.model_time += delta

    def step(self, action):
        """
        Function to perform the action selected by the agent.
        :param action: int value for eye movement action taken by agent.
        :return: tuple <next state, reward, done, info>
        """
        self.logger.debug("taking action {%s}" % self.actions[action])
        done = True
        mt = 0
        # If performing proofread.
        if action == 0:
            # take action.
            encoded_time, mt = self.move_eyes()

        reward = self.reward(action, mt)

        return self.belief_state, reward, done, {'encoding': encoded_time, 'mt': mt}

    def reset(self):
        """
        Function to be called on start of a trial. It resets the environment
        and sets the initial belief state.
        :return: current belief state.
        """

        self.logger.debug("Resetting Environment for start of new trial.")
        self.eye_location = self.device.start()
        self.logger.debug("Eye initialised to location: {%d, %d}" % (self.eye_location[0], self.eye_location[1]))
        self.error_found = False
        self.model_time = 0.0
        self.error_prob = 0.05
        self.simulate_typing()
        self.set_belief()
        return self.belief_state

    def reward(self, action, movement_time):
        """
        Function for calculating R(a).
        :param action: tuple for finger movement action taken by agent.
        :param movement_time: movement time in seconds for taking action.
        :return: reward: float value to denote goodness of action and action type
        """

        # if no-op return 0 reward.
        if action == 1:
            return 0.0

        if self.error_found:
            movement_time += 0.15  # add motor movement time for response
            reward = self.task_reward - movement_time
        else:
            reward = -movement_time

        return reward

    def set_belief(self):
        """
        Function to update belief state.
        """
        self.belief_state = repr(self.error_prob)
        self.logger.debug("current belief state is {%s}" % self.belief_state)

    def render(self, mode='human'):
        pass

    def move_eyes(self):
        """ Calculate total eye movement time.
            Moves the eye if a fixation has occured.

        Returns:
            (mt_enc, mt_exec , mt_enc_l) : tuple containing (encoding_time, execution_time, left_encoding_time).
        """
        proof_loc = random.choice(self.proof_locs)
        dist = distance(self.eye_location, proof_loc)
        eccentricity = visual_distance(dist, self.user_distance)
        (mt_enc, mt_exec, mt_enc_l), mt, moved = EMMA_fixation_time(eccentricity / 14)
        if moved:
            self.eye_location = proof_loc
        return (mt_enc * 1000, mt_exec * 1000, mt_enc_l * 1000), mt

    def simulate_typing(self):
        """
        Simulates the typing behavior.
        Calculates current error probability.
        """
        obs_prob = self.observation_probability
        self.error_found = False
        unproof_char = random.randint(1, 10)
        for i in range(unproof_char):
            error = False
            sigma, error_chance = self.choose_random_sigma()
            s1 = np.random.normal(0, sigma)
            s2 = np.random.normal(0, sigma)
            if s1 > 0.5 or s1 < -0.5 or s2 > 0.5 or s2 < -0.5:
                error = True
                self.error_found = True

            if error:
                obs_error = obs_prob
            else:
                obs_error = 1 - obs_prob

            self.error_prob = self.update_error_belief(obs_error, self.error_prob, error_chance)

    def choose_random_sigma(self):
        """
        Chooses a random sigma for SAT value.
        Chooses a random error chance for SAT value.
        """
        index = random.randint(0, len(self.sat_true_list) - 1)
        sat = self.sat_true_list[index]
        error_chance = self.error_probability_list[index]

        return sat, error_chance

    def reset_error_prob(self):
        """
        Function to reset error probability
        """
        self.error_prob = 0.05

    def update_error_belief(self, obs_e, belief_e, error_chance):
        """ Updates the error belief using Bayes Update
        Args:
            obs_e : observation probability.
            belief_e : current belief
            error_chance : chance of error for a particular SAT.

        Returns:
            new_belief_e : new belief
        """
        obs_ne = 1 - obs_e
        belief_ne = 1 - belief_e
        prob_e_e = 1
        no_error_chance = 1 - error_chance
        prob_e_ne = 0

        new_belief_e = obs_e * belief_ne * error_chance + 1 * belief_e * prob_e_e
        new_belief_ne = obs_ne * belief_ne * no_error_chance + 1 * belief_e * prob_e_ne

        # Normalizing
        temp_total = new_belief_e + new_belief_ne
        new_belief_e = new_belief_e / temp_total
        # rounding off to nearest 0.05
        new_belief_e = round(0.05 * round(float(new_belief_e) / 0.05), 2)

        return new_belief_e
