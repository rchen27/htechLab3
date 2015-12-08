CS 5555 Lab 3
-----------------------

### Team

Roger Chen and Shimiao Huang

### Objective

Explore Clinical Trial Recruitment/Screening/Stratification that incorporates participant data from wearables and mobile devices. Design and prototype a tool for recruiting, screening and/or classifying study participants based on analysis of prescribed data streams for a specified period of time (1-2 weeks) so as to improve study design and outcomes.

### Web App

We use Android Moves to track two ambient streams: GPS location and number of steps taken. The android app Ohmage-mobile is used to distribute a pre-screen survey to potential trial participants for self-report data. Using these streams, we built a dashboard for clinical trial researchers to see the data from each participant. We use the data to classify each patient into the different categories detailed above and display them in a table for the researcher. They are also able to see graphs of how the patient is progressing through the run-in period and trial.


### Running

To run, install flask and run:

```
python app.py
```
