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
    global._init = false;
    console.log('start reload');
  }
  render() {
    return (
      <Background>
        <Logo />
        <Header>College Guard</Header>

        <Paragraph>
          some introduction
        </Paragraph>

        <Button mode="contained" onPress={() => this.props.navigation.navigate('Login')}>
          Login
        </Button>

        <Button
          mode="outlined"
          onPress={() => this.props.navigation.navigate('Register')}
        >
          Sign Up
        </Button>

        {/* only for developer */}
        <Button
          mode="outlined"
          onPress={() => this.props.navigation.navigate('HomeNavigator')}
        >
          DEV LOGIN
        </Button>

      </Background>
    );
  }
}
