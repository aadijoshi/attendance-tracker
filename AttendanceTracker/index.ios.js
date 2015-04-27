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
            <View style={styles.container}><Text>bla4</Text></View>
        </TabBarIOSItemContent>
      </TabBarIOS>
    );
  },
});

var Event = React.createClass({
  getInitialState: function() {
    if (this.props.event != null) {
      return {
        date: this.props.event.date,
        name: this.props.event.name,
      };
    } else {
      return {
        date: new Date(),
        name: "",
      };
    }

  },
  onSubmitHandler: function() {
    var newEvent = {
      name: this.state.name,
      date: this.state.date,
      ids: [],
    };
    if (this.props.event == null) {
      MOCK_EVENTS.push(newEvent);
    } else {
      var oldEventId = MOCK_EVENTS.indexOf(this.props.event);
      MOCK_EVENTS[oldEventId].name = newEvent.name;
      MOCK_EVENTS[oldEventId].date = newEvent.date;

    }
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
            onChangeText={(text) => this.setState({name: text})}
            placeholder="Event Name"
            value={this.state.name == "" ? null : this.state.name}
            returnKeyType='next'
            keyboardType='default'
          />
          <DatePickerIOS
            date={this.state.date}
            mode="date"
            onDateChange={(date) => this.setState({date: date})}
          />
        </View>
        <TouchableHighlight style={styles.submit} onPress={this.onSubmitHandler}>
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
  },
  onSubmitHandler: function(event) {
    console.log("Search onSubmitHandler");
    console.log(event);
    if (this.props.targetTab == "syncTab") {
      this.props.onSubmitHandler(this.props.targetTab, event);
    } else if (this.props.targetTab == "editTab") {
      this.props.onSubmitHandler(this.props.targetTab, event, true);
    }
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
            autoFocus={true}
            clearButtonMode='while-editing'
            onChangeText={this.search}
            placeholder='Event Name'
            returnKeyType='next'
            keyboardType='default'
          />
          <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderEvent}
        />
        </View>
        
      </View>
    );
  },
  renderEvent: function(event) {
    return (
      <TouchableHighlight style={styles.event} onPress={this.onSubmitHandler.bind(this, event)}>
        <View>
          <Text>{event.name}</Text>
          <Text>{event.date.toDateString()}</Text>
          <Text>{event.ids.length}</Text>
        </View>
      </TouchableHighlight>
    );
  },
  search: function(text) {
    this.setState({
      eventName: text,
      dataSource: this.state.dataSource.cloneWithRows(
        MOCK_EVENTS.filter(
          (event) => event.name.toLowerCase().indexOf(text.toLowerCase()) != -1
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


