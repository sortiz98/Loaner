import React, { useState, useLayoutEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Pressable, Button, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import AppStyles from '../styles/AppStyles';

import { setDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase-config";

import { numInput, displayProgressTabs } from '../components/HelperFunctions';
import { MaterialIcons } from '@expo/vector-icons';


export default function RatePrices({ navigation, route }) {

    const completion = Math.max(route.params.completion, 3);
    const data = route.params.data;
    const rates = data.rates;

    const [priceHourly, setPriceHourly] = useState(rates.hour);
    const [priceDaily, setPriceDaily] = useState(rates.day);
    const [priceWeekly, setPriceWeekly] = useState(rates.week);
    const [priceMonthly, setPriceMonthly] = useState(rates.month);

    const goBack = (navigation) => (
        <TouchableOpacity style={{ marginLeft: -10 }} onPress={() => navigation.navigate("Rates", { data: { ...data, ...{ rates: getPriceDict() } }, completion: completion })}>
            <MaterialIcons name="keyboard-arrow-left" size={36} color="black" />
        </TouchableOpacity>
    )

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (goBack(navigation)),
        });
    }, [navigation, goBack]);

    //const readRates = async () => {
    //    await getDoc(listing)
    //        .then((snapshot) => {
    //            if (snapshot.exists && snapshot.data()) {
    //                let data = snapshot.data();
    //                data.rates = route.params.rates;
    //                setListingData(data);
    //            } else {
    //                console.log("NO LISTING");
    //            }
    //        })
    //        .catch((error) => { console.log(error.message) });
    //}

    //const writePrices = async () => {
    //    const updatedData = { ...listingData, ...{ rates: getPriceDict() } }
    //    setDoc(listing, updatedData)
    //        .then(() => { })
    //        .catch((error) => { console.log(error.message) });
    //}

    const getPriceDict = () => {
        let priceDict = {};
        if ("hour" in rates) {
            priceDict.hour = priceHourly;
        }
        if ("day" in rates) {
            priceDict.day = priceDaily;
        }
        if ("week" in rates) {
            priceDict.week = priceWeekly;
        }
        if ("month" in rates) {
            priceDict.month = priceMonthly;
        }
        return priceDict;
    }

    const priceTextInput = (inputTitle, updateFunction, price, rate) => {
        const active = (rate in rates);
        const placeholderText = (active) ? "0" : "";
        const stateColor = (active) ? "#000" : "#7777";
        return (
            <View>
                <Text style={[{ color: stateColor, fontWeight: "bold", fontSize: 16 }, AppStyles.topMargin]}>{inputTitle}</Text>
                <View style={[{ flexDirection: "row" }, AppStyles.centered, AppStyles.topMargin10, AppStyles.bottomMargin]}>
                    <Text style={[AppStyles.darkBoldText, AppStyles.topMargin, AppStyles.centered, { marginRight: 20, marginBottom: 10, color: stateColor }]}>$</Text>
                    <TextInput
                        style={[AppStyles.rateTextInput, AppStyles.centered, { fontSize: 18, fontWeight: "bold", color: "rgba(0, 0, 0, 0.6)"}]}
                        onChangeText={newPrice => numInput(newPrice, updateFunction)}
                        placeholder={placeholderText}
                        placeholderTextColor="#7777"
                        editable={active}
                        keyboardType="number-pad"
                        maxLength={5}
                        returnKeyType="done"
                        textAlign="center"
                    />
                    <Text style={[AppStyles.topMargin, AppStyles.centered, { marginLeft: 20, marginBottom: 10, fontSize: 10, fontWeight: "bold", color: stateColor }]}>{"/ " + rate}</Text>
                </View>
            </View>
        );
    }

    //readRates();
    //console.log(listingData);


    const displayViews = ({ item }) => {
        return (
            <View>
                {priceTextInput("Hourly Price", setPriceHourly, priceHourly, "hour")}
                <View style={[AppStyles.line]}></View>
                {priceTextInput("Daily Price", setPriceDaily, priceDaily, "day")}
                <View style={[AppStyles.line]}></View>
                {priceTextInput("Weekly Price", setPriceWeekly, priceWeekly, "week")}
                <View style={[AppStyles.line]}></View>
                {priceTextInput("Monthly Price", setPriceMonthly, priceMonthly, "month")}
            </View>
        );
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 20
        }}>
            <View style={{ flex: 5, padding: 5 }}>
                 <KeyboardAvoidingView
                    style={AppStyles.whiteBackground}
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    keyboardVerticalOffset={300}>
                    <FlatList
                        data={[{}]}
                        renderItem={displayViews}
                    />
                 </KeyboardAvoidingView>
            </View>
            <View style={[{ flex: 1, alignSelf: 'center', justifyContent: 'center' }]}>
                {displayProgressTabs(navigation, { data: data, completion: completion })}
                <Pressable style={[AppStyles.buttonBlue, AppStyles.bottomMargin8]} onPress={() => { navigation.navigate("ItemCalendar", { data: { ...data, ...{ rates: getPriceDict() } }, completion: completion }); }}>
                    <Text style={AppStyles.buttonLightText}>Next</Text>
                </Pressable>
            </View>
        </View>
    );

}

