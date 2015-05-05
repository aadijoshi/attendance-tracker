/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
 'use strict';

var React = require('react-native');

var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
} = React;

var styles = StyleSheet.create({
  navigator: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    height: 30
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  }
});

module.exports = styles;

var Home = require('./Views/Home.js');




var AttendanceTracker = React.createClass({
  getInitialState: function() {
    return {
      currentEvent:null,
    };
  },

  render: function() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          component: Home,
          title: "Home", 
          passProps: {},
        }}
        navigationBarHidden={true}
      />
    );
  },
});






AppRegistry.registerComponent('AttendanceTracker', () => AttendanceTracker);


