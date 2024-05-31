import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import AppStyles from '../styles/AppStyles';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { Octicons } from '@expo/vector-icons';

export default function Home({ navigation, route }) {

    const [viewList, setViewList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const size = ((windowWidth - 20) / 3);

    const curr_weekday = 0;
    const curr_month = 0;
    const curr_day = 0

    const hours = 0;
    const days = 0;
    const weeks = 0;
    const months = 0;

    const getUnits = (rate, amount) => {
        switch (rate) {
            case "hour":
                break;
            case "day":
                break;
            case "week":
                break;
            case "month":
                break;
            default:
                console.log("RATE NOT VALID");
        }
    }

    const itemAvailability = () => {
        if (curr_weekday in calendar.weekly && calendar.weekly[curr_weekday] == "full") {
            return null;
        }
        if (months > 0 || weeks > 0) {
            // if calendary.weekly non empty return null
        }
        i = 1;
        while (i < days) {
            const day = (curr_weekday + i) % 7;
            if (day in calendar.weekly) {
                return null;
            }
            i += 1;
        }
        const day = (curr_weekday + i) % 7;
        if (day in calendar.weekly && calendar.weekly[day] == "full") {
            return null;
        }
        i = 1;
        while (i < months) {
            const month = (curr_month + i) % 12;
            if (Object.keys(calendar.markedDates[month]).length > 0) {
                return null;
            }
            i += 1;
        }



        if (/*Span of time in same month*/) {
            // if start date == end date: if "full" return null; if "semi" if (calc available blocks and at least one is >= hours) {return blocks >= hours} else {return null}
            // check that start and end dates are not "full"; check that days in between are not in weekly or marked dates
        } else {
            // check that Object.keys(calendar.markedDates[month]).length == 0 else return null
            // between start date and end of month: check that days are not in weekly or marked dates. check that start date is not "full"
            // between start of month and end date: check that days are not in weekly or marked dates. check that end date is not "full"
        }
        // if start date "semi", calculate first available time F (last end time in blocks); else 0
        // if end date not "semi" return F, 23.5; else return F and calculated last available time L (first start time in blocks)

        // if (F + hours) > 24 { F + hours % 24 > L return null else return min(hours, L) } else {}

    }



    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flex: 1, marginTop: 65 }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ marginRight: -40, marginLeft: 20, marginTop: 13 }}>
                        <Octicons name="search" size={20} color="black" />
                    </View>
                    <TextInput
                        style={[{ fontSize: 13, width: windowWidth - 20 }, AppStyles.searchTextInput]}
                        onChangeText={newText => setSearchQuery(newText)}
                        placeholder="What are you looking for?"
                        placeholderTextColor="#777"
                        maxLength={30}
                        returnKeyType='search'
                        textAlign="center"
                        onSubmitEditing={input => navigation.navigate("SearchSpan", { searchQuery: searchQuery })}
                    />
                </View>
                
                <View style={[AppStyles.fullLine, AppStyles.bottomMarginSmall, AppStyles.topMargin10]}></View>
            </View>
            <View style={[{ flex: 9.5, padding: 10 }]}>
                <FlatList
                    data={viewList}
                    renderItem={addView}
                />
            </View>
        </View>
    );
}

// <Text style={[{ fontSize: 13, color: "#777" }]}>What are you looking for?</Text> {createFlatList()}