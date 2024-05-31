import React, { useState, useLayoutEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Pressable, Button, TextInput, TouchableOpacity } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import AppStyles from '../styles/AppStyles';

import { setDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase-config";

import WixCalendar from '../components/WixCalendar';
import { displayProgressTabs } from '../components/HelperFunctions';
import { MaterialIcons } from '@expo/vector-icons';

export default function ItemCalendar({ navigation, route }) {

    const completion = Math.max(route.params.completion, 3.5);
    const data = route.params.data;
    const [itemCalendarData, setItemCalendarData] = useState(("itemCalendar" in data) ? data.itemCalendar : { dateTimeBlocks: {}, weekly: {}, markedDates: {} });
    
    //const itemCalendarDoc = doc(listing, 'tabs', "itemCalendar");
    const goBack = (navigation) => (
        <TouchableOpacity style={{ marginLeft: -10 }} onPress={() => navigation.navigate("RatePrices", { data: { ...data, ...{ itemCalendar: { ...itemCalendarData } } }, completion: completion })}>
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
                <Text style={[AppStyles.darkHeaderText, AppStyles.topMargin10]}>Item Calendar</Text>
                <Text style={[AppStyles.darkText, AppStyles.topMargin10, AppStyles.bottomMarginMedium]}>Are there specific dates you would like to block out for your item? Tap on dates to block and unblock them. Press and hold to block off hours</Text>
                <View style={[AppStyles.lineTop]}></View>
                
                <View style={[AppStyles.calendarCover, AppStyles.topMargin10]}>
                    <WixCalendar navigation={navigation} modalText={"Block out time frames when you usually use your item"} updateDataFunction={setItemCalendarData} calendarData={{ ...itemCalendarData }} longDayEnabled={true} />
                </View>
                <View style={[AppStyles.line]}></View>
                <View style={[AppStyles.topMarginMedium]}>
                    {displayProgressTabs(navigation, { data: data, completion: completion })}
                    <Pressable style={[AppStyles.buttonBlue, AppStyles.bottomMarginMedium]} onPress={() => { navigation.navigate("MyCalendar", { data: { ...data, ...{ itemCalendar: { ...itemCalendarData } } }, completion: completion }); }}>
                        <Text style={AppStyles.buttonLightText}>Next</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );

}
