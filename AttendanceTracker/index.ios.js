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

var CardReaderManager = require('NativeModules').CardReaderManager;

CardReaderManager.test((error, msg) => {
  if (error) {
    console.error(error);
  } else {
    console.log(msg);
  }
})


var AttendanceTracker = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+Control+Z for dev menu
        </Text>
        <View style={styles.tabbar}>{this.renderTabBar()}</View>
      </View>
    );
  },

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

  renderTabBar: function() {
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
          <Text>create</Text>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={this._icon('history')}
          selected={this.state.selectedTab === 'editTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'editTab'
            });
          }}>
          <Text>create</Text>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={this._icon('more')}
          selected={this.state.selectedTab === 'attendanceTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'attendanceTab'
            });
          }}>
          <Text>create</Text>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={this._icon('contacts')}
          selected={this.state.selectedTab === 'syncTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'syncTab'
            });
          }}>
          <Text>create</Text>
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
});



var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  tabbar: {
    
});

AppRegistry.registerComponent('AttendanceTracker', () => AttendanceTracker);
