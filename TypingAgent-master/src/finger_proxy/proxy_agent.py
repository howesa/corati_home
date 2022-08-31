import logging
from src.abstract.agent import Agent
from src.finger.finger_agent import FingerAgent

from src.utilities.utils import distance


class ProxyAgent(Agent):

    def __init__(self, layout_config, agent_params, train):
        self.logger = logging.getLogger(__name__)

        self.agent_left_thumb = FingerAgent(layout_config, agent_params, 1, train)
        self.agent_right_thumb = FingerAgent(layout_config, agent_params, 2, train)
        self.hit = 0.0
        self.sat_true = None

    def train(self, episodes):
        pass

    def evaluate(self, sentence, **kwargs):
        pass

    def move(self, char, sigma_desired, eye_status):
        """
        Use Heuristic to choose between left thumb or right thumb to type. Heuristic is to check
        where spatially char is located on keyboard and call the corresponding thumb to type.
        :param eye_status: if eyes are on keyboard or not.
        :param char: target char to type.
        :param sigma_desired: desired sat value to signify how accurately finger should type.
        :return: movement time, q_value, finger location, finger_type
        """

        # get char location on keyboard.
        coord = self.agent_left_thumb.env.device.get_coordinate(char)

        # get left and right thumb location.
        left_tmb = self.agent_left_thumb.env.finger_location
        right_tmb = self.agent_right_thumb.env.finger_location

        if coord[1][0] >= int(self.agent_left_thumb.env.device.layout.shape[1] / 2):
            # char on right side of the keyboard.
            agent_type = 0
            mt, finger_q, finger_loc, finger_travel_dist, action_type = self.make_finger_movement(char, sigma_desired,
                                                                                                  eye_status,
                                                                                                  self.agent_right_thumb)
        else:
            # char on left side of the keyboard.
            agent_type = 1
            mt, finger_q, finger_loc, finger_travel_dist, action_type = self.make_finger_movement(char, sigma_desired,
                                                                                                  eye_status,
                                                                                                  self.agent_left_thumb)
        return mt, finger_q, finger_loc, finger_travel_dist, action_type, agent_type

    def make_finger_movement(self, char, sigma_desired, eye_status, agent):
        """
         Function to perform finger movement from current position to target char.
        """
        mt, _, _, finger_q = agent.type_char(char, sigma_desired, eye_status)
        finger_loc = agent.env.finger_location
        finger_travel_dist = agent.env.dist
        action_type = agent.env.action_type
        self.hit = agent.env.hit
        self.sat_true = agent.env.sat_true

        return mt, finger_q, finger_loc, finger_travel_dist, action_type

    def reset(self):
        self.agent_left_thumb.env.reset()
        self.agent_right_thumb.env.reset()

    def load(self):
        self.agent_right_thumb.load()
        self.agent_left_thumb.load()
