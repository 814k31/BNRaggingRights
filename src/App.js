import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableHighlight
} from 'react-native';

import { NativeRouter, Route, Switch, Redirect } from 'react-router-native';

import BluetoothSearch from './views/BluetoothSearch';

export default class App extends Component<{}> {
    constructor() {
        super();

        this.state = {
            connectedDevice: null,
        };
    }

    setDevice(inDevice) {
        this.setState({
            connectedDevice: inDevice
        });
    }

    render() {
        return (
            <NativeRouter>
                <Switch>
                    <Route exact path='/' render={() => {
                        var redirectToDevice = this.state.connectedDevice ? <Redirect to='/connected' push /> : null;

                        return (
                            <View style={{flex: 1}}>
                                {redirectToDevice}
                                <BluetoothSearch device={this.state.device} setDevice={this.setDevice} />
                            </View>
                        );
                    }} />
                    <Route exact path='/connected' render={(match) => {
                        var deviceKeys = []
                        for (var key in this.state.connectedDevice) {
                            if (this.state.connectedDevice.hasOwnProperty(key)) {
                                deviceKeys.push(<Text>key: {this.state.connectedDevice[key]}</Text>);
                            }
                        }

                        <View style={{ flex:1 }}>
                            <FlatList
                                data={deviceKeys}
                                renderItem={({item}) => item}
                            />
                        </View>
                    }} />
                </Switch>
            </NativeRouter>
        );
    }
}
