import { Ionicons } from '@expo/vector-icons';
//import * as React from 'react';
import React, { memo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
//import { TextInput, Button } from 'react-native-paper';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

export default class FindRouteScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startpos: '',
      endpos: '',
    };
  }

  _onDesPressed = (index) => {

  }

  render() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <TextInput
          style={styles.inputSize}
          label="StartPos"
          returnKeyType="next"
          value={this.state.startpos}
          onChangeText={(startpos) => this.setState({ startpos })}
          keyboardType="default">
        </TextInput>
        <TextInput
          style={styles.inputSize}
          label="EndPos"
          returnKeyType="done"
          value={this.state.endpos}
          onChangeText={(endpos) => this.setState({ endpos })}
          keyboardType="default">
        </TextInput>
        <Button mode="contained" style={styles.buttonSize}>查询路径</Button>
        <View style={styles.buttonRow}>
          <Button style={styles.defaultButton} onPress={this._onDesPressed(1)}>
            去教学楼
          </Button>
          <Button style={styles.defaultButton}>去图书馆</Button>
        </View>
        <View style={styles.buttonRow}>
          <Button style={styles.defaultButton}>去校医院</Button>
          <Button style={styles.defaultButton}>去找稀奇</Button>
        </View>
        <View style={styles.buttonRow}>
          <Button style={styles.defaultButton}>稀奇爸爸</Button>
          <Button style={styles.defaultButton}>永远滴神</Button>
        </View>
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    paddingTop: 15,
  },
  inputSize: {
    width: '80%',
    alignSelf: 'center',
  },
  buttonSize: {
    width: '80%',
    height: '12%',
    alignItems: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    //marginVertical: 20,
  },
  defaultButton: {
    width: '40%',
    alignSelf: 'center',
  },
  buttonRow: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
  }
});
