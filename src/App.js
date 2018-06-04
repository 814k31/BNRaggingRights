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
import Dashboard from './views/Dashboard';

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
                    <Route exact path='/dashboard' component={Dashboard} />
                    <Route exact path='/' render={() => {
                        let redirectToDevice = this.state.connectedDevice ? <Redirect to='/connected' push /> : null;

                        return (
                            <View style={{flex: 1}}>
                                {redirectToDevice}
                                <BluetoothSearch device={this.state.device} setDevice={(inDevice) => this.setDevice(inDevice)} />
                            </View>
                        );
                    }} />
                    <Route exact path='/connected' render={(match) => {
                        let deviceKeys = []
                        for (let key in this.state.connectedDevice) {
                            if (typeof this.state.connectedDevice[key] !== 'object') {
                                if (this.state.connectedDevice.hasOwnProperty(key)) {
                                    deviceKeys.push(<Text>key: {JSON.stringify(this.state.connectedDevice[key])}</Text>);
                                }
                            }
                        }

                        return (
                            <View style={{ flex:1 }}>
                                <FlatList
                                    keyExtractor={(item, index) => index.toString()}
                                    data={deviceKeys}
                                    renderItem={({item}) => item}
                                />
                            </View>
                        );
                    }} />
                </Switch>
            </NativeRouter>
        );
    }
}
