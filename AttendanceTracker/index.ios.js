/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
 'use strict';

var React = require('react-native');

 var {
  AppRegistry,
  DatePickerIOS,
  TouchableHighlight,
  TabBarIOS,
  ListView,
  TextInput,
  StyleSheet,
  Text,
  View,
} = React;

var MOCK_EVENTS =
[
  {
    name: "Karting",
    date: new Date(2015, 01, 10, 0, 0, 0, 0),
    ids: [
      "N1",
      "N22",
      "N333",
      "N444"
      ]
  },
  {
    name: "Archery",
    date: new Date(2015, 02, 20, 0, 0, 0, 0),
    ids: [
      "N4444",
      "N1",
      ]
  },
  {
    name: "Wakeboarding",
    date: new Date(2015, 03, 30, 0, 0, 0, 0),
    ids: []
  },
]




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
            <Event title="Create a New Event" onSubmitHander={this.onPressHandler}></Event>
        </TabBarIOSItemContent>
        <TabBarIOSItemContent tabName='editTab' iconURI='history' selectedTab={this.state.selectedTab} onPressHandler={this.onPressHandler}>
            <Event title="Edit an Existing Event" onSubmitHander={this.onPressHandler}></Event>
        </TabBarIOSItemContent>
        <TabBarIOSItemContent tabName='attendanceTab' iconURI='more' selectedTab={this.state.selectedTab} onPressHandler={this.onPressHandler}>
            <Search title="Find an Event to Start Taking Attendance" onSubmitHander={this.onPressHandler}></Search>
        </TabBarIOSItemContent>
        <TabBarIOSItemContent tabName='syncTab' iconURI='contacts' selectedTab={this.state.selectedTab} onPressHandler={this.onPressHandler}>
            <View style={styles.container}><Text>bla4</Text></View>
        </TabBarIOSItemContent>
      </TabBarIOS>
    );
  },
});

var Event = React.createClass({
  getDefaultProps: function() {
    return {
      date: new Date(),
    };
  },
  getInitialState: function() {
    return {
      date: this.props.date,
    };
  },
  onSubmitHandler: function() {
    var newEvent = {
      name: this.state.eventName,
      date: this.state.date,
      ids: [],
    };
    MOCK_EVENTS.push(newEvent);
    this.props.onSubmitHandler("syncTab", newEvent);
  },
  render: function() {
    return (
       <View style={styles.container}>
        <Text style={styles.title}>
          {this.props.title}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            autoFocus={false}
            clearButtonMode='while-editing'
            onChangeText={(text) => this.setState({eventName: text})}
            placeholder='Event Name'
            returnKeyType='next'
            keyboardType='default'
          />
          <DatePickerIOS
            date={this.state.date}
            mode="date"
            onDateChange={(date) => this.setState({date: date})}
          />
        </View>
        <TouchableHighlight style={styles.submit} onPress={this.onSubmitHander}}>
          <Text>Submit</Text>
        </TouchableHighlight>
      </View>
    );
  },
});

var Search = React.createClass({
  getInitialState: function () {
    var ds = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
    return {
      dataSource: ds.cloneWithRows(MOCK_EVENTS),
    }
  }
  render: function() {
    return (
       <View style={styles.container}>
        <Text style={styles.title}>
          {this.props.title}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            autoFocus={true}
            clearButtonMode='while-editing'
            onChangeText={this.search}
            placeholder='Event Name'
            returnKeyType='next'
            keyboardType='default'
          />
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderEvent}
        />
        <TouchableHighlight style={styles.submit} onPress={function(){console.log(this.state)}}>
          <Text>Submit</Text>
        </TouchableHighlight>
      </View>
    );
  },
  renderEvent: function(event) {
    return (
      <View style={styles.event}>
        <Text>{event.name}</Text>
        <Text>{event.date.toDateString()}</Text>
        <Text>{event.ids.length}</Text>
      </View>
    );
  },
  search: function(text) {
    this.setState({
      eventName: text,
      dataSource: this.state.dataSource.cloneWithRows(
        this.state.dataSource.filter(
          (event) => event.name.search(text) != -1
        )
      ),
    });
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


