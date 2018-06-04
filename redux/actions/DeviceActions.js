const types = {
	CONNECT: 'CONNECT',
	DISCONNECT: 'DISCONNECT',
	CONNECTING: 'CONNECTING',
	READ: 'READ',
	WRITE: 'WRITE',
	SUBSCRIBE: 'SUBSCRIBE',
	UNSUBSCRIBE: 'UNSUBSCRIBE'
};

// Define increment tally action
export function connect(device) {
	return dispatch => {
		dispatch(connecting(true));

		// Connect to device
        this.manager.connectToDevice(device.id).then(res => {
            dispatch(setConnected(res));
            dispatch(connecting(false));
            // this.manager.stopDeviceScan();
        });

	}
}

export function setConnected(device) {
	return {
		type: types.CONNECT,
		payload: device
	};
}

export function disconnect() {
	return (dispatch, getState) => {
		const connected = getState().connected;
		if (connected) {
			connect.cancelConnection()
				.then(res => dispatch(setConnected(null)))
				.catch(err => {
					console.error('Error Disconnecting', err);
					dispatch(setConnected(null));
				});
		}
	}
}

export function connecting(isConnecting) {
	return {
		type: types.CONNECTING,
		payload: isConnecting
	};
}

export function read(characteristic) {
	return {
		type: types.READ,
		payload: characteristic
	};
}

export function write(characteristic, value) {
	return {
		type: types.WRITE,
		payload: {
			characteristic,
			value
		}
	};
}

export function subscribe(characteristic) {
	return {
		type: types.SUBSCRIBE,
		payload: characteristic
	};	
}

export function unSubscribe(characteristic) {
	return {
		type: types.UNSUBSCRIBE,
		payload: characteristic
	};	
}

export default types;