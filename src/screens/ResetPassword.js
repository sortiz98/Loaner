import { Text, View, TextInput, ImageBackground, Button, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
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
                <Text style={[AppStyles.lightHeaderText, AppStyles.leftAligned]}>Reset Password</Text>
                <Text style={[AppStyles.lightText, AppStyles.leftAligned, AppStyles.bottomMargin, AppStyles.topMargin]}>Enter your account email and we will send an email with instructions to reset your password</Text>
                <Text style={AppStyles.errorText}>{errorMessage}</Text>
                <TextInput
                    style={[AppStyles.textInput, AppStyles.lightTextInput, AppStyles.lightText]}
                    placeholder='Email'
                    placeholderTextColor="#BEBEBE"
                    value={email}
                    onChangeText={setEmail} />
                <Pressable style={[AppStyles.button, AppStyles.topMargin, AppStyles.bottomMarginLarge]} onPress={resetPassword}>
                    <Text style={AppStyles.buttonText}>SEND RESET EMAIL</Text>
                </Pressable>
            </KeyboardAvoidingView>
        </View>
    );
}
