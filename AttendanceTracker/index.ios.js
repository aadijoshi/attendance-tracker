/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
 'use strict';

var React = require('react-native');
var Home = require('./Views/Home.js');
var styles = require('./Views/styles.js');

var {
  AppRegistry,
  NavigatorIOS,
} = React;

var AttendanceTracker = React.createClass({
  getInitialState: function() {
    return {
      currentEvent:null,
    };
  },

  render: function() {
    return (
      <NavigatorIOS
        style={styles.navigator}
        initialRoute={{
          title: "Home",
          component: Home,
        }}
        navigationBarHidden={false}
        barTintColor="white"
        tintColor="#663399"
      />
    );
  },
});

AppRegistry.registerComponent('AttendanceTracker', () => AttendanceTracker);


