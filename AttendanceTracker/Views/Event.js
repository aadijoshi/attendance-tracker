var React = require('react-native');
var styles = require('../index.ios.js');
var uuid_gen = require('node-uuid');

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

NNumbers = [818799090, 813549627, 811111111, 822222222, 833333333];

var Event = React.createClass({
  getInitialState: function() {
    return {
      name: this.props.name,
      date: this.props.date,
      swiped: this.props.swiped,
      uuid: this.props.uuid == "" ? uuid_gen.v1() : this.props.uuid,
      dataSource: 
        new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }).cloneWithRows(this.props.swiped),
    }
  },
  store: function(newSwiped) {
    var storing = {
      name: this.state.name, 
      date: this.state.date, 
      swiped: newSwiped, 
      uuid: this.state.uuid
    };
    AsyncStorage.setItem(this.state.uuid, JSON.stringify(storing))
      .then(() => {
        this.setState({
          swiped: newSwiped,
          dataSource: this.state.dataSource.cloneWithRows(newSwiped),
        });
      })
      .catch((err) => {console.log(err);})
      .done();
  },
  onSwipe: function() {
    this.store(this.state.swiped.concat([NNumbers[Math.floor(Math.random() * NNumbers.length)]]));
  },
  goHome: function() {
    if (this.props.editing) {
      this.props.navigator.popN(2);
    } else {
      this.props.navigator.pop();
    }
  },
  submitName: function() {
    this.store(this.state.swiped);
  },
  deleteID: function(id) {
    var tmp_swiped = this.state.swiped.slice();
    tmp_swiped.splice(this.state.swiped.indexOf(id), 1);
    this.store(tmp_swiped);
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
          {this.props.route.title}
        </Text>
        <TextInput
          style={styles.input}
          autoFocus={true}
          clearButtonMode='while-editing'
          onChangeText={(text) => this.setState({name: text})}
          onEndEditing={this.submitName}
          placeholder="Event Name"
          value={this.state.name}
          returnKeyType='done'
          keyboardType='default'
        />
        <Text>{this.props.date}</Text>
        <TouchableHighlight onPress={this.onSwipe}>
          <Text>Swipe</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.goHome}>
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