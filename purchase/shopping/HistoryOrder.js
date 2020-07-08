import React from 'react';
import { ScrollView,RefreshControl } from 'react-native';
import { List, WhiteSpace, WingBlank } from '@ant-design/react-native';
import { GetHistoryOrderList_tenant, GetOrderList_tenant } from '../DatabaseClient';
import Cache from '../../core/Cache';

const Item = List.Item;

export class HistoryOrder extends React.Component {
    constructor(props) {
        super(props);
        let orders = []
        this.state = {
            id: Cache.get('account'),//props.navigation.state.params.id,
            orders: orders,
            isRefreshing: false
        };
    }
    componentDidMount() {
        GetHistoryOrderList_tenant(this.state.id).then((response)=>{this.successShow(response)});
        // GetOrderList_tenant(this.state.id).then((response)=>{this.successShow(response)});
    }

    _onRefresh = ()=>{
        this.setState({
            isRefreshing: true
        });
        //间隔5秒结束下拉刷新
        // setTimeout(()=>{
            GetHistoryOrderList_tenant(this.state.id).then((response)=>{this.successShow(response)});
        //     this.setState({
        //         isRefreshing: false,
        //     })
        // }, 5000);
    }
    successShow(response) {
        let orders = [];
        response.forEach(element => {
            orders.push([element.id, element.item_list]);
        });
        this.setState({
            orders: orders
        });
    }
    render() {
        return (
            <WingBlank>
            <WhiteSpace />
            <ScrollView refreshControl={
                            <RefreshControl refreshing={this.state.isRefreshing}
                                            onRefresh={this._onRefresh}
                                            // tintColor="#ff0000"
                                            title="Loading..."
                                            // titleColor="#00ff00"
                                            />
                        }>
                <List renderHeader={'历史订单'}>
                    {this.state.orders.map((historyorder) => {
                        return(
                            <Item key={historyorder}>{historyorder}</Item>
                        )
                    })}
                </List>
            </ScrollView>
            </WingBlank>
        );
    }
}