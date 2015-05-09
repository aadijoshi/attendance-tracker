var React = require('react-native');
var styles = require('./styles.js');
var uuid_gen = require('node-uuid');
var CardReaderManager = require('NativeModules').CardReaderManager;


var {
  Text,
  View,
  ScrollView,
  TextInput,
  ScrollView,
  ListView,
  TouchableHighlight,
  AsyncStorage,
  DatePickerIOS,
  AlertIOS,
  DeviceEventEmitter,
  ActivityIndicatorIOS,
  Image,
} = React;

var Event = React.createClass({
  getInitialState: function() {
    return {
      name: this.props.name,
      date: this.props.date,
      swiped: this.props.swiped,
      uuid: this.props.uuid == "" ? uuid_gen.v1() : this.props.uuid,
      dataSource: 
        new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }).cloneWithRows(this.props.swiped),
      editingDate: false,
      editingName: false,
      deviceConnected: false,
      deviceOpened: false,
    }
  },
  componentWillMount: function() {
    this.subscriptions = [
      DeviceEventEmitter.addListener('Log', (res) => {console.log(res);}),
      DeviceEventEmitter.addListener('updateConnStatus', this.updateConnStatus),
      DeviceEventEmitter.addListener('openDevice', this.openDevice),
      DeviceEventEmitter.addListener('trackDataReady', this.readTrackData),
    ];
    CardReaderManager.initMagTek();
  },
  componentWillUnmount: function () {
    CardReaderManager.closeDevice();
    for (var i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].remove();
    }
  },
  store: function(newSwiped) {
    var storing = {
      name: this.state.name, 
      date: this.state.date.toDateString(), 
      swiped: newSwiped, 
      uuid: this.state.uuid
    };
    AsyncStorage.setItem(this.state.uuid, JSON.stringify(storing))
      .then(() => {
        this.setState({
          swiped: newSwiped,
          dataSource: this.state.dataSource.cloneWithRows(newSwiped),
        });
      })
      .catch((err) => {console.log(err);})
      .done();
  },
  goHome: function() {
    if (this.props.editing) {
      this.props.navigator.popN(2);
    } else {
      this.props.navigator.pop();
    }
  },
  submitName: function() {
    this.setState({
      editingName: false,
    })
    this.store(this.state.swiped);
  },
  deleteID: function(id) {
    var tmp_swiped = this.state.swiped.slice();
    tmp_swiped.splice(this.state.swiped.indexOf(id), 1);
    this.store(tmp_swiped);
  },
  renderName: function(id) {
    return (
      <View style={styles.swipedRow}>
        <Text style={styles.inputText}>{"N"+id.substring(1)}</Text>
        <TouchableHighlight onPress={this.deleteID.bind(this, id)}>
            <Image 
              source={require('image!clear_button')}
              style={styles.clearButton}
            />
        </TouchableHighlight>
      </View>
    );
  },
  alertDisconnect: function() {
    AlertIOS.alert(
      "Warning",
      "Please make sure the magnetic card reader is NOT connected at this time.",
      [
        {text: "I have disconnected the card reader", onPress: CardReaderManager.openDevice},
        {text: "Cancel"},
      ]
    );
  },
  openDevice: function(isOpened) {
    if (isOpened) {
      AlertIOS.alert(
        "Alert",
        "You may now connect the magnetic card reader.",
        [
          {text: "OK", onPress: this.setState({deviceOpened: true})},
        ]
      );
    }
  },
  readTrackData: function(res) {
    if (res.status == "TRANS_STATUS_OK" && res.data != "" && res.data[1] != "E") {
      this.store(this.state.swiped.concat([res.data.split("=")[0].substring(1)]));
    }
  },
  updateConnStatus: function(status) {
    if (status.isDeviceConnected && status.isDeviceOpened && !this.state.deviceConnected) {
      this.setState({
        deviceConnected: true,
      });
      AlertIOS.alert(
        "Alert",
        "You may now start swiping cards."
      );
    }
  },
  render: function() {
    var datePicker, dateButton, swipeButton;
    if (this.state.editingDate) {
      datePicker = ( 
        <View style={styles.eventDatePicker}>
          <DatePickerIOS
            date={this.state.date}
            mode="date"
            onDateChange={(date)=>this.setState({date: date})}
          />
        </View>
      );
      dateButton = (
        <TouchableHighlight 
          style={styles.eventDateButton} 
          onPress={()=>this.setState({editingDate: false})}
          underlayColor='#ffffff'
        >
          <Text style={styles.text}>Done</Text>
        </TouchableHighlight>
      );
    } else {
      dateButton = (
        <TouchableHighlight 
          style={styles.eventDateButton} 
          underlayColor='#ffffff'
        >
          <Text style={[styles.text, styles.grayedText]}>Done</Text>
        </TouchableHighlight>
      );
      if (this.state.deviceOpened && !this.state.deviceConnected) {
        swipeButton = (
          <ActivityIndicatorIOS
            style={styles.eventSwipeButton}
            size='large'
          />
        );
      } else if (!this.state.deviceOpened){
        swipeButton = (
          <View style={styles.eventSwipeButton}>
            <TouchableHighlight 
              style={styles.button} 
              onPress={this.alertDisconnect}
              underlayColor='#ffffff'
            >
              <Text style={styles.text}>start swiping</Text>
            </TouchableHighlight>
          </View>
        );
      }
    }
    return (
      <ScrollView 
        scrollEnabled={false}
        contentContainerStyle={styles.eventContainer}>
        <View style={styles.eventTopContainer}>
          <View style={styles.eventLabelContainer}>
            <View style={styles.eventRow}>
              <Text style={styles.text}>Name</Text>
            </View>
            <View style={styles.eventRow}>
              <Text style={styles.text}>Date</Text>
            </View>
          </View>
          <View style={styles.eventInputContainer}>
            <View style={styles.eventRow}>
              <TextInput
                style={styles.input}
                autoFocus={false}
                onFocus={()=>this.setState({editingName: true, editingDate: false})}
                clearButtonMode='while-editing'
                onChangeText={(text) => this.setState({name: text})}
                onEndEditing={this.submitName}
                placeholder="Event Name"
                value={this.state.name}
                returnKeyType='done'
                keyboardType='default'
              />
            </View>
            <View style={styles.eventRow}>
              <Text 
                style={styles.inputText} 
                onPress={()=>{this.setState({editingDate: true});}}
              >
                {this.state.date.toDateString()}
              </Text>
              {dateButton}
            </View>
          </View>
        </View>
        <View style={styles.eventBottomContainer}>
          <ListView
            style={styles.swipedContainer}
            automaticallyAdjustContentInsets={false}
            dataSource={this.state.dataSource}
            renderRow={this.renderName}
          />
          {datePicker}
          {swipeButton}
        </View>
      </ScrollView>
    );
  },
});


module.exports = Event;