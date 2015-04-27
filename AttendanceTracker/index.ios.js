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
module.exports = MOCK_EVENTS;

var Search = require('./Search.js');
var Event = require('./Event.js');
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
    };
  },

  onPressHandler: function(tabName) {
    this.setState({
      selectedTab:tabName,
      editing:false,
      currentEvent:null,
    });
  },
  onSubmitHandler: function(tabName, event, editing) {
    if (event != null) {
      this.setState({
        currentEvent:event,
      });
    };
    if (editing == true && tabName == "editTab") {
      this.setState({
        editing : true,
      });
    } else {
      this.setState({
        editing : false,
      });
    }
    this.setState({
      selectedTab:tabName,
    });
  },
  render: function() {
    var editTabContent;
    if (this.state.editing) {
      editTabContent = (<Event title="Edit an Existing Event" onSubmitHandler={this.onSubmitHandler} event={this.state.currentEvent}></Event>);
    } else {
      editTabContent = (<Search title="Find an Event to Edit" onSubmitHandler={this.onSubmitHandler} targetTab="editTab"></Search>);
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
            <Search title="Find an Event to Start Taking Attendance" onSubmitHandler={this.onSubmitHandler} targetTab="syncTab"></Search>
        </TabBarIOSItemContent>
        <TabBarIOSItemContent tabName='syncTab' iconURI='contacts' selectedTab={this.state.selectedTab} onPressHandler={this.onPressHandler}>
            <Sync></Sync>
        </TabBarIOSItemContent>
      </TabBarIOS>
    );
  },
});

var styles = StyleSheet.create({
  
});



AppRegistry.registerComponent('AttendanceTracker', () => AttendanceTracker);


