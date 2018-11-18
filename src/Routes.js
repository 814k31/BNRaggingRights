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

import { withBluetooth } from './providers';

import BluetoothSearch from './views/BluetoothSearch';
import Dashboard from './views/Dashboard';

const Routes = ({ bluetooth }) => (
    <NativeRouter>
        <Switch>
            <Route path="/bluetooth" component={BluetoothSearch} />
            {!bluetooth.device ? <Redirect to="/bluetooth" /> : null}
            <Route
                path="/dashboard"
                component={Dashboard}
            />

            <Route
                path="/"
                render={() => <Redirect to="/dashboard" replace />}
            />
        </Switch>
    </NativeRouter>
);

export default withBluetooth(Routes);
