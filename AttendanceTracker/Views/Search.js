var React = require('react-native');
var styles = require('./styles.js');
var moment = require('moment');

var {
  Text,
  View,
  TextInput,
  ListView,
  TouchableHighlight,
  AsyncStorage,
  Image,
} = React;

var {
  SearchStyles,
  GlobalStyles,
} = styles;

var Search = React.createClass({
  getInitialState: function () {
    return {
      events: [],
      dataSource: 
        new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }),
      sort: "name",
      reverse: false,
    }
  },
  componentWillMount: function () {
    AsyncStorage.getAllKeys()
      .then((keys) => {
        Promise.all(keys.map((key) => {return AsyncStorage.getItem(key);}))
          .then((events) => { 
            console.log(events);
            this.setState({
              events: events.map(JSON.parse).map((event)=>{event.date = moment(event.date);return event;})
            });
            this.sortByName(false);
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
    console.log(event)
    AsyncStorage.removeItem(event.uuid)
      .then(() => {
        var tmp_events = this.state.events.slice();
        tmp_events.splice(this.state.events.indexOf(event), 1);
        console.log(tmp_events);
        this.setState({
          events: tmp_events,
          dataSource: this.state.dataSource.cloneWithRows(tmp_events),
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .done();
  },
  sortEvents: function(type) {
    var reverse = this.state.reverse;
    if (this.state.sort == type) {
      reverse = !reverse;
    }
    if (type == "name") {
      this.sortByName(reverse);
    } else if (type == "date") {
      this.sortByDate(reverse);
    }
    this.setState({
      reverse: reverse,
    });
  },
  sortByName: function(reverse) {
    var newEvents = this.state.events.slice();
    newEvents.sort(
      (a, b)=>{
        if (reverse) {
          [a, b] = [b, a];
        }
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        } else {
          return 0;
        }
      }
    );
    this.setState({
      events: newEvents,
      dataSource: this.state.dataSource.cloneWithRows(newEvents),
      sort: "name",
    });
    console.log(newEvents);
  },
  sortByDate: function(reverse) {
    var newEvents = this.state.events.slice();
    newEvents.sort(
      (a, b)=>{
        if (reverse) {
          [a, b] = [b, a];
        }
        if (a.date < b.date) {
          return -1;
        } else if (a.date > b.date) {
          return 1;
        } else {
          return 0;
        }
      }
    );
    this.setState({
      events: newEvents,
      dataSource: this.state.dataSource.cloneWithRows(newEvents),
      sort: "date",
    });
    console.log(newEvents);
  },
  _renderRow: function(event) {
    return (
      <View style={SearchStyles.row}>
        <TouchableHighlight 
          style={SearchStyles.field} 
          onPress={this.editEvent.bind(this, event)}
          underlayColor='#ffffff'
        >
          <View>
            <Text style={GlobalStyles.text}>{event.name}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight 
          style={SearchStyles.field} 
          onPress={this.editEvent.bind(this, event)}
          underlayColor='#ffffff'
        >
          <View >
            <Text style={GlobalStyles.text}>{event.date.format("MMM DD, YYYY")}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={SearchStyles.deleteButton}
          onPress={this.deleteEvent.bind(this, event)}
          underlayColor='#ffffff'
        >
          <Image 
            source={require('image!clear_button')}
          />
        </TouchableHighlight>
      </View>
    );
  },
  render: function() {
    return (
      <View style={SearchStyles.container}>
        <View style={SearchStyles.row}>
          <View style={SearchStyles.field}>
            <Text 
              style={[GlobalStyles.text, GlobalStyles.purpleText, GlobalStyles.centeredText]}
              onPress={this.sortEvents.bind(this,"name")}
            >
              Name
            </Text>
          </View>
          <View style={SearchStyles.field}>
            <Text 
              style={[GlobalStyles.text, GlobalStyles.purpleText, GlobalStyles.centeredText]}
              onPress={this.sortEvents.bind(this,"date")}
            >
              Date
            </Text>
          </View>
        </View>
        <ListView
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
        />
      </View>
    );
  },
});

module.exports = Search;