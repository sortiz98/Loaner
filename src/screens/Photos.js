import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Pressable, Button, TextInput, TouchableOpacity, Image, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CalendarList } from 'react-native-calendars';
import AppStyles from '../styles/AppStyles';

import { setDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase-config";

import { displayProgressTab, displayProgressTabs } from '../components/HelperFunctions';

export default function Photos({ navigation, route }) {

    const completion = Math.max(route.params.completion, 1);
    const data = route.params.data;

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currImage, setCurrImage] = useState(0);

    let initial_styles = [];
    const initial_images = ("photos" in data) ? data.photos : [null, null, null, null, null, null, null, null, null];
    initial_images.forEach((img) => { (img == null) ? initial_styles.push(AppStyles.imagePlaceholder) : initial_styles.push(AppStyles.imagePreview) });

    const [images, setImages] = useState(initial_images);
    const [styles, setStyles] = useState(initial_styles);

    const readPhotos = async () => {
        await getDoc(listing)
            .then((snapshot) => {
                if (snapshot.exists && snapshot.data()) {
                    let snapData = snapshot.data();
                    setData(snapData);
                    ("photos" in snapData)? setImages(snapData.photos): console.log("No Photos");
                } else {
                    console.log("NO LISTING");
                }
            })
            .catch((error) => { alert(error.message); console.log("EEK"); });
    }

    const savePhotos = async () => {
        console.log("SAVE");
        const updatedData = { ...data, ...{ photos: images } };
        //await setDoc(listing, updatedData)
        //    .then(() => {console.log("SUCCCESS") })
        //    .catch((error) => { alert(error.message); console.log("BAD"); });
    }

    const pickImage = async (index) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        if (!result.cancelled) {
            let copyImages = [...images];
            copyImages[index] = result.uri;
            await setImages(copyImages);

            let copyStyles = [...styles];
            copyStyles[index] = AppStyles.imagePreview;
            setStyles(copyStyles);
        }
    }

    const deleteImage = async () => {
        let copyImages = [...images];
        copyImages[currImage] = null;
        await setImages(copyImages);

        let copyStyles = [...styles];
        copyStyles[currImage] = AppStyles.imagePlaceholder;
        setStyles(copyStyles);

        setEditModalVisible(false);
    }


    const photoDisplay = (index) => {
        return (
            <TouchableOpacity style={{ width: 115, height: 115 }} onPress={() => { setCurrImage(index); images[index]? setEditModalVisible(true): pickImage(index) }}>
                {(images[index]) ? <Image source={{ uri: images[index] }} style={styles[index]} /> : <Image source={require("../assets/photo-placeholder.png")} style={styles[index]} />}
            </TouchableOpacity>
        );
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 20
        }}>
            <View style={[{ flex: 5 }]}>
                <Text style={[AppStyles.topMargin50, AppStyles.bottomMargin35, AppStyles.centered, AppStyles.centerText]}>
                    <Text style={[AppStyles.darkText]}>Showcase up to 9 pictures. </Text>
                    <Text style={{ fontSize: 11, fontWeight: "bold", color: "#000" }}>Capture all angles. </Text>
                    <Text style={[AppStyles.darkText]}>The more pictures you add, the more activity you’re likely to have!</Text>
                </Text>
                <View style={AppStyles.centered}>
                    <View style={{flexDirection:"row"}}>
                        {photoDisplay(0)}
                        {photoDisplay(1)}
                        {photoDisplay(2)}
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        {photoDisplay(3)}
                        {photoDisplay(4)}
                        {photoDisplay(5)}
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        {photoDisplay(6)}
                        {photoDisplay(7)}
                        {photoDisplay(8)}
                    </View>
                </View>
            </View>
            <View style={[{ flex: 1, alignSelf: 'center', justifyContent: 'center' }]}>
                {displayProgressTabs(navigation, { data: data, completion: completion })}
                <Pressable style={[AppStyles.buttonBlue, AppStyles.bottomMargin8]} onPress={() => { if (images[0] == null) { alert("Missing main photo") } else { navigation.navigate("Details", { data: { ...data, ...{ photos: images } }, completion: completion }); } }}>
                    <Text style={AppStyles.buttonLightText}>Next</Text>
                </Pressable>
            </View>

            <Modal
                animationType="none"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => {
                    setEditModalVisible(!editModalVisible);
                }}
            >
                <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                    <View style={{flex: 4.3}}></View>
                    <View style={AppStyles.editModalView}>
                        <TouchableOpacity style={[{ width: 300, height: 50 }]} onPress={() => { setEditModalVisible(false); pickImage(currImage) }}>
                            <Text style={{ fontSize: 13, fontWeight: "500", marginTop: 15, color: "#24a0ed" , textAlign: 'center'}}>Update photo</Text>
                        </TouchableOpacity>
                        <View style={[AppStyles.lineTop]}></View>
                        <TouchableOpacity style={[{ width: 300, height: 50 }]} onPress={deleteImage}>
                            <Text style={{ fontSize: 13, fontWeight: "500", marginTop: 15, color: "#d80000", textAlign: 'center' }}>Delete</Text>
                        </TouchableOpacity>
                        <View style={[AppStyles.lineTop]}></View>
                        <TouchableOpacity style={[{ width: 300, height: 50 }]} onPress={() => { setEditModalVisible(false) }}>
                            <Text style={{ fontSize: 13, fontWeight: "500", marginTop: 15, color: "#000", textAlign: 'center' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );

}

