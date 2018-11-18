import React, { Component } from 'react';
import { NativeRouter, Route, Switch, Redirect } from 'react-router-native';

import { BluetoothManager } from './providers';
import Routes from './Routes';

export default () => (
    <BluetoothManager>
        <Routes />
    </BluetoothManager>
);
