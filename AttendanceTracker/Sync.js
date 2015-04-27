var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
} = React;

var Search = React.createClass({
	render: function() {
    	return (
			<View style={styles.container}>
				<Text style={styles.title}>Sync</Text>
			</View>
		);
	},
});

var styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    containerBackgroundColor: 'white' 
  },
});

module.exports = Search;
