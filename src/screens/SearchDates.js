import React, { useState, useLayoutEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Pressable, Button, TextInput, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import AppStyles from '../styles/AppStyles';

import { setDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase-config";

import { MaterialIcons } from '@expo/vector-icons';
import WixCalendar from '../components/WixCalendar';
import { getDateString, searchListings } from '../components/HelperFunctions';

export default function SearchDates({ navigation, route }) {

    const markStyle = { customStyles: { container: { backgroundColor: 'rgba(80, 107, 174, 0.2)', borderRadius: 0, borderColor: 'rgba(80, 107, 174, 1)' } } };
    const initialMarkedDate = ("markedDate" in route.params) ? { [route.params.markedDate]: markStyle } : {};
    const searchTitle = route.params.searchQuery;
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [flexible, setFlexible] = useState(("flexible" in route.params)? route.params.flexible : false);
    const [markedDate, setMarkedDate] = useState(initialMarkedDate);
    const today = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 1);
    maxDate.setMonth(today.getMonth() - 1);

    const goBack = (navigation) => (
        <TouchableOpacity style={{ marginLeft: -10 }} onPress={() => navigation.navigate("SearchSpan", getParams())}>
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
        searchListings({searchQuery: searchTitle});
        const keys = Object.keys(markedDate);
        const dateMarked = (keys.length == 0) ? null : keys[0];
        return { ...route.params, ...{ markedDate: dateMarked, flexible: flexible } };
    }

    const displaySwitch = () => {
        return (
            <View style={{marginBottom: 25, marginTop: 20, flexDirection: "column"}}>
                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: 30, position: 'absolute', alignSelf: 'center', width: windowWidth - 50, height: 40 }}></View>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', width: (windowWidth - 50) / 2 }}>
                            {!flexible && <View style={{ backgroundColor: 'rgba(255, 255, 255, 1)', width: (windowWidth - 50) / 2, height: 35, alignSelf: 'flex-start', borderRadius: 30, marginTop: 2.5, marginLeft: 2.5 }}></View>}
                        </View>
                        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', width: (windowWidth - 50) / 2}}>
                            {flexible && <View style={{ backgroundColor: 'rgba(255, 255, 255, 1)', width: (windowWidth - 50) / 2, height: 35, alignSelf: 'flex-end', borderRadius: 30, marginTop: 2.5, marginRight: 2.5 }}></View>}
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", position: "absolute" }}>
                        <TouchableOpacity style={{ justifyContent: 'flex-start', alignItems: 'flex-start', width: (windowWidth - 50) / 2 }} onPress={()=>setFlexible(false)}>
                            <Text style={{ alignSelf: 'center', color: 'rgba(0, 0, 0, 0.8)', fontSize: 12.5, marginTop: 10 }}>Choose a date</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ justifyContent: 'flex-end', alignItems: 'flex-end', width: (windowWidth - 50) / 2 }} onPress={() => setFlexible(true)}>
                            <Text style={{ alignSelf: 'center', color: 'rgba(0, 0, 0, 0.8)', fontSize: 12.5, marginTop: 10, marginBottom: 0 }}>I'm flexible</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    const onDaySelect = (day) => {
        setMarkedDate({
            [day.dateString]: {
                customStyles: {
                    container: {
                        backgroundColor: 'rgba(80, 107, 174, 0.2)',
                        borderRadius: 0,
                        borderColor: 'rgba(80, 107, 174, 1)'
                    }
                }
            }});
    }

    const next = () => {
        const params = getParams();
        if (flexible) {
            navigation.navigate("SearchResults", params);
        } else {
            (params.markedDate != null) ? navigation.navigate("SearchTime", getParams()) : alert("Select a date");
        }
    }


    return (
        <View style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 20
        }}>
            <View style={{ flex: 8, padding: 5 }}>
                <Text style={[AppStyles.darkHeaderText18, AppStyles.topMargin10]}>When do you need it?</Text>
                {displaySwitch()}              
                <View style={[AppStyles.searchCalendarCover, AppStyles.topMargin10]}>
                    <View style={[AppStyles.line]}></View>
                    <CalendarList
                        markingType={'custom'}
                        minDate={getDateString(today)}
                        maxDate={getDateString(maxDate)}
                        pastScrollRange={0}
                        futureScrollRange={11}
                        onDayPress={onDaySelect}
                        markedDates={markedDate}
                        theme={{ 'stylesheet.day.basic': { today: { borderRadius: 0 }, todayText: { color: "#000" }, base: { borderWidth: 0.3, alignItems: 'center', justifyContent: 'center', flex: 1, minWidth: 43, minHeight: 43 } } }}
                    />
                    {flexible && <View style={{ position: 'absolute', backgroundColor: 'rgba(255, 255, 255, 0.75)', width: windowWidth, height: windowHeight * 0.56, alignSelf: 'center' }}></View>}
                    <View style={[AppStyles.line]}></View>
                </View>
            </View>
            <View style={[{ flex: 1, alignSelf: 'center', justifyContent: 'center' }]}>
                <Pressable style={[AppStyles.buttonBlue, AppStyles.bottomMargin8]} onPress={next}>
                    <Text style={AppStyles.buttonLightText}>Next</Text>
                </Pressable>
            </View>
        </View>
    );

}

