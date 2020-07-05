import React, { Component } from 'react';
import {fetchRouteData ,fetchPosData} from '../core/mapdata';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import {theme} from '../core/theme';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  PixelRatio
} from 'react-native';
 
//输入框组件
class Search extends Component {

  //构造函数
  constructor(props) {
    super(props);
    this.state = {
      text: '', 
      show: false,
      hint_names_list: [],
      location:'',
      search_flag: false,
    };
    
  }

  //组件渲染
  render() {
    return (
      <View style={styles.flex}>
          <View style={[styles.flexDirection, styles.inputHeight]}>
            <View style={styles.flex}>
              <TextInput
                style={styles.input}
                returnKeyType="search"
                placeholder="请输入终点"
                value={this.state.text}
                onChangeText={this.textChange.bind(this)}/>
            </View>
            <View style={styles.btn}>
              {/* <Text style={styles.search} onPress={this.search.bind(this)}>确认</Text> */}
              <Text style={styles.search} onPress={this.props.onSearch.bind(this)}>确认</Text>
            </View>
          </View>


          {this.state.show?
            <ScrollView style={styles.list}>

              {this.state.hint_names_list.map((item, i)=>{
                return (
                    <Text onPress={this.hideList.bind(this, item)}
                              style={styles.item} numberOfLines={1}
                              key={i}>{item[0]}</Text>
                )
              }) }
            </ScrollView>
            : null
          }
      </View>
    );
  }
 
  //输入框文字改变
  textChange(text){
    fetchPosData(text, this.props.cur_position, this);
    this.setState({
      show: text!="" ? true : false,
      text: text
    });
  }
 
  //隐藏自动提示列表
  hideList(info){
    // alert(info[0])
    this.setState({
      show: false,
      text: info[0],
      location: info[1]
    });

  }
 
  //搜索按钮点击
  search(){
    if(text === ""){
      alert("输入为空");
      this.setState({
        search_flag: false,
      });
    }else{
      this.setState({
        search_flag: true,
      });
    }
    //alert("您输入的内容为："+this.state.text);
//     alert(this.state.location);
// 		var origin = '120.125842,30.259188';
//     var destination=this.state.location;
//     console.log(this.state.location);
//     //var destination = '116.434446,39.90816';
// 		fetchData(origin, destination);
  }
}

// const CustomSearch = ({ props }) => (
//   <Search
    
//   />
// );

//样式定义
const styles = StyleSheet.create({
  flex:{
    // flex: 0.25,
    // flexDirection: 'column',
    // flex: 0.25
  },
  flexDirection:{
    flexDirection:'row',
    // flexDirection: 'column'
    // flex: 1
  },
  topStatus:{
    marginTop:25,
  },
  inputHeight:{
    height:45,
  },
  input:{
    fontSize:16,
    height:45,
    width: Layout.window.width-50,
    borderWidth:1,
    marginLeft: 0,
    paddingLeft:5,
    borderColor: '#ccc',
    borderRadius: 4
  },
  btn:{
    width:55,
    marginLeft:-5,
    marginRight:5,
    backgroundColor: '#6600ff',
    height:45,
    justifyContent:'center',
    alignItems: 'center'
  },
  search:{
    color:'#fff',
    fontSize:16,
    fontWeight:'bold'
  },
  list:{
    marginTop: 1/PixelRatio.get(),
    marginLeft:5,
    marginRight:5,
    height:300,
    // width: 300,
    borderColor:'#ccc',
    // borderTopWidth: 1/PixelRatio.get(),
  },
  item:{
    fontSize:16,
    padding:5,
    paddingTop:10,
    paddingBottom:10,
    borderWidth: 1/PixelRatio.get(),
    borderColor:'#ddd',
    borderTopWidth:0,
  }
});

export {Search};

 
// AppRegistry.registerComponent('HelloWorld', () => App);