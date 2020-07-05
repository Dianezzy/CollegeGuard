import * as React from 'react';
// import { Font } from 'expo';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
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
  }

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
