The current UI only contains basic functions, therefore, some fields in the UI are not feasible for now and do not need to be filled in when you test the model.<br />
The below instructions indicates what you need to do and what you can do with the current version of UI.

## Landing Page

Both "evaluating" and "training" are available.

## Evaluation

### evaluate/model

- **Corpus Selection**
  Choose **Single Sentence** and fill in the field.

- **Model Selection**
  Choose **Default** as the selected model.

- **Start Evaluating**
  Press the button to start.

### evaluate/process

Wait for the evaluation of the model, check the log of evaluation process. <br />
After the evaluation is done, the page will indicate the success status.
<br />
Press "Check Results" to view the data.

### evaluate/result

N.B. All data displayed for now is hard-coded. (path: ../data/output1 )

- **Sentence-level Results**
  Choose either "Sentence" or "Statistic feature" for inspecting the aggregated results for **one specific sentence**.

- **Trail-level Results**
  Choose either "Trial" or "Statistic feature" for inspecting the aggregated results for **one specific trial**.
  <br />
  Turn to the tab "Video", press the button to generate video for the selected trial. The video will be generated in ../data/output/SupervisorAgent.mp4.

- **Save Model**
  Press the button and name the model.
  <br />
  This specific model used for evaluation will be saved in ../data/models_saved, and can be resused in evaluation (automatically displayed in the dropdown menu of "built-in and saved models").

## Training

### train/model

- **Corpus Selection**
  Leave all fields blank. (You can play around them, but the values will not affect the model)

- **Model Configuration**
  Leave all fields blank. (You can play around them, but the values will not affect the model)

- **Device Specification**
  Leave all fields blank. (You can play around them, but the values will not affect the model)

- **Keyboard Setting**
  You can play around them, but the result of customized keyboard hasn't been connected to the model.
  Press "Preview" to check the customized keyboard.

- **Start Training**
  Press the button to start.

### train/process

Wait for the training of the model, check the log of evaluation process. <br />
However, it'll disconnected with frontend in 2 mins, but continue training on backend (see in the backend terminal).
No succeess status will be displayed and the training page will remain like this all the time as no response can be fetched.
<br />
Please manually modify the url as ".../train/result" to check the hard-coded result.

### train/result

N.B. All data displayed for now is hard-coded. (path: ../data/output1 )

- **Sentence-level Results**
  Choose either "Sentence" or "Statistic feature" for inspecting the aggregated results for **one specific sentence**.

- **Trail-level Results**
  Choose either "Trial" or "Statistic feature" for inspecting the aggregated results for **one specific trial**.
  <br />
  Turn to the tab "Video", press the button to generate video for the selected trial. The video will be generated in ../data/output/SupervisorAgent.mp4.

- **Save Model**
  Press the button and name the model.
  <br />
  This specific model configured for training will be saved in ../data/models_saved, and can be resused in evaluation (automatically displayed in the dropdown menu of "built-in and saved models").

## TODO list

https://docs.google.com/document/d/1kzlWyMdVMlkp-Q1ACUrTKl-6gdpm9g7uiI-G0qxdR9M/edit?usp=sharing
