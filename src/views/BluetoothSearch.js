import React, { Component } from 'react';
import {
    ActivityIndicator,
    Button,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { withBluetooth } from '../providers';

import { Buffer } from 'buffer';

class BluetoothSearch extends Component {
    startScan() {
        const { bluetooth } = this.props;
        if (bluetooth.isScanning) {
            bluetooth.stopScanning();
            this.setState({ buttonTitle: 'Start Scan' });
            return;
        }

        this.setState({ scanning: true, buttonTitle: 'Stop Scan'});
        bluetooth.scan();
    }

    render() {
        const { bluetooth } = this.props;

        const isConnected = bluetooth.device
            ? <Text>Connected To: {bluetooth.device.name}</Text>
            : null;

        const isConnecting = bluetooth.isConnecting ? (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' color='#ff0000' />
            </View>
        ): null;

        const buttonTitle = bluetooth.isScanning
            ? 'Stop Scannn'
            : 'Start Scannn';

        return (
            <View style={styles.container}>
                {isConnecting}
                <View style={styles.listContainer}>
                    <FlatList
                        data={bluetooth.foundDevices}
                        keyExtractor={(device) => device.id}
                        renderItem={(device) => {
                            return (
                                <TouchableOpacity style={{ padding: 10, alignSelf: 'stretch', alignItems: 'center' }}
                                    underlayColor="green"
                                    onPress={() => bluetooth.connect(device.item)}>
                                    <Text>{device.item.name}</Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
                <View style={styles.inputContainer}>
                    {isConnected}
                    <Button
                        style={{ padding: 0, height: 50 }}
                        onPress={() => {
                            if (bluetooth.isScanning) {
                                bluetooth.stopScanning();
                            } else {
                                bluetooth.scan();
                            }
                        }}
                        title={buttonTitle}
                    />
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
        alignSelf: 'stretch'
    }
});


export default withBluetooth(BluetoothSearch);

// 0x23, 0xD1, 0x13, 0xEF, 0x5F, 0x78, 0x23, 0x15, 0xDE, 0xEF, 0x12, 0x12, 0x00, 0x00, 0x00, 0x00
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
//                 let hexString = new Buffer(res.value, 'base64').toString('hex');
//                 console.log('characteristic value hex', hexString);
//             }).catch(err => console.log('read err', err));
//     });
// }).catch((err) => console.log('discoverAllServicesAndCharacteristics error', err));

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
