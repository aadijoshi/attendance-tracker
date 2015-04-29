var React = require('react-native');
var styles = require('./index.ios.js');

var {
  StyleSheet,
  Text,
  View,
} = React;

var Sync = React.createClass({
	render: function() {
		console.log("rendering sync");
    	return (
    		<View style={styles.container}>
				<Text style={styles.title}>Sync</Text>
			</View>
    		
		);
	},
});

module.exports = Sync;
