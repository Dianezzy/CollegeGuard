
var SERVER_ADDRESS = 'http://35.206.225.223:5000/data';//'http://192.168.43.117:5000/data';

var origin = '116.434307,39.90909';
var destination = '116.434446,39.90816';
var mypoisition = '120.121562,30.262746';
var key = '3990adc4545cdeb32078d8ffc67b61ae';

const PI = 3.1415926535897932384626;
const ee = 0.00669342162296594323;
const a = 6378245.0;

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

function out_of_china(lng, lat) {
    return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
}

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

// 后端查询当前位置附近区域人流量数据
function fetchPopulationData(lat, lng, obj) {
    var res_arr = new Array();

    var url = SERVER_ADDRESS + "?lat=" + lat + "&lng=" + lng;
    console.log(url);

    fetch(url)
        .then((res) => res.json())
        .then((json) => {
            console.log(json.length, json instanceof Array, res_arr instanceof Array);

            var max_cnt = Math.max.apply(Math, json.map(function(o) {return o.count}));
            console.log("max cnt",max_cnt);

            for (let i = 0; i < json.length; i++) {
                let [gcj_lng, gcj_lat] = wgs84_to_gcj02(parseFloat(json[i].wgs_lng), parseFloat(json[i].wgs_lat));
                res_arr.push({
                    'latitude': gcj_lat, //parseFloat(json[i].wgs_lat),
                    "longitude": gcj_lng,//parseFloat(json[i].wgs_lng),
                    "intensity": parseFloat(json[i].count)/max_cnt
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
}

// 查询最优路径（最短距离且危险系数最小）
function fetchRouteData(origin, destination, obj) {
    var url = `https://restapi.amap.com/v3/direction/walking?origin=${origin}&destination=${destination}&key=${key}`
    console.log(url)
    fetch(url)
        .then((res) => res.json())
        .then((json) => {
            var all_data = obj.state.heatmap_json;

            // console.log(json);
            let paths = json.route.paths;

            var allpaths_list = new Array();
            //traverse all paths
            for (let i = 0; i < paths.length; i++) {
                let steps = paths[i].steps;
                let step_num = steps.length;
                var coord = [];
                //traverse all steps in a path
                for (let j = 0; j < step_num; j++) {
                    //get coordinates in this step
                    let polyline = steps[j].polyline;
                    //coordinates are split by ;
                    var polyline_list = polyline.split(';');
                    if (j == 0) {
                        //append first coordinates 
                        coord = polyline_list;
                    }
                    else {
                        //avoid repeat coordinates
                        polyline_list.shift();
                        coord = coord.concat(polyline_list);
                    }

                }
                console.log('--final coord list');
                console.log(coord);
                console.log(coord.length)
                allpaths_list.push(coord);
            }

            console.log('---paths number', allpaths_list.length);

            let danger_min;
            let path_index;
            let danger_sum;
            for (let k = 0; k < allpaths_list.length; k++) {
                                var dangerlist = new Array();
                danger_sum = 0;
                for (let i = 0; i < coord.length; i++) {
                    let place = coord[i];
                    //console.log('--begint');
                    //console.log(place);

                    let x = parseFloat(place.split(',')[0]);
                    let y = parseFloat(place.split(',')[1]);
                    // console.log(x, y);
                    var coord_tr = [];
                    coord_tr = wgs84_to_gcj02(x, y);
                    // console.log(coord_tr);
                    let mindistance;
                    let danger_rank;
                    for (let j = 0; j < all_data.length; j++) {
                        var x1 = parseFloat(all_data[j].wgs_lng);
                        var y1 = parseFloat(all_data[j].wgs_lat);
                        var a = x1 - x;
                        var b = y1 - y;
                        var c = Math.sqrt(a * a + b * b);
                        if (j == 0) {
                            mindistance = c;
                            danger_rank = parseFloat(all_data[j].count);
                        }
                        else {
                            if (c < mindistance) {
                                mindistance = c;
                                danger_rank = parseFloat(all_data[j].count)
                            }
                        }
                    }
                    dangerlist.push(danger_rank);
                    danger_sum += danger_rank;
                }
                if (k == 0) {
                    danger_min = danger_sum;
                    path_index = k;
                }
                else {
                    if (danger_sum < danger_min) {
                        danger_min = danger_sum;
                        path_index = k;
                    }
                }
            }

            // console.log(all_data.length);
            // console.log(all_data[0].time);
            console.log('----the shortesd path is', path_index);
            console.log('the danger rank is', danger_min);
            console.log(allpaths_list[path_index]);

            var res_list = [];
            for(let i =0;i<allpaths_list[path_index].length;i++){
                var item = allpaths_list[path_index][i];
            // for(var item in allpaths_list[path_index]){
                let pos_list = item.split(',');
                // console.log(item, pos_list);
                res_list.push({
                    latitude: parseFloat(pos_list[1]),
                    longitude: parseFloat(pos_list[0]),
                });
            }

            // let status = json.status;
            // let info = json.info;
            // alert("status:" + status + "-------info:" + info);
            obj.setState({
                search_path_pts: res_list
            });
            // console.log(res_list);
        })
        .catch((e) => {
            alert(e);
        });
}


// 根据关键字返回当前位置附近相似位置（搜索提示）
function fetchPosData(keywords, cur_position, obj) {
    var url = `https://restapi.amap.com/v3/assistant/inputtips?output=json&city=0571&location=${cur_position}&keywords=${keywords}&key=${key}`
    fetch(url)
        .then((res) => res.json())
        .then((json) => {
            console.log(json.tips);
            var pos_name_list = [];
            for (var i = 0; i < json.tips.length; i++) {
                var pos_name = json.tips[i].name;
                var pos_location = json.tips[i].location;
                var pos_itm = [pos_name, pos_location];
                pos_name_list.push(pos_itm);
            }

            obj.setState({
                hint_names_list: pos_name_list
            });
        })
        .catch((e) => {
            alert(e);
        });
}

export { fetchRouteData, fetchPosData, fetchPopulationData };