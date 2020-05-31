import React, {Component} from 'react';
import {AppRegistry, View, Text, StyleSheet, TouchableHighlight} from 'react-native';

var origin = '116.434307,39.90909';
var destination = '116.434446,39.90816';
var key = '3990adc4545cdeb32078d8ffc67b61ae';
class Fetch extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight
                    underlayColor='rgb(210,260,260)'
                    style={{padding: 10, marginTop: 10, borderRadius: 5,}}
                    
                    onPress={this.fetchData(origin, destination, key)}
                >
                    <Text >get请求</Text>
                </TouchableHighlight>
            </View>
        );
    }

    get() {
        fetch('https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())//1
            .then((jsonData) => {//2
                let country = jsonData.data.movies[0].title;
                let city = jsonData.data.movies[0].title;
                alert("country:" + country + "-------city:" + city);
            });
    }
    fetchData(origin, destination, key){
        //var url = 'https://facebook.github.io/react-native/movies.json';
        //var url = 'https://restapi.amap.com/v3/direction/walking?origin=116.434307,39.90909&destination=116.434446,39.90816&key=3990adc4545cdeb32078d8ffc67b61ae';
        //var origin = '116.434307,39.90909';
        //var destination = '116.434446,39.90816';
        //var key = '3990adc4545cdeb32078d8ffc67b61ae';
        var url = `https://restapi.amap.com/v3/direction/walking?origin=${origin}&destination=${destination}&key=${key}`
        fetch(url)
            .then((res)=> res.json())
            .then((json)=>{
                //this.setState({resultJson:json});//将json数据传递出去，setState会重新调用render()
                //let country = json.movies[0].title;
                //let city = json.movies[0].title;
                
                console.log(json);
                let status = json.status;
                let info = json.info;
                alert("status:" + status + "-------info:" + info);
            })
            .catch((e)=>{
                alert(e);
            });
      }
      fetchJson(origin, destination, key){
        //var url = 'https://restapi.amap.com/v3/direction/walking?origin=116.434307,39.90909&destination=116.434446,39.90816&key=3990adc4545cdeb32078d8ffc67b61ae';
        //var origin = '116.434307,39.90909';
        //var destination = '116.434446,39.90816';
        //var key = '3990adc4545cdeb32078d8ffc67b61ae';
        var url = `https://restapi.amap.com/v3/direction/walking?origin=${origin}&destination=${destination}&key=${key}`
        fetch(url)
            .then((res)=> {return res.text()})
            .then((text)=>{  
                console.log(text);
            })
            .catch((e)=>{
                alert(e);
            });
      }

}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    }
});
AppRegistry.registerComponent('FetchSample', () => Fetch);
export {Fetch};