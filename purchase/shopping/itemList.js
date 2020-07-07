import React from 'react';
import { StyleSheet, Image, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Tabs, WingBlank, WhiteSpace, List, Button, Flex } from '@ant-design/react-native';
import {ItemDisplay} from './ItemDisplay';
import Cache from '../../core/Cache';
import {GetItems} from '../DatabaseClient';

var items=[{
    id:'default',
    price:'20',
    pic:'https://user-images.githubusercontent.com/37875411/81286757-28a9d600-9094-11ea-8f39-51c71772b768.jpg'
}
]

const Item = List.Item;
const Brief = Item.Brief;

export class StoreDetailComponent extends React.Component{
    constructor(props){
        super(props);
        //现在state里放入参数
        this.state={
            myItems:[]
        };
        console.log(this.state.myItems);
    }
    
    static test='';

    //didMount函数在组件被挂载的时候执行一次
    componentDidMount(){
        var merchantID=Cache.get("merchant id");
        if(this.props.navigation.state.params.merchantName!=merchantID){
            Cache.clearItems();
            Cache.set("merchant id",this.props.navigation.state.params.merchantName);
        }
        GetItems(this.props.navigation.state.params.merchantName).then(
            (response)=>{
                let result=response.map((item,index)=>{
                    
                    return {
                        id:item.id,
                        price:item.payment,
                        pic:item.imgs
                    };
                });
                //利用setState来更新参数，将从服务器中得到的数据嵌入到state里
                this.setState({myItems:result}); 
            }
        )
    }

    render(){
        return (
            
                <ScrollView style={{ flex: 1 }}>
                    
                    <List renderHeader={'店铺商品列表'}>
                        {
                            this.state.myItems.map((item,key)=>{
                                return(
                                    <Item wrap extra={
                                        <Button onPress={()=>{
                                            Cache.addItem(
                                                {id:item.id,price:item.price,count:1,pic:item.pic
                                            });
                                            console.log(Cache.storage);}
                                        }>
                                            <Text style={styles.add2CartBtn}>+</Text>
                                        </Button>
                                    }
                                    onPress={()=>{this.props.navigation.navigate('ItemDisplayScreen',{name: item.id});}}
                                    key={key}
                                    >
                                        <WingBlank style={{ marginBottom: 5, flexDirection: 'row', alignItems:'center' }}>
                                            <Image source={{uri: item.pic}} style={styles.smallPictureSize}></Image>
                                            <View>
                                                <Text style={styles.title}>{item.id}</Text>
                                                <Text style={styles.descrip}>余量：50份</Text>
                                                <Text style={styles.price}>￥{item.price}</Text>
                                            </View>
                                        </WingBlank>
                                    </Item>
                                )
                            })
                        }
                    </List>
                </ScrollView>
                
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    smallPictureSize: {
        width: 100,
        height: 100,
        borderRadius:5,
    },
    descrip:{        
        marginLeft:10,
        paddingLeft:2,
        paddingTop:2,
        paddingBottom:2,
        color:"#F8F8FF",
        fontWeight: "bold",
        fontSize:15,
        backgroundColor:'orange',
        borderRadius:3,

    },
    price:{
        paddingLeft:10,
        fontSize:15,
        color:'#CD5C5C',
        fontWeight:'200',
        fontFamily:'Times New Roman'
    },
    introduction: {
        fontSize:20
    },
    title:{
        fontSize:20,
        paddingLeft:10,
        fontFamily:'Times New Roman'
    },
    add2CartBtn: {
        fontSize:25,
        alignItems:'center',
        color:'#4169E1'
    }
  });


