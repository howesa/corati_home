import abc
import numpy as np
from os import path

import logging


class Device(abc.ABC):
    def __init__(self):
        self.logger = self.logger = logging.getLogger(__name__)
        self.layout = None

    def load_layout(self, layout_config):
        if path.exists(path.join('layouts', layout_config)):
            self.layout = np.load(path.join('layouts', layout_config))
            self.logger.info('layout loading completed.')
        else:
            self.logger.error('failed to load layout file {%s}.' % layout_config)
