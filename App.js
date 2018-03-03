/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableHighlight
} from 'react-native';

import { BleManager } from 'react-native-ble-plx';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

// const bleManager = new BleManager();

export default class App extends Component<{}> {
  constructor() {
    super();
    this.manager = new BleManager();
    this.state = {
      helloText: "Hello",
      showTextField: false,
      // list: [{id: 'Initial', name: "Initial"}, {id: 'Values', name: "Values"}, {id: 'To', name: "To"}, {id: 'The', name: 'The'}, {id: 'Flatlist', name: 'Flatlist'}],
      list: [],
      count: 0,
      buttonTitle: 'Start Scan',
      connectedDevice: null
    }
  }

  helloWorld(event) {
    //AlertIOS.alert('Hello', 'world');
    /*this.setState({
      helloText: "Now I'm somthing else",
    });*/
    this.setState({
      showTextField: !this.state.showTextField
    })
  }

  connectToDevice(device) {
    if (!this.state.connectedDevice) {
      this.manager.connectToDevice(device.id).then((res) => {
        // console.log('connect res', res);
        this.setState({connectedDevice: res});
      });
    } else {
      this.state.connectedDevice.cancelConnection().then((res) => {
        console.log('device.cancelConnection res', res);
        this.setState({connectedDevice: null});
      });
    }
  }

  startScan(event) {
    // this.manager.state().then((res) => {
    //   console.log("hello worldss " + res);
    // });
    if (!this.state.scanning) {
      this.manager.startDeviceScan(null, null, (error, device) => {
        // console.log('device', device);
        // console.log('device name', device.name);
        // console.log('device id', device.id);
        if (device.name) {
          console.log('device name', device.name);
          var deviceList = this.state.list;

          if (deviceList.find((element) => {
            return element.id === device.id
          })) {
            return;
          }

          var newDevice = {
            id: device.id,
            name: device.name
          }

          this.setState({list: deviceList.concat(newDevice)});
        }
      })
      this.setState({scanning: true, buttonTitle: 'Stop Scan'});
    } else {
      this.manager.stopDeviceScan()
      this.setState({scanning: false, buttonTitle: 'Start Scan'});
    }

  }

  addToList(event) {
    this.setState({
      list: this.state.list.concat([{key: this.state.helloText + this.state.count, value: this.state.helloText}]),
      count: this.state.count + 1
    })
  }

  render() {
    // { connectedDevice } = this.state;

    var isConnected = null;
    if (this.state.connectedDevice) {
      isConnected = (
        <Text>Connected To: {this.state.connectedDevice.name}</Text>
      );
    }

    return (
       <View style={styles.container}>
        <View style={styles.listContainer}>
          <FlatList
            data={this.state.list}
            // renderItem={({item}) => <Text>{item.value}</Text>}
            keyExtractor={(item) => item.id}
            renderItem={
              ({item}) => {
                return (
                  <TouchableHighlight
                  underlayColor="green"
                  onPress={() => {this.connectToDevice(item)}}>
                    <Text style={{margin: 30}}>{item.name}</Text>
                  </TouchableHighlight>
                )
              }
            }
          />
        </View>
        {/*
          <ActivityIndicator size="large" color="#0000ff" />
          <Button style={{borderWidth: 1}} onPress={this.helloWorld.bind(this)} title={this.state.helloText} color="#841584"></Button>
        */}
        <View style={styles.inputContainer}>
          {/*<TextInput style={{width: 300}} onChangeText={(newText) => {this.setState({helloText: newText})}} value={this.state.helloText}/>*/}
          {/*<Button style={{padding: 0, height: 50}} onPress={this.addToList.bind(this)} title="Add!"></Button>*/}
          <Button style={{padding: 0, height: 50}} onPress={this.startScan.bind(this)} title={this.state.buttonTitle}></Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  listContainer: {
    flex: 5,
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
