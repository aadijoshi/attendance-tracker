var React = require('react-native');
var styles = require('./styles.js');

var {
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
				date: new Date(),
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
	test: function() {
		this.props.navigator.push({
			title: "Test",
			component: require('./Test.js'),
		});
	},
	render: function() {
    	return (
			<View style={styles.homeContainer}>
				<View style={styles.homeTitleContainer}>
					<Text style={[styles.text, styles.title]}>attendance</Text>
					<Text style={[styles.text, styles.title]}>tracker</Text>
				</View>
				<View style={styles.homeButtonsContainer}>
					<TouchableHighlight 
						style={styles.button} 
						onPress={this.newEvent}
						underlayColor='#ffffff'
					>
						<Text style={styles.text}>new event</Text>
					</TouchableHighlight>
					<TouchableHighlight 
						style={styles.button} 
						onPress={this.editEvent}
						underlayColor='#ffffff'
					>
						<Text style={styles.text}>update event</Text>
					</TouchableHighlight>
					<TouchableHighlight 
						style={styles.button} 
						onPress={this.syncEvents}
						underlayColor='#ffffff'
					>
						<Text style={styles.text}>sync data</Text>
					</TouchableHighlight>
				</View>
			</View>
		);
	},
});

module.exports = Home;
