import React, { Component } from 'react';
import { AppRegistry, View, Text, StyleSheet, TouchableHighlight } from 'react-native';

var SERVER_ADDRESS = 'http://192.168.43.117:5000/data';
const PI = 3.1415926535897932384626;
const ee = 0.00669342162296594323;  // 扁率
const a = 6378245.0  // 长半轴

function _transformlat(lng, lat) {
    let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;

    return ret;
}

function _transformlng(lng, lat) {
    let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;

    return ret;
}

// 判断是否在国内，不在国内不做偏移
function out_of_china(lng, lat) {
    return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
}

//  WGS84转GCJ02(火星坐标系)
function wgs84_to_gcj02(lng, lat) {
    if (out_of_china(lng, lat))  // 判断是否在国内
        return [lng, lat];

    let dlat = _transformlat(lng - 105.0, lat - 35.0);
    let dlng = _transformlng(lng - 105.0, lat - 35.0);
    let radlat = lat / 180.0 * PI;
    let magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    let sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
    let mglat = lat + dlat;
    let mglng = lng + dlng;

    return [mglng, mglat];
}

// 查询当前位置附近区域人流量数据
async function fetchPopulationData(lat, lng, obj) {
    var res_arr = new Array();

    var url = SERVER_ADDRESS + "?lat=" + lat + "&lng=" + lng;
    console.log(url);

    await fetch(url)
        .then((res) => res.json())
        .then((json) => {
            console.log(json.length, json instanceof Array, res_arr instanceof Array);
            for (let i = 0; i < json.length; i++) {
                let [gcj_lng, gcj_lat] = wgs84_to_gcj02(parseFloat(json[i].wgs_lng), parseFloat(json[i].wgs_lat));
                res_arr.push({
                    'latitude': gcj_lat, //parseFloat(json[i].wgs_lat),
                    "longitude": gcj_lng,//parseFloat(json[i].wgs_lng),
                    "intensity": parseFloat(json[i].count)
                })
                // if (i === 0)
                    // console.log(res_arr[i]);
            }
            obj.setState({
                key: Math.random(),
                place_coords: res_arr,
                heatmap_json: json,
            })
        })
        .catch((e) => {
            alert(e);
        });

    // return res_arr;
}

export { fetchPopulationData };