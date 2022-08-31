# -*- coding: utf-8 -*- 

import numpy as np
import queue
import cv2
import csv
import pprint
from tqdm import tqdm
from PIL import ImageFont, ImageDraw, Image

pp = pprint.PrettyPrinter(indent=4)

# global
# from the image device.png
start_x = 563
start_y = 1956
key_width = 131
key_height = 230

# device image
device_img = "./data/images/device.png"

# video fps
fps = 50

# eye color
eye_rgb = (0, 255, 0)  # (255, 0, 0)

# finger color
finger_rgb = (255, 0, 0)  # (0, 255, 0)

# agent radius
radius = 40

# Transparency factor
alpha = 0.7

fontpath = "./src/visualise/Arial.ttf"
font = ImageFont.truetype(fontpath, 80)


def read_data_from_csv(filename):
    """ Reads test data stored in csv file.
        CSV Structure: ["model time", "agent loc x", "agent loc y", "action x", "action y", "type"]

        Args:
            filename : name of csv file.

        Returns:
            data : list of data in csv file excluding the header row.
    """
    with open(filename, 'rU') as f:
        reader = csv.reader(f, delimiter=',')
        data = list(list(line) for line in reader)
        data = data[1:]
        return data


def interp_test_data(data):
    """ Interpolates the data according to the specified fps

        Args:
            data : list of test data of shape :
            ["model time", "agent loc x", "agent loc y", "action x", "action y", "type"].

        Returns:
            itrp_data : list of interpolated data.
    """
    # interpolation interval = (1000 / fps) since 1 sec = 1000 ms
    interp_ms = 1000 / fps

    ####int(round(float(data[i][0])/interp_ms)*interp_ms)
    # rounding off model times to nearest interp_ms.
    model_time = [int(interp_ms * round(float(val[0]) / interp_ms)) for val in data]
    agent_loc_x = [int(val[1]) for val in data]
    agent_loc_y = [int(val[2]) for val in data]
    action_x = [val[3] for val in data]
    action_y = [val[4] for val in data]
    itrp_data = []

    # arranging model time. +1 to include last time.
    model_time_itrp = np.arange(0, model_time[-1] + 1, interp_ms)
    # interpolate agent loc x wrt model time.
    agent_loc_x_itrp = np.interp(model_time_itrp, model_time, agent_loc_x)
    # interpolate agent loc y wrt model time.
    agent_loc_y_itrp = np.interp(model_time_itrp, model_time, agent_loc_y)

    # copying the action where it was present originally
    for i in tqdm(range(len(model_time_itrp))):
        action_x_itrp = ""
        action_y_itrp = ""
        if model_time_itrp[i] in model_time:
            idx = model_time.index(model_time_itrp[i])
            action_x_itrp = action_x[idx]
            action_y_itrp = action_y[idx]
        itrp_data.append([model_time_itrp[i], agent_loc_x_itrp[i], agent_loc_y_itrp[i], action_x_itrp, action_y_itrp])
    return itrp_data


def lerp(v0, v1, i):
    return v0 + i * (v1 - v0)


def interp_cubic_test_data(data):
    """ Interpolates the data according to the specified fps

        Args:
            data : list of test data of shape :
            ["model time", "agent loc x", "agent loc y", "action x", "action y", "type"].

        Returns:
            itrp_data : list of interpolated data.
    """
    # interpolation interval = (1000 / fps) since 1 sec = 1000 ms
    interp_ms = 1000 / fps

    ####int(round(float(data[i][0])/interp_ms)*interp_ms)
    # rounding off model times to nearest interp_ms.
    model_time = [int(interp_ms * round(float(val[0]) / interp_ms)) for val in data]
    agent_loc_x = [int(val[1]) for val in data]
    agent_loc_y = [int(val[2]) for val in data]
    action_x = [val[3] for val in data]
    action_y = [val[4] for val in data]
    itrp_data = []

    # arranging model time. +1 to include last time.

    model_time_itrp = []  # np.arange(0, model_time[-1] + 1, interp_ms)
    # interpolate agent loc x wrt model time.
    agent_loc_x_itrp = []  # np.interp(model_time_itrp, model_time, agent_loc_x)
    # interpolate agent loc y wrt model time.
    agent_loc_y_itrp = []  # np.interp(model_time_itrp, model_time, agent_loc_y)

    # TODO: doing a hack job here due to deadline. Future work to clean up the entire visualisation code.
    for i in range(len(model_time) - 1):
        x0 = agent_loc_x[i]
        y0 = agent_loc_y[i]

        x1 = agent_loc_x[i + 1]
        y1 = agent_loc_y[i + 1]

        time_diff = model_time[i + 1] - model_time[i]
        n = int(time_diff / interp_ms)

        points = [(lerp(x0, x1, ((1. / n * i)) ** 3), lerp(y0, y1, ((1. / n * i)) ** 3)) for i in range(n + 1)]
        points = points[1:]
        t = model_time[i] + interp_ms
        for row in points:
            model_time_itrp.append(t)
            agent_loc_x_itrp.append(row[0])
            agent_loc_y_itrp.append(row[1])
            t += interp_ms

    model_time_itrp.append(model_time[-1])
    agent_loc_x_itrp.append(agent_loc_x[-1])
    agent_loc_y_itrp.append(agent_loc_y[-1])

    for i in tqdm(range(len(model_time_itrp))):
        action_x_itrp = ""
        action_y_itrp = ""
        if model_time_itrp[i] in model_time:
            idx = model_time.index(model_time_itrp[i])
            action_x_itrp = action_x[idx]
            action_y_itrp = action_y[idx]
        itrp_data.append([model_time_itrp[i], agent_loc_x_itrp[i], agent_loc_y_itrp[i], action_x_itrp, action_y_itrp])
    return itrp_data


def xy_to_key(row, col):
    """ given row and col returns the respective character.

        Args:
            row : index of row.
            col : index of col.

        Returns:
            keys[row][col] : character corresponding to row and col
    """
    keys = [['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'å'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä'],
            ['-', '-', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '<', '<'],
            ['-', '-', '-', ' ', ' ', ' ', ' ', ' ', '>', '>', '>']]  # < : backspace, > : enter
    return keys[row][col]


def xy_to_pixels(row, col):
    """ given row and col returns the pixel x and y for the device.

        Args:
            row : index of row.
            col : index of col.

        Returns:
            x : x pixel in the device
            y : y pixel in the device
    """
    x = start_x + float(col) * key_width
    y = start_y + float(row) * key_height
    return x, y


def draw_agent(img, loc_x, loc_y, rgb):
    """ draw agent location on the device with given color.

        Args:
            img : cv2 read image of device.
            loc_x : col of the agent.
            loc_y : row of the agent.
            rgb : (r,g,b) tuple of rgb color

        Returns:
            agent_drawn_img : image with agent drawn
            x : x pixel of agent in the device
            y : y pixel of agent in the device
    """
    x, y = xy_to_pixels(loc_x, loc_y)
    agent_drawn_img = cv2.circle(img, (int(x), int(y)), radius, rgb, -1)
    return agent_drawn_img, int(x), int(y)


def draw_agent_points(img, trail_data, rgb, vision):
    """ draw agent location on the device with given color.

        Args:
            img : cv2 read image of device.
            trail_data : data of trail data of the agent
            rgb : (r,g,b) tuple of rgb color
            vision: boolean for plotting vision point

        Returns:
            agent_drawn_img : image with agent drawn
            x : x pixel of agent in the device
            y : y pixel of agent in the device
    """
    for j in range(len(trail_data)):
        x, y = xy_to_pixels(trail_data[j][0], trail_data[j][1])
        if vision:
            img = cv2.circle(img, (int(x), int(y)), radius - 10, rgb, -1)
        else:
            img = cv2.circle(img, (int(x), int(y)), radius, rgb, -1)

    return img


def draw_agent_trail(img, trail_data, rgb, vision):
    """ draw agent trail on the device with given color.

        Args:
            img : cv2 read image of device.
            trail_data : data of trail data of the agent
            rgb : (r,g,b) tuple of rgb color

        Returns:
            img : updated image with agent trail drawn.
    """
    for j in range(len(trail_data)):
        if j > 0:
            if vision:
                cv2.line(img, trail_data[j], trail_data[j - 1], rgb, 5)
            else:
                cv2.line(img, trail_data[j], trail_data[j - 1], rgb, 12)
    return img


def show_keypress(img, action_x, action_y):
    """ highlights the pressed key.

        Args:
            img : cv2 read image of device.
            action_x : col of the action.
            action_y : row of the action.

        Returns:
            keypress_img : image with agent drawn
            x : x pixel of agent in the device
            y : y pixel of agent in the device
    """
    x, y = xy_to_pixels(action_x, action_y)
    x1 = 0;
    x2 = 0

    # keypress for backspace
    if action_x == 2 and action_y == 9:
        x1 = x - (key_width / 2);
        x2 = x + (key_width / 2) + (1 * key_width)
    elif action_x == 2 and action_y == 10:
        x1 = x - (key_width / 2) - (1 * key_width);
        x2 = x + (key_width / 2)

    # keypress for space
    elif action_x == 3 and action_y == 3:
        x1 = x - (key_width / 2);
        x2 = x + (key_width / 2) + (4 * key_width)
    elif action_x == 3 and action_y == 4:
        x1 = x - (key_width / 2) - (1 * key_width);
        x2 = x + (key_width / 2) + (3 * key_width)
    elif action_x == 3 and action_y == 5:
        x1 = x - (key_width / 2) - (2 * key_width);
        x2 = x + (key_width / 2) + (2 * key_width)
    elif action_x == 3 and action_y == 6:
        x1 = x - (key_width / 2) - (3 * key_width);
        x2 = x + (key_width / 2) + (1 * key_width)
    elif action_x == 3 and action_y == 7:
        x1 = x - (key_width / 2) - (4 * key_width);
        x2 = x + (key_width / 2)

    # keypress for enter
    elif action_x == 3 and action_y == 8:
        x1 = x - (key_width / 2);
        x2 = x + (key_width / 2) + (2 * key_width)
    elif action_x == 3 and action_y == 9:
        x1 = x - (key_width / 2) - (1 * key_width);
        x2 = x + (key_width / 2) + (1 * key_width)
    elif action_x == 3 and action_y == 10:
        x1 = x - (key_width / 2) - (2 * key_width);
        x2 = x + (key_width / 2)

    # other keypresses
    else:
        x1 = x - (key_width / 2);
        x2 = x + (key_width / 2)

    keypress_img = cv2.rectangle(img, (int(x1), int(y - key_height / 2)), (int(x2), int(y + key_height / 2)),
                                 (80, 80, 80), -1)

    return keypress_img


def update_text_area(text, action_x, action_y):
    """ updates the text area region.

        Args:
            text : current typed text.
            action_x : col of the action.
            action_y : row of the action.

        Returns:
            text : new text after taking action
    """

    key = xy_to_key(int(action_x), int(action_y))
    if key == '<':
        text = text[:-1]
    elif key == '>':
        text = text
    else:
        text += key
    return text


def add_details(img, screen_img, text, has_vision, has_finger, model_time):
    """ add details to the screen image.

        Args:
            img : current cv2 read image.
            screen_img : original cv2 read device image.
            text : current text.
            has_vision : bool
            has_finger : bool
            model_time : current model time

        Returns:
            img : updated image
    """
    img = cv2.addWeighted(img, alpha, screen_img, 1 - alpha, 0)
    img_pil = Image.fromarray(img)
    draw = ImageDraw.Draw(img_pil)
    draw.text((525, 410), text, font=font, fill=(0, 0, 0, 0))
    img = np.array(img_pil)
    # cv2.putText(img, text, (520, 485), cv2.FONT_HERSHEY_SIMPLEX, 3, (0, 0, 0), 3, cv2.LINE_AA)
    cv2.putText(img, "Trial time = " + str(model_time) + "ms", (500, 150), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 0), 3,
                cv2.LINE_AA)
    if has_vision:
        cv2.putText(img, 'Eye', (30, 440), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 0), 3, cv2.LINE_AA)
        cv2.circle(img, (440, 420), 30, eye_rgb, -1)
    if has_finger:
        cv2.putText(img, 'Finger', (30, 560), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 0), 3, cv2.LINE_AA)
        cv2.circle(img, (440, 540), 40, finger_rgb, -1)

    return img


def save_video(screen_img, screen_arr, output_file):
    """ Saves the image frames as a video

        Args:
            screen_img : original cv2 read device image.
            screen_arr : screen frames.
            output_file : name of the output file
    """
    size = (int(screen_img.shape[1]), int(screen_img.shape[0]))
    fourcc = cv2.VideoWriter_fourcc(*'MP4V')
    out = cv2.VideoWriter(output_file, fourcc, fps, size)
    for i in range(len(screen_arr)):
        out.write(screen_arr[i])
    out.release()


def visualise_agent(has_vision, has_finger, vision_file, finger_file, output_file):
    screen_img = cv2.imread(device_img)
    screen_arr = []
    eye_trail = []
    finger_trail = []
    eye_point_trail = []
    finger_point_trail = []
    text = ""
    data_size = 0

    if has_vision:
        eye_data = read_data_from_csv(vision_file)
        eye_data = interp_test_data(eye_data)
        if data_size == 0:  data_size = len(eye_data)

    if has_finger:
        finger_data = read_data_from_csv(finger_file)
        finger_data = interp_cubic_test_data(finger_data)
        if data_size == 0:  data_size = len(finger_data)

    for i in range(data_size):
        img = screen_img.copy()
        if has_finger:
            # drawing keypress if action is present
            if not finger_data[i][3] == "":
                img = show_keypress(img, int(finger_data[i][3]), int(finger_data[i][4]))
                text = update_text_area(text, finger_data[i][3], finger_data[i][4])
                finger_point_trail.append((finger_data[i][1], finger_data[i][2]))

            img = draw_agent_points(img, finger_point_trail, finger_rgb, False)
            img, fingerloc_x, fingerloc_y = draw_agent(img, finger_data[i][1], finger_data[i][2], finger_rgb)

            finger_trail.append((fingerloc_x, fingerloc_y))
            # if len(finger_trail) > 10: finger_trail.pop(0)  # restriciting trail size to 10
            img = draw_agent_trail(img, finger_trail, finger_rgb, False)
            img = add_details(img, screen_img, text, has_vision, has_finger, finger_data[i][0])

        if has_vision:
            # drawing keypress if action is present
            if not eye_data[i][3] == "" and not has_finger:
                img = show_keypress(img, int(eye_data[i][3]), int(eye_data[i][4]))
                text = update_text_area(text, eye_data[i][3], eye_data[i][4])

            if not eye_data[i][3] == "":
                eye_point_trail.append((eye_data[i][1], eye_data[i][2]))

            img = draw_agent_points(img, eye_point_trail, eye_rgb, True)
            img, eyeloc_x, eyeloc_y = draw_agent(img, eye_data[i][1], eye_data[i][2], eye_rgb)
            eye_trail.append((eyeloc_x, eyeloc_y))
            # if len(eye_trail) > 10: eye_trail.pop(0)  # restriciting trail size to 10
            img = draw_agent_trail(img, eye_trail, eye_rgb, True)
            img = add_details(img, screen_img, text, has_vision, has_finger, eye_data[i][0])

        screen_arr.append(img)

    save_video(screen_img, screen_arr, output_file)

# def visualise_vision_agent(test_data_file, output_file):

#     data = read_data_from_csv(test_data_file)
#     data = interp_data(data)

#     screen_img = cv2.imread(device_img)

#     screen_arr = []
#     eye_trail = []
#     text = ""
#     alpha = 0.7  # Transparency factor
#     for i in range(len(data)):
#         img = screen_img.copy()
#         if not data[i][3] == "":
#             img = show_keypress(img, int(data[i][3]), int(data[i][4]))
#             text = change_text(text, data[i][3], data[i][4])

#         img, eyeloc_x, eyeloc_y = show_eyelocation(img, data[i][1], data[i][2])
#         eye_trail.append((int(eyeloc_x), int(eyeloc_y)))
#         if len(eye_trail) > 10 :
#             eye_trail.pop(0)

#         for j in range(len(eye_trail)):
#             if j > 0 :
#                 cv2.line(img, eye_trail[j],eye_trail[j-1], (0,255,0), 5)


#         img = cv2.addWeighted(img, alpha, screen_img, 1 - alpha, 0)

#         cv2.putText(img, text,(520,485), cv2.FONT_HERSHEY_SIMPLEX,3,(0,0,0),3,cv2.LINE_AA)
#         cv2.putText(img, "Trial time = " + str(int(data[i][0])) + "ms",(500,150),cv2.FONT_HERSHEY_SIMPLEX,2,(0,0,0),3,cv2.LINE_AA)
#         cv2.putText(img,'Eye',(30,520), cv2.FONT_HERSHEY_SIMPLEX,2,(0,0,0),3,cv2.LINE_AA)
#         cv2.circle(img,(440,500),40,(0,255,0),-1)

#         screen_arr.append(img)

#     size = (int(screen_img.shape[1]),int(screen_img.shape[0]))
#     fourcc = cv2.VideoWriter_fourcc(*'MP4V')
#     out = cv2.VideoWriter(output_file,fourcc, 50.0, size)
#     for i in range(len(screen_arr)):
#         out.write(screen_arr[i])
#     out.release()

# def visualise_finger_agent(test_data_file, output_file):

#     data = read_data_from_csv(test_data_file)
#     data = interp_data(data)

#     screen_img = cv2.imread(device_img)

#     screen_arr = []
#     finger_trail = []
#     text = ""
#     alpha = 0.7  # Transparency factor
#     for i in range(len(data)):
#         img = screen_img.copy()
#         if not data[i][3] == "":
#             img = show_keypress(img, int(data[i][3]), int(data[i][4]))
#             text = change_text(text, data[i][3], data[i][4])

#         img, fingerloc_x, fingerloc_y = show_fingerlocation(img, data[i][1], data[i][2])
#         finger_trail.append((int(fingerloc_x), int(fingerloc_y)))
#         if len(finger_trail) > 10 :
#             finger_trail.pop(0)

#         for j in range(len(finger_trail)):
#             if j > 0 :
#                 cv2.line(img, finger_trail[j],finger_trail[j-1], (255,0,0), 5)


#         img = cv2.addWeighted(img, alpha, screen_img, 1 - alpha, 0)

#         cv2.putText(img, text,(520,485), cv2.FONT_HERSHEY_SIMPLEX,2,(0,0,0),3,cv2.LINE_AA)
#         cv2.putText(img, "Trial time = " + str(int(data[i][0])) + "ms",(500,150),cv2.FONT_HERSHEY_SIMPLEX,2,(0,0,0),3,cv2.LINE_AA)
#         cv2.putText(img,'Finger',(30,520), cv2.FONT_HERSHEY_SIMPLEX,2,(0,0,0),3,cv2.LINE_AA)
#         cv2.circle(img,(440,500),40,(255,0,0),-1)

#         screen_arr.append(img)

#     size = (int(screen_img.shape[1]),int(screen_img.shape[0]))
#     fourcc = cv2.VideoWriter_fourcc(*'MP4V')
#     out = cv2.VideoWriter("./output/output_finger.mp4",fourcc, 50.0, size)
#     for i in range(len(screen_arr)):
#         out.write(screen_arr[i])
#     out.release()
