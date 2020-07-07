import React, { memo } from 'react';

import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
import '../constants/globals';

export default class StartScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    // global._init = false;
    // console.log('start reload');
  }
  render() {
    return (
      <Background>
        <Logo />
        <Header>College Guard</Header>

        <Paragraph>
          为在校学生保驾护航
        </Paragraph>

        <Button mode="contained" onPress={() => this.props.navigation.navigate('Login')}>
          登录
        </Button>

        <Button
          mode="outlined"
          onPress={() => this.props.navigation.navigate('Register')}
        >
          注册
        </Button>

        {/* only for developer */}
        <Button
          mode="outlined"
          onPress={() => this.props.navigation.navigate('HomeNavigator')}
        >
          开发者登录
        </Button>

      </Background>
    );
  }
}
