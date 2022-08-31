import abc
import numpy as np


class Agent(abc.ABC):

    @abc.abstractmethod
    def train(self, episodes):
        pass

    @abc.abstractmethod
    def evaluate(self, sentence, **kwargs):
        pass
