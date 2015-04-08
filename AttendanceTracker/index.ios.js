/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
 'use strict';


var Button = require('react-native-button');
var React = require('react-native');

 var {
  AppRegistry,
  DatePickerIOS,
  TabBarIOS,
  ListView,
  TextInput,
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
    });
    console.log(tabName);
  },

  render: function() {
    return (
      <TabBarIOS>
        <TabBarIOSItemContent tabName='createTab' iconURI='favorites' selectedTab={this.state.selectedTab} onPressHandler={this.onPressHandler}>
            <Create></Create>
        </TabBarIOSItemContent>
        <TabBarIOSItemContent tabName='editTab' iconURI='history' selectedTab={this.state.selectedTab} onPressHandler={this.onPressHandler}>
            <View style={styles.container}><Text>bla2</Text></View>
        </TabBarIOSItemContent>
        <TabBarIOSItemContent tabName='attendanceTab' iconURI='more' selectedTab={this.state.selectedTab} onPressHandler={this.onPressHandler}>
            <View style={styles.container}><Text>bla3</Text></View>
        </TabBarIOSItemContent>
        <TabBarIOSItemContent tabName='syncTab' iconURI='contacts' selectedTab={this.state.selectedTab} onPressHandler={this.onPressHandler}>
            <View style={styles.container}><Text>bla4</Text></View>
        </TabBarIOSItemContent>
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
      <View style={styles.container}>
        <Text style={styles.title}>
          Create a New Event
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            autoFocus={false}
            clearButtonMode='while-editing'
            onChangeText={(text) => this.setState({eventName: text})}
            placeholder='Event Name'
            returnKeyType='next'
            keyboardType='ascii-capable'
          />
          <DatePickerIOS
            date={this.state.date}
            mode="date"
            onDateChange={(date) => {
              this.setState({
                date: date
              });
            }}
          />
        </View>
        <Button style={styles.submit} onPress={function(){console.log('bla')}}>
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  }
});

AppRegistry.registerComponent('AttendanceTracker', () => AttendanceTracker);


