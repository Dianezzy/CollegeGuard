import React, { memo, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { emailValidator } from '../core/utils';
import Background from '../components/Background';
import BackButton from '../components/BackButton';
import Logo from '../components/Logo';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import Button from '../components/Button';

export default class ForgotPasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailError:null,
    };
  }

  _onSendPressed = () => {
    const emailError = emailValidator(this.state.email);

    if (emailError) {
      this.setState({emailError});
      return;
    }

    this.props.navigation.navigate('LoginScreen');
  };

  render() {
    return (
      <Background>
        <BackButton goBack={() => this.props.navigation.navigate('Login')} />

        <Logo />

        <Header>Restore Password</Header>

        <TextInput
          label="E-mail address"
          returnKeyType="done"
          value={this.state.email}
          onChangeText={(email) => this.setState({email})}
          error={!!this.state.emailError}
          errorText={this.state.emailError}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />

        <Button mode="contained" onPress={this._onSendPressed} style={styles.button}>
          Send Reset Instructions
      </Button>

        <TouchableOpacity
          style={styles.back}
          onPress={() => this.props.navigation.navigate('Login')}
        >
          <Text style={styles.label}>← Back to login</Text>
        </TouchableOpacity>
      </Background>
    );
  }
}

const styles = StyleSheet.create({
  back: {
    width: '100%',
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
  label: {
    color: theme.colors.secondary,
    width: '100%',
  },
});
