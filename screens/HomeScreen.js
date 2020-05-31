import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

// import { MonoText } from '../components/StyledText';
// import GoogleMap from 'react-native-maps-google';
import { MapView } from "react-native-amap3d";
import {Fetch} from '../core/mapdata';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.mapContainer}>
          {/* <GoogleMap
              cameraPosition={{auto: true, zoom: 10}}
              showsUserLocation={true}
              scrollGestures={true}
              zoomGestures={true}
              tiltGestures={true}
              rotateGestures={true}
              consumesGesturesInView={true}
              compassButton={true}
              myLocationButton={true}
              indoorPicker={true}
              allowScrollGesturesDuringRotateOrZoom={true}
          /> */}
            {/* <MapView
                coordinate={{
                    latitude: 39.91095,
                    longitude: 116.37296
                }}
            /> */}
            <Fetch/> 
        </View>

        <View style={styles.buttonContainer}>
          
        </View>
      </ScrollView>

    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  mapContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
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
});
