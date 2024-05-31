import React, { useState, useLayoutEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Pressable, Button, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import AppStyles from '../styles/AppStyles';

import { setDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase-config";

import { MaterialIcons } from '@expo/vector-icons';
import { compareTimes } from '../components/HelperFunctions';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import App from '../../App';

export default function SearchTime({ navigation, route }) {

    const initialTime = new Date(0, 0, 0, 12, 0);
    const [time, setTime] = useState(("time" in route.params) ? route.params.time : initialTime);
    const [pickerVisible, setPickerVisible] = useState(false);
    const hours = (route.params.rate == "hour") ? route.params.amount % 24 : null;
    const searchTitle = route.params.searchQuery;
    const startHour = (hours == null) ? 6 : (hours < 18) ? 6 + hours : 12 - (hours % 18);
    const endHour = (hours == null) ? 23.5 : (hours < 7) ? 23.5 - hours : 23.5;
    const startBound = new Date(0, 0, 0, startHour, 0);
    const endBound = new Date(0, 0, 0, Math.floor(endHour), 30);
  

    const goBack = (navigation) => (
        <TouchableOpacity style={{ marginLeft: -10 }} onPress={() => navigation.navigate("SearchDates", getParams())}>
            <MaterialIcons name="keyboard-arrow-left" size={36} color="black" />
        </TouchableOpacity>
    )

    useLayoutEffect(() => {
        navigation.setOptions({
            title: searchTitle,
            headerLeft: () => (goBack(navigation)),
        });
    }, [searchTitle, goBack]);

    const getParams = () => {
        return { ...route.params, ...{ time: time } };
    }

    const onTimeConfirm = (t) => {
        setConfirmedTime(t);
        setPickerVisible(false);
    }


    const setConfirmedTime = (t) => {
        if (compareTimes(t, endBound)) {
            setTime(endBound);
        } else if (compareTimes(startBound, t)) {
            setTime(startBound);
        } else {
            setTime(t);
        }
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 20
        }}>
            <View style={{ flex: 8, padding: 5 }}>
                <Text style={[AppStyles.darkHeaderText18, AppStyles.topMargin10]}>What time?</Text>
                <Text style={[AppStyles.darkText13, AppStyles.topMargin]}>Select a time for pick-up</Text>
                <TouchableOpacity style={AppStyles.topMargin50} onPress={() => setPickerVisible(true)}>
                    <View style={[AppStyles.timeTextInput]}></View>
                    <Text style={{ alignSelf: 'center', position: 'absolute', marginTop: 27, fontSize: 18, color: 'rgba(0,0,0,0.65)', fontWeight: '600' }}>{time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={pickerVisible}
                    mode="time"
                    onConfirm={onTimeConfirm}
                    onCancel={() => { setPickerVisible(false) }}
                />
            </View>
            <View style={[{ flex: 1, alignSelf: 'center', justifyContent: 'center' }]}>
                <Pressable style={[AppStyles.buttonBlue, AppStyles.bottomMargin8]} onPress={() => { navigation.navigate("SearchResults", getParams()) }}>
                    <Text style={AppStyles.buttonLightText}>Next</Text>
                </Pressable>
            </View>
        </View>
    );

}

