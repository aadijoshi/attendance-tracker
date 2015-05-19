var React = require('react-native');
var styles = require('./styles.js');
var uuid_gen = require('node-uuid');
var CardReaderManager = require('NativeModules').CardReaderManager;
var moment = require('moment');
var Modal = require('react-native-modal');

var {
  Text,
  View,
  ScrollView,
  TextInput,
  ListView,
  TouchableHighlight,
  AsyncStorage,
  DatePickerIOS,
  AlertIOS,
  DeviceEventEmitter,
  ActivityIndicatorIOS,
  Image,
} = React;

var {
  GlobalStyles,
  EventStyles,
} = styles;

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
    console.log(newSwiped);
    var storing = {
      name: this.state.name, 
      date: this.state.date.toISOString(), 
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
  editName: function() {
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
      this.setState({
        deviceOpened: true,
      });
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
  _renderModal: function() {
    if (this.state.deviceOpened && !this.state.deviceConnected) {
      return (
        <Modal
          hideCloseButton={true}
          isVisible={true}
        >
          <Text style={[GlobalStyles.text, GlobalStyles.centeredText]}>Please connect the magnetic card reader.</Text>
          <ActivityIndicatorIOS
            style={GlobalStyles.indicator}
            size='large'
          />
        </Modal>
      );
    }
  },
  _renderDatePicker: function() {
    if (this.state.editingDate) {
      return (
        <View style={EventStyles.datePicker}>
          <DatePickerIOS
            date={this.state.date.toDate()}
            mode="date"
            onDateChange={(date)=>{this.setState({date: moment(date)}); this.store(this.state.swiped);}}
          />
        </View>
      );
    } else {
      return null;
    }
  },
  _renderDateButton: function() {
    if (this.state.editingDate) {
      return (
        <TouchableHighlight 
          onPress={()=>this.setState({editingDate: false})}
          underlayColor='#ffffff'
        >
          <Text style={[GlobalStyles.text, GlobalStyles.purpleText]}>Done</Text>
        </TouchableHighlight>
      );
    }
  },
  _renderSwipeButton: function() {
    if (!this.state.editingDate && !this.state.deviceOpened)
    {
      return (
        <View style={EventStyles.swipeButton}>
          <TouchableHighlight 
            style={GlobalStyles.button} 
            onPress={this.alertDisconnect}
            underlayColor='#ffffff'
          >
            <Text style={[GlobalStyles.text, GlobalStyles.purpleText]}>start swiping</Text>
          </TouchableHighlight>
        </View>
      );
    }
  },
  _renderRow: function(id) {
    return (
      <View style={EventStyles.swipedRow}>
        <Text style={GlobalStyles.text}>{"N"+id.substring(1)}</Text>
        <TouchableHighlight 
          onPress={this.deleteID.bind(this, id)}
          underlayColor='#ffffff'
        >
          <Image 
            source={require('image!clear_button')}
          />
        </TouchableHighlight>
      </View>
    );
  },
  render: function() {
    return (
      <ScrollView 
        scrollEnabled={false}
        contentContainerStyle={EventStyles.container}
      >
        <View style={EventStyles.topContainer}>
          <View style={EventStyles.labelsContainer}>
            <View style={EventStyles.fieldRow}>
              <Text style={[GlobalStyles.text, GlobalStyles.purpleText]}>Name</Text>
            </View>
            <View style={EventStyles.fieldRow}>
              <Text style={[GlobalStyles.text, GlobalStyles.purpleText]}>Date</Text>
            </View>
          </View>
          <View style={EventStyles.inputsContainer}>
            <View style={EventStyles.fieldRow}>
              <TextInput
                style={[GlobalStyles.text, EventStyles.input]}
                autoFocus={false}
                onFocus={()=>this.setState({editingName: true, editingDate: false})}
                clearButtonMode='while-editing'
                onChangeText={(text) => this.setState({name: text})}
                onEndEditing={this.editName}
                placeholder="Event Name"
                value={this.state.name}
                returnKeyType='done'
                keyboardType='default'
              />
            </View>
            <View style={EventStyles.fieldRow}>
              <Text 
                style={GlobalStyles.text} 
                onPress={()=>{this.setState({editingDate: true});}}
              >
                {this.state.date.format("MMM DD, YY")}
              </Text>
              {this._renderDateButton()}
            </View>
          </View>
        </View>
        <View style={EventStyles.bottomContainer}>
          <ListView
            style={EventStyles.swipedContainer}
            automaticallyAdjustContentInsets={false}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
          />
          {this._renderDatePicker()}
          {this._renderSwipeButton()}
        </View>
      {this._renderModal()}
      </ScrollView>
    );
  },
});


module.exports = Event;