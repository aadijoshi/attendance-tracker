var React = require('react-native');
var App = require('./index.ios.js');

var {
  StyleSheet,
  Text,
  View,
} = React;

var {
  MOCK_EVENTS,
  styles,
} = App;

var Sync = React.createClass({
	render: function() {
    	return (
			<View style={styles.container}>
				<Text style={styles.title}>Sync</Text>
			</View>
		);
	},
});

module.exports = Sync;
