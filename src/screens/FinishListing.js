import React, { useState, useLayoutEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Pressable, Button, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import AppStyles from '../styles/AppStyles';
import InlineTextButton from '../components/InlineTextButton';
import { moneyInput, displayProgressTabs } from '../components/HelperFunctions';
import { Ionicons } from '@expo/vector-icons';

import { setDoc, doc, collection, addDoc, getDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { MaterialIcons } from '@expo/vector-icons';

export default function CancellationPolicy({ navigation, route }) {

    const completion = 6;
    const data = route.params.data;

    const initial_value = ("itemValue" in data) ? data.itemValue : 0;
    const [itemValue, setItemValue] = useState(initial_value);
    const [displayItemValue, setDisplayItemValue] = useState(initial_value);
    const [itemValueTextColor, setItemValueTextColor] = useState(("itemValue" in data) ? "#000" : "#7777");

    const [modalVisible, setModalVisible] = useState(false);

    const goBack = (navigation) => (
        <TouchableOpacity style={{ marginLeft: -10 }} onPress={() => navigation.navigate("CancellationPolicy", { data: { ...data, ...{ itemValue: itemValue } }, completion: completion })}>
            <MaterialIcons name="keyboard-arrow-left" size={36} color="black" />
        </TouchableOpacity>
    )

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (goBack(navigation)),
        });
    }, [navigation, goBack]);


    const finish = async () => {
        const user = doc(db, 'users', auth.currentUser.email);
        const appListings = doc(db, 'app', 'listings');
        const listings = collection(appListings, 'all');

        await addDoc(listings, { ...data, ...{ itemValue: itemValue, creationTime: Timestamp.fromDate(new Date()) } })   // .toDate() to convert back
            .then((ref) => {
                getDoc(user)
                    .then((snapshot) => {
                        let listings = [ref.id];
                        let snapdata = {};
                        if (snapshot.exists) {
                            snapdata = snapshot.data();
                            if (snapdata && ("listings" in snapdata)) {
                                listings = [ref.id, ...snapdata.listings];
                            }
                        }
                        setDoc(user, { ...snapdata, ...{ listings: listings } })
                            .then()
                            .catch((error) => { alert(error.message) });
                    })
                    .catch((error) => { alert(error.message) });

                getDoc(appListings)
                    .then((snapshot) => {
                        let top = { [ref.id] : data.photos[0] };
                        let snapdata = {};
                        if (snapshot.exists) {
                            snapdata = snapshot.data();
                            if (snapdata && ("top" in snapdata)) {
                                const snaptop = snapdata.top;
                                const keys = Object.keys(snaptop);
                                top = { ...{ [ref.id] : data.photos[0] }, ...snaptop };
                                if (keys.length > 100) {
                                    delete top[keys[0]];
                                }
                            }
                        }
                        setDoc(appListings, { ...snapdata, ...{ top: top } })
                            .then()
                            .catch((error) => { alert(error.message) });
                    })
                    .catch((error) => { alert(error.message) });
            })
            .catch((error) => { alert(error.message) });
    }

    const terms = () => {
        return (
            <View style={{ alignSelf: "center", flex: 1 }}>
                <Text style={[AppStyles.darkText, AppStyles.topMargin10]}>What is your item worth? If your item is damanged or not returned, your pay out will be based on this amount.</Text>
            </View>
        );
    }

    const displayModal = () => {
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{ flex: 1 }}>
                    <View style={AppStyles.modalView}>
                        <TouchableOpacity style={[AppStyles.imageButton, AppStyles.leftAligned]} onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" color="#000" size={20} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: -10, color: "#000" }}>Rately Terms & Conditions</Text>
                        <View style={{ alignSelf: "center", flex: 1, marginTop:10, marginBottom:20 }}>
                            <FlatList
                                data={[{ key: "terms" }]}
                                renderItem={terms}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 20
        }}>
            <View style={{ flex: 5 }}>
                {displayModal()}
                <Text style={[{ color: "#000", fontWeight: "bold", fontSize: 16 }, AppStyles.topMargin]}>Item Value</Text>
                <Text style={[AppStyles.darkText, AppStyles.topMargin10, AppStyles.bottomMargin8]}>What is your item worth? If your item is damanged or not returned, your pay out will be based on this amount.</Text>
                <TextInput
                    style={[AppStyles.thinTextInput, AppStyles.centered, AppStyles.bottomMarginMedium, { fontSize: 15, alignSelf:"stretch", color: itemValueTextColor }]}
                    onChangeText={input => { moneyInput(input, setItemValue, setDisplayItemValue); setItemValueTextColor("#000"); }}
                    value={"$" + displayItemValue}
                    maxLength={5}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    textAlign="center"
                    onSubmitEditing={input => setDisplayItemValue(itemValue)}
                />
                <View style={[AppStyles.line]}></View>
                <Text style={[{ color: "#000", fontWeight: "bold", fontSize: 16 }, AppStyles.topMargin]}>How you'll get paid</Text>
                <Text style={[AppStyles.darkText, AppStyles.topMargin10, AppStyles.bottomMarginMedium]}>Insert payment information here</Text>
                <View style={[AppStyles.line]}></View>
                <Text style={[{ color: "#000", fontWeight: "bold", fontSize: 16 }, AppStyles.topMargin]}>Don't Forget...</Text>
                <Text style={[AppStyles.topMargin10, AppStyles.bottomMarginMedium]}>
                    <Text style={[AppStyles.darkText]}>When you receive requests for your item, you will only have </Text>
                    <Text style={{ fontSize: 11, fontWeight: "bold", color: "#000" }}>24 hours</Text>
                    <Text style={[AppStyles.darkText]}> to respond. Make sure to turn on your notifications!</Text>
                </Text>
                <View style={[AppStyles.line]}></View>
                <View style={{ flexDirection: "row", flexWrap:"wrap", marginTop: 26 }}>
                    <Text style={AppStyles.darkText}>By clicking the button below, I agree to the lister </Text>
                    <InlineTextButton style={{ fontSize: 10, fontWeight: "bold", color: "#000" }} text="Rately Terms & Conditions." onPress={() => setModalVisible(!modalVisible)} />
                </View>
            </View>
            <View style={[{ flex: 1, alignSelf: 'center', justifyContent: 'center' }]}>
                {displayProgressTabs(navigation, { data: data, completion: completion })}
                <Pressable style={[AppStyles.buttonBlue, AppStyles.bottomMargin8]} onPress={() => { finish(); navigation.navigate("PostScreen"); }}>
                    <Text style={AppStyles.buttonLightText}>Agree to Terms & Conditions</Text>
                </Pressable>
            </View>
        </View>
    );

}

