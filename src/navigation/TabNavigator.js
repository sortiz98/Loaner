import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { View, Text, KeyboardAvoidingView, Pressable, Button, TextInput, TouchableOpacity } from 'react-native';

import Home from '../screens/Home';
import Post from '../screens/Post';
import Listings from '../screens/Listings';
import Details from '../screens/Details';
import Login from '../screens/Login';
import ManageAccount from '../screens/ManageAccount';
import ItemCalendar from '../screens/ItemCalendar';
import MyCalendar from '../screens/MyCalendar';
import WixCalendar from '../components/WixCalendar';
import BlockTimeCard from '../components/BlockTimeCard';
import CancellationPolicy from '../screens/CancellationPolicy';

import { doc, collection, getDoc, query, deleteDoc, where } from "firebase/firestore";
import { db, auth } from "../firebase-config";

import { NavigationContainer } from '@react-navigation/native';

import { Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import RatePrices from '../screens/RatePrices';
import Rates from '../screens/Rates';
import Photos from '../screens/Photos';
import FinishListing from '../screens/FinishListing';
import SearchSpan from '../screens/SearchSpan';
import SearchDates from '../screens/SearchDates';
import SearchTime from '../screens/SearchTime';
import SearchResults from '../screens/SearchResults';


export default function TabNavigator({ navigation, route }) {
    const Tab = createBottomTabNavigator();
    const Stack = createNativeStackNavigator();

    const HomeStack = (navigation) => {
        return (
            <Stack.Navigator initialRouteName="HomeScreen">
                <Stack.Screen
                    name="HomeScreen"
                    component={Home}
                    options={{ headerShown: false }}
                    initialParams={{ viewList: route.params.viewList }}
                />
                <Stack.Screen
                    name="SearchSpan"
                    component={SearchSpan}
                    options={{ title: "Search", headerLeft: () => (<View></View>), headerShown: true, headerTintColor: "#000", headerRight: () => (cancelSearch(navigation)) }}
                />
                <Stack.Screen
                    name="SearchDates"
                    component={SearchDates}
                    options={{ title: "Search", headerLeft: () => (<View></View>), headerShown: true, headerTintColor: "#000", headerRight: () => (cancelSearch(navigation)) }}
                />
                <Stack.Screen
                    name="SearchTime"
                    component={SearchTime}
                    options={{ title: "Search", headerLeft: () => (<View></View>), headerShown: true, headerTintColor: "#000", headerRight: () => (cancelSearch(navigation)) }}
                />
                <Stack.Screen
                    name="SearchResults"
                    component={SearchResults}
                    options={{ title: "Search", headerLeft: () => (<View></View>), headerShown: true, headerTintColor: "#000", headerRight: () => (cancelSearch(navigation)) }}
                />
            </Stack.Navigator>
        );
    };

    const PostStack = (navigation) => {
        return (
            <Stack.Navigator initialRouteName="PostScreen">
                <Stack.Screen
                    name="PostScreen"
                    component={Post}
                    options={{ headerShown: true, title: "Post" }}
                />
                <Stack.Screen
                    name="Photos"
                    component={Photos}
                    options={{ title: "Photos", headerLeft: () => (<View></View>), headerShown: true, headerTintColor: "#000", headerRight: () => (cancelPost(navigation)) }}
                />
                <Stack.Screen
                    name="Details"
                    component={Details}
                    options={{ title: "Details", headerBackTitleVisible: false, headerShown: true, headerTintColor: "#000", headerRight: () => (cancelPost(navigation)) }}
                />
                <Stack.Screen
                    name="Rates"
                    component={Rates}
                    options={{ title: "Rates", headerBackTitleVisible: false, headerShown: true, headerTintColor: "#000", headerRight: () => (cancelPost(navigation)) }}
                />
                <Stack.Screen
                    name="RatePrices"
                    component={RatePrices}
                    options={{ title: "Price", headerBackTitleVisible: false, headerShown: true, headerTintColor: "#000", headerRight: () => (cancelPost(navigation)) }}
                />
                <Stack.Screen
                    name="ItemCalendar"
                    component={ItemCalendar}
                    options={{ title: "Availability", headerBackTitleVisible: false, headerShown: true, headerTintColor: "#000", headerRight: () => (cancelPost(navigation))  }}
                />
                <Stack.Screen
                    name="BlockTimeCard"
                    component={BlockTimeCard}
                    options={{ headerShown: true }}
                />
                <Stack.Screen
                    name="MyCalendar"
                    component={MyCalendar}
                    options={{ title: "Availability", headerBackTitleVisible: false, headerShown: true, headerTintColor: "#000", headerRight: () => (cancelPost(navigation))  }}
                />
                <Stack.Screen
                    name="CancellationPolicy"
                    component={CancellationPolicy}
                    options={{ title: "Policy", headerBackTitleVisible: false, headerShown: true, headerTintColor: "#000", headerRight: () => (cancelPost(navigation)) }}
                />
                <Stack.Screen
                    name="FinishListing"
                    component={FinishListing}
                    options={{ title: "Finish", headerBackTitleVisible: false, headerShown: true, headerTintColor: "#000", headerRight: () => (cancelPost(navigation)) }}
                />
            </Stack.Navigator>
        );
    };

    const cancelPost = (navigation) => (
        <TouchableOpacity onPress={() => navigation.navigate("PostScreen")}>
            <Text style={{ color: "#24a0ed", fontSize: 10 }}>Cancel</Text>
        </TouchableOpacity>
    )

    const cancelSearch = (navigation) => (
        <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
            <Text style={{ color: "#24a0ed", fontSize: 10 }}>Cancel</Text>
        </TouchableOpacity>
    )

    const getTabBarVisibility = (route) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        console.log(route.name);
        console.log(routeName);
        if (routeName == "SearchSpan") {
            return 'none';
        }
        if (routeName == "SearchTime") {
            return 'none';
        }
        if (routeName == "SearchResults") {
            return 'none';
        }
        if (routeName == "SearchDates") {
            return 'none';
        }
        if (routeName == "Photos") {
            return 'none';
        }
        if (routeName == "Details") {
            return 'none';
        }
        if (routeName == "Rates") {
            return 'none';
        }
        if (routeName == "RatePrices") {
            return 'none';
        }
        if (routeName == "ItemCalendar") {
            return 'none';
        }
        if (routeName == "MyCalendar") {
            return 'none';
        }
        if (routeName == "CancellationPolicy") {
            return 'none';
        }
        if (routeName == "FinishListing") {
            return 'none';
        }
        return 'flex';
    };


    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: { backgroundColor: '#fff' },
                tabBarInactiveTintColor: '#949494',
                tabBarActiveTintColor: 'navy',
            }}>
            <Tab.Screen
                name="Home"
                options={({ route }) => ({
                    tabBarStyle: {
                        display: getTabBarVisibility(route),
                        backgroundColor: '#fff',
                    },
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" color={color} size={size - 4} />
                    ),
                })}
            >
                {({ navigation }) => HomeStack(navigation)}
            </Tab.Screen>
            <Tab.Screen
                name="Post"
                options={({ route }) => ({
                    tabBarStyle: {
                        display: getTabBarVisibility(route),
                        backgroundColor: '#fff',
                    },
                    tabBarBadge: 3,
                    tabBarBadgeStyle: { backgroundColor: 'navy', position: 'absolute', paddingBottom: 12, flexDirection: 'column', flexWrap: 'wrap', paddingVertical: 0, borderBottomWidth: 10, right: 10, width: 20, top: -5, height: 18, fontSize: 9, textAlignVertical: 'top', padding: -5, alignItems: 'flex-start', justifyContent: 'center' },
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="camera-outline" color={color} size={size - 3} />
                    ),
                })}
            >
                {({ navigation }) => PostStack(navigation)}
            </Tab.Screen>
            <Tab.Screen
                name="Listings"
                component={Listings}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Octicons name="checklist" color={color} size={size - 6} />
                    ),
                }}
            />
            <Tab.Screen
                name="Account"
                component={ManageAccount}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-circle-outline" color={color} size={size - 3} />
                    ),
                }}
            />
        </Tab.Navigator>
    );

}

//{({ navigation }) => PostStack(navigation)}
