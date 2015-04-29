var React = require('react-native');
var styles = require('./index.ios.js');

var {
  StyleSheet,
  Text,
  View,
  TextInput,
  ListView,
  TouchableHighlight,
} = React;

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
    if (this.props.targetTab == "attendanceTab") {
      this.props.onSubmitHandler(this.props.targetTab, event, false, true);
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
        <View>
          <TextInput
            style={styles.input}
            autoFocus={false}
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
      <TouchableHighlight onPress={this.onSubmitHandler.bind(this, event)}>
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

module.exports = Search;