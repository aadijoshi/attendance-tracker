
var React = require('react-native');
var {
	StyleSheet,
	PixelRatio,
} = React;

//var StyleSheet = require('react-native-debug-stylesheet');

var styles = StyleSheet.create({
	navigator: {
		flex:1,
		top: 20,
	},
  homeContainer: {
    flex: 1,
    top: 45,
  },
  swipedRow: {
  	flexDirection: 'row',
  	justifyContent: 'space-between',
  	alignItems: 'center',
  	padding: 10,
  	paddingBottom: 0,
  },
  eventContainer: {
  	flex: 1,
  	justifyContent: 'flex-start',
  },
  eventTopContainer: {
  	flexDirection: 'row',
  	alignItems: 'flex-start',
  	justifyContent: 'flex-start',
  },
  eventBottomContainer: {
  	flex:1,
  	alignItems: 'stretch',
  	justifyContent: 'space-between',
  },
  flex: {
  	flex:1,
  },
  grayedText: {
  	color: 'gray'
  },
  text: {
  	color: '#663399',
  	fontSize: 18,
  },
  inputText: {
  	color: 'black',
  	fontSize: 18,
  	textAlign: 'center',
  },
  eventRow: {
  	height: 60,
  	alignItems: 'center',
  	justifyContent: 'space-between',
  	flexDirection: 'row',
  	padding: 10,
  	borderBottomWidth: 1,
  	borderColor: 'gray',
  },
  eventLabelContainer: {
  	flex: 1,
  },
  eventInputContainer: {
  	flex: 4,
  },
  swipedContainer: {
  	flex: 2,
  },
  eventDatePicker: {
  	justifyContent: 'flex-end',
  	bottom: 64,
  },
  eventSwipeButton: {
  	flex: 1,
  	marginTop: 10,
  	justifyContent: 'flex-start',
  	alignItems: 'center',
  },
  homeTitleContainer: {
  	flex: 1,
  	justifyContent: 'center',
  	alignItems:  'center',
  },
  homeButtonsContainer: {
  	flex: 1,
  	justifyContent: 'flex-start',
  	alignItems:  'center',
  },
  button: {
  	width: 185,
  	height: 50,
  	justifyContent: 'center',
  	alignItems:  'center',
  	margin: 10,
  	borderRadius: 5,
  	borderWidth:3,
  	borderColor:'#cfcfcf',
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
  },
  input: {
    height: 40,
    width: 235,
    borderWidth: 1,
    borderColor: 'white',
    alignSelf: 'center',
  }
});

module.exports = styles;