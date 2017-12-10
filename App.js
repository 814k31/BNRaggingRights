/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  constructor() {
    super();
    this.state = {
      helloText: "Hello",
      showTextField: false,
      list: [{key: 'Initial'}, {key: 'Values'}, {key: 'To'}, {key: 'The'}, {key: 'Flatlist'}],
      count: 0
    }
  }

  helloWorld(event) {
    //AlertIOS.alert('Hello', 'world');
    /*this.setState({
      helloText: "Now I'm somthing else",
    });*/
    this.setState({
      showTextField: !this.state.showTextField
    })
  }

  addToList(event) {
    this.setState({
      list: this.state.list.concat([{key: this.state.helloText + this.state.count}]),
      count: this.state.count + 1
    })
  }

  render() {
    return (
       <View style={styles.container}>
        <View style={styles.listContainer}>
          <FlatList
            data={this.state.list}
            renderItem={({item}) => <Text>{item.key}</Text>}
          />
        </View>
        {/*
          <ActivityIndicator size="large" color="#0000ff" />
          <Button style={{borderWidth: 1}} onPress={this.helloWorld.bind(this)} title={this.state.helloText} color="#841584"></Button>
        */}
        <View style={styles.inputContainer}>
          <TextInput style={{width: 300}} onChangeText={(newText) => {this.setState({helloText: newText})}} value={this.state.helloText}/>
          <Button style={{width: 1000}} onPress={this.addToList.bind(this)} title="Addd"></Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  listContainer: {
    flex: 5,
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
