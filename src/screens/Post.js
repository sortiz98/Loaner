import React, { useState } from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import AppStyles from '../styles/AppStyles';
import { setDoc, doc, collection, addDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { MaterialIcons } from '@expo/vector-icons';

export default function Post({ navigation, route }) {

    return (
        <View style={{flex: 1, backgroundColor: '#fff', padding: 30 }}>
            <Text style={[AppStyles.darkHeaderText, AppStyles.topMarginMedium]}>Create Listing</Text>
            <Text style={[{ fontSize: 13, color: "#777" }, AppStyles.topMargin10, AppStyles.bottomMarginMedium]}>I want to list an...</Text>
            <View style={[AppStyles.topMargin]}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity style={[AppStyles.listingOptionButton, { width: 330 }]} onPress={() => { navigation.navigate("Photos", { completion: 0, data: { isService: false } }); }}>
                        <Text style={[AppStyles.darkBoldText, AppStyles.topMargin, AppStyles.centered]}>Item</Text>
                    </TouchableOpacity>
                    <View style={{ marginLeft: -35, marginTop: 8 }}>
                        <MaterialIcons name="keyboard-arrow-right" size={36} color="#506BAE" />
                    </View>
                </View>
            </View>
            <View style={[AppStyles.topMargin]}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity style={[AppStyles.listingOptionButton, { width: 330 }]} onPress={() => { console.log("NO SERVICE") }}>
                        <Text style={[AppStyles.darkBoldText, AppStyles.topMargin, AppStyles.centered]}>Service</Text>
                    </TouchableOpacity>
                    <View style={{ marginLeft: -35, marginTop: 8 }}>
                        <MaterialIcons name="keyboard-arrow-right" size={36} color="#506BAE" />
                    </View>
                </View>
            </View>
        </View>
    );
}


// navigation.navigate("Photos", { completion: 0, data: { isService: false } }); }}>


//<TouchableOpacity style={[AppStyles.listingOptionButton]} onPress={() => { console.log("NO SERVICE") }}>
//    <Text style={[AppStyles.darkBoldText, AppStyles.topMargin, AppStyles.centered]}>Service</Text>
//</TouchableOpacity>