var React = require('react-native');
var styles = require('../index.ios.js');

var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AsyncStorage,
} = React;

var Sync = React.createClass({
	getInitialState: function() {
		return {
			events: [],
      allowSync: false,
		}
	},
  componentWillMount: function () {
    AsyncStorage.getAllKeys()
      .then((keys) => {return Promise.all(keys.map((key) => {return AsyncStorage.getItem(key);}));})
      .then((events) => {this.setState({events: events.map(JSON.parse), allowSync: true});})
      .catch((err) => {console.log(err);})
      .done();
  },
  deleteEvent: function(event) {
    AsyncStorage.removeItem(event.uuid)
      .then(() => {
        var tmp_events = this.state.events.slice();
        tmp_events.splice(this.state.events.indexOf(event), 1);
        this.setState({
          events: tmp_events,
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .done();
  },
  sync: function() {
    if (this.state.allowSync) {
      Promise.all(this.state.events.map((event) => {
        return fetch("http://10.230.9.173:8000/sync", {
          method: "post",
          body: JSON.stringify(event),
        })
          .then((response) => {
            if (response.status >= 200 && response.status < 300) {
              this.deleteEvent(event);
              return Promise.resolve(response);
            } else {
              return Promise.reject(response);
            }
          });
      }))
        .then(() => {
          console.log("Events have finished syncing");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Please wait while events load");
    }
  },
	render: function() {
    	return (
    		<View style={styles.container}>
	    		<TouchableHighlight onPress={this.props.navigator.pop}>
		        	<Text>Home</Text>
		        </TouchableHighlight>
				<TouchableHighlight onPress={this.sync}>
		        	<Text>Sync</Text>
		        </TouchableHighlight>
			</View>
    		
		);
	},
});

module.exports = Sync;
