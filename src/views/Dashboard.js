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
                temperature: Math.round((value - 32) * 5 / 9)
            })
        });
    }

    render() {
        const { bluetooth } = this.props;
        const { temperature } = this.state;

        return (
            <View>
                <Text>Dashboard</Text>
                <Text>Temperature: {temperature}</Text>
                <Button title="Disconnect" onPress={bluetooth.disconnect} />
            </View>
        );
    }
}

export default withBluetooth(Dashboard);
