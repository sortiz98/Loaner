import React, { useState, useLayoutEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Pressable, Button, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import AppStyles from '../styles/AppStyles';

import { setDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase-config";

import { MaterialIcons } from '@expo/vector-icons';
import { numInput } from '../components/HelperFunctions';

export default function SearchSpan({ navigation, route }) {

    const r1 = "hour";
    const r2 = "day";
    const r3 = "week";
    const r4 = "month";

    const rate = ("rate" in route.params) ? route.params.rate : r1;
    const initial_amount = ("amount" in route.params) ? route.params.amount : 3;

    const [selectedRate, setSelectedRate] = useState(rate);

    const [stateHourly, setStateHourly] = useState((selectedRate == r1) ? AppStyles.activeRateOptionButton : AppStyles.inactiveRateOptionButton);
    const [stateDaily, setStateDaily] = useState((selectedRate == r2) ? AppStyles.activeRateOptionButton : AppStyles.inactiveRateOptionButton);
    const [stateWeekly, setStateWeekly] = useState((selectedRate == r3) ? AppStyles.activeRateOptionButton : AppStyles.inactiveRateOptionButton);
    const [stateMonthly, setStateMonthly] = useState((selectedRate == r4) ? AppStyles.activeRateOptionButton : AppStyles.inactiveRateOptionButton);
    
    const [amount, setAmount] = useState(initial_amount);
    const searchTitle = route.params.searchQuery;

    useLayoutEffect(() => {
        navigation.setOptions({
            title: searchTitle,
        });
    }, [searchTitle]);

    const updateStates = (r) => {
        setStateHourly(AppStyles.inactiveRateOptionButton);
        setStateDaily(AppStyles.inactiveRateOptionButton);
        setStateWeekly(AppStyles.inactiveRateOptionButton);
        setStateMonthly(AppStyles.inactiveRateOptionButton);

        switch (r) {
            case r2:
                setStateDaily(AppStyles.activeRateOptionButton);
                break;
            case r3:
                setStateWeekly(AppStyles.activeRateOptionButton);
                break;
            case r4:
                setStateMonthly(AppStyles.activeRateOptionButton);
                break;
            default:
                setStateHourly(AppStyles.activeRateOptionButton);
        }

        setSelectedRate(r);
    }

    const rateOptionButton = (optionTitle, style, r) => {
        return (
            <View style={[AppStyles.topMargin, AppStyles.centered]}>
                <TouchableOpacity style={[style]} onPress={() => { updateStates(r) }}>
                    <Text style={[AppStyles.darkBoldText, AppStyles.topMargin, AppStyles.centered]}>{optionTitle}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const displayViews = ({item}) => {
        return (
            <View>
                <Text style={[AppStyles.darkHeaderText18, AppStyles.topMargin10]}>How long do you need it?</Text>
                <Text style={[AppStyles.darkText13, AppStyles.topMarginMedium, AppStyles.bottomMargin]}>Select a rate...</Text>
                {rateOptionButton("Hourly", stateHourly, r1)}
                {rateOptionButton("Daily", stateDaily, r2)}
                {rateOptionButton("Weekly", stateWeekly, r3)}
                {rateOptionButton("Monthly", stateMonthly, r4)}
                <Text style={[AppStyles.darkText13, AppStyles.topMargin35]}>Specify an amount...</Text>
                <View style={[{ flexDirection: "row" }, AppStyles.topMargin, AppStyles.bottomMargin]}>
                    <TextInput
                        style={[AppStyles.timeTextInput, { fontSize: 18, fontWeight: "bold", color: "rgba(0, 0, 0, 0.8)" }]}
                        onChangeText={newAmount => numInput(newAmount, setAmount)}
                        placeholder={amount + ""}
                        keyboardType="number-pad"
                        maxLength={5}
                        returnKeyType="done"
                        textAlign="center"
                    />
                    <Text style={[AppStyles.topMargin, AppStyles.centered, { marginLeft: 20, marginBottom: 10, fontSize: 12.6, fontWeight: "400", color: "rgba(0, 0, 0, 0.7)" }]}>{selectedRate + "s"}</Text>
                </View>
            </View>
        );
    }


    return (
        <View style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 20
        }}>
            <View style={{ flex: 8, padding: 5 }}>
                 <KeyboardAvoidingView
                    style={AppStyles.whiteBackground}
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    keyboardVerticalOffset={230}>
                    <FlatList
                        data={[{}]}
                        renderItem={displayViews}
                    />
                </KeyboardAvoidingView>
            </View>
            <View style={[{ flex: 1, alignSelf: 'center', justifyContent: 'center' }]}>
                <Pressable style={[AppStyles.buttonBlue, AppStyles.bottomMargin8]} onPress={() => { navigation.navigate("SearchDates", { ...route.params, ...{ rate: selectedRate, amount: amount } }) }}>
                    <Text style={AppStyles.buttonLightText}>Next</Text>
                </Pressable>
            </View>
        </View>
    );

}

