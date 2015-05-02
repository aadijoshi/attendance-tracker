var React = require('react-native');
var styles = require('./index.ios.js');

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
      loadingPromise: new Promise((resolve, reject) => {
        var rejectTimeout, resolveInterval;
        rejectTimeout = setTimeout(() => {
          console.log("rejectTimeout");
          clearInterval(resolveInterval);
          console.log("rejectTimeout2");
          reject("Event loading is unusually slow, please try again.");
        }, 5000);  
        resolveInterval = setInterval(() => {
          console.log("resolveInterval");

          if (this.state.events.length != 0) {
          console.log("resolveInterval2");
            clearTimeout(rejectTimeout);
          console.log("resolveInterval3");
            clearInterval(resolveInterval);
          console.log("resolveInterval4");
            resolve("Finished loading events");
          }
        }, 500);
      })
		}
	},
  componentWillMount: function () {
    AsyncStorage.getAllKeys()
      .then((keys) => {
        Promise.all(keys.map((key) => {return AsyncStorage.getItem(key);}))
          .then((events) => { this.setState({events: events});})
          .catch((err) => {console.log(err);})
          .done();
      })
      .catch((err) => {console.log(err);})
      .done();
  },
  sync: function() {
    this.state.loadingPromise
      .then((msg) => {console.log(msg);console.log(this.state);})
      .catch((err) => {console.log(err);})
      .done();
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
