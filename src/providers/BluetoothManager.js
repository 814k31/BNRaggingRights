import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

// Create's authentication context to be use anywhere in the app
export const BluetoothManagerContext = React.createContext();

// Wraps a component with the auth context as props
export function withBluetooth(InComponent) {
    return function BluetoothManagerComponent(props) {
        return (
            <BluetoothManagerContext.Consumer>
                {({ bluetooth }) => <InComponent {...props} bluetooth={bluetooth} />}
            </BluetoothManagerContext.Consumer>
        );
    };
}

export default class BluetoothManager extends Component {
    constructor() {
        super();

        this.manager = new BleManager();

        this.state = {
            device: null,
            foundDevices: [],
            isConnecting: false,
            isScanning: false,
            services: []
        };
    }

    connect(device) {
        this.setState({ isConnecting: true });

        // Connect to device
        this.manager.connectToDevice(device.id)
        	.then((res) => {
                res.onDisconnect(() => this.setState({ device: null }));

	            this.setState({
	                // device: res,
	                isConnecting: false
	            }, () => this.scanServicesAndCharacteristics(res));
                this.stopScanning();
	        })
	        .catch((err) => {
	        	console.warn('Error connecting to device', err);
	        	this.setState({ isConnecting: false });
	        });
    }

    scan() {
    	const { isScanning, foundDevices } = this.state;

    	// Dont start scanning if it already is
        if (isScanning) {
            return;
        }

        this.setState({ isScanning: true });

        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
            	console.warn('Error on device found callback', error);
            	return;
            }

            if (!device.name) {
                return;
            }

            this.setState(() => {
                // Check if the device has already been added
                if (this.state.foundDevices.find((element) => (element.id === device.id))) {
                    // Don't add devices that have already been found
                    return;
                }
                console.log('foundDevices', [...this.state.foundDevices, device]);
                return { foundDevices: [...this.state.foundDevices, device] }
            });
        });
    }

    subscribeToTemperature(callback = () => {}) {
        const { device } = this.state;

        console.log('subscribeToTemperature', device.id);

        this.manager.monitorCharacteristicForDevice(
            device.id,
            '0000f00d-1212-efde-1523-785fef13d123',
            '0000beef-1212-efde-1523-785fef13d123',
            (err, characteristic) => {
                if (err) {
                    console.warn('Temperature callback error', err);
                    return;
                }

                console.log('characteristic', characteristic);
                const value = new Buffer(characteristic.value, 'base64');
                callback(value[0]);
            }
        );
    }

    onConnected() {
        console.log('onConnected');
        // this.scanServicesAndCharacteristics();
    }

    scanServicesAndCharacteristics(device) {
        // const { device } = this.state;
        console.log('scanServicesAndCharacteristics');
        if (!device) return;

        device.discoverAllServicesAndCharacteristics()
            .then((res) => {
                res.services().then(serviceArray => {
                    console.log('serviceArray', serviceArray);
                    this.setState({ device: device, services: serviceArray });
                    // serviceArray.forEach(service => {
                    //     service.characteristics().then(characteristic => {
                    //         if (characteristic) console.log('characteristic', characteristic.uuid);
                    //     }).catch(error => console.log('characteristic error', error))
                    });

                //     this.state.connectedDevice.readCharacteristicForService('0000f00d-1212-efde-1523-785fef13d123', '0000beef-1212-efde-1523-785fef13d123')
                //         .then((res) => {
                //             console.log('characteristic value base64', res.value);
                //             let hexString = new Buffer(res.value, 'base64').toString('hex');
                //             console.log('characteristic value hex', hexString);
                //         }).catch(err => console.log('read err', err));
            })
            .catch((err) => console.warn('discoverAllServicesAndCharacteristics error', err));
    }

    stopScanning() {
    	const { isScanning } = this.state;

    	if (isScanning) {
            this.manager.stopDeviceScan();
            this.setState({ isScanning: false });
        }
    }

    disconnect() {
    	const { device } = this.state;
		device.cancelConnection()
			.then((res) => {
                this.setState({
                    device: null,
                    services: [],
                    characteristic: []
                });
            })
	        .catch(err => console.warn('Error Disconnecting to device', err));
    }

    render() {
        const { children } = this.props;

        return (
            <BluetoothManagerContext.Provider
                /* Sets the context to be the state and actions avaible to other components */
                value={{
                    bluetooth: {
                        ...this.state,
                        connect: inDevice => this.connect(inDevice),
                        disconnect: () => this.disconnect(),
                        scan: () => this.scan(),
                        stopScanning: () => this.stopScanning(),
                        subscribeToTemperature: callback => this.subscribeToTemperature(callback)
                    }
                }}
            >
                {/* Context Consumers have to be wrapped by the Context Provider */}
                {children}
            </BluetoothManagerContext.Provider>
        );
    }
}

BluetoothManager.propTypes = {
    children: PropTypes.node.isRequired
};
