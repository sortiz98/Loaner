import React, { useState, useLayoutEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Pressable, Button, TextInput, TouchableOpacity } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import AppStyles from '../styles/AppStyles';

import { setDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase-config";

import WixCalendar from '../components/WixCalendar';
import { displayProgressTabs } from '../components/HelperFunctions';
import { MaterialIcons } from '@expo/vector-icons';

export default function MyCalendar({ navigation, route }) {

    const completion = Math.max(route.params.completion, 4);
    const data = route.params.data;
    const [myCalendarData, setMyCalendarData] = useState(("myCalendar" in data) ? data.myCalendar : { dateTimeBlocks: {}, weekly: {}, markedDates: {} });

    const goBack = (navigation) => (
        <TouchableOpacity style={{ marginLeft: -10 }} onPress={() => navigation.navigate("ItemCalendar", { data: { ...data, ...{ myCalendar: { ...myCalendarData } } }, completion: completion })}>
            <MaterialIcons name="keyboard-arrow-left" size={36} color="black" />
        </TouchableOpacity>
    )

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (goBack(navigation)),
        });
    }, [navigation, goBack]);

    return (
        <View style={AppStyles.container}>
            <KeyboardAvoidingView
                style={AppStyles.whiteBackground}
                behavior={Platform.OS === "ios" ? "padding" : null}
                keyboardVerticalOffset={0}>
                <Text style={[AppStyles.darkHeaderText, AppStyles.topMargin10]}>My Calendar</Text>
                <Text style={[AppStyles.darkText, AppStyles.topMargin10, AppStyles.bottomMarginMedium]}>When are you unavailable for hand-off? Tap on dates to block and unblock them . Double tap to block off hours</Text>
                <View style={[AppStyles.lineTop]}></View>

                <View style={[AppStyles.calendarCover, AppStyles.topMargin10]}>
                    <WixCalendar navigation={navigation} modalText={"Block out time frames when you are not available to hand-off or retreive your item. Include sleep!"} updateDataFunction={setMyCalendarData} calendarData={{ ...myCalendarData }} longDayEnabled={true} />
                </View>
                <View style={[AppStyles.line]}></View>
                <View style={[AppStyles.topMarginMedium]}>
                    {displayProgressTabs(navigation, { data: data, completion: completion })}
                    <Pressable style={[AppStyles.buttonBlue, AppStyles.bottomMarginMedium]} onPress={() => { navigation.navigate("CancellationPolicy", { data: { ...data, ...{ myCalendar: { ...myCalendarData } } }, completion: completion }); }}>
                        <Text style={AppStyles.buttonLightText}>Next</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );

}

