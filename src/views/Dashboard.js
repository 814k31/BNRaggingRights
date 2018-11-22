import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';

import { withBluetooth } from '../providers';

class Dashboard extends Component {
    constructor() {
        super();

        this.state = {
            temperature: 0
        };
    }

    componentDidMount() {
        const { bluetooth } = this.props;
        bluetooth.subscribeToTemperature((value) => {
            this.setState({
                temperature: Math.round(value / 4)
            })
        });
    }

    render() {
        const { bluetooth } = this.props;
        const { temperature } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 30 }}>Device </Text>
                    <Text style={{ fontSize: 20 }}>{bluetooth.device.name}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 40, fontWeight: 'bold' }}>Temperature</Text>
                    <Text style={{ fontSize: 40 }}>{temperature} °C</Text>
                </View>
                <View style={{ margin: 10 }}>
                    <Button title="Disconnect" onPress={bluetooth.disconnect} />
                </View>
            </View>
        );
    }
}

export default withBluetooth(Dashboard);
