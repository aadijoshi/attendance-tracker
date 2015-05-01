var React = require('react-native');
var styles = require('./index.ios.js');
var guid = require('./guid.js');

var {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  ListView,
  TouchableHighlight,
  AsyncStorage,
} = React;


var Event = React.createClass({
  getInitialState: function() {
    return {
      name: this.props.name,
      date: this.props.state,
      ids: this.props.ids,
      dataSource: 
        new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }).cloneWithRows(this.props.ids),
    }
  },
  componentWillMount: function() {
    this.setState({
      key: guid()
    });
  },
  home: function() {
    this.props.navigator.push({
      title: "Home",
      component: Home,
    });
  },
  store: function(newIds) {
    console.log(JSON.stringify(this.state));
    AsyncStorage.setItem(this.state.key, JSON.stringify(this.state))
      .then(() => {
        this.setState({
          ids: newIds,
          dataSource: this.state.dataSource.cloneWithRows(newIds),
        })
      })
      .catch((error) => {
        console.log(error);
      })
      .done();
  },
  onSwipe: function() {
    this.store(this.state.ids.concat(["yay"]));
  },
  deleteID: function(id) {
    var temp_ids = this.state.ids.slice();
    temp_ids.splice(this.state.ids.indexOf(id), 1);
    this.store(temp_ids);
  },
  renderName: function(id) {
    return (
      <TouchableHighlight onPress={this.deleteID.bind(this, id)}>
          <Text>{id}</Text>
      </TouchableHighlight>
    );
  },
  render: function() {
    return (
       <View style={styles.container}>
        <Text style={styles.title}>
          Create Event
        </Text>
        <TextInput
          style={styles.input}
          autoFocus={true}
          clearButtonMode='while-editing'
          onChangeText={(text) => this.setState({name: text})}
          onSubmitEditing={()=>this.store}
          placeholder="Event Name"
          value={this.state.name}
          returnKeyType='done'
          keyboardType='default'
        />
        <Text>{this.props.date.toDateString()}</Text>
        <TouchableHighlight onPress={this.onSwipe}>
          <Text>Swipe</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.home}>
          <Text>Home</Text>
        </TouchableHighlight>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderName}
        />
      </View>
    );
  },
});

module.exports = Event;