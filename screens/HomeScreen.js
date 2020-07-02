import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';

// import { MonoText } from '../components/StyledText';
import { MapView } from "react-native-amap3d";
import { Fetch, fetchData } from '../core/mapdata';
import { fetchPopulationData } from '../core/heatmap';

import Layout from '../constants/Layout';
import '../constants/globals";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cur_latitude: 0,
      cur_longitude: 0,
      place_coords: [],
      // place_radius: [],
    }

    // this._init = false;
    this.init_latitude = 0;//39.5;
    this.init_longitude = 0;//116;
    // this.region_latlng = new Array(4); // 左上 右上 左下 右下四个点经纬度
  }

  componentDidMount() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);

    // 每隔一段时间刷新热力图
    // this.interval = setInterval(this.updateHeatmap, 3600000);

    // 请求json数据（测试）
    var origin = '116.434307,39.90909';
    var destination = '116.434446,39.90816';
    fetchData(origin, destination);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
    if (!global._init) {
      this.init_latitude = data.latitude;
      this.init_longitude = data.longitude;

      // 热力图覆盖范围
      // var radius = 5; // km
      // this.region_latlng[0] = (this.init_longitude - 0.01 * radius) + "," + (this.init_latitude + 0.01 * radius); // 左上
      // this.region_latlng[1] = (this.init_longitude + 0.01 * radius) + "," + (this.init_latitude + 0.01 * radius); // 右上
      // this.region_latlng[2] = (this.init_longitude - 0.01 * radius) + "," + (this.init_latitude - 0.01 * radius); // 左下
      // this.region_latlng[3] = (this.init_longitude + 0.01 * radius) + "," + (this.init_latitude - 0.01 * radius); // 右下

      // for (var i = 0; i < 4; i++) {
      //   console.log(this.region_latlng[i]);
      // }
      // fetchPopulationData(this.region_latlng);

      global._init = true;

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

      // 初始化热力图
      this.updateHeatmap();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>

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
            // showsIndoorMap
            // showsLocationButton
            onLocation={this._LocationEvent}
          // locationStyle={{
          //   image: "flag",
          //   // fillColor: "red",
          //   // strokeColor: "red",
          //   strokeWidth: 0
          // }}
          >
            {this.state.place_coords.length > 0 &&
              <MapView.HeatMap
                key={this.state.key}
                opacity={0.8}
                radius={25}
                coordinates={this.state.place_coords} />
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
