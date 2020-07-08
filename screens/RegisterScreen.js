import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ToastAndroid } from 'react-native';
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
import { CreateUser, GetUserInfo } from '../core/UserDatabaseClient';

export default class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      nameError: null,
      emailError: null,
      passwordError: null,
    };
  }

  _onSignUpPressed = () => {
    let nameError = nameValidator(this.state.name);
    let emailError = emailValidator(this.state.email);
    let passwordError = passwordValidator(this.state.password);

    if (emailError || passwordError || nameError) {
      this.setState({ emailError });
      this.setState({ nameError });
      this.setState({ passwordError });
      return;
    }

    // 查询用户是否存在
    GetUserInfo(this.state.name).then(
      (response) => {
        if (response.length > 0) {
          nameError = '用户名已存在';
          this.setState({ nameError });
          return;
        } else {
          var user = { name: this.state.name, email: this.state.email, pwd: this.state.password };
          // 写入数据库
          CreateUser(user).then(
            (response) => {
              if (response === 'Y') {
                // alert("注册成功");
                ToastAndroid.show("注册成功",ToastAndroid.LONG);
                // 跳转登录界面
                this.props.navigation.navigate('Dashboard');
              } else {
                ToastAndroid.show("注册失败",ToastAndroid.LONG);
                // alert("注册失败 " + response);
              }
            }
          );
        }
      }
    );
  };

  render() {
    return (
      <Background>
        <BackButton goBack={() => this.props.navigation.navigate('Start')} />

        <Logo />

        <Header>创建账号</Header>

        <TextInput
          label="用户名"
          returnKeyType="next"
          value={this.state.name}
          onChangeText={(name) => this.setState({ name })}
          error={!!this.state.nameError}
          errorText={this.state.nameError}
        />

        <TextInput
          label="邮箱"
          returnKeyType="next"
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}
          error={!!this.state.emailError}
          errorText={this.state.emailError}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
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

        <Button mode="contained" onPress={this._onSignUpPressed} style={styles.button}>
          注册
      </Button>

        <View style={styles.row}>
          <Text style={styles.label}>已经有账号? </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={styles.link}>登录</Text>
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