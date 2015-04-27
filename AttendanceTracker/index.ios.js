/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
 'use strict';

var React = require('react-native');

var {
  AppRegistry,
  TabBarIOS,
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    containerBackgroundColor: 'white' 
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  }
});

module.exports = {
  styles: styles,
  MOCK_EVENTS: MOCK_EVENTS,
};


var Search = require('./Search.js');
var Event = require('./Event.js');
var Attendance = require('./Attendance.js');
var Sync = require('./Sync.js');



//var CardReaderManager = require('NativeModules').CardReaderManager;
//
//CardReaderManager.test((error, msg) => {
//  if (error) {
//    console.error(error);
//  } else {
//    console.log(msg);
//  }
//});
var TabBarIOSItemContent = React.createClass({
  _icon: function(imageUri) {
    return {
      uri: imageUri,
      isStatic: true
    };
  },
  onPressHandler: function() {
    this.props.onPressHandler(this.props.tabName);
  },
  render: function() {
    return (
      <TabBarIOS.Item
        icon={this._icon(this.props.iconURI)}
        selected={this.props.selectedTab === this.props.tabName}
        onPress={this.onPressHandler}
        key={new Date()}
      >
        {this.props.children}
      </TabBarIOS.Item>
    );
  },
});

var AttendanceTracker = React.createClass({
  getInitialState: function() {
    return {
      selectedTab: 'createTab',
      editing:false,
      currentEvent:null,
      takingAttendance:false,
    };
  },

  onPressHandler: function(tabName) {
    this.replaceState(this.getInitialState());
    this.setState({
      selectedTab:tabName,
    });
  },
  onSubmitHandler: function(tabName, event, editing, takingAttendance) {
    this.setState({
      currentEvent: event,
      editing : editing,
      takingAttendance: takingAttendance,
      selectedTab: tabName,
    });
  },
  render: function() {
    var editTabContent, attendanceTabContent;
    if (this.state.editing) {
      editTabContent = (<Event title="Edit an Existing Event" onSubmitHandler={this.onSubmitHandler} event={this.state.currentEvent}></Event>);
    } else {
      editTabContent = (<Search title="Find an Event to Edit" onSubmitHandler={this.onSubmitHandler} targetTab="editTab"></Search>);
    }
    if (this.state.takingAttendance) {
      attendanceTabContent = (<Attendance event={this.state.currentEvent}></Attendance>);
    } else {
      attendanceTabContent = (<Search title="Find an Event to Start Taking Attendance" onSubmitHandler={this.onSubmitHandler} targetTab="attendanceTab"></Search>);
    }
    return (
      <TabBarIOS>
        <TabBarIOSItemContent tabName='createTab' iconURI='favorites' selectedTab={this.state.selectedTab} onPressHandler={this.onPressHandler}>
            <Event title="Create a New Event" onSubmitHandler={this.onSubmitHandler}></Event>
        </TabBarIOSItemContent>
        <TabBarIOSItemContent tabName='editTab' iconURI='history' selectedTab={this.state.selectedTab} onPressHandler={this.onPressHandler}>
          {editTabContent}
        </TabBarIOSItemContent>
        <TabBarIOSItemContent tabName='attendanceTab' iconURI='more' selectedTab={this.state.selectedTab} onPressHandler={this.onPressHandler}>
          {attendanceTabContent}
        </TabBarIOSItemContent>
        <TabBarIOSItemContent tabName='syncTab' iconURI='contacts' selectedTab={this.state.selectedTab} onPressHandler={this.onPressHandler}>
            <Sync></Sync>
        </TabBarIOSItemContent>
      </TabBarIOS>
    );
  },
});






AppRegistry.registerComponent('AttendanceTracker', () => AttendanceTracker);


