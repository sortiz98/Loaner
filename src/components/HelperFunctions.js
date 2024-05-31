
import { View, Text, TouchableOpacity } from 'react-native';
import AppStyles from '../styles/AppStyles';
import { doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../firebase-config";
import { Lexer, Tagger } from 'pos';

export const searchListings = (params) => {
    //var pos = require('pos');
    const words = new Lexer().lex(params.searchQuery);
    const tagger = new Tagger();
    const taggedWords = tagger.tag(words);
    console.log("WORDS");
    console.log(taggedWords);
    //const q = query(citiesRef, where('title', 'array-contains-any', ['west_coast', 'east_coast']));

}

export const compareTimes = (t1, t2) => {
    if (t1.getHours() > t2.getHours()) {
        return true;
    }
    if (t1.getHours() == t2.getHours() && t1.getMinutes() > t2.getMinutes()) {
        return true;
    }
    return false;
}

export const getDateString = (date) => {
    let month = date.getMonth() + 1
    let day = date.getDate()

    let monthPrefix = 0
    if (month > 9) {
        monthPrefix = ''
    }

    let dayPrefix = 0
    if (day > 9) {
        dayPrefix = ''
    }

    return `${date.getFullYear()}-${monthPrefix}${month}-${dayPrefix}${day}`
}

export const moneyInput = (input, setMoneyValue, setDisplayMoneyValue, decimal = false) => {
    let parsed = input.split("$");
    let amount = "";
    parsed.forEach((segment) => {
        amount += segment;
    });
    setDisplayMoneyValue(amount);
    if (amount.charAt(0) == "0") {
        amount = amount.slice(1);
    }
    if (decimal) {
        amount = parseDecimal(amount);
    }
    setMoneyValue(amount);
}

export const numInput = (input, setNum) => {
    if (input.charAt(0) == "0") {
        input = amount.slice(1);
    }
    setNum(input);
}

export const parseDecimal = (input) => {
    let parsed = input.split(".", 2);
    if (parsed.length == 1) {
        return input;
    }
    let dollars = parsed[0];
    let cents = parsed[1];
    if (dollars.length == 0) {
        dollars = "0";
    }
    if (cents.length > 2) {
        cents = cents.slice(0, 2);
    }
    const total = dollars + "." + cents;

    return (total.length > 4)? dollars : total;
}


export const displayProgressTab = (displayText, index, activeIndex, navigationFunc) => {
  
    if (index == Math.ceil(activeIndex) && activeIndex % 1 != 0) {
        return (
            <TouchableOpacity style={AppStyles.imageButton} onPress={navigationFunc}>
                <View style={{ flexDirection: "row" }}>
                    <View style={[AppStyles.halfPostProgressTab, AppStyles.activeColor, AppStyles.roundedLeftCorners]}></View>
                    <View style={[AppStyles.halfPostProgressTab, AppStyles.inactiveColor, AppStyles.roundedRightCorners]}></View>
                </View>
                <Text style={[AppStyles.postProgressText, AppStyles.activeColor]}>{displayText}</Text>
            </TouchableOpacity>
        );
    } else if (index <= activeIndex) {
        return (
            <TouchableOpacity style={AppStyles.imageButton} onPress={navigationFunc}>
                <View style={[AppStyles.postProgressTab, AppStyles.activeColor]}></View>
                <Text style={[AppStyles.postProgressText, AppStyles.activeColor]}>{displayText}</Text>
            </TouchableOpacity>
        );
    } else {
        return (
            <TouchableOpacity style={AppStyles.imageButton} onPress={() => console.log("INACTIVE")}>
                <View style={[AppStyles.postProgressTab, AppStyles.inactiveColor]}></View>
                <Text style={[AppStyles.postProgressText, AppStyles.inactiveColor]}>{displayText}</Text>
            </TouchableOpacity>
        );
    }
}

export const displayProgressTabs = (navigation, params) => {
    const comp = params.completion;
    return (
        <View style={{ flexDirection: "row" }}>
            {displayProgressTab("1. Photo", 1, comp, () => navigation.navigate("Photos", params))}
            {displayProgressTab("2. Detail", 2, comp, () => navigation.navigate("Details", params))}
            {displayProgressTab("3. Rates", 3, comp, () => navigation.navigate("Rates", params))}
            {displayProgressTab("4. Aval.", 4, comp, () => navigation.navigate("ItemCalendar", params))}
            {displayProgressTab("5. Policy", 5, comp, () => navigation.navigate("CancellationPolicy", params))}
            {displayProgressTab("6. Finish", 6, comp, () => navigation.navigate("FinishListing", params))}
        </View>
    );
}
