import sys
import gym
import yaml
import math
import random
import logging
import numpy as np
from os import path
import pandas as pd

import Levenshtein as lev

from src.abstract.environment import AgentEnv
from src.finger_proxy.proxy_agent import ProxyAgent
from src.vision.vision_agent import VisionAgent
from src.proofread.proofread_agent import ProofreadAgent
from src.display.touchscreendevice import TouchScreenDevice


class SupervisorEnvironment_(AgentEnv):

    def __init__(self, layout_config, agent_params, train):

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

        self.vision_agent = VisionAgent(layout_config, agent_params['vision'])
        self.finger_agent = ProxyAgent(layout_config, agent_params['finger'], False)
        self.proofread_agent = ProofreadAgent(layout_config, agent_params['proofread'])

        self.actions = agent_params['supervisor']['action_type']
        self.sat_desired = agent_params['supervisor']['sat_desired']
        self.found_reward = agent_params['supervisor']['reward']
        self.agent_id = 0
        self.eye_loc = None
        self.prev_eye_loc = None
        self.finger_loc = None
        self.belief = None
        self.finger_q = 0.0
        self.proofread_q = 0.0
        self.is_error = None
        self.sentence_to_type = None
        self.key_found = False
        self.typed = None
        self.eye_on_keyboard = None
        self.is_terminal = False
        self.n_chars = 0
        self.line = ''
        self.typed_detailed = ""
        self.eye_model_time = 0
        self.finger_model_time = 0
        self.eye_on_kb_time = 0
        self.action_space = gym.spaces.discrete.Discrete(len(self.actions))
        self.mt = 0
        self.model_time = 0
        self.steps = 0
        self.n_fixations_freq = 0
        self.gaze_shift_kb_to_txt_freq = 0
        self.gaze_shift_txt_to_kb_freq = 0
        self.n_back_space_freq = 0
        self.immediate_backspace_freq = 0
        self.delay_backspace_freq = 0
        self.finger_travel_dist = 0
        self.saccade_time = 0
        self.encoding_time = 0
        self.eye_test_data = []
        self.finger_test_data = []
        self.sentence_test_data = []
        self.fixation_duration = []
        self.train = train
        self.belief_state = None
        if not self.train:
            self.eye_test_data.append(["model time", "eyeloc x", "eyeloc y", "action x", "action y", "type"])
            self.finger_test_data.append(["model time", "fingerloc x", "fingerloc y", "action x", "action y", "type"])

            data = pd.read_csv(path.join("data", "user_data", agent_params['supervisor']['corpus']), sep=",")
            # assuming the 1st column will always be sentence id
            self.sentences_id = data.iloc[:, 0].values
            self.sentences = list(data.iloc[:, 1].values)
            self.sentences_bkp = self.sentences.copy()
        else:
            data = pd.read_csv(path.join("data", "user_data", "train_corpus.csv"), sep=",")
            self.sentences = list(data.iloc[:, 0].values)

        self.vision_agent.agent.load()
        self.finger_agent.load()
        self.proofread_agent.agent.load()

    def update_model_time(self, delta):
        """
        Function to update model runtime.
        :param delta: time to increment in ms.
        """
        self.model_time += delta

    def make_eye_movement(self, char):
        """
        Function to perform eye movement from current position to target char.
        :param char: target character to move eyes to.
        :return movement time in seconds.
        """

        self.prev_eye_loc = self.eye_loc
        # movement values are in seconds. But, for visualisation we use ms. Converting everything here.
        (mt_enc, mt_exec, mt_enc_l), self.mt, self.eye_loc, _, moved = self.vision_agent.type_char(char, self.eye_loc)

        if moved:
            self.n_fixations_freq += 1

        self.fixation_duration.append(self.eye_model_time - self.saccade_time)

        self.eye_model_time += (self.mt * 1000)

        self.saccade_time = round(self.eye_model_time - (mt_enc_l * 1000), 4)

        if not self.train:
            self.eye_test_data.append(
                [round(self.eye_model_time - (mt_enc_l*1000) - (mt_exec*1000) + 50, 4), self.prev_eye_loc[0],
                 self.prev_eye_loc[1], "", "", 'encoding'])
            self.eye_test_data.append(
                [round(self.eye_model_time - (mt_enc_l*1000), 4), self.prev_eye_loc[0], self.prev_eye_loc[1],
                 self.eye_loc[0], self.eye_loc[1], 'saccade'])
            if mt_enc_l > 0:
                self.eye_test_data.append(
                    [round(self.eye_model_time, 4), self.eye_loc[0], self.eye_loc[1], "", "", 'late encoding'])
        return self.mt

    def make_finger_movement(self, char, sigma_desired, eye_time):
        """
         Function to perform finger movement from current position to target char.
        """
        finger_time = 0
        self.mt, self.finger_q, finger_loc, finger_travel_dist, action_type, agent_type = \
            self.finger_agent.move(char, sigma_desired, self.eye_on_keyboard)
        self.finger_loc = finger_loc
        self.finger_travel_dist += finger_travel_dist
        finger_time += self.mt

        # Keep iterating the finger model until a peck is performed and appending the finger data
        while action_type == self.finger_agent.agent_right_thumb.env.actions[0]:
            self.finger_model_time += (self.mt * 1000)
            if not self.train:
                self.finger_test_data.append(
                    [round(self.finger_model_time, 4), self.finger_loc[0], self.finger_loc[1], "", "", "move"])

            self.mt, self.finger_q, finger_loc, finger_travel_dist, action_type, agent_type = \
                self.finger_agent.move(char, sigma_desired, self.eye_on_keyboard)
            self.finger_loc = finger_loc
            self.finger_travel_dist += finger_travel_dist
            finger_time += self.mt

        self.finger_model_time += (self.mt * 1000)
        if not self.train:
            self.finger_test_data.append(
                [round(self.finger_model_time, 4), self.finger_loc[0], self.finger_loc[1], self.finger_loc[0],
                 self.finger_loc[1], "peck"])
            # finger waits for eye and eye waits for finger. Next action taken when both have reacted for a target.
            if finger_time > eye_time:
                self.eye_model_time = self.finger_model_time
                self.eye_test_data.append(
                    [round(self.eye_model_time, 4), self.eye_loc[0], self.eye_loc[1], "", "", 'wait'])
            elif finger_time < eye_time:
                self.finger_model_time = self.eye_model_time
                self.finger_test_data.append(
                    [round(self.finger_model_time, 4), self.finger_loc[0], self.finger_loc[1], "", "", "wait"])

        # See what is typed and update
        letter = self.device.get_character(self.finger_loc[0], self.finger_loc[1])

        if letter == '<':
            self.typed = self.typed[:-1]
            self.typed_detailed += '<'
        elif letter != '>':
            self.typed += letter
            self.typed_detailed += letter
        else:
            # pressed enter key. this is terminal state.
            self.typed += letter
            self.typed_detailed += letter
            self.is_terminal = True

    def step(self, action):
        """
        Perform a single step in the environment.
        Args:
            action: int value representing, 0: type or 1: proof read.

        Returns:
            state: current finger and proofread agent q values.
            reward: scalar reward value for taking action.
            terminal: if episode is done or not.
            info: dictionary of episode info.
        """
        self.steps += 1
        if self.sentence_to_type.startswith(self.typed):
            # Updates what is left to type
            self.line = self.sentence_to_type.replace(self.typed, '', 1)

        char = self.line[0]

        if action < len(self.sat_desired):
            # Typing action was selected.
            sigma_desired = self.sat_desired[action]

            # EYE MOVEMENT
            eye_time = self.make_eye_movement(char)

            # FINGER MOVEMENT
            self.eye_on_keyboard = True if not tuple(self.eye_loc) in self.proofread_agent.env.proof_locs else False
            if self.eye_on_keyboard:
                self.eye_on_kb_time += (eye_time * 1000)
            self.make_finger_movement(char, sigma_desired, eye_time)

            if not self.is_error:
                self.is_error = not self.finger_agent.hit

            # update proofread
            self.update_proofread(self.proofread_agent.env.error_probability_list[self.finger_agent.sat_true])

        else:
            # EYE MOVEMENT FOR PROOFREADING
            sigma_desired = self.sat_desired[(action - len(self.sat_desired))]

            # Check if eyes are on keyboard
            self.eye_on_keyboard = True if not tuple(self.eye_loc) in self.proofread_agent.env.proof_locs else False

            self.prev_eye_loc = self.eye_loc
            (mt_enc, mt_exec, mt_enc_l), self.mt, self.eye_loc = self.proofread_agent.proofread_text(self.eye_loc)

            if tuple(self.eye_loc) in self.proofread_agent.env.proof_locs and self.eye_on_keyboard:
                self.gaze_shift_kb_to_txt_freq += 1
            self.n_fixations_freq += 1

            self.eye_model_time += (self.mt * 1000)

            if not self.train:
                self.eye_test_data.append(
                    [round(self.eye_model_time - mt_enc_l - mt_exec + 50, 4), self.prev_eye_loc[0],
                     self.prev_eye_loc[1], "", "", 'encoding'])
                self.eye_test_data.append(
                    [round(self.eye_model_time - mt_enc_l, 4), self.prev_eye_loc[0], self.prev_eye_loc[1],
                     self.eye_loc[0], self.eye_loc[1], 'saccade'])
                if mt_enc_l > 0:
                    self.eye_test_data.append(
                        [round(self.eye_model_time, 4), self.eye_loc[0], self.eye_loc[1], "", "",
                         'late encoding'])

            # Once proofread. Error prob reset to lowest value.
            self.proofread_agent.env.reset_error_prob()
            self.proofread_agent.env.set_belief()
            self.proofread_q = self.proofread_agent.get_q_value()

            # If errors found on proofreading.
            if self.is_error:
                if len(self.typed) > len(self.sentence_to_type):
                    indexes = [i for i in range(len(self.sentence_to_type)) if self.typed[i] != self.sentence_to_type[i]]
                else:
                    indexes = [i for i in range(len(self.typed)) if self.typed[i] != self.sentence_to_type[i]]
                if len(indexes) > 0:
                    err_idx = indexes[0]
                else:
                    err_idx = len(self.typed)

                # Calculating required back spaces to remove errors
                n_bs = len(self.typed) - err_idx

                self.n_back_space_freq += n_bs

                if n_bs == 1:
                    self.immediate_backspace_freq += 1
                if n_bs > 1:
                    self.delay_backspace_freq += 1

                # For number of required backspaces
                for bs in range(n_bs):
                    char = '<'
                    # EYE MOVEMENT
                    eye_time = self.make_eye_movement(char)
                    if self.eye_on_keyboard:
                        self.eye_on_kb_time += (eye_time * 1000)

                    # FINGER MOVEMENT
                    self.eye_on_keyboard = True if not tuple(
                        self.eye_loc) in self.proofread_agent.env.proof_locs else False
                    self.make_finger_movement(char, sigma_desired, eye_time)

                # Errors corrected after proofreading
                self.is_error = False

        total_mt = (self.eye_model_time + self.finger_model_time) / 1000.0
        reward = self.reward(action, total_mt)

        self.set_belief()

        if self.is_terminal and not self.train:
            # log sentence level data.
            self.logger.debug("typed: %s" % self.typed)
            index = self.sentences_bkp.index(self.sentence_to_type[:-1])
            corrected = 0
            uncorrected = 0
            if self.typed == self.sentence_to_type and self.n_back_space_freq > 0:
                corrected = 1

            if not (self.typed == self.sentence_to_type):
                uncorrected = 1

            wpm = ((len(self.typed)) / 5.0) / (self.finger_model_time / 60000.0)
            err_lev_dist = lev.distance(self.sentence_to_type, self.typed)
            proportion_gaze_kb = self.eye_on_kb_time / self.eye_model_time
            iki = self.finger_model_time/len(self.typed_detailed)
            line = [self.sentences_id[index], self.agent_id, self.sentence_to_type, wpm, err_lev_dist,
                    self.gaze_shift_kb_to_txt_freq, self.n_back_space_freq, self.immediate_backspace_freq,
                    self.delay_backspace_freq, proportion_gaze_kb, self.n_fixations_freq,
                    self.finger_travel_dist, iki, corrected, uncorrected, np.mean(self.fixation_duration)]
            self.sentence_test_data.append(line)

        return self.belief_state, reward, self.is_terminal, {}

    def reset(self):
        """
        Function to be called on start of a trial. It resets the environment
        and sets the initial belief state.
        :return: current belief state.
        """
        self.logger.debug("Resetting Environment for start of new trial.")
        self.steps = 0
        self.eye_loc = self.device.start()
        self.logger.debug("Eye initialised to location: {%d, %d}" % (self.eye_loc[0], self.eye_loc[1]))
        self.finger_loc = self.device.start()
        self.logger.debug("Finger initialised to location: {%d, %d}" % (self.finger_loc[0], self.finger_loc[1]))
        self.vision_agent.env.reset()
        self.finger_agent.reset()
        self.proofread_agent.env.reset()
        self.vision_agent.env.eye_location = self.eye_loc
        self.proofread_agent.env.eye_location = self.eye_loc
        self.mt = 0
        self.key_found = False
        self.is_terminal = False
        self.eye_on_keyboard = True
        self.typed = ""
        self.typed_detailed = ""
        self.finger_q = 0.0
        self.eye_model_time = 0
        self.finger_model_time = 0
        self.eye_on_kb_time = 0
        self.gaze_shift_kb_to_txt_freq = 0
        self.gaze_shift_txt_to_kb_freq = 0
        self.n_back_space_freq = 0
        self.immediate_backspace_freq = 0
        self.delay_backspace_freq = 0
        self.n_fixations_freq = 0
        self.finger_travel_dist = 0
        self.saccade_time = 0
        self.encoding_time = 0
        self.fixation_duration.clear()

        self.proofread_agent.env.set_belief()
        self.proofread_q = self.proofread_agent.get_q_value()
        if self.train:
            self.sentence_to_type = random.choice(self.sentences)
        else:
            self.sentence_to_type = self.sentences.pop(0)

        self.sentence_to_type += '>'
        self.logger.debug('typing: %s' % self.sentence_to_type)
        self.line = self.sentence_to_type
        self.n_chars = len(self.sentence_to_type)
        if not self.train:
            # Initial data appended for both eye and finger
            self.eye_test_data.append(
                [round(self.eye_model_time, 4), self.eye_loc[0], self.eye_loc[1], "", "", "start"])

            self.finger_test_data.append(
                [round(self.finger_model_time, 4), self.finger_loc[0], self.finger_loc[1], "", "", "start"])

        self.set_belief()
        return self.belief_state

    def reward(self, action, movement_time):
        """
        Function for calculating R(a) = total character in sentence - movement time - levenshtein distance.
        :param action: tuple for finger movement action taken by agent.
        :param movement_time: movement time in seconds for taking action.
        :return: reward: float value to denote goodness of action and action type
        """

        if self.steps == 100 and not self.is_terminal:
            # reached max length.
            self.is_terminal = True
            return - movement_time - lev.distance(self.sentence_to_type, self.typed_detailed)
        elif not self.is_terminal:
            return 0.0
        else:
            return self.n_chars - movement_time - lev.distance(self.sentence_to_type, self.typed_detailed)

    def render(self, mode='human'):
        pass

    def set_belief(self):
        """
        Function to update belief state.
        """
        self.belief_state = np.asarray([self.finger_q, self.proofread_q]).astype(np.float32)
        self.logger.debug("current belief state is {%s}" % str(self.belief_state))

    def update_proofread(self, error_chance):
        """
        Function to update proof read belief.
        """
        obs_prob = self.proofread_agent.env.observation_probability

        if self.is_error:
            obs_error = obs_prob
        else:
            obs_error = 1 - obs_prob

        self.proofread_agent.env.error_prob = self.proofread_agent.env.update_error_belief(obs_error,
                                                                                           self.proofread_agent.env.error_prob,
                                                                                           error_chance)
        self.proofread_agent.env.set_belief()
        self.proofread_q = self.proofread_agent.get_q_value()
