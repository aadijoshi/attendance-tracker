var React = require('react-native');
var styles = require('./index.ios.js');

var {
  StyleSheet,
  Text,
  View,
  TextInput,
  ListView,
  TouchableHighlight,
  AsyncStorage,
} = React;

var Search = React.createClass({
  getInitialState: function () {
    return {
      name: "",
      events: [],
      dataSource: 
        new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }),
    }
  },
  componentWillMount: function () {
    AsyncStorage.getAllKeys()
      .then((keys) => {
        Promise.all(keys.map((key) => {return AsyncStorage.getItem(key);}))
          .then((events) => { 
            this.setState({events: events.map(JSON.parse)});
            this.search(this.state.name);
          })
          .catch((err) => {console.log(err);})
          .done();
      })
      .catch((err) => {console.log(err);})
      .done();
  },
  editEvent: function(event) {
    this.props.navigator.push({
      title: "Edit Event",
      component: require('./Event.js'),
      passProps: {
        name: event.name,
        date: event.date,
        swiped: event.swiped,
        uuid: event.uuid,
        editing: true,
      },
    });
  },
  deleteEvent: function(event) {
    AsyncStorage.removeItem(event.uuid)
      .then(() => {
        var tmp_events = this.state.events.slice();
        tmp_events.splice(this.state.events.indexOf(event), 1);
        this.setState({
          events: tmp_events,
        });
        this.search(this.state.name);
      })
      .catch((error) => {
        console.log(error);
      })
      .done();
  },
  render: function() {
    return (
       <View style={styles.container}>
        <Text style={styles.title}>
          {this.props.route.title}
        </Text>
        <View>
        <TouchableHighlight onPress={this.props.navigator.pop}>
          <Text>Home</Text>
        </TouchableHighlight>
          <TextInput
            style={styles.input}
            autoFocus={false}
            clearButtonMode='while-editing'
            onChangeText={this.search}
            placeholder='Event Name'
            returnKeyType='done'
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
      <View>
      <TouchableHighlight onPress={this.editEvent.bind(this, event)}>
        <View>
          <Text>Name: {event.name}</Text>
          <Text>Date: {event.date}</Text>
          <Text>Number of Attendees: {event.swiped.length}</Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight onPress={this.deleteEvent.bind(this, event)}>
        <Text>Delete</Text>
      </TouchableHighlight>
      </View>
    );
  },
  search: function(text) {
    this.setState({
      name: text,
      dataSource: this.state.dataSource.cloneWithRows(
        this.state.events.filter(
          (event) => {
            return event.name.toLowerCase().indexOf(text.toLowerCase()) != -1;
          }
        )
      ),
    });
  },
});

module.exports = Search;