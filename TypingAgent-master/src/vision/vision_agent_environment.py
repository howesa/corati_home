import sys
import gym
import yaml
import logging
from os import path

from src.abstract.environment import AgentEnv
from src.display.touchscreendevice import TouchScreenDevice

from src.utilities.utils import distance, visual_distance, EMMA_fixation_time


class VisionAgentEnv(AgentEnv):

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
        self.task_reward = agent_params['reward']
        self.model_time = 0.0

        self.observation_space = gym.spaces.Box(low=0.0, high=len(self.device.keys) - 1, shape=(1,))
        self.logger.debug("State Space: %s" % repr(self.observation_space))
        self.action_space = gym.spaces.Discrete(self.device.layout.shape[0] * self.device.layout.shape[1])
        self.logger.debug("Action Space: %s" % repr(self.action_space))

    def update_model_time(self, delta):
        """
        Function to update model runtime.
        :param delta: time to increment in ms.
        """
        self.model_time += delta

    def step(self, action):
        """
        Function to perform the action selected by the agent.
        :param action: int value for eye movement action taken by agent.
        :return: tuple <next state, reward, done, info>
        """
        self.logger.debug("taking action {%d}" % action)

        # take action.
        _, movement_time, _ = self.move_eyes(action)

        # for acting what was the reward.
        reward = self.reward(action, movement_time)

        # update belief state.
        # (for current implementation doesn't affect anything
        # since state is the target key which doesn't change
        # within a trial.)
        self.set_belief()

        # is action terminal.
        # (for current implementation every action is terminal action).
        done = True

        # currently sending empty dict as info. Can extend it to add something in future.
        return self.belief_state, reward, done, {}

    def reset(self):
        """
        Function to be called on start of a trial. It resets the environment
        and sets the initial belief state.
        :return: current belief state.
        """
        self.logger.debug("Resetting Environment for start of new trial.")
        self.eye_location = self.device.start()
        self.logger.debug("Eye initialised to location: {%d, %d}" % (self.eye_location[0], self.eye_location[1]))
        self.target = self.device.get_random_key()
        self.logger.debug("Target key for the trial set to: {%s}" % self.target)
        self.prev_eye_loc = self.eye_location
        self.set_belief()
        self.model_time = 0.0
        return self.belief_state

    def reward(self, action, movement_time):
        """
        Function for calculating R(a).
        :param action: int value for eye movement action taken by agent.
        :param movement_time: movement time in seconds for taking action.
        :return: reward: float value to denote goodness of action.
        """
        if self.is_target():
            reward = self.task_reward - movement_time
        else:
            reward = -movement_time

        self.logger.debug("reward for taking action %d is %.2f" % (action, reward))

        return reward

    def move_eyes(self, action):
        """
        function to make eye movement. Uses EMMA to calculate movement time.
        :param action: int value for eye movement action taken by agent.
        :return: emma tuple and movement time in seconds.
        :return: moved did eyes move.
        """

        coord = self.device.convert_to_ij(action)
        distance_traveled = distance(self.prev_eye_loc, coord)
        self.logger.debug("Distance: %.2f" % distance_traveled)

        # the number 14 is a scaling factor for our task.
        eccentricity = visual_distance(distance_traveled, self.user_distance)/14
        self.logger.debug("eccentricity : {%.2f}" % eccentricity)

        (mt_enc, mt_exec, mt_enc_l), movement_time, moved = EMMA_fixation_time(eccentricity)

        if moved:
            self.update_sensor_position(action)
            self.logger.debug("took %f seconds to move eyes." % movement_time)

        self.prev_eye_loc = self.eye_location
        self.update_model_time(movement_time * 1000)
        return (mt_enc, mt_exec, mt_enc_l), movement_time, moved

    def render(self, mode='human'):
        """
        Visualise agent-environment interaction. Currently not implemented.
        We have external python code to do this.
        :param mode: string value to denote human viewable mode or agent training mode.
        """
        pass

    def is_target(self):
        """
        Function to check if the key eyes are looks at is the target get.
        """
        coord = self.device.get_coordinate(self.target[0])

        if self.eye_location[0] in coord[0] and self.eye_location[1] in coord[1]:
            self.logger.debug("Looking at the correct key.")
            return True
        else:
            self.logger.debug("Looking at the key {%s}, but target is {%s}" %
                              (self.device.get_character(self.eye_location[0], self.eye_location[1]), self.target[0]))
            return False

    def update_sensor_position(self, index):
        """
        Function to update the current sensor location.
        :param index: location to move eyes to.
        """
        coord = self.device.convert_to_ij(index)
        self.logger.debug("Moving eyes to location {%s}" % str(coord))
        self.eye_location = coord

    def set_belief(self):
        """
        Function to update belief state.
        """
        self.belief_state = repr(self.target[0])
        self.logger.debug("current belief state is {%s}" % self.belief_state)
