import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import AppStyles from '../styles/AppStyles';
import { doc, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { Octicons } from '@expo/vector-icons';

export default function Home({ navigation, route }) {

    const [viewList, setViewList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const size = ((windowWidth - 20) / 3); 

    const updateView = async () => {
        const temp = await route.params.viewList;
        await setViewList(temp);
        console.log("TEMO");
        console.log(temp);
        //if (viewList == []) {
        //    await setViewList(temp);
        //    console.log("TEMO");
        //    console.log(temp);
        //}
    }

    const ReadDocs = async () => {
        const q = query(collection(doc(db, "app", "listings"), "all")); //, where("name", "==", "Sarah")); 
        const querySnapshot = await getDocs(q);
       
        let names_list = []
        querySnapshot.forEach((document) => {
            names_list.push(document.data()["name"]);
        });

        setNames(names_list);
    }

    const photoDisplay = (img) => {
        return (
            <TouchableOpacity style={{ width: size, height: size }} onPress={() => { console.log("NAVIGATE TO LISTING") }}>
                <Image source={{ uri: img.uri }} style={[AppStyles.imageThumbnail]} />
            </TouchableOpacity>
        );
    }

    const addView = ({ item }) => {
        return (
            <View style={[{ flexDirection: "row" }]}>
                {photoDisplay(item.image1)}
                {item.image2 && photoDisplay(item.image2)}
                {item.image3 && photoDisplay(item.image3)}
            </View>
        );
        
    }

    updateView();

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
                        maxLength={26}
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