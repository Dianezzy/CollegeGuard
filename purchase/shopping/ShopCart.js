import React from 'react';
import Cache from '../../core/Cache';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, WingBlank, WhiteSpace, List, Flex } from '@ant-design/react-native';
import Button from '../../components/Button';
import { StyleSheet, Image, ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import { InsertOrder } from '../DatabaseClient';

const Item = List.Item;
const Brief = Item.Brief;

export default class ShopCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sumPrice: Cache.countPrice(),
            items: Cache.getItemList(),
        };
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            this.setState({
                sumPrice: Cache.countPrice(),
                items: Cache.getItemList(),
            });
        });
    }
    componentWillUnmount() { this._navListener.remove(); }

    getItemListToString() {
        var string = "";
        // console.log(this.state.items);
        for (var index in this.state.items) {
            string += (this.state.items[index].id + "*" + this.state.items[index].count + ";\n");
        }
        return string;
    }


    render() {
        return (
            <ScrollView style={{ flex: 1 }}>
                {/* <WhiteSpace /> */}
                <List renderHeader={'购物车'} >
                    {
                        this.state.items.map(
                            (item, key) => {
                                return (
                                    <Item key={key} wrap>
                                        <WingBlank style={{ marginBottom: 5, flexDirection:'row', justifyContent:'space-around' }}>
                                            <Image source={{ uri: item.pic }} style={styles.smallPictureSize}></Image>
                                            <View style={{alignSelf:'center'}}>
                                                <Text style={styles.title}>{item.id}</Text>
                                                <WhiteSpace />
                                                <Text style={styles.price}>￥{item.price}</Text>
                                            </View>
                                            {/* <View style={{flexDirection:'column',alignSelf:'flex-end'}}> */}
                                            <WingBlank style={{ marginBottom: 5, flexDirection: 'row', alignSelf:'center' }}>
                                                <Ionicons name="ios-remove-circle" size={24} color="black" onPress={() => {
                                                    Cache.itemNoPlus(item.id, -1);
                                                    this.setState({
                                                        sumPrice: Cache.countPrice(),
                                                        items: Cache.getItemList(),
                                                    })
                                                }}></Ionicons>


                                                <WingBlank ><Text>{Cache.getItemNo(item.id)}</Text></WingBlank>
                                                <Ionicons name="ios-add-circle" size={24} color="black" onPress={() => {
                                                    Cache.itemNoPlus(item.id, 1);
                                                    this.setState({
                                                        sumPrice: Cache.countPrice(),
                                                        items: Cache.getItemList(),
                                                    });
                                                }}></Ionicons>
                                            </WingBlank>
                                            {/* </View> */}
                                        </WingBlank>
                                    </Item>
                                )
                            }
                        )
                    }
                </List>
                <Button mode="contained" style={styles.button} onPress={() => {
                    var orderinfo = {
                        m_id: Cache.get("merchant id"),
                        t_id: Cache.get("account"),
                        item_list: this.getItemListToString(),
                        total_price: this.state.sumPrice,
                        payment: null,
                    };
                    InsertOrder(orderinfo).then(
                        (response) => {
                            if (response == 'Y') {
                                Alert.alert('订单已生成');
                                Cache.clearItems();
                                this.setState({ items: Cache.getItemList(),
                                    sumPrice:0 })
                            }
                            else {
                                Alert.alert('订单生成错误');
                            }
                        }
                    )
                }}>￥{this.state.sumPrice}  去结算</Button>
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
        height: 100
    },
    price: {
        paddingLeft: 10,
        fontSize: 15,
        color: '#CD5C5C',
        fontWeight: '200',
        fontFamily: 'Times New Roman'
    },
    introduction: {
        fontSize: 20
    },
    title: {
        fontSize: 20,
        paddingLeft: 10,
        fontFamily: 'Times New Roman'
    },
    add2CartBtn: {
        fontSize: 25,
        alignItems: 'flex-end',
        color: '#4169E1'
    },
    cartExtra: {
        flexDirection: 'row'
        // alignItems:'flex-end',
    },
    button: {
        alignItems: 'center',
        alignSelf: 'center',
        // paddingHorizontal: 20,
        // marginRight: 20,
        marginTop: 20,

        width: '60%',
    },
});

