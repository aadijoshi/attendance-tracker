var React = require('react-native');
var styles = require('./styles.js');
var Modal = require('react-native-modal');

var {
  Text,
  View,
  TouchableHighlight,
  AsyncStorage,
  ActivityIndicatorIOS,
  AlertIOS,
  NetInfo,
} = React;

var {
  GlobalStyles,
} = styles;

var Sync = React.createClass({
	getInitialState: function() {
		return {
			events: [],
      allowSync: false,
      synced: false,
      online: false,
		}
	},
  componentWillMount: function () {
    AsyncStorage.getAllKeys()
      .then((keys) => {return Promise.all(keys.map((key) => {return AsyncStorage.getItem(key);}));})
      .then((events) => {
        this.setState({events: events.map(JSON.parse), allowSync: true}); 
        return NetInfo.isConnected.fetch()})
      .then((isConnected) => {
        console.log(isConnected);
        if (isConnected) {
          this.setState({online: true});
          this.sync();
        } else {
          var listener = function(isConnected)
          {
            if (isConnected) {
              this.sync();
              NetInfo.isConnected.removeEventListener('change', listener);
            }
          }
          NetInfo.isConnected.addEventListener('change', listener.bind(this));
          this.setState({online: false});
        }
      })
      .catch((err) => {console.log(err);})
      .done();
  },
  deleteEvent: function(event) {
    AsyncStorage.removeItem(event.uuid)
      .then(() => {
        var tmp_events = this.state.events.slice();
        tmp_events.splice(this.state.events.indexOf(event), 1);
        this.setState({
          events: tmp_events,
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .done();
  },
  sync: function() {
    Promise.all(this.state.events.map((event) => {
      console.log(event);
      event.date = new Date(event.date).toDateString();
      return fetch("http://10.230.9.173:8000/sync", {
        method: "post",
        body: JSON.stringify(event),
      })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            this.deleteEvent(event);
            return Promise.resolve(response);
          } else {
            return Promise.reject(response);
          }
        });
    }))
      .then(() => {
        this.setState({synced: true});
        AlertIOS.alert(
          "Success",
          "All events have been synced successfully.",
          [
            {text: "OK", onPress: this.props.navigator.pop},
          ]
        );
      })
      .catch((err) => {
        console.log(err);
      });
  },
  render: function() {
    console.log(this.state.allowSync, this.state.synced, this.state.online);
    if (!this.state.allowSync) {
      return (
        <Modal
          hideCloseButton={true}
          isVisible={true}
        >
          <Text style={[GlobalStyles.text, GlobalStyles.centeredText]}>Please wait while events are loaded from local storage.</Text>
          <ActivityIndicatorIOS
            style={GlobalStyles.indicator}
            size='large'
          />
        </Modal>
      );
    } else if (this.state.allowSync && !this.state.synced && this.state.online) {
      return (
        <Modal
          hideCloseButton={true}
          isVisible={true}
        >
          <Text style={[GlobalStyles.text, GlobalStyles.centeredText]}>Please wait while events are syncing.</Text>
          <ActivityIndicatorIOS
            style={GlobalStyles.indicator}
            size='large'
          />
        </Modal>
      );
    } else if (this.state.allowSync && !this.state.synced && !this.state.online) {
      return (
        <Modal
          hideCloseButton={true}
          isVisible={true}
        >
          <Text style={[GlobalStyles.text, GlobalStyles.centeredText]}>Please connect to the Internet.</Text>
        </Modal>
      );
    } else {
      return (<View></View>);
    }
  },
});

module.exports = Sync;
