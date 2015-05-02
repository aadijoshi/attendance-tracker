var React = require('react-native');
var styles = require('./index.ios.js');

var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;

var Home = React.createClass({
	newEvent: function() {
		this.props.navigator.push({
			title: "New Event",
			component: require('./Event.js'),
			passProps: {
				name: "",
				uuid: "",
				date: new Date().toDateString(),
				swiped: [],
			},
		});
	},
	editEvent: function() {
		this.props.navigator.push({
			title: "Edit Event",
			component: require('./Search.js'),
		});
	},
	syncEvents: function() {
		this.props.navigator.push({
			title: "Sync Events",
			component: require('./Sync.js'),
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
