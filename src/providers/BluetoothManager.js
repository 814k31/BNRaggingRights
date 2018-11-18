import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { BleManager } from 'react-native-ble-plx';

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
            isScanning: false
        };
    }

    connect(device) {
        // If device exists disconnect
        this.setState({ isConnecting: true });

        // Connect to device
        this.manager.connectToDevice(device.id)
        	.then((res) => {
	            console.log('connect res', res);
	            this.setState({
	                device: res,
	                isConnecting: false
	            });
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

            // Check if the device has already been added
            if (foundDevices.find((element) => (element.id === device.id))) {
                // Don't add devices that have already been found
                return;
            }

            this.setState({ foundDevices: foundDevices.concat(device) });
        });
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
			.then(res => this.setState({ device: null }))
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
                        stopScanning: () => this.stopScanning()
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
