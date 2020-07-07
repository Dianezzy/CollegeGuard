import * as React from 'react';
// import { Font } from 'expo';
import { Platform, StatusBar, StyleSheet, View, BackHandler } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import useCachedResources from './hooks/useCachedResources';
import StartNavigator from './navigation/StartNavigator';
import MyLoading from "./components/MyLoading";

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    await Font.loadAsync({
      'spacemono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      ionicons: Ionicons.font['ionicons'],
      ...MaterialIcons.font,
    });

    // if (Platform.OS === 'android'){
    //   BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    // }
  }

//  componentWillUnmount() {
//     if (Platform.OS === 'android') {
//       BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
//     }
//   }

//   onBackAndroid = () => {
//     //禁用返回键
//     // if(this.state.exit_flag) {
//         if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
//           BackHandler.exitApp();//直接退出APP
//         }else{
//           this.lastBackPressed = Date.now();
//           ToastAndroid.show('再按一次退出应用', 1000);//提示
//           return true;
//         }
//     // }
//   }

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        {<MyLoading
          ref={(ref) => {
            global.mLoadingComponentRef = ref;
          }}
        />}
        <StartNavigator />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
