import { NavigationContainer, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import HomeNavigator from './HomeNavigator';

import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
} from '../screens';

const mainStack = createStackNavigator(
  {
    Start: {
      screen: StartScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    ForgotPassword: {
      screen: ForgotPasswordScreen,
      navigationOptions: {
        headerShown: false
      }
    },   
    HomeNavigator: {
      screen: HomeNavigator,
      navigationOptions: ({ navigation }) => ({
        headerTitle: getHeaderTitle(navigation),
      }),
    },
  },
  {
    initialRouteName: 'Start',
    // headerMode: 'none',
  }
);

const INITIAL_ROUTE_NAME = 'Home';

function getHeaderTitle(navigation) {
  console.log(navigation.state.routes[navigation.state.index]);
  const routeName = navigation.state?.routes[navigation.state.index]?.key ?? INITIAL_ROUTE_NAME;
  console.log(routeName);
  switch (routeName) {
    case 'Home':
      return 'College Guard';
    case 'Route':
      return '安全路径';
    case 'Shop':
      return '社区购物';
    case 'PersonalCenter':
      return '个人中心';
  }
}

export default createAppContainer(mainStack);