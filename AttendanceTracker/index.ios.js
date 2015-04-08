/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
 'use strict';


var Button = require('react-native-button');
var React = require('react-native');

 var {
  DatePickerIOS,
  TabBarIOS,
  ListView,
  TextInput,
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

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
      selectedTab: 'createTab',
    };
  },

  _icon: function(imageUri) {
    return {
      uri: imageUri,
      isStatic: true
    };
  },

  tabBarProps: function(tabName, iconURI, onPressfn) {
    return (
      icon={this._icon({iconURI})}
      selected={this.state.selectedTab === {tabName}}
      onPress={() => {
        this.setState({
          selectedTab: {tabName}
        });
        {onPressfn}
      }}
    );
  },

  render: function() {
    return (
      <TabBarIOS>
        {this.renderTabItem('createTab', 'favorites', () => console.log("createTab"), </Create>)}
        <TabBarIOS.Item
          {this.tabBarProps('createTab', 'favorites', function(){console.log('createTab')})}>
            </Create>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          {this.tabBarProps('editTab', 'history', function(){console.log('editTab')})}>
            </Edit>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          {this.tabBarProps('attendanceTab', 'more', function(){console.log('attendanceTab')})}>
            </Attendance>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          {this.tabBarProps('syncTab', 'contact', function(){console.log('syncTab')})}>
            </Sync>
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  },
});

var Create = React.createClass({
  getInitialState: function() {
    return {
      date: new Date(),
    };
  },
  render: function() {
    return (
      <View style={style.container}>
        <Text style={style.title}>
          Create a New Event
        </Text>
        <View style={style.inputContainer}>
          <TextInput
            style={style.input}
            autoFocus={true}
            clearButtonMode='while-editing'
            onChangeText={(text) => this.setState({eventName: text})}
            placeholder='Event Name'
            returnKeyType='next'
          />
          <DatePickerIOS
            date={this.state.date}
            mode="date"
            onDateChange={(data) => {
              this.setState({
                date: {data}
              });
            }}
          />
        </View>
        <Button style={style.submit} onPress={function(){console.log({this.state})};}>
          Submit
        </Button>
      </View>
    );
  },
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    alignItems: 'center'
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
});

AppRegistry.registerComponent('AttendanceTracker', () => AttendanceTracker);
