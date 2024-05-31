import React, { useState, useEffect, createContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL, listAll, list } from "firebase/storage";
import {getFirestore, collection, collectionGroup, getDocs, getDoc, query, where, setDoc, doc} from "firebase/firestore";
import { db, storage } from "./src/firebase-config";
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import ResetPassword from './src/screens/ResetPassword';
import ResetPasswordEmail from './src/screens/ResetPasswordEmail';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ManageAccount from './src/screens/ManageAccount';
import Home from './src/screens/Home';
import TabNavigator from './src/navigation/TabNavigator';
//import { Provider } from 'react-redux';
//import { Store } from './src/redux/store';

const getSnap = async (q) => {
    const result = await getDocs(q);
    return result;
}

const Stack = createNativeStackNavigator();
//const MyContext = createContext("")

export default function App() {

    const [names, setNames] = useState([]);
    const [userDoc, setUserDoc] = useState(null);
    const [image, setImage] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);

    const usersCollectionRef = collection(db, "users");
    const usersGroup = collectionGroup(db, "users");
    const imagesListRef = ref(storage, "images/");
    const [homeViewList, setHomeViewList] = useState("Hi");

    const name_data = {
        "name": "Sarah"
    };


    const UploadFile = (uri) => {
        if (uri == null) return;
        Create({ "name": "Steph", "uri": uri });
        const imageRef = ref(storage, `images/sample@email.com/listing1/image1`);

        uploadBytes(imageRef, uri).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageUrls((prev) => [...prev, url]);
            });
        });
        ReadSingleDoc();
    };

    const GetPermissions = () => {
        useEffect(async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission denied!');
            }
        }, []);

    }

    const PickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        if (!result.cancelled) {
            setImage(result.uri);
            UploadFile(result.uri);
        }
    }

    const Create = (data) => {


        const myDoc = doc(db, 'users', "sample@email.com");

        setDoc(myDoc, data)
            .then(() => { alert("Document Created") })
            .catch((error) => { alert(error.message) });

    }

    const ReadSingleDoc = () => {

        const myDoc = doc(db, 'users', "sample@email.com");

        getDoc(myDoc)
            .then((snapshot) => {
                if (snapshot.exists) {
                    setUserDoc(snapshot.data());
                } else {
                    alert("No Doc Found");
                }
            })
            .catch((error) => { alert(error.message) });
    }



    const ReadDocs = async () => {

        const q = query(collection(db, "users"), where("name", "==", "Sarah"));

        const querySnapshot = await getDocs(q);
        //.then((snapshot) => {
        //    if (snapshot.exists) {
        //        snapshot.docs.data();
        //    } else {
        //        alert("No Data Found");
        //    }
        //})
        //.catch((error) => {
        //    alert(error.message)
        //});
        let names_list = []
        querySnapshot.forEach((doc) => {
            names_list.push(doc.data()["name"]);
        });

        setNames(names_list);

    }


    //ReadSingleDoc();
    //ReadDocs();

    //  return (
    //      <View style={styles.container}>

    //          <Button title="Choose Image" onPress={PickImage} />
    //          {image && <Image source={{ uri:image }} style={{
    //              width: 200,
    //              height: 200
    //          }} />}

    //          {userDoc != null && <Image source={{ uri: userDoc.uri }} style={{
    //              width: 200,
    //              height: 200
    //          }} />}
    //          <StatusBar style="auto" />
    //      </View>
    //  );
    //}

    const LoginStack = () => {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ResetPassword"
                    component={ResetPassword}
                    options={{ title: "", headerBackTitleVisible:false, headerTintColor: "#fff",
                        headerStyle: {
                            backgroundColor: '#3F5385',
                            borderBottomColor: '#ffffff',
                            borderBottomWidth: 3,
                        }
                    }}
                />
                <Stack.Screen
                    name="ResetPasswordEmail"
                    component={ResetPasswordEmail}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        );
    };

    const createHomeList = async () => {
        const appListings = doc(db, 'app', 'listings');
        console.log("FIIIII");
        const snap = await getDoc(appListings);
        const snapdata = snap.data();
        if (snap.exists && snapdata) {
            const topListings = snapdata.top;
            const topKeys = Object.keys(snapdata.top);
            const imgList = [];
            let i = 0;
            while (i < topKeys.length) {
                const k1 = topKeys[i];
                const k2 = topKeys[i + 1];
                const k3 = topKeys[i + 2];
                const i1 = k1 ? { key: k1, uri: topListings[k1] } : null;
                const i2 = k2 ? { key: k2, uri: topListings[k2] } : null;
                const i3 = k3 ? { key: k3, uri: topListings[k3] } : null;
                imgList.push({ image1: i1, image2: i2, image3: i3 });
                i += 3;
            }
            return imgList;
        }
        return [];
    }

    return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="LoginStack"
                        component={LoginStack}
                        options={{ headerShown: false }} />
                    <Stack.Screen
                        name="SignUp"
                        component={SignUp}
                        options={{ headerShown: false }} />
                    <Stack.Screen
                        name="Tabs"
                        component={TabNavigator}
                        options={{ headerShown: false }}
                        initialParams={{ viewList: createHomeList() }} />
                </Stack.Navigator>
            </NavigationContainer>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

//export default App;
//{
//    userDoc != null && <Text>name: {userDoc.name}</Text>

//}
//{
//    names != [] && <Text>first: {names[0]}</Text>
//}


//{
//    imageUrls != [] && <Image source={{ url: imageUrls[0] }} style={{
//        width: 200,
//        height: 200
//    }} />
//}
