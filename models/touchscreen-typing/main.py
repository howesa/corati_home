import sys
import yaml
import numpy
import random
import logging
import argparse
from os import path, makedirs
from datetime import datetime

from src.finger_proxy.proxy_agent import ProxyAgent
from src.utilities.logging_config_manager import setup_logging

from src.display.touchscreendevice import TouchScreenDevice
from src.vision.vision_agent import VisionAgent
from src.finger.finger_agent import FingerAgent
from src.proofread.proofread_agent import ProofreadAgent
from src.supervisor.supervisor_agent import SupervisorAgent

parser = argparse.ArgumentParser()

# General parameters
parser.add_argument("--all", action="store_true", default=False,
                    help="train/test all the agents [vision, finger, proofread, supervisor]")
parser.add_argument("--vision", action="store_true", default=False, help="train/test only the vision agent")
parser.add_argument("--finger", action="store_true", default=False, help="train/test only the finger agent")
parser.add_argument("--proofread", action="store_true", default=False, help="train/test only the proofread agent")
parser.add_argument("--supervisor", action="store_true", default=False, help="train/test only the supervisor agent")
parser.add_argument("--train", action="store_true", default=False, help="run model in train mode")
parser.add_argument("--config", required=True, help="name of the configuration file (REQUIRED)")
parser.add_argument("--seed", type=int, default=datetime.now().microsecond, help="random seed default: current time")
parser.add_argument("--type", default=">", help="sentence to type for the agent.")
parser.add_argument("--batch", action="store_true", default=False, help="evaluate a batch of sentences.")
parser.add_argument("--users", type=int, default=1, help="number of users to simulate")
parser.add_argument("--twofinger", action="store_true", default=False, help="enable typing with two finger.")
parser.add_argument("--verbose", action="store_true", default=False, help="print tqdm step in new line.")

# get user command line arguments.
args = parser.parse_args()

# Initialise random seed.
numpy.random.seed(args.seed)
random.seed(args.seed)

# Setup Logger.
if not path.isdir("logs"):
    # if logs folder doesn't exist create one.
    makedirs("logs")
setup_logging(default_path=path.join("configs", "logging.yml"))
logger = logging.getLogger(__name__)
logger.info("logger is set.")

# load app config.
if path.exists(path.join("configs", args.config)):
    with open(path.join("configs", args.config), 'r') as file:
        config_file = yaml.load(file, Loader=yaml.FullLoader)
        logger.info("App Configurations loaded.")
else:
    logger.error("File doesn't exist: Failed to load %s file under configs folder." % str(args.config))
    sys.exit(0)

if args.train:
    if path.exists(path.join("configs", config_file['training_config'])):
        with open(path.join("configs", config_file['training_config']), 'r') as file:
            train_config = yaml.load(file, Loader=yaml.FullLoader)
            logger.info("Training Configurations loaded.")
    else:
        logger.error("File doesn't exist: Failed to load %s file under configs folder." %
                     config_file['training_config'])
        sys.exit(0)

    if args.vision or args.all:
        logger.info("Initiating Vision Agent Training.")
        vision_agent = VisionAgent(config_file['device_config'], train_config['vision'], args.verbose)
        vision_agent.train(vision_agent.episodes)

    if args.finger or args.all:
        logger.info("Initiating Finger Agent Training.")
        finger_agent = FingerAgent(config_file['device_config'], train_config['finger'], 0, True, args.verbose)
        finger_agent.train(finger_agent.episodes)

    if args.proofread or args.all:
        logger.info("Initiating Proofread Agent Training.")
        proofread_agent = ProofreadAgent(config_file['device_config'], train_config['proofread'], args.verbose)
        proofread_agent.train(proofread_agent.episodes)

    if args.supervisor or args.all:
        logger.info("Initiating Supervisor Agent Training.")
        if args.twofinger:
            supervisor_agent = SupervisorAgent(config_file['device_config'], train_config, True, True, args.verbose)
        else:
            supervisor_agent = SupervisorAgent(config_file['device_config'], train_config, True, False, args.verbose)

        print(type(supervisor_agent.episodes))
        supervisor_agent.train(supervisor_agent.episodes)

else:
    if path.exists(path.join("configs", config_file['testing_config'])):
        with open(path.join("configs", config_file['testing_config']), 'r') as file:
            test_config = yaml.load(file, Loader=yaml.FullLoader)
            logger.info("Training Configurations loaded.")
    else:
        logger.error("File doesn't exist: Failed to load %s file under configs folder." %
                     config_file['testing_config'])
        sys.exit(0)

    if args.vision or args.all:
        logger.info("Initiating Vision Agent Evaluation.")
        vision_agent = VisionAgent(config_file['device_config'], test_config['vision'])
        vision_agent.evaluate(args.type)

    if args.finger or args.all:
        logger.info("Initiating Finger Agent Evaluation.")
        finger_agent = FingerAgent(config_file['device_config'], test_config['finger'], 0, False)
        finger_agent.evaluate(args.type, sat_desired=test_config['finger']['typing_accuracy'])

    if args.supervisor or args.all:
        logger.info("Initiating Supervisor Agent Evaluation.")
        if args.twofinger:
            supervisor_agent = SupervisorAgent(config_file['device_config'], test_config, False, True, args.verbose)
        else:
            supervisor_agent = SupervisorAgent(config_file['device_config'], test_config, False, False, args.verbose)
        supervisor_agent.evaluate(args.type, args.batch, args.users)

