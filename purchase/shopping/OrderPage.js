import React, { Component } from 'react'
import { TextInput, View, StyleSheet, Alert } from 'react-native'
import {  WhiteSpace } from '@ant-design/react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Heading2 } from '../../purchase_M/Text'
import { GetOrderInfo, ChangeStat } from '../../purchase_M/DatabaseClient';
import { UpdateOrderStat, UpdateOrderStat_done, UpdateOrderStat_pay } from '../../purchase/DatabaseClient';
import Button from '../../components/Button';

class ConfirmBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hint: props.stat == 'ready' ? '打包完成' : '确认打包',
            id: props.id,
            stat: props.stat,
            isDisabled: props.stat == 'ready',
            isMounted: props.stat == 'ready',
        };
        this.change = this.change.bind(this);
    }
    componentDidMount() {
        this.setState({ isMounted: true });
    }
    componentWillUnmount() {
        this.state.isMounted = false;
    }
    change() {
        if (this.state.isMounted) {
            this.setState((state) => ({
                hint: '打包完成',
                isDisabled: true
            }));
        }
    }
    render() {
        return (
            <Button disabled={this.state.isDisabled}
                onPress={() => {
                    Alert.alert(
                        "是否确认打包完成？",
                        "",
                        [
                            {
                                text: '确认', onPress: () => {
                                    ChangeStat(this.state.id);
                                    this.change();
                                }
                            },
                            { text: '取消', style: 'cancel' },
                        ],
                    )
                }}>
                {this.state.hint}
            </Button>
        );
    }
}

export class OrderPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canChange: false,
            id: props.navigation.state.params.id,
            stat: props.navigation.state.params.stat
        };
        // alert(this.state.id+ this.state.stat);
    }
    componentDidMount() {
        // alert(this.state.id);
        GetOrderInfo(this.state.id).then((response) => { this.successShow(response[0]) });
    }
    successShow(response) {
        // alert(response);
        this.setState({
            t_id: response.t_id,
            item_list: response.item_list,
            total_price: response.total_price.toString(),
            v_id: response.v_id,
            stat: response.stat == 'preparing' ? '准备中' : '已送达',
            payment: response.payment == 'yes' ? '已支付' : '未支付'
        });
    }
    render() {
        return (
            <KeyboardAwareScrollView>
                <TouchableOpacity style={styles.touch}>
                    <View style={styles.content}>
                        <Heading2>商品列表</Heading2>
                        <View style={{ flex: 1, backgroundColor: 'blue' }} />
                        <TextInput style={{ color: '#999999', width: 200, textAlign: 'right' }}
                            defaultValue={this.state.item_list}
                            editable={this.state.canChange}
                            onChangeText={(text) => this.setState({
                                storeName: text
                            })}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.touch}>
                    <View style={styles.content}>
                        <Heading2>买家</Heading2>
                        <View style={{ flex: 1, backgroundColor: 'blue' }} />
                        <TextInput style={{ color: '#999999', width: 200, textAlign: 'right' }}
                            defaultValue={this.state.t_id}
                            editable={this.state.canChange}
                            onChangeText={(text) => this.setState({
                                owner_name: text
                            })}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.touch}>
                    <View style={styles.content}>
                        <Heading2>总价</Heading2>
                        <View style={{ flex: 1, backgroundColor: 'blue' }} />
                        <TextInput style={{ color: '#999999', width: 200, textAlign: 'right' }}
                            defaultValue={this.state.total_price}
                            editable={this.state.canChange}
                            onChangeText={(text) => this.setState({
                                owner_name: text
                            })}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.touch}>
                    <View style={styles.content}>
                        <Heading2>志愿者</Heading2>
                        <View style={{ flex: 1, backgroundColor: 'blue' }} />
                        <TextInput style={{ color: '#999999', width: 200, textAlign: 'right' }}
                            defaultValue={this.state.v_id}
                            editable={this.state.canChange}
                            onChangeText={(text) => this.setState({
                                certificate: text
                            })}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.touch1}>
                    <View style={styles.content}>
                        <Heading2>支付状态</Heading2>
                        <View style={{ flex: 1, backgroundColor: 'blue' }} />
                        <TextInput style={{ color: '#999999', width: 200, textAlign: 'right' }}
                            defaultValue={this.state.payment}
                            editable={this.state.canChange}
                            multiline={true}
                            onChangeText={(text) => this.setState({
                                description: text
                            })}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.touch1}>
                    <View style={styles.content}>
                        <Heading2>订单状态</Heading2>
                        <View style={{ flex: 1, backgroundColor: 'blue' }} />
                        <TextInput style={{ color: '#999999', width: 200, textAlign: 'right' }}
                            defaultValue={this.state.stat}
                            editable={this.state.canChange}
                            multiline={true}
                            onChangeText={(text) => this.setState({
                                description2: text
                            })}
                        />
                    </View>
                </TouchableOpacity>

                <WhiteSpace />
                {/* <ConfirmBtn id={this.state.id} stat={this.state.stat} /> */}
                <WhiteSpace />

                {this.state.payment === '未支付' ?
                    <Button mode="contained" style={styles.button} onPress={() => {
                        UpdateOrderStat_pay(this.state.id).then(
                            (response) => {
                                // alert(response);
                                if (response === 'Y') {
                                    Alert.alert('支付成功');
                                    this.setState({
                                        payment: '已支付'
                                    })
                                }
                                else {
                                    Alert.alert('支付错误');
                                }
                            }
                        )
                    }}>去支付</Button>
                    : null
                }

                {this.state.payment === '已支付' &&  this.state.stat != '已送达'?
                    <Button mode="contained" style={styles.button} onPress={() => {
                        UpdateOrderStat_done(this.state.id).then(
                            (response) => {
                                // alert(response);
                                if (response === 'Y') {
                                    Alert.alert('订单已完成');
                                    this.setState({
                                        stat: '已送达',
                                    })
                                }
                                else {
                                    Alert.alert('收货错误');
                                }
                            }
                        )
                    }}>确认收货</Button>
                    : null
                }

            </KeyboardAwareScrollView>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        marginTop: 40,
        marginLeft: 40,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        width: '80%'
    },
    buttonview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: '80%',
        marginLeft: '10%'
    },
    touch: {
        backgroundColor: "white",
        borderBottomColor: "#DCDCDC",
        borderWidth: 0.2,
        height: 50,
    },
    touch1: {
        backgroundColor: "white",
        borderBottomColor: "#DCDCDC",
        borderWidth: 0.2,
        height: 50,
    },
    content: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 10,
    },
    text1: {
        fontSize: 18
    },
    textInput: {
        width: 270,
        height: 30,
        borderColor: "#708090",
        borderWidth: 2,
        marginBottom: 10,
    },
    textInput2: {
        width: 270,
        height: 90,
        borderColor: "#C0C0C0",
        borderWidth: 1,
        backgroundColor: "white",
        marginBottom: 10,
    },
    changeButton: {
        marginTop: 10,
        width: 100,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2c3e50",
        borderRadius: 20,
    },
    saveButton: {
        marginTop: 10,
        width: 100,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#3CB371",
        borderRadius: 20,
    },
    textChange: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "bold",
    },
    arrow: {
        width: 14,
        height: 14,
        marginLeft: 5,
    },
    button: {
        // alignItems: 'center',
        alignSelf: 'center',
        // paddingHorizontal: 20,
        // marginRight: 20,
        marginTop: 20,

        width: '60%',
    },
});
