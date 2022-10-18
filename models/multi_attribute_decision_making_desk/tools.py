'''
Tools for gaze-based interaction
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
import pickle

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

def plot_learning_curve(output_dir, window=100):
    """
    :param output_folder: (str) the save location of the results to plot
    """
    x, y = ts2xy(load_results(output_dir), 'timesteps')
    y = moving_average(y, window=window)
    title='Learning Curve'
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

def set_canvas(bg):
    time.sleep(2)  
    #set the canvas
    plt.close()
    fig, ax = plt.subplots(figsize=(7,7)) # note we must use plt.subplots, not plt.subplot
    ax.get_xaxis().set_visible(False)
    ax.get_yaxis().set_visible(False)
    plt.xlim(-1,4)
    plt.ylim(-1,4)
    plt.gca().set_aspect('equal', adjustable='box')
    
    n = bg.shape[0]
    for i in range(0,n):
        if bg['type'][i] == 'button':
            plt.text( bg['x'][i], bg['y'][i], bg['value'][i], horizontalalignment='center' )
        elif bg['type'][i] == 'value':
            plt.text( bg['x'][i], bg['y'][i], bg['value'][i], horizontalalignment='center' )

    update_display(gap_time=1)
    return ax

'''
'''

def animate_episode(ax, df_eps):
    gaze_x,gaze_y = df_eps.loc[0]['fixation_x'],df_eps.loc[0]['fixation_y']
    width = 0.02

    for t in range(1,len(df_eps)):
        # each time step t
        new_gaze_x, new_gaze_y = df_eps.loc[t]['fixation_x'],df_eps.loc[t]['fixation_y'] 
        plt.arrow(gaze_x,gaze_y, new_gaze_x-gaze_x,new_gaze_y-gaze_y,head_width=0.05,
                      length_includes_head=True,linestyle='-',color='r')

        # plot fixation
        circle1 = plt.Circle((new_gaze_x,new_gaze_y), width, color='r')
        ax.add_patch(circle1)

        if (gaze_x == new_gaze_x) and (gaze_y == new_gaze_y):
            width = width + 0.02
        else:
            width = 0.01
        
        update_display(gap_time=0.3)
            
        # gaze becomes the current gaze
        gaze_x,gaze_y=new_gaze_x,new_gaze_y

'''
'''

def animate_multiple_episodes(data, background, n):
    for eps in range(n):
        # each episode
        bg_eps = background.loc[ background['episode']==eps]
        bg_eps.reset_index(drop=True, inplace=True)
        ax = set_canvas(bg_eps)
    
        # behaviour data for each episode
        df_eps = data.loc[data['episode']==eps]
        df_eps.reset_index(drop=True, inplace=True)

        # truncate the length of the episode if it is too long.
        #if len(df_eps) > 5:
        #    df_eps = df_eps[0:5]
        
        animate_episode(ax, df_eps)

'''
'''

def default_box(x):
    ''' Used by gym for continuous actions and observation spaces.
    '''
    return spaces.Box(low=-1, high=1, shape=(x, ), dtype=np.float64)

'''
'''

def create_new_folder(outdir):
    ''' Create a new folder with the name {outdir}_{folder_number}. 
        Folder_number is stored in a pickle file and is incremented each time a folder is created.
    '''
    
    folder_number_filename = f'.folder_number_for_{outdir}.pickle'

    if os.path.exists(folder_number_filename):
        print(folder_number_filename)
        with open(folder_number_filename, 'rb') as handle:
            folder_number = pickle.load(handle) + 1
    else:
        folder_number = 0

    with open(folder_number_filename, 'wb') as handle:
        pickle.dump(folder_number, handle, protocol=pickle.HIGHEST_PROTOCOL)
    
    outdir = f'{outdir}_{folder_number:03}/'
    
    if not os.path.exists(outdir):
        os.mkdir(outdir)

    return outdir

'''
'''

def data_to_csv(data,dirname,filename):
    df = pd.DataFrame(data)
    path = f'{dirname}/{filename}'
    df.to_csv(path,index=False)
