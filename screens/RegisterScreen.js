import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import {
  emailValidator,
  passwordValidator,
  nameValidator,
} from '../core/utils';

export default class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      nameError:null,
      emailError:null,
      passwordError:null,
    };
  }
  
  _onSignUpPressed = () => {
    const nameError = nameValidator(this.state.name);
    const emailError = emailValidator(this.state.email);
    const passwordError = passwordValidator(this.state.password);

    if (emailError || passwordError || nameError) {
      this.setState({emailError});
      this.setState({nameError});
      this.setState({passwordError});
      return;
    }

    this.props.navigation.navigate('Dashboard');
  };

  render() {
    return (
      <Background>
        <BackButton goBack={() => this.props.navigation.navigate('Start')} />

        <Logo />

        <Header>Create Account</Header>

        <TextInput
          label="Name"
          returnKeyType="next"
          value={this.state.name}
          onChangeText={(name) => this.setState({name})}
          error={!!this.state.nameError}
          errorText={this.state.nameError}
        />

        <TextInput
          label="Email"
          returnKeyType="next"
          value={this.state.email}
          onChangeText={(email) => this.setState({email})}
          error={!!this.state.emailError}
          errorText={this.state.emailError}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />

        <TextInput
          label="Password"
          returnKeyType="done"
          value={this.state.password}
          onChangeText={(password) => this.setState({password})}
          error={!!this.state.passwordError}
          errorText={this.state.passwordError}
          secureTextEntry
        />

        <Button mode="contained" onPress={this._onSignUpPressed} style={styles.button}>
          Sign Up
      </Button>

        <View style={styles.row}>
          <Text style={styles.label}>Already have an account? </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </Background>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    color: theme.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});