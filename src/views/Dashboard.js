import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';

import { withBluetooth } from '../providers';

class Dashboard extends Component {
    render() {
        const { bluetooth } = this.props;
        return (
            <View>
                <Text>Dashboard</Text>
                <Button title="Disconnect" onPress={bluetooth.disconnect} />
            </View>
        );
    }
}

export default withBluetooth(Dashboard);
