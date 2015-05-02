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
    console.log(this.props);
    console.log(this.props.key ? this.props.key : guid());
    return {
      name: this.props.name,
      date: this.props.date,
      swiped: this.props.swiped,
      key: this.props.key ? this.props.key : guid(),
      dataSource: 
        new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }).cloneWithRows(this.props.swiped),
    }
  },
  goHome: function() {
    this.props.navigator.push({
      title: "Home",
      component: require('./Home.js'),
    });
  },
  store: function(newSwiped) {
    var storing = {name: this.state.name, date: this.state.date, swiped: newSwiped};
    AsyncStorage.setItem(this.state.key, JSON.stringify(storing))
      .then(() => {
        this.setState({
          swiped: newSwiped,
          dataSource: this.state.dataSource.cloneWithRows(newSwiped),
        })
        console.log(this.state);
      })
      .catch((error) => {
        console.log(error);
      })
      .done();
  },
  onSwipe: function() {
    this.store(this.state.swiped.concat(["yay"]));
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
          Create Event
        </Text>
        <TextInput
          style={styles.input}
          autoFocus={true}
          clearButtonMode='while-editing'
          onChangeText={(text) => this.setState({name: text})}
          onSubmitEditing={this.submitName}
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