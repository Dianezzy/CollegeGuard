import React from 'react';
import { View, ScrollView,RefreshControl } from 'react-native';
import { Button, List, WhiteSpace, WingBlank } from '@ant-design/react-native';
import { GetOrderList_tenant } from '../DatabaseClient';
import Cache from '../../core/Cache';

const Item = List.Item;

export class CurrentOrder extends React.Component {
    constructor(props) {
        super(props);
        let orders = []
        this.state = {
            t_id: Cache.get('account'),//props.navigation.state.params.account.name,
            orders: orders,
            isRefreshing: false
        };
    }
    
    componentDidMount() {
        GetOrderList_tenant(this.state.t_id).then((response)=>{this.successShow(response)});
    }
    _onRefresh = ()=>{
        this.setState({
            isRefreshing: true
        });
        //间隔5秒结束下拉刷新
        // setTimeout(()=>{
            GetOrderList_tenant(this.state.t_id).then((response)=>{this.successShow(response)});
        //     this.setState({
        //         isRefreshing: false,
        //     })
        // }, 5000);
    }

    successShow(response) {
        let orders = [];
        response.forEach(element => {
            orders.push([[element.id, element.item_list], element.stat]);
        });
        this.setState({
            orders: orders,
            isRefreshing: false,
        });
    }
    render(){
        console.log(this.state.t_id);
        return (
            <View>
                <WingBlank>
                <WhiteSpace/>
                {/* <Button
                    onPress={() => {
                        this.props.navigation.navigate('HistoryOrderScreen', {id: this.state.t_id})
                    }}>
                    历史订单列表
                </Button> */}
                <WhiteSpace/>
                <ScrollView refreshControl={
                            <RefreshControl refreshing={this.state.isRefreshing}
                                            onRefresh={this._onRefresh}
                                            // tintColor="#ff0000"
                                            title="Loading..."
                                            // titleColor="#00ff00"
                                            />
                        }>
                    <List renderHeader={'当前共有' + this.state.orders.length + '个订单未确认收货'}>
                    
                        {this.state.orders.map((order) => {
                            return (
                                <Item key={order[0]} extra={<Button // 这里是接口
                                                        onPress={() => {this.props.navigation.navigate('OrderPagePersonal', {id: order[0][0], stat: order[1]})}}>
                                                        详细信息
                                                    </Button>}>
                                    {order[0]} 
                                </Item>
                            );
                        })}
                    </List>
                </ScrollView>
                </WingBlank>
            </View>
        );
    }
}

