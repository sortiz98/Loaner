import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import AppStyles from '../styles/AppStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SearchResults({ navigation, route }) {

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
    }


    const addView = ({ item }) => {
        const tagStyle = item.delivery ? AppStyles.greenTag : AppStyles.grayTag;
        return (
            <TouchableOpacity style={[AppStyles.searchResultCard]} onPress={() => console.log("No")}>
                <Image source={{ uri: item.uri }} style={[AppStyles.searchResultImage]} />
                <View style={[AppStyles.searchResultDetailCard]}>
                    <View style={[{ flexDirection: "row" }]}>
                        <Text>{item.title}</Text>
                        <MaterialCommunityIcons name="star" size={24} color="black" />
                        <Text>{"4.9"}</Text>
                    </View>
                    <View style={[{ flexDirection: "row" }]}>
                        <Text>{"3 miles away"}</Text>
                        <View style={AppStyles.dot}></View>
                        <View style={tagStyle}>
                            <Text>{item.delivery ? "Delivery" : "No Delivery"}</Text>
                        </View>
                    </View>
                    <View style={[{ flexDirection: "row" }]}>
                        <Text>{"$" + (item.price * amount)}</Text>
                        <Text>{"Total for " + amount + " " + rate + "s"}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
        
    }

    const createFlatList = async () => {
        const appListings = doc(db, 'app', 'listings');
        await getDoc(appListings)
            .then((snapshot) => {
                const snapdata = snapshot.data();
                if (snapshot.exists && snapdata) {
                    const topListings = snapdata.top;
                    const imgList = [];
                    let i = 0;
                    while (i < topListings.length) {
                        imgList.push({ image1: topListings[i], image2: topListings[i + 1], image3: topListings[i + 3] });
                        i += 3;
                    }
                    setViewList(imgList);
                }
            })
            .catch((error) => { alert(error.message) });
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

