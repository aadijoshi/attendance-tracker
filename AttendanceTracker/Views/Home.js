var React = require('react-native');
var styles = require('./styles.js');
var moment = require('moment');

var {
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
} = React;

var {
	GlobalStyles,
	HomeStyles,
} = styles;

var Home = React.createClass({
	newEvent: function() {
		this.props.navigator.push({
			title: "New Event",
			component: require('./Event.js'),
			passProps: {
				name: "",
				uuid: "",
				date: moment(),
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
		AlertIOS.alert(
			"Warning",
			"Syncing data will automatically remove events from your local phone storage if successful.",
			[{
				text: "OK",
				onPress: 
					this.props.navigator.push.bind(this,{
						title: "Sync Events",
						component: require('./Sync.js'),
					}),
			},
			{
				text: "Cancel"
			}]);
	},
	render: function() {
    	return (
			<View style={HomeStyles.container}>
				<View style={HomeStyles.titleContainer}>
					<Text style={[GlobalStyles.text, GlobalStyles.purpleText, HomeStyles.title]}>attendance</Text>
					<Text style={[GlobalStyles.text, GlobalStyles.purpleText, HomeStyles.title]}>tracker</Text>
				</View>
				<View style={HomeStyles.buttonsContainer}>
					<TouchableHighlight 
						style={GlobalStyles.button} 
						onPress={this.newEvent}
						underlayColor='#ffffff'
					>
						<Text style={[GlobalStyles.text, GlobalStyles.purpleText]}>new event</Text>
					</TouchableHighlight>
					<TouchableHighlight 
						style={GlobalStyles.button} 
						onPress={this.editEvent}
						underlayColor='#ffffff'
					>
						<Text style={[GlobalStyles.text, GlobalStyles.purpleText]}>update event</Text>
					</TouchableHighlight>
					<TouchableHighlight 
						style={GlobalStyles.button} 
						onPress={this.syncEvents}
						underlayColor='#ffffff'
					>
						<Text style={[GlobalStyles.text, GlobalStyles.purpleText]}>sync data</Text>
					</TouchableHighlight>
				</View>
			</View>
		);
	},
});

module.exports = Home;
