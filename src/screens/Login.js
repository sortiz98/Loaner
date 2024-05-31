import { Text, View, TextInput, ImageBackground, Pressable, Button, KeyboardAvoidingView, Platform } from 'react-native';
import AppStyles from '../styles/AppStyles';
import InlineTextButton from '../components/InlineTextButton';
import React from 'react';
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function Login({ navigation }) {
    const background = require("../assets/splash.png");

    if (auth.currentUser) {
        navigation.navigate("Tabs");
    } else {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.navigate("Tabs");
            }
        });
    }

    let [errorMessage, setErrorMessage] = React.useState("");
    let [email, setEmail] = React.useState("");
    let [password, setPassword] = React.useState("");

    let login = () => {
        console.log("LOHIN");
        if (email !== "" && password !== "") {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log("LOGINNNN");
                    navigation.navigate("Tabs", { user: userCredential.user });
                    setErrorMessage("");
                    setEmail("");
                    setPassword("");
                })
                .catch((error) => {
                    setErrorMessage(error.message)
                });
        } else {
            setErrorMessage("Please enter an email and password");
        }
    }

    return (
        <View style={AppStyles.openingContainer}>
            <KeyboardAvoidingView
                style={AppStyles.backgroundCover}
                behavior={Platform.OS === "ios" ? "padding" : null}
                keyboardVerticalOffset={60}>
                <Text style={[AppStyles.lightMediumText]}>Welcome back to Rately!</Text>
                <View style={[AppStyles.rowContainer, AppStyles.topMargin, AppStyles.bottomMargin]}>
                    <Text style={[AppStyles.lightHeaderText, AppStyles.header]}>Login</Text>
                </View>
                <Text style={AppStyles.errorText}>{errorMessage}</Text>
                <TextInput
                    style={[AppStyles.textInput, AppStyles.lightTextInput, AppStyles.lightText]}
                    placeholder='Email'
                    placeholderTextColor="#BEBEBE"
                    value={email}
                    onChangeText={setEmail} />
                <TextInput
                    style={[AppStyles.textInput, AppStyles.lightTextInput, AppStyles.lightText]}
                    placeholder='Password'
                    placeholderTextColor="#BEBEBE"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword} />
                <View style={[AppStyles.bottomMarginMedium, AppStyles.leftMarginLarge, AppStyles.topMarginSmall]}>
                    <InlineTextButton text="Forgot Password?" fontSize="12" onPress={() => navigation.navigate("ResetPassword")} />
                </View>
                <Pressable style={AppStyles.button} onPress={login}>
                    <Text style={AppStyles.buttonText}>LOGIN</Text>
                </Pressable>
                <View style={[AppStyles.rowContainer, AppStyles.topMarginLarge]}>
                    <Text style={AppStyles.lightText}>Don't have an account? </Text>
                    <InlineTextButton text="Sign Up" onPress={() => navigation.navigate("SignUp")} />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
