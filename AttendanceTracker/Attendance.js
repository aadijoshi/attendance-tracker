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

var Attendance = React.createClass({
	render: function() {
    	return (
			<View style={styles.container}>
				<Text style={styles.title}>Taking attendance</Text>
				<Text style={styles.title}>{this.props.event.name}</Text>
				<Text style={styles.title}>{this.props.event.date.toDateString()}</Text>
				<Text style={styles.title}>{this.props.event.ids.length}</Text>
			</View>
		);
	},
});

module.exports = Attendance;
