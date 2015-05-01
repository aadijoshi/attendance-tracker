var React = require('react-native');
var styles = require('./index.ios.js');

var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;

var Search = require('./Search.js');
var Event = require('./Event.js');
var Sync = require('./Sync.js');

var Home = React.createClass({
	newEvent: function() {
		this.props.navigator.push({
			title: "New Event",
			component: Event,
			passProps: {
				name: null,
				date: new Date(),
				ids: [],
			},
		});
	},
	editEvent: function() {
		this.props.navigator.push({
			title: "Edit Event",
			component: Search,
		});
	},
	syncEvents: function() {
		this.props.navigator.push({
			title: "Sync Events",
			component: Sync,
		});
	},
	render: function() {
    	return (
			<View style={styles.container}>
				<Text style={styles.title}>Attendance Tracker</Text>
				<TouchableHighlight onPress={this.newEvent}>
					<Text>New</Text>
				</TouchableHighlight>
				<TouchableHighlight onPress={this.editEvent}>
					<Text>Edit</Text>
				</TouchableHighlight>
				<TouchableHighlight onPress={this.syncEvents}>
					<Text>Sync</Text>
				</TouchableHighlight>
			</View>
		);
	},
});

module.exports = Home;
