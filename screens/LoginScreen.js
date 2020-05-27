import React, { memo, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { emailValidator, passwordValidator } from '../core/utils';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      emailError: null,
      passwordError: null,
    };
  }

  _onLoginPressed = () => {
    const emailError = emailValidator(this.state.email);
    const passwordError = passwordValidator(this.state.password);
  
    // console.log(this.state.email,this.state.password);
    // console.log(emailError,passwordError);
    if (emailError || passwordError) {
      this.setState({emailError});
      this.setState({passwordError});
      // console.log(this.state.emailError,this.state.passwordError);
      return;
    }

    // console.log('login');
    this.props.navigation.navigate('HomeNavigator');
  };

  render() {
    return (
      <Background>
        <BackButton goBack={() => this.props.navigation.navigate('Start')} />

        <Logo />

        <Header>College Guard</Header>

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

        <View style={styles.forgotPassword}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.label}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>

        <Button mode="contained" onPress={this._onLoginPressed}>
          Login
      </Button>

        <View style={styles.row}>
          <Text style={styles.label}>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
            <Text style={styles.link}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </Background>
    );
  }
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});
