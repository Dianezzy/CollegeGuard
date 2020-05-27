// import { NavigationContainer } from '@react-navigation/native';
// import { createAppContainer } from "react-navigation";
// import { NavigationContainer, createAppContainer} from 'react-navigation';
// import { createStackNavigator } from 'react-navigation-stack';
// import { createAppContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
// import { Font } from 'expo';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons,MaterialIcons } from '@expo/vector-icons';

import useCachedResources from './hooks/useCachedResources';
// import BottomTabNavigator from './navigation/HomeNavigator';
// import LinkingConfiguration from './navigation/LinkingConfiguration';
import StartNavigator from './navigation/StartNavigator';

import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  Dashboard,
} from './screens';

// const Stack = createStackNavigator();
// const mainStack = createStackNavigator(
//   {
//     Start:{
//       screen: StartScreen,
//       navigationOptions: {
//         headerShown: false
//       }
//     },
//     Login:{
//       screen: LoginScreen,
//       navigationOptions: {
//         headerShown: false
//       }
//     },
//     Register:{
//       screen: RegisterScreen,
//       navigationOptions: {
//         headerShown: false
//       }
//     },
//     ForgotPassword:{
//       screen: ForgotPasswordScreen,
//       navigationOptions: {
//         headerShown: false
//       }
//     },
//     Dashboard:{
//       screen: Dashboard,
//       navigationOptions: {
//         headerShown: false
//       }
//     },    
//     // HomeNavigator:{
//     //   screen: BottomTabNavigator,
//     //   navigationOptions: {
//     //     headerShown: false
//     //   }
//     // },
//   },
//   {
//     initialRouteName: 'Start',
//     headerMode: 'none',
//   }
// );

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount(){
    await Font.loadAsync({
      'spacemono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      ionicons: Ionicons.font['ionicons'],
      ...MaterialIcons.font,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        <StartNavigator />
      </View>
    )
  }
}

// export default function App(props) {
//   // const isLoadingComplete = useCachedResources();

//   React.useEffect(() =>
//     Expo.Font.loadAsync({
//       'MaterialIcons': require('@expo/vector-icons')
//     }), []);  

//   // if (!isLoadingComplete) {
//   //   return null;
//   // } else {
//     return (
//       <View style={styles.container}>
//         {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
//         <StartNavigator />
//         {/* <NavigationContainer>
//           <mainStack/>
//         </NavigationContainer> */}
//         {/* {createAppContainer(mainStack)} */}
//         {/* <NavigationContainer linking={LinkingConfiguration}>
//           <Stack.Navigator>
//             <Stack.Screen name="Root" component={BottomTabNavigator} />
//           </Stack.Navigator>
//         </NavigationContainer> */}
//       </View>
//     );
//   // }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
