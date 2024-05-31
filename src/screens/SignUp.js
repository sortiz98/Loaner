import { Text, View, TextInput, ImageBackground, Button, KeyboardAvoidingView, Pressable, Platform } from 'react-native';
import AppStyles from '../styles/AppStyles';
import InlineTextButton from '../components/InlineTextButton';
import React from 'react';
import { auth } from "../firebase-config";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

export default function SignUp({ navigation }) {
    const background = require("../assets/splash.png");

    let [email, setEmail] = React.useState("");
    let [password, setPassword] = React.useState("");
    let [confirmPassword, setConfirmPassword] = React.useState("");
    let [validationMessage, setValidationMessage] = React.useState("");

    let validateAndSet = (value, valueToCompare, setValue) => {
        if (value !== valueToCompare) {
            setValidationMessage("Passwords do not match.");
        } else {
            setValidationMessage("");
        }

        setValue(value);
    };

    let signUp = () => {
        if (password === confirmPassword) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    sendEmailVerification(auth.currentUser);
                    navigation.navigate("Tabs", { user: userCredential.user });
                })
                .catch((error) => {
                    setValidationMessage(error.message);
                });
        }
    }

    return (
        <View style={AppStyles.openingContainer}>
            <KeyboardAvoidingView
                style={AppStyles.backgroundCover}
                behavior={Platform.OS === "ios" ? "padding" : null}
                keyboardVerticalOffset={60}>
                <Text style={[AppStyles.lightMediumText]}>Welcome to Rately!</Text>
                <View style={[AppStyles.rowContainer, AppStyles.topMargin, AppStyles.bottomMargin]}>
                    <Text style={[AppStyles.lightHeaderText, AppStyles.header]}>Sign Up</Text>
                </View>
                <Text style={[AppStyles.errorText]}>{validationMessage}</Text>
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
                    onChangeText={(value) => validateAndSet(value, confirmPassword, setPassword)} />
                <TextInput
                    style={[AppStyles.textInput, AppStyles.lightTextInput, AppStyles.lightText, AppStyles.bottomMargin]}
                    placeholder='Confirm Password'
                    placeholderTextColor="#BEBEBE"
                    secureTextEntry={true}
                    value={confirmPassword}
                    onChangeText={(value) => validateAndSet(value, password, setConfirmPassword)} />
                <Pressable style={[AppStyles.button, AppStyles.topMargin]} onPress={signUp}>
                    <Text style={AppStyles.buttonText}>SIGN UP</Text>
                </Pressable>
                <View style={[AppStyles.rowContainer, AppStyles.topMarginLarge]}>
                    <Text style={AppStyles.lightText}>Already have an account? </Text>
                    <InlineTextButton text="Login" onPress={() => navigation.popToTop()} />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

