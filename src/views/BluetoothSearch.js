import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableHighlight
} from 'react-native';

import { Buffer } from 'buffer';

import { BleManager } from 'react-native-ble-plx';

export default class BluetoothSearch extends Component<{}> {
    constructor() {
        super();
        this.manager = new BleManager();
        this.state = {
            helloText: "Hello",
            showTextField: false,
            list: [],
            count: 0,
            buttonTitle: 'Start Scan',
            connectedDevice: null
        };
    }

    connectToDevice(device) {
        if (this.state.connectedDevice) {
            // Disconnect From Device
            this.state.connectedDevice.cancelConnection().then((res) => {
                console.log('device.cancelConnection res', res);
                this.setState({ connectedDevice: null });
            });
            return;
        }

        this.manager.connectToDevice(device.id).then((res) => {
            console.log('connect res', res);
            this.setState({connectedDevice: res});

            this.setDevice(res);

            //0x23, 0xD1, 0x13, 0xEF, 0x5F, 0x78, 0x23, 0x15, 0xDE, 0xEF, 0x12, 0x12, 0x00, 0x00, 0x00, 0x00
            //0xF00D

            // res.discoverAllServicesAndCharacteristics().then((newRes) => {
            //     newRes.services().then(serviceArray => {
            //         serviceArray.forEach(service => {
            //             console.log('service', service.uuid);
            //             service.characteristics().then(characteristic => {
            //                 if (characteristic) console.log('characteristic', characteristic.uuid);
            //             }).catch(error => console.log('characteristic error', error))
            //         });

            //         this.state.connectedDevice.readCharacteristicForService('0000f00d-1212-efde-1523-785fef13d123', '0000beef-1212-efde-1523-785fef13d123')
            //             .then((res) => {
            //                 console.log('characteristic value base64', res.value);
            //                 var hexString = new Buffer(res.value, 'base64').toString('hex');
            //                 console.log('characteristic value hex', hexString);
            //             }).catch(err => console.log('read err', err));
            //     });
            // }).catch((err) => console.log('discoverAllServicesAndCharacteristics error', err));
        });
    }

    startScan(event) {
        if (this.state.scanning) {
            this.manager.stopDeviceScan();
            this.setState({ scanning: false, buttonTitle: 'Start Scan' });
            return;
        }

        this.manager.startDeviceScan(null, null, (error, device) => {
            if (!device.name) {
                console.error('Device has no name');
                return;
            }

            console.log('Found Device: ', device.name);
            console.log('list', this.state.list);
            // Check if the device has already been added
            if (this.state.list.find((element) => (element.id === device.id))) {
                // Don't add devices if they have already been found
                return;
            }

            var newDevice = {
                id: device.id,
                name: device.name
            };

            console.log('newDevice', newDevice)

            this.setState({list: this.state.list.concat(newDevice)});
        });
        this.setState({scanning: true, buttonTitle: 'Stop Scan'});
    }

    addToList(event) {
        this.setState({
            list: this.state.list.concat([{key: this.state.helloText + this.state.count, value: this.state.helloText}]),
            count: this.state.count + 1
        });
    }

    render() {
        var isConnected = this.state.connectedDevice ? <Text>Connected To: {this.state.connectedDevice.name}</Text> : null;
        return (
            <View style={styles.container}>
                <View style={styles.listContainer}>
                    <FlatList
                        data={this.state.list}
                        keyExtractor={(device) => device.id}
                        renderItem={({device}) => {
                            console.log('renderItem', device)
                            if (!device) return;
                            return (
                                <TouchableHighlight style={{alignSelf: 'stretch', alignItems: 'center'}}
                                    underlayColor="green"
                                    onPress={() => {this.connectToDevice(device)}}>
                                    <Text>{device.name}</Text>
                                </TouchableHighlight>
                            );
                        }}
                    />
                </View>
                <View style={styles.inputContainer}>
                    {isConnected}
                    <Button style={{ padding: 0, height: 50 }} onPress={this.startScan.bind(this)} title={this.state.buttonTitle}></Button>
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
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    listContainer: {
        flex: 5,
        paddingTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
    }
});


// 0x23, 0xD1, 0x13, 0xEF, 0x5F, 0x78, 0x23, 0x15, 0xDE, 0xEF, 0x12, 0x12, 0x00, 0x00, 0x00, 0x00

// Found Services [
// {
//     isPrimary: true,
//     deviceID: 'F4:D0:B4:83:6C:07',
//     uuid: '00001800-0000-1000-8000-00805f9b34fb',
//     id: 1,
//     ...
// },
// {
//     isPrimary: true,
//     deviceID: 'F4:D0:B4:83:6C:07',
//     uuid: '00001801-0000-1000-8000-00805f9b34fb',
//     id: 5,
//     ...
// },
// {
//     isPrimary: true,
//     deviceID: 'F4:D0:B4:83:6C:07',
//     uuid: '0000f00d-1212-efde-1523-785fef13d123',
//     id: 6,
//     ...
// }
//]
