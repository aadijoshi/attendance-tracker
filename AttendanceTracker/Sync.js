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
			loading: 0,
		}
	},
  componentWillMount: function () {
 	this.setState({
 		loading: 1,
 		loadingPromise: new Promise (
 			(resolve, reject) => {
 				if (this.state.loading == 0){
 					resolve(this.state.loading);
 				} else {
 					reject(this.state.loading);
 				}
 			}
 		),
 	});
    AsyncStorage.getAllKeys()
      .then((keys) => {
      	this.setState({
        	loading: this.state.loading+keys.length,
        });
        for (var i = 0; i<keys.length; i++) {
          AsyncStorage.getItem(keys[i])
          .then((event) => {
            var newEvents = this.state.events.concat(JSON.parse(event));
            this.setState({
              events: newEvents,
            });
          })
          .catch((error) => {
            console.log(error);
          })
          .done(() => {
          	this.setState({
          		loading: this.state.loading-1,
          	});
          });
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .done(() => {
      	this.setState({
      		loading: this.state.loading-1,
      	});
      });
  },
  sync: function() {
  	this.state.loadingPromise
  		.then(() => {
  			console.log("finished loading events");
  		})
  		.catch((error) => {
  			console.log(error);
  		})
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
