import React, { useState, useLayoutEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Pressable, Button, TextInput, TouchableOpacity } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import AppStyles from '../styles/AppStyles';

import { setDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase-config";

import { displayProgressTabs } from '../components/HelperFunctions';
import { MaterialIcons } from '@expo/vector-icons';

export default function Rates({ navigation, route }) {

    const completion = Math.max(route.params.completion, 2.5);
    const data = route.params.data;

    const rates = ("rates" in data) ? data.rates : { "hour": 0, "day": 0 };

    console.log("RATES");
    console.log(rates);

    const [hourIsSelected, setHourIsSelected] = useState("hour" in rates);
    const [dayIsSelected, setDayIsSelected] = useState("day" in rates);
    const [weekIsSelected, setWeekIsSelected] = useState("week" in rates);
    const [monthIsSelected, setMonthIsSelected] = useState("month" in rates);

    const [hourStyle, setHourStyle] = useState(hourIsSelected ? AppStyles.activeRateOptionButton : AppStyles.inactiveRateOptionButton);
    const [dayStyle, setDayStyle] = useState(dayIsSelected ? AppStyles.activeRateOptionButton : AppStyles.inactiveRateOptionButton);
    const [weekStyle, setWeekStyle] = useState(weekIsSelected ? AppStyles.activeRateOptionButton : AppStyles.inactiveRateOptionButton);
    const [monthStyle, setMonthStyle] = useState(monthIsSelected ? AppStyles.activeRateOptionButton : AppStyles.inactiveRateOptionButton);

    const goBack = (navigation) => (
        <TouchableOpacity style={{marginLeft: -10}} onPress={() => navigation.navigate("Details", { data: { ...data, ...{ rates: getRatesDict() } }, completion: completion })}>
            <MaterialIcons name="keyboard-arrow-left" size={36} color="black" />
        </TouchableOpacity>
    )

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (goBack(navigation)),
        });
    }, [navigation, goBack]);


    const getRatesDict = () => {
        let rateDict = {};
        if (hourIsSelected) {
            rateDict.hour = 0;
        }
        if (dayIsSelected) {
            rateDict.day = 0;
        }
        if (weekIsSelected) {
            rateDict.week = 0;
        }
        if (monthIsSelected) {
            rateDict.month = 0;
        }
        return rateDict;
    }

    const updateSelection = (setStyle, isSelected, setIsSelected) => {
        if (isSelected) {
            setIsSelected(false);
            //delete rates[optionTitle.toLowerCase()];
            setStyle(AppStyles.inactiveRateOptionButton);
        } else {
            setIsSelected(true);
            //rates[optionTitle.toLowerCase()] = 0;
            setStyle(AppStyles.activeRateOptionButton);
        }
    }

    const rateOptionButton = (optionTitle, style, setStyle, isSelected, setIsSelected) => {
        return (
            <View style={[AppStyles.topMargin, AppStyles.centered]}>
                <TouchableOpacity style={[style]} onPress={() => { updateSelection(setStyle, isSelected, setIsSelected) }}>
                    <Text style={[AppStyles.darkBoldText, AppStyles.topMargin, AppStyles.centered]}>{optionTitle}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const displayTabs = (comp) => {
        return (
            <View style={{ flexDirection: "row" }}>
                {displayProgressTab("1. Photo", 1, comp, () => navigation.navigate("Photos", route.params))}
                {displayProgressTab("2. Detail", 2, comp, () => navigation.navigate("Details", route.params))}
                {displayProgressTab("3. Rates", 3, comp, () => navigation.navigate("Rates", route.params))}
                {displayProgressTab("4. Aval.", 4, comp, () => navigation.navigate("ItemCalendar", route.params))}
                {displayProgressTab("5. Policy", 5, comp, () => navigation.navigate("CancellationPolicy", route.params))}
                {displayProgressTab("6. Finish", 6, comp, () => navigation.navigate("FinishListing", route.params))}
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
                <Text style={[AppStyles.darkHeaderText, AppStyles.topMargin10]}>Rate Options</Text>
                <Text style={[AppStyles.darkText, AppStyles.topMargin10, AppStyles.bottomMarginMedium]}>Select the rate options you would like to offer for your listing below You may select one or more.</Text>
                {rateOptionButton("Hourly", hourStyle, setHourStyle, hourIsSelected, setHourIsSelected)}
                {rateOptionButton("Daily", dayStyle, setDayStyle, dayIsSelected, setDayIsSelected)}
                {rateOptionButton("Weekly", weekStyle, setWeekStyle, weekIsSelected, setWeekIsSelected)}
                {rateOptionButton("Monthly", monthStyle, setMonthStyle, monthIsSelected, setMonthIsSelected)}
            </View>
            <View style={[{ flex: 1, alignSelf: 'center', justifyContent: 'center' }]}>
                {displayProgressTabs(navigation, { data: data, completion: completion })}
                <Pressable style={[AppStyles.buttonBlue, AppStyles.bottomMargin8]} onPress={() => { if (Object.keys(rates).length == 0) { alert("Select at least one option") } else { navigation.navigate("RatePrices", { data: { ...data, ...{ rates: getRatesDict() } }, completion: completion }); } }}>
                    <Text style={AppStyles.buttonLightText}>Next</Text>
                </Pressable>
            </View>
        </View>
    );

}

