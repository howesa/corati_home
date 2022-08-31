import logging
import numpy as np

from src.abstract.device import Device


class TouchScreenDevice(Device):
    def __init__(self, layout_config, params, ignore_key='-'):
        super(TouchScreenDevice, self).__init__()
        self.logger = logging.getLogger(__name__)
        self.load_layout(layout_config)
        unique_list = np.unique(self.layout)
        self.keys = np.delete(unique_list, np.where(unique_list == ignore_key))
        self.device_params = params

    def get_coordinate(self, char):
        """
        Returns the (row, column) index corresponding to the character.
        :param char: character for which the coordinate is asked.
        :return: tuple of numpy array representing row and col of character.
        """
        coord = np.where(self.layout == char)
        return coord

    def get_character(self, row, column):
        """
        Returns the string character corresponding to the (row, column).
        :param row: int value of the row.
        :param column: int value of the column.
        :return: string character.
        """
        if 0 <= row < self.layout.shape[0] and 0 <= column < self.layout.shape[1]:
            return self.layout[row][column]
        else:
            self.logger.error('row {%d} or column {%d} is out of bound' % (row, column))

    def get_character_from_index(self, index):
        """
        Returns the string character at the layout index
        :param index:
        :return:  string character.
        """
        row = int(index / self.layout.shape[1])
        column = int(index % self.layout.shape[1])
        return self.get_character(row, column)

    def convert_to_ij(self, index):
        """
        Convert index to row col.
        """
        row = int(index / self.layout.shape[1])
        column = int(index % self.layout.shape[1])
        return [row, column]


    def get_random_key(self):
        """
        Returns a random string character present in the layout.
        :return: string character.
        """
        return np.random.choice(self.keys, 1, replace=True)

    def initialise_sensor_position(self, finger):
        """
        Initialise the sensor position on the screen.
        :param finger: int value to represent finger type. 0: single finger, 1: left-thumb, 2: right-thumb
                        None: sensor is not a finger.
        :return:
        """
        random_row = np.random.randint(0, self.layout.shape[0])
        if finger is None or finger == 0:
            random_column = np.random.randint(0, self.layout.shape[1])
        elif finger == 1:
            # left thumb
            random_column = np.random.randint(0, int(self.layout.shape[1]/2))
        else:
            # right-thumb
            random_column = np.random.randint(int(self.layout.shape[1]/2), self.layout.shape[1])

        self.logger.debug('setting the sensor to row {%d} and column {%d}' % (random_row, random_column))
        return [random_row, random_column]

    def start(self, finger=None):
        """
        Function to initialise the device.

        :param finger: int value to represent finger type. 0: single finger, 1: left-thumb, 2: right-thumb
                        None: sensor is not a finger.
        :return: string char or None
        """
        self.logger.debug('Starting the touch screen device.')
        # Initialise the sensor position to a random location.
        sensor_loc = self.initialise_sensor_position(finger)

        return sensor_loc

    def convert_to_meters(self, distance):
        """
        Function to convert distance to meters.
        :param distance:
        :return:
        """
        return self.device_params['key_height_m'] * distance

