import numpy as np

import chainer
import chainerrl
import chainer.links as L
import chainer.functions as F


class QFunction(chainer.Chain):

    def __init__(self, embed_size, n_actions, n_hidden_channels=50, dropout_ratio=0.2):
        super().__init__()
        self.dropout = dropout_ratio
        with self.init_scope():
            self.l0 = L.Linear(embed_size, n_hidden_channels)
            self.l1 = L.Linear(n_hidden_channels, n_hidden_channels)
            self.l2 = L.Linear(n_hidden_channels, n_hidden_channels)
            self.l3 = L.Linear(n_hidden_channels, n_actions)

    def __call__(self, x, test=False):
        """
        Args:
            x (ndarray or chainer.Variable): An observation
            test (bool): a flag indicating whether it is in test mode
        """
        h = F.relu(self.l0(x))
        h = F.dropout(h, self.dropout)
        h = F.relu(self.l1(h))
        h = F.dropout(h, self.dropout)
        h = F.relu(self.l2(h))
        return chainerrl.action_value.DiscreteActionValue(self.l3(h))
