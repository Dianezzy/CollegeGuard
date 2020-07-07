import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Image, StyleSheet, Text, View, Alert, ToastAndroid, Platform, BackHandler } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';

// export default function PersonalCenterScreen() {
export default class PersonalCenterScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exit_flag: false
    }
  }

  _onModifyPwd = () => {

  }

  _onCheckVersion = () => {
    // alert('当前已是最新版本');
    ToastAndroid.show('当前已是最新版本', ToastAndroid.SHORT);
  }

  _onAbout = () => {
    Alert.alert('关于',
      '版本：V1.0\n开发团队：sgbbhygdwmd',
      [
        {
          text: 'OK',
        }
      ]
    )
  }

  _onExit = () => {
    BackHandler.exitApp();
  }


  render() {
    return (
      <Background>
        <Image source={require('../assets/avatar.png')} style={styles.image} />

        <Header>{global.username}</Header>

        <View style={styles.container}>
          {/* <Button mode="contained" onPress={this._onModifyPwd}>
          修改密码
      </Button> */}

          <Button mode="contained" style={styles.button} onPress={this._onCheckVersion}>
            检查更新
      </Button>

          <Button mode="contained" style={styles.button} onPress={this._onAbout}>
            关于
      </Button>

          <Button mode="contained" style={styles.button} onPress={this._onExit}>
            退出
      </Button>
        </View>
        {/* <OptionButton
        icon="md-person"
        label="用户名"
        // onPress={() => TODO)}
      />

      <OptionButton
        icon="md-code-working"
        label="密码"
        // onPress={() => TODO)}
      />

      <OptionButton
        icon="md-book"
        label="订单记录"
        // onPress={() => TODO)}
        isLastOption
      /> */}

      </Background>
    );
  }
}

function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // flexDirection: 'column',
    // backgroundColor: '#fafafa',
    padding: 20,
    height: '50%',
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    // alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: 50
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 5,
  },
  button: {
    height: 50,
    // alignItems: 'center'
  }
});
