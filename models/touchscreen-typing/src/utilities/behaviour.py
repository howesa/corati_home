import csv
from os import path


class AgentBehaviour:

    def __init__(self, agent_type="default"):
        self.filename = agent_type + "AgentBehaviour.csv"
        self.behaviour_data = []

        if not path.exists(path.join("data", "output", self.filename)):
            self.behaviour_data.append(["time", "sentence", "char", "sat_true", "sat_desired", "q-val", "action_type",
                                        "reward", "entropy", "accuracy"])

    def clear_data(self):
        self.behaviour_data.clear()
        if not path.exists(path.join("data", "output", self.filename)):
            self.behaviour_data.append(["time", "sentence", "char", "sat_true", "sat_desired", "q-val", "action_type",
                                        "reward", "entropy", "accuracy"])

    def add_datapoint(self, time=0.0, sentence="", char="", sat_true=0.0, sat_desired=0.0, qval=0.0, actiontype="", reward=0.0,
                      entropy=None, accuracy=0.0):
        self.behaviour_data.append([time, sentence, char, sat_true, sat_desired, qval, actiontype, reward, entropy,
                                    accuracy])

    def save(self):
        with open(path.join("data", "output", self.filename), "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerows(self.behaviour_data)
