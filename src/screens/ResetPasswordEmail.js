import { Text, View, TextInput, ImageBackground, Button, KeyboardAvoidingView, Platform } from 'react-native';
import AppStyles from '../styles/AppStyles';
import InlineTextButton from '../components/InlineTextButton';
import React from 'react';
import { auth } from "../firebase-config";
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ResetPassword({ navigation }) {
    const background = require("../assets/splash.png");

    let [email, setEmail] = React.useState("");
    let [errorMessage, setErrorMessage] = React.useState("");

    let resetPassword = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                navigation.popToTop();
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    }

    return (
        <View style={AppStyles.openingContainer}>
            <KeyboardAvoidingView
                style={AppStyles.backgroundCover}
                behavior={Platform.OS === "ios" ? "padding" : null}
                keyboardVerticalOffset={60}>
                <Text style={[AppStyles.lightHeaderText]}>Check Email</Text>
                <Text style={[AppStyles.lightText, AppStyles.bottomMargin, AppStyles.topMargin]}>We have sent password reset instructions to your email</Text>
                <Text style={AppStyles.errorText}>{errorMessage}</Text>
                <Pressable style={[AppStyles.button, AppStyles.topMargin, AppStyles.bottomMarginLarge]} onPress={navigation.navigate("LoginStack")}>
                    <Text style={AppStyles.buttonText}>RETRY LOGIN</Text>
                </Pressable>
            </KeyboardAvoidingView>
        </View>
    );
}
