var React = require('react-native');
var App = require('./index.ios.js');

var {
  StyleSheet,
  Text,
  View,
  TextInput,
  DatePickerIOS,
  TouchableHighlight,
} = React;

var {
  MOCK_EVENTS,
  styles,
} = App;

var Event = React.createClass({
  getInitialState: function() {
    if (this.props.event != null) {
      console.log("event not null");
      return {
        date: this.props.event.date,
        name: this.props.event.name,
      };
    } else {
      console.log("event null");
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
    this.props.onSubmitHandler("attendanceTab", newEvent, false, true);
  },
  render: function() {
    return (
       <View style={styles.container}>
        <Text style={styles.title}>
          {this.props.title}
        </Text>
        <View>
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
        <TouchableHighlight onPress={this.onSubmitHandler}>
          <Text>Submit</Text>
        </TouchableHighlight>
      </View>
    );
  },
});

module.exports = Event;