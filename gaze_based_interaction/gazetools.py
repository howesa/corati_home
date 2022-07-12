'''
Tools for model of gaze-based interaction
Andrew Howes
2022
'''

import os
import csv

import gym
from gym import spaces

import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import time
from IPython import display

from stable_baselines3 import PPO
from stable_baselines3.common import results_plotter
from stable_baselines3.common.monitor import Monitor
from stable_baselines3.common.noise import NormalActionNoise
from stable_baselines3.common.callbacks import BaseCallback
from stable_baselines3.common.callbacks import CheckpointCallback
from stable_baselines3.common.results_plotter import load_results, ts2xy, plot_results


output_dir = 'output/'
policy_file = 'policy'


'''
    Plot learning curve
''' 

def plot_learning_curve(title='Learning Curve'):
    """
    :param output_folder: (str) the save location of the results to plot
    :param title: (str) the title of the task to plot
    """
    x, y = ts2xy(load_results(output_dir), 'timesteps')
    y = moving_average(y, window=100)
    fig = plt.figure(title)
    plt.plot(y)
    plt.xlabel('Number of Timesteps')
    plt.ylabel('Rewards')

def moving_average(values, window):
    """
    Smooth values by doing a moving average
    :param values: (numpy array)
    :param window: (int)
    :return: (numpy array)
    """
    weights = np.repeat(1.0, window) / window
    return np.convolve(values, weights, 'valid')

'''
    Get the Euclidean distance between points p and q 
'''

def get_distance(p,q):
    return np.sqrt(np.sum((p-q)**2))

'''
'''

def plot_gaze(gaze_x,gaze_y):
    plt.plot(gaze_x,gaze_y,'r+',markersize=20,linewidth=2)

'''
'''

def update_display(gap_time):
    # update the display with a time step
    display.display(plt.gcf())
    display.clear_output(wait=True)
    time.sleep(gap_time)

'''
'''

def set_canvas():
    time.sleep(2)  
    #set the canvas
    plt.close()
    fig, ax = plt.subplots(figsize=(7,7)) # note we must use plt.subplots, not plt.subplot
    plt.xlim(-1,1)
    plt.ylim(-1,1)
    plt.gca().set_aspect('equal', adjustable='box')
    update_display(gap_time=1)
    return(ax)

'''
'''

def animate_episode(ax, df_eps):
    gaze_x,gaze_y=df_eps.loc[0]['fixation_x'],df_eps.loc[0]['fixation_y']
    plot_gaze(gaze_x,gaze_y)

    for t in range(1,len(df_eps)):
        # each time step t

        if t==2:
            # target
            target_x,target_y=df_eps.loc[t]['target_x'],df_eps.loc[t]['target_y']
            target_width=df_eps.loc[t]['target_width']
            circle1 = plt.Circle((target_x,target_y), target_width/2, color='k')
            ax.add_patch(circle1)
            update_display(gap_time=0.3)

        new_gaze_x,new_gaze_y=df_eps.loc[t]['fixation_x'],df_eps.loc[t]['fixation_y'] 
        plt.arrow(gaze_x,gaze_y, new_gaze_x-gaze_x,new_gaze_y-gaze_y,head_width=0.05,
                      length_includes_head=True,linestyle='-',color='r')
        plot_gaze(new_gaze_x,new_gaze_y)
        update_display(gap_time=0.3)
            
         # new gaze becomes the current gaze
        gaze_x,gaze_y=new_gaze_x,new_gaze_y

'''
'''

def animate_multiple_episodes(data, n):
    for eps in range(n):
        # each episode
        ax = set_canvas()
    
        # behaviour data for each episode
        df_eps=data.loc[data['episode']==eps]
        df_eps.reset_index(drop=True, inplace=True)
    
        # truncate the length of the episode if it is too long.
        if len(df_eps) > 5:
            df_eps = df_eps[0:5]
        
        animate_episode(ax, df_eps)
    return True

'''
'''

def default_box(x):
    return spaces.Box(low=-1, high=1, shape=(x, ), dtype=np.float64)
        