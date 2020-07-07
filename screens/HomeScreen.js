import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, BackHandler, ToastAndroid } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';

// import { MonoText } from '../components/StyledText';
import { MapView } from "react-native-amap3d";
import { fetchRouteData, fetchPosData, fetchPopulationData } from '../core/mapdata';
import { Search } from '../components/dropdown';

import Layout from '../constants/Layout';
import '../constants/globals';
import LoadingUtil from "../core/LoadingUtil";
import Cache from '../core/Cache';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cur_latitude: 0,
      cur_longitude: 0,
      place_coords: [],
      search_path_pts: [],
      heatmap_json: [],
    }

    this._init = false;
    this.init_latitude = 0;//39.5;
    this.init_longitude = 0;//116;
    this.lastBackPressed = 0;
    // this.region_latlng = new Array(4); // 左上 右上 左下 右下四个点经纬度

    // Cache.set("account","lemonxq");
  }

  componentDidMount() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);

    // 每隔一段时间刷新热力图
    // this.interval = setInterval(this.updateHeatmap, 3600000);
    if (Platform.OS === 'android'){
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);

    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  onBackAndroid = () => {
    //禁用返回键
    if(this.props.navigation.isFocused()) {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
          BackHandler.exitApp();//直接退出APP
        }else{
          this.lastBackPressed = Date.now();
          ToastAndroid.show('再按一次退出应用', 1000);//提示
          return true;
        }
    }
  }
  

  updateHeatmap = () => {
    if (this.state.cur_latitude === 0 && this.state.cur_longitude === 0)
      fetchPopulationData(this.init_latitude, this.init_longitude, this);
    else
      fetchPopulationData(this.state.cur_latitude, this.state.cur_longitude, this);
  }

  // 定位事件
  _LocationEvent = data => {
    this.setState({
      cur_latitude: data.latitude,
      cur_longitude: data.longitude,
    }, () => {
      // console.log(this.state.cur_latitude, this.state.cur_longitude);
    });

    // 初始化
    // console.log('init', global._init);
    if (!this._init) {
      this.init_latitude = data.latitude;
      this.init_longitude = data.longitude;

      this._init = true;

      // 移至定位点
      this.mapView.setStatus(
        {
          // tilt: 0,
          rotation: 0,
          zoomLevel: 18,
          center: {
            latitude: this.init_latitude,
            longitude: this.init_longitude
          },
        }, 1000
      );

      // if (!global._init) {
        // 初始化热力图
        this.updateHeatmap();

        // global._init = true;
      // }
    }
  }

  _onSearchRoute = () => {
    console.log("on search");
    // console.log(this.search_comp.state);
    if (this.search_comp.state.text === "") {
      alert("输入为空");
    } else {
      console.log("输入的内容为：" + this.search_comp.state.text);

      var origin = this.state.cur_longitude + ',' + this.state.cur_latitude;//'120.125842,30.259188';
      var destination = this.search_comp.state.location;
      console.log(origin, destination);

      // 清空上次搜索记录
      this.setState({
        search_path_pts: []
      });

      // 搜索
      fetchRouteData(origin, destination, this);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* 查询路径 */}
        <Search ref={ref => this.search_comp = ref}
          onSearch={this._onSearchRoute}
          cur_position={this.state.cur_longitude + ',' + this.state.cur_latitude}
        />

        <View style={styles.mapContainer}>
          {/* 地图 */}
          <MapView ref={ref => (this.mapView = ref)}
            style={styles.mapStyle}
            width={Layout.window.width}
            height={Layout.window.height}
            coordinate={{ latitude: this.init_latitude, longitude: this.init_longitude }}
            zoomLevel={18}
            tilt={0}
            locationEnabled={true}
            showsZoomControls={false}
            showsTraffic
            onLocation={this._LocationEvent}
          >
            {/* 热力图 */}
            {this.state.place_coords.length > 0 &&
              <MapView.HeatMap
                key={this.state.key}
                opacity={0.8}
                radius={25}
                coordinates={this.state.place_coords} />
            }

            {/* 路径绘制 */}
            {this.state.search_path_pts.length > 0 ?

              <MapView.Polyline
                width={15}
                color="rgba(0, 0, 255, 0.5)"
                coordinates={this.state.search_path_pts}
              />
              : null
            }
          </MapView>
        </View>

      </View>
    );
  }
}

// HomeScreen.navigationOptions = {
//   header: null,
// };


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    // marginTop: 0,
    // marginBottom: 20,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  mapStyle: {
    flex: 1,
    // width: 300,//Dimensions.get('window').width,
    // height: 400,//Dimensions.get('window').height,
  },
});
