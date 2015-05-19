# Attendance Tracker
Attendance tracker for Athletics Department @ NYUAD using iDynamo and NYU ID cards on iOS, and analytics with Highcharts on the frontend. Software Engineering project.

# Structure
The project includes two main parts: **iOS react-native app** for the iOS part, and **Django app** for web-based analytics placed in AttendanceTracker/ and server/ respectively. 

# Depencies

### iOS app
Since iOS app is built using React Native, you will have to install React Native's dependencies, like Node and Watchman. Please refer to https://facebook.github.io/react-native/docs/getting-started.html

To meet project-specific dependencies, you should run `npm install` in the AttendanceTracker/ directory in order to isntall dependencies listed in `package.json`

We are also using Magtek's iDynamo. Please refer to their documentation for the information about the SDK at http://magtek.com/docs/99875473.pdf

### Django app
The web interface Django app requires Django version 1.8 and Python 2.7. Refer to https://docs.djangoproject.com/en/1.8/topics/install/ to install Django and related depependencies.

Depending on your database choice, you might have to install a database driver. Refer to https://docs.djangoproject.com/en/1.8/topics/install/#get-your-database-running for more info.

The django app uses bower to manage dependencies. The easiest way to install bower is through npm by running
`npm install -g bower`
After installing bower, run `bower install` in the server/ directory to install dependencies listed in `bower.json`

After setting up Django and installing dependencies through bower, you can start developing the web interface of the project.

# Project Structure
iOS app provides swiping capabilities, which are then synched through an API endpoint into the server, and the front-end provides interface to perform analytics, as well as administration on the database. 

# Bug Reporting
Please submit bugs via issues on Github. If you want to fix bugs, see Contributing

# Contributing
* Fork the repository
* (optional but recommended) Create a branch to develop on
* Submit a pull request
