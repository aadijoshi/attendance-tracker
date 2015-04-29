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


var MOCK_EVENTS =
[
  {
    name: "Karting",
    date: new Date(2015, 1, 10, 0, 0, 0, 0),
    ids: [
      "N1",
      "N22",
      "N333",
      "N444"
      ]
  },
  {
    name: "Archery",
    date: new Date(2015, 2, 20, 0, 0, 0, 0),
    ids: [
      "N4444",
      "N1",
      ]
  },
  {
    name: "Wakeboarding",
    date: new Date(2015, 3, 30, 0, 0, 0, 0),
    ids: []
  },
];

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

var Home = require('./Home.js');


//var CardReaderManager = require('NativeModules').CardReaderManager;
//
//CardReaderManager.test((error, msg) => {
//  if (error) {
//    console.error(error);
//  } else {
//    console.log(msg);
//  }
//});


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


