import React, { useState, useLayoutEffect } from 'react';
import { View, Text, Pressable, TextInput, Switch, FlatList, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import AppStyles from '../styles/AppStyles';
import { ref, uploadBytes, getDownloadURL, listAll, list } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { setDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import DropDown from '../components/DropDown';
import { moneyInput, numInput, displayProgressTabs } from '../components/HelperFunctions';
import { MaterialIcons } from '@expo/vector-icons';



export default function Details({ navigation, route }) {


    const completion = Math.max(route.params.completion, 2);
    const data = route.params.data;

    const blank = {
        title: '', description: '', category: 'OTHR', delivery: { available: false, distanceRange: 10, minLoan: { time: 1, unit: 'hour' }, baseFee: 0, feePerMile: 0 }
    };
    const initial_details = ("details" in data) ? data.details : blank;
    const [details, setDetails] = useState(initial_details);

    const [title, setTitle] = useState(initial_details.title);
    const [description, setDescription] = useState(initial_details.description);
    const [category, setCategory] = useState(initial_details.category);

    const delivery_available = initial_details.delivery.available;
    const displayTextColor = delivery_available? '#000':'#7777';

    const [timeUnit, setTimeUnit] = useState(initial_details.delivery.minLoan.unit);

    const [distanceRange, setDistanceRange] = useState(initial_details.delivery.distanceRange);
    const [distanceRangeTextColor, setDistanceRangeTextColor] = useState(displayTextColor);

    const [loanTime, setLoanTime] = useState(initial_details.delivery.minLoan.time);
    const [loanTimeTextColor, setLoanTimeTextColor] = useState(displayTextColor);

    const [baseFee, setBaseFee] = useState(initial_details.delivery.baseFee);
    const [displayBaseFee, setDisplayBaseFee] = useState(initial_details.delivery.baseFee);
    const [baseFeeTextColor, setBaseFeeTextColor] = useState(displayTextColor);

    const [feePerMile, setFeePerMile] = useState(initial_details.delivery.feePerMile);
    const [displayFeePerMile, setDisplayFeePerMile] = useState(initial_details.delivery.feePerMile);
    const [feePerMileTextColor, setFeePerMileTextColor] = useState(displayTextColor);

    const [viewList, setViewList] = useState(delivery_available ? [{ key: "delivery" }, { key: "main" }] : [{ key: "main" }]);
    const [delivery, setDelivery] = useState(delivery_available);
    const [invertScroll, setInvertScroll] = useState(delivery_available);

    const goBack = (navigation) => (
        <TouchableOpacity style={{ marginLeft: -10 }} onPress={() => navigation.navigate("Photos", { data: { ...data, ...{ details: saveDetails() } }, completion: completion })}>
            <MaterialIcons name="keyboard-arrow-left" size={36} color="black" />
        </TouchableOpacity>
    )

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (goBack(navigation)),
        });
    }, [navigation, goBack]);

    const categories = [
        { label: 'Party Supplies', value: 'PARS' },
        { label: 'Tools', value: 'TOOL' },
        { label: 'Fashion Accessories', value: 'FASH' },
        { label: 'Furniture', value: 'FURN' },
        { label: 'Services', value: 'SERV' },
        { label: 'Other', value: 'OTHR' },
    ];

    const timeUnits = [
        { label: 'hours', value: 'hour' },
        { label: 'days', value: 'day' },
        { label: 'weeks', value: 'week' },
        { label: 'months', value: 'month' },
    ];

    const saveDetails = () => {

        let details = {};
        details.title = title;
        details.category = category;
        details.description = description;
        details.delivery = {};
        details.delivery.available = delivery;
        details.delivery.distanceRange = distanceRange;
        details.delivery.minLoan = { time: loanTime, unit: timeUnit };
        details.delivery.baseFee = baseFee;
        details.delivery.feePerMile = feePerMile;
        return details;

        //const detailsDoc = doc(listing, 'tabs', "details");
        //setDoc(detailsDoc, details)
        //    .then(() => { console.log("") })
        //    .catch((error) => { alert(error.message) });

    }

    const updateDelivery = () => {
        if (delivery) {
            setDelivery(false);
            setViewList([{ key: "main" }]);
            setInvertScroll(false);
        } else {
            setDelivery(true);
            setViewList([{ key: "delivery" }, { key: "main" }]);
            setInvertScroll(true);
        }
    }



    const displayTabs = (comp) => {
        console.log("DIS TABS");
        console.log(comp);
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

    const displayMainDetails = () => {
        return (
            <View>
                <Text style={{ fontSize: 12.5, fontWeight: "600", color: "#000" }}>Title</Text>
                <TextInput
                    style={[AppStyles.thinTextInput, { fontSize: 12 }]}
                    onChangeText={newTitle => setTitle(newTitle)}
                    defaultValue={title}
                    maxLength={30}
                />
                <Text style={{ fontSize: 12.5, fontWeight: "600", color: "#000", marginTop: 3 }}>Category</Text>
                <DropDown label="--------------------" data={categories} onSelect={setCategory} dropdownStyle={AppStyles.thinTextInput} labelStyle={AppStyles.blackText}/>
                <Text style={{ fontSize: 12.5, fontWeight: "600", color: "#000", marginTop: 3 }}>Description</Text>
                <TextInput
                    placeholder="1500 characters"
                    style={[AppStyles.thinTextInput, { height: 150, fontSize: 12 }]}
                    onChangeText={newDescription => setDescription(newDescription)}
                    defaultValue={description}
                    multiline={true}
                    maxLength={1500}
                />
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5, marginBottom: 15 }}>
                    <Text style={{ fontSize: 13, fontWeight: "600", color: "#000", marginTop: 5 }}>Delivery?</Text>
                    <Switch
                        trackColor={{ false: 'rgba(0, 0, 0, 0.3)', true: 'rgba(80, 107, 174, 1)' }}
                        thumbColor={delivery ? '#B9C4DF' : '#efefef'}
                        ios_backgroundColor='rgba(0, 0, 0, 0.3)'
                        onValueChange={updateDelivery}
                        value={delivery}
                    />
                </View>
            </View>
        );
    }

    const displayDeliveryDetails = () => {
        return (
            <View>
                <Text style={{ fontSize: 12, fontWeight: "500", color: "#000" }}>Maximum Distance Range</Text>
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                    <TextInput
                        style={[AppStyles.thinTextInput, { fontSize: 12, width: 200, color: distanceRangeTextColor }]}
                        onChangeText={newRange => { numInput(newRange, setDistanceRange); setDistanceRangeTextColor("#000"); }}
                        value={distanceRange}
                        maxLength={5}
                        keyboardType="number-pad"
                        returnKeyType="done"
                        textAlign="center"
                        placeholder="10"
                    />
                    <Text style={{ fontSize: 11, fontWeight: "500", color: "#000", marginTop: 15, marginLeft: 20 }}>miles</Text>
                </View>
                <Text style={{ fontSize: 12, fontWeight: "500", color: "#000", marginTop: 5 }}>Minimum Loan Time</Text>
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                    <TextInput
                        style={[AppStyles.thinTextInput, { fontSize: 12, width: 200, marginRight: 20, color: loanTimeTextColor }]}
                        onChangeText={newTime => { numInput(newTime, setLoanTime); setLoanTimeTextColor("#000"); }}
                        value={loanTime}
                        maxLength={5}
                        placeholder="1"
                        keyboardType="number-pad"
                        returnKeyType="done"
                        textAlign="center"
                    />
                    <DropDown label="hours" data={timeUnits} onSelect={setTimeUnit} dropdownStyle={AppStyles.lineTextInput} labelStyle={AppStyles.darkSemiBoldText} />
                </View>
                <Text style={{ fontSize: 12, fontWeight: "500", color: "#000", marginTop: 10 }}>Delivery Fee</Text>
                <View style={{ flexDirection: "row", marginTop: 5, justifyContent: "space-between", marginTop: 15 }}>
                    <Text style={{ fontSize: 11, fontWeight: "400", color: "#000", marginTop: 15 }}>Base Fee</Text>
                    <TextInput
                        style={[AppStyles.thinTextInput, { fontSize: 12, width: 200, color: baseFeeTextColor }]}
                        onChangeText={input => { moneyInput(input, setBaseFee, setDisplayBaseFee, decimal = true); setBaseFeeTextColor("#000"); }}
                        value={"$" + displayBaseFee}
                        maxLength={7}
                        keyboardType="decimal-pad"
                        returnKeyType="done"
                        textAlign="center"
                        onSubmitEditing={input => setDisplayBaseFee(baseFee)}
                    />
                </View>
                <View style={{ flexDirection: "row", marginTop: 5, justifyContent: "space-between", marginBottom: 30 }}>
                    <Text style={{ fontSize: 11, fontWeight: "400", color: "#000", marginTop: 15 }}>Fee Per Mile</Text>
                    <TextInput
                        style={[AppStyles.thinTextInput, { fontSize: 12, width: 200, color: feePerMileTextColor}]}
                        onChangeText={input => { moneyInput(input, setFeePerMile, setDisplayFeePerMile, decimal = true); setFeePerMileTextColor("#000"); }}
                        value={"$" + displayFeePerMile}
                        maxLength={7}
                        keyboardType="decimal-pad"
                        returnKeyType="done"
                        textAlign="center"
                        onSubmitEditing={input => setDisplayFeePerMile(feePerMile)}
                    />
                </View>
            </View>
        );
    }

    const addView = ({ item }) => {
        if (item.key == "delivery") {
            return displayDeliveryDetails();
        } else {
            return displayMainDetails();
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'stretch', padding: 20, backgroundColor: "white" }}>
            <View style={{ flex: 5 }}>
                <KeyboardAvoidingView
                    style={AppStyles.whiteBackground}
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    keyboardVerticalOffset={100}>
                    <FlatList
                        inverted={invertScroll}
                        data={viewList}
                        renderItem={addView}
                    />
                </KeyboardAvoidingView>
            </View>
            <View style={[{ flex: 1, alignSelf: 'center', justifyContent: 'center' }]}>
                {displayProgressTabs(navigation, { data: data, completion: completion })}
                <Pressable style={[AppStyles.buttonBlue, AppStyles.bottomMargin8]} onPress={() => { navigation.navigate("Rates", { data: { ...data, ...{ details: saveDetails() } }, completion: completion }); }}>
                    <Text style={AppStyles.buttonLightText}>Next</Text>
                </Pressable>
            </View>
        </View>
    );
}
