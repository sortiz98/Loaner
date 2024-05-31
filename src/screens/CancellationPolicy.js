import React, { useState, useLayoutEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Pressable, Button, TextInput, TouchableOpacity } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import AppStyles from '../styles/AppStyles';

import { setDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase-config";

import { displayProgressTabs } from '../components/HelperFunctions';
import { MaterialIcons } from '@expo/vector-icons';

export default function CancellationPolicy({ navigation, route }) {


    const completion = Math.max(route.params.completion, 5);
    const data = route.params.data;

    const p1 = "24 Hour";
    const p2 = "Three Day";
    const p3 = "Full Week";

    const [selectedPolicy, setSelectedPolicy] = useState(("policy" in data)? data.policy : p1);

    const [state24Hour, setState24Hour] = useState((selectedPolicy == p1) ? AppStyles.activeBubbleButton : AppStyles.inactiveBubbleButton);
    const [stateThreeDay, setStateThreeDay] = useState((selectedPolicy == p2) ? AppStyles.activeBubbleButton : AppStyles.inactiveBubbleButton);
    const [stateFullWeek, setStateFullWeek] = useState((selectedPolicy == p3) ? AppStyles.activeBubbleButton : AppStyles.inactiveBubbleButton);

    const goBack = (navigation) => (
        <TouchableOpacity style={{ marginLeft: -10 }} onPress={() => navigation.navigate("MyCalendar", { data: { ...data, ...{ policy: selectedPolicy } }, completion: completion })}>
            <MaterialIcons name="keyboard-arrow-left" size={36} color="black" />
        </TouchableOpacity>
    )

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (goBack(navigation)),
        });
    }, [navigation, goBack]);

    //const writePolicy = async () => {
    //    await getDoc(listing)
    //        .then((snapshot) => {
    //            if (snapshot.exists && snapshot.data()) {
    //                const data = snapshot.data();
    //                data.policy = selectedPolicy;
    //                setDoc(route.params.listing, data)
    //                    .then(() => {})
    //                    .catch((error) => { console.log(error.message) });
    //            } else {
    //                console.log("NO LISTING");
    //            }
    //        })
    //        .catch((error) => { console.log(error.message) });
    //}

    const updateStates = (optionTitle) => {
        setState24Hour(AppStyles.inactiveBubbleButton);
        setStateThreeDay(AppStyles.inactiveBubbleButton);
        setStateFullWeek(AppStyles.inactiveBubbleButton);

        switch (optionTitle) {
            case p2:
                setStateThreeDay(AppStyles.activeBubbleButton);
                break;
            case p3:
                setStateFullWeek(AppStyles.activeBubbleButton);
                break;
            default:
                setState24Hour(AppStyles.activeBubbleButton);
        }

        setSelectedPolicy(optionTitle);
    }

    const optionButton = (optionTitle, description, style) => {
        return (
            <View style={[AppStyles.topMargin, AppStyles.centered]}>
                <TouchableOpacity style={[style]} onPress={() => { updateStates(optionTitle) }}>
                    <Text style={[AppStyles.darkBoldText, AppStyles.topMarginMedium, AppStyles.horizontalPadding20]}>{optionTitle}</Text>
                    <Text style={[AppStyles.smallDarkText, AppStyles.topMargin10, AppStyles.horizontalPadding20]}>{description}</Text>
                </TouchableOpacity>
            </View>
        );
    }



    return (
        <View style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 20
        }}>
            <View style={{ flex: 5 }}>
                <Text style={[AppStyles.darkHeaderText, AppStyles.topMarginMedium]}>Cancellation Policy</Text>
                <Text style={[AppStyles.darkText, AppStyles.topMargin10, AppStyles.bottomMarginMedium]}>Select a cancellation policy for your item</Text>
                {optionButton(p1 + " - Recommended", "Reservation may be cancelled up to 24 hours before hand-off time for a full refund", state24Hour)}
                {optionButton(p2, "Reservation may be cancelled up to 3 days before hand-off time for a full refund", stateThreeDay)}
                {optionButton(p3, "Reservation may be cancelled up to 7 days before hand-off time for a full refund", stateFullWeek)}
            </View>
            <View style={[{ flex: 1, alignSelf: 'center', justifyContent: 'center' }]}>
                {displayProgressTabs(navigation, { data: data, completion: completion })}
                <Pressable style={[AppStyles.buttonBlue, AppStyles.bottomMargin8]} onPress={() => { navigation.navigate("FinishListing", { data: { ...data, ...{ policy: selectedPolicy } }, completion: completion }); }}>
                    <Text style={AppStyles.buttonLightText}>Next</Text>
                </Pressable>
            </View>
        </View>
    );

}

