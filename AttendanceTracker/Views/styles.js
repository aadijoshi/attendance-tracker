
var React = require('react-native');
var {
	StyleSheet,
	PixelRatio,
} = React;

//var StyleSheet = require('react-native-debug-stylesheet');

var GlobalStyles = StyleSheet.create({
  purpleText: {
  	color: '#663399',
  },
  text: {
  	color: 'black',
  	fontSize: 18,
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
  centeredText: {
		textAlign: 'center',
	},
	indicator: {
  	padding: 10,
  	paddingTop: 30,
  }
});

var IndexStyles = StyleSheet.create({
	navigator: {
		flex:1,
		top: 20,
	},
})

var HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    top: 45,
  },
  titleContainer: {
  	flex: 1,
  	justifyContent: 'center',
  	alignItems:  'center',
  },
  buttonsContainer: {
  	flex: 1,
  	justifyContent: 'flex-start',
  	alignItems:  'center',
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
  },
});

var EventStyles = StyleSheet.create({
  swipedRow: {
  	flexDirection: 'row',
  	justifyContent: 'space-between',
  	alignItems: 'center',
  	padding: 10,
  	paddingBottom: 0,
  },
  fieldRow: {
  	height: 60,
  	alignItems: 'center',
  	justifyContent: 'space-between',
  	flexDirection: 'row',
  	padding: 10,
  	borderBottomWidth: 1,
  	borderColor: 'gray',
  },
  container: {
  	flex: 1,
  	justifyContent: 'flex-start',
  },
  topContainer: {
  	flexDirection: 'row',
  	alignItems: 'flex-start',
  	justifyContent: 'flex-start',
  },
  bottomContainer: {
  	flex:1,
  	alignItems: 'stretch',
  	justifyContent: 'space-between',
  },
  labelsContainer: {
  	flex: 1,
  },
  inputsContainer: {
  	flex: 4,
  },
  swipedContainer: {
  	flex: 2,
  },
  datePicker: {
  	justifyContent: 'flex-end',
  	bottom: 64,
  },
  swipeButton: {
  	flex: 1,
  	marginTop: 10,
  	justifyContent: 'flex-start',
  	alignItems: 'center',
  },
  grayedText: {
  	color: 'gray'
  },
  input: {
    height: 40,
    width: 235,
    borderWidth: 1,
    borderColor: 'white',
    alignSelf: 'center',
  },
});

var SearchStyles = StyleSheet.create({
	container: {
    flex: 1,
    top: 45,
  },
	row: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'stretch',
		padding: 10,
		paddingRight: 40,
  	borderBottomWidth: 1,
  	borderColor: 'gray',
	},
	field: {
		flex: 1,
	},
	deleteButton: {
		position: 'absolute',
		right: 5,
	},
});

module.exports = 
{
	GlobalStyles: GlobalStyles, 
	IndexStyles: IndexStyles, 
	HomeStyles: HomeStyles, 
	EventStyles: EventStyles,
	SearchStyles: SearchStyles,
};