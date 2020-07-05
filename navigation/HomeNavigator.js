import * as React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import { NavigationContainer,createAppContainer } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
// import ShoppingNavigator from '../shopping/ShoppingNavigator';
import ShoppingNavigator from '../purchase/shopping/ShoppingNavigator';

import {
    HomeScreen,
    ShopScreen,
    PersonalCenterScreen,
    FindRouteScreen
} from '../screens';

const BottomTab=createBottomTabNavigator({
    Home:{
        screen: HomeScreen,
        navigationOptions:{
            tabBarLabel: '首页',
            tabBarIcon: ({focused})=>{
                return (
                    <TabBarIcon 
                        name='home'
                        focused={focused}
                    />
                );
            }
        }
    },
    // Route: {
    //     screen: FindRouteScreen,
    //     navigationOptions:{
    //         tabBarLabel: '导航',
    //         tabBarIcon: ({focused})=>{
    //             return (
    //                 <TabBarIcon 
    //                     name='directions-run'
    //                     focused={focused}
    //                 />
    //             );
    //         },
    //     }
    // }, 
    Shop:{
        screen: ShoppingNavigator,
        navigationOptions:{
            tabBarLabel: '购物',
            tabBarIcon: ({focused})=>{
                return (
                    <TabBarIcon 
                        name='shopping-cart'
                        focused={focused}
                    />
                );
            },
            tabBarVisible: false,
        }
    },
    PersonalCenter:{
        screen: PersonalCenterScreen,
        navigationOptions:{
            tabBarLabel: '个人中心',
            tabBarIcon: ({focused})=>{
                return (
                    <TabBarIcon 
                        name='person'
                        focused={focused}
                    />
                );
            }
        }
    },
},
{

    initialRouteName: 'Home',
    // tabBarPosition: 'bottom',
    // animationEnabled: false,
    // swipeEnabled: false,
}
);

export default createAppContainer(BottomTab);