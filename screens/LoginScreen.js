import React, { memo, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, ToastAndroid } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { emailValidator, passwordValidator, nameValidator } from '../core/utils';
import { GetUserInfo } from '../core/UserDatabaseClient';
import Cache from '../core/Cache';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      emailError: null,
      passwordError: null,
      name: '',
      nameError: null
    };
  }

  _onLoginPressed = () => {
    // let emailError = emailValidator(this.state.email);
    let passwordError = passwordValidator(this.state.password);
    let nameError = nameValidator(this.state.name);

    if (nameError || passwordError) {
      this.setState({ nameError });
      this.setState({ passwordError });
      return;
    }

    // 查询用户是否存在
    GetUserInfo(this.state.name).then(
      (response) => {
        if (response.length == 0) {
          nameError = '用户不存在';
          this.setState({ nameError });
          return;
        } else {
          // 查询密码是否正确
          let pwd = response[0].pwd;
          if (pwd === this.state.password) {
            // alert("登录成功");
            ToastAndroid.show("登录成功",ToastAndroid.LONG);

            Cache.set("account", this.state.name);
            global.username = this.state.name;

            // 跳转主界面
            this.props.navigation.navigate('HomeNavigator');
          } else {
            passwordError = '密码错误';
            this.setState({ passwordError });
            return;
          }
        }
      }
    );
  };

  render() {
    return (
      <Background>
        <BackButton goBack={() => this.props.navigation.navigate('Start')} />

        <Logo />

        <Header>College Guard</Header>

        {/* <TextInput
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
        /> */}
        <TextInput
          label="用户名"
          returnKeyType="next"
          value={this.state.name}
          onChangeText={(name) => this.setState({ name })}
          error={!!this.state.nameError}
          errorText={this.state.nameError}
        />

        <TextInput
          label="密码"
          returnKeyType="done"
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          error={!!this.state.passwordError}
          errorText={this.state.passwordError}
          secureTextEntry
        />

        <View style={styles.forgotPassword}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.label}>忘记密码</Text>
          </TouchableOpacity>
        </View>

        <Button mode="contained" onPress={this._onLoginPressed}>
          登录
      </Button>

        <View style={styles.row}>
          <Text style={styles.label}>还没有账号? </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
            <Text style={styles.link}>注册</Text>
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
