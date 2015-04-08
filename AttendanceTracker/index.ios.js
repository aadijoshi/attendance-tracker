/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

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

  _renderContent: function(text: string) {
    return (
    <View style={styles.container}>
        <Text>
          {text}
        </Text>
        </View>)},
  

  render: function() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          icon={this._icon('favorites')}
          selected={this.state.selectedTab === 'createTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'createTab'
            });
          }}>
          {this._renderContent('Create New Event')}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={this._icon('history')}
          selected={this.state.selectedTab === 'editTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'editTab'
            });
          }}>
          {this._renderContent('Edit Existing Event')}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={this._icon('more')}
          selected={this.state.selectedTab === 'attendanceTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'attendanceTab'
            });
          }}>
          {this._renderContent('Start Taking Attendance')}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={this._icon('contacts')}
          selected={this.state.selectedTab === 'syncTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'syncTab'
            });
          }}>
          {this._renderContent('Sync Your Data')}
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
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
