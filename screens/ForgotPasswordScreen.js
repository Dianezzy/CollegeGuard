import React, { memo, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity,ToastAndroid } from 'react-native';
import { emailValidator, nameValidator, passwordValidator} from '../core/utils';
import Background from '../components/Background';
import BackButton from '../components/BackButton';
import Logo from '../components/Logo';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import Button from '../components/Button';
import { UpdateUserPwd, GetUserInfo } from '../core/UserDatabaseClient';

export default class ForgotPasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      nameError: null,
      email: '',
      emailError: null,
      password: '',
      passwordError: null,
    };
  }

  _onSendPressed = () => {
    let nameError = nameValidator(this.state.name);
    let emailError = emailValidator(this.state.email);
    let passwordError = passwordValidator(this.state.password);

    if (emailError || nameError || passwordError) {
      this.setState({emailError});
      this.setState({nameError});
      this.setState({passwordError});
      return;
    }

    // 查询用户是否存在
    GetUserInfo(this.state.name).then(
      (response)=>{
        if(response.length==0){
          nameError = '用户不存在';
          this.setState({nameError});
          return;
        }else{
              // 查询邮箱是否正确
              let email = response[0].email;
              if(email === this.state.email){
                console.log(this.state.name,this.state.password);
                // 修改密码
                UpdateUserPwd(this.state.name, this.state.password).then(
                  (res)=>{
                    console.log(res);
                    if(res==='Y'){
                      // alert("修改密码成功");
                      ToastAndroid.show("修改密码成功",ToastAndroid.LONG);
                      // 跳转登录界面
                      this.props.navigation.navigate('LoginScreen');
                    }else{
                      // alert("修改密码失败 " + res);
                      ToastAndroid.show("修改密码失败",ToastAndroid.LONG);
                    }
                  }
                );
              }else{
                emailError = '邮箱错误';
                this.setState({emailError});
                return;
              }
        }
      }
    );
  };

  render() {
    return (
      <Background>
        <BackButton goBack={() => this.props.navigation.navigate('Login')} />

        <Logo />

        <Header>重置密码</Header>

        <TextInput
          label="用户名"
          returnKeyType="next"
          value={this.state.name}
          onChangeText={(name) => this.setState({name})}
          error={!!this.state.nameError}
          errorText={this.state.nameError}
        />
        <TextInput
          label="邮箱"
          returnKeyType="done"
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
          label="新密码"
          returnKeyType="done"
          value={this.state.password}
          onChangeText={(password) => this.setState({password})}
          error={!!this.state.passwordError}
          errorText={this.state.passwordError}
          secureTextEntry
        />    

        <Button mode="contained" onPress={this._onSendPressed} style={styles.button}>
          确认
      </Button>

        <TouchableOpacity
          style={styles.back}
          onPress={() => this.props.navigation.navigate('Login')}
        >
          <Text style={styles.label}>← 返回登录界面</Text>
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
