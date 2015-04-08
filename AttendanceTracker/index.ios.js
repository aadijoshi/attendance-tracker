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

  renderTabItem: function(tabName: string, iconName: string, onPressfn, content)
  {
    return (
      <TabBarIOS.Item
        icon={this._icon({iconName})}
        selected={this.state.selectedTab === {tabName}}
        onPress={() => {
          this.setState({
            selectedTab: {tabName}
          });
          {onPressfn}
        }}>
        {content}
      </TabBarIOS.Item>
    )
  }

  render: function() {
    return (
      <TabBarIOS>
        {this.renderTabItem('createTab', 'favorites', () => console.log("createTab"), </Create>)}
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

var Create = React.createClass({
  render: function () {
    <View style={styles.container}>
      <Text>
        Create a new event
      </Text>
    </View>
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
