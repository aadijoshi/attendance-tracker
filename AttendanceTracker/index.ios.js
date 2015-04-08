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

  render: function() {
    return (
      <TabBarIOS>
        <TabBarIOSItemContent tabName='createTab' iconURI='favorites' onPressfn=function(){console.log('createTab')}>
            </Create>
        </TabBarIOSItemContent>
        <TabBarIOSItemContent tabName='editTab' iconURI='history' onPressfn=function(){console.log('editTab')}>
            </Create>
        </TabBarIOSItemContent>
        <TabBarIOSItemContent tabName='attendanceTab' iconURI='more' onPressfn=function(){console.log('attendanceTab')}>
            </Create>
        </TabBarIOSItemContent>
        <TabBarIOSItemContent tabName='syncTab' iconURI='contacts' onPressfn=function(){console.log('syncTab')}>
            </Create>
        </TabBarIOSItemContent>
      </TabBarIOS>
    );
  },
});

var TabBarIOSItemContent = React.createClass({
  render: function() {
    return (
      <TabBarIOS.Item
        icon={this._icon({this.props.iconURI})}
        selected={this.state.selectedTab === {this.props.tabName}}
        onPress={() => {
          this.setState({
            selectedTab: {this.props.tabName}
          });
          {this.props.onPressfn}
        }}
      >
        {this.props.children}
      </TabBarIOS.Item>
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
