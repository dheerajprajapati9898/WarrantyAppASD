import React, { useEffect, useState, useRef } from 'react';
import styles from './styles'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupPinDatabase, insertPinItems, getAllPinItems } from './../../db/pin/pin'
import { setIsLogin } from './../../components/SharedPreference'
import { updateLoginItem, getAllLoginItems } from './../../db/Login/Login'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import axios from 'axios';
import RemoteUrls from '../apiUrl';
import { AESExtensions } from '../AESExtensions';
import { ActivityIndicator } from 'react-native-paper';
const LoginWithOTP = () => {
    const navigation = useNavigation();

    useEffect(() => {
        setupPinDatabase()
    }, [])

    const CELL_COUNT = 6;
    const [contactnumber, setcontactnumber] = useState('7378891335');
    const [confirmotp, setconfirmotp] = useState('');
    const ref = useRef();
    const ref1 = useRef();

    const getCellOnLayoutHandler = index => {
        // Example handler for cell layout if needed
        return ({ nativeEvent: { layout: { width } } }) => {
            // Do something with cell layout if needed
        };
    };

    const getCellOnLayoutHandler1 = index => {
        // Example handler for cell layout if needed
        return ({ nativeEvent: { layout: { width } } }) => {
            // Do something with cell layout if needed
        };
    };
    const [loading, setloading] = useState(false)
    const [isotpsent, setisotpsent] = useState(false)
    const [isbuttonchange, setisbuttonchange] = useState(false)
    const handleotploginSubmit = async () => {
        try {
            setloading(true)
            const requestdata = {
                "Username_MobileNo": contactnumber
            }

            // console.log(requestdata);
            const encryptedlogindata = AESExtensions.encryptS(requestdata)
            console.log("encrypted", encryptedlogindata);


            const payload = {
                "RequestId": "",
                "IsEncrypt": "",
                "RequestData": encryptedlogindata,
                "SessionExpiryTime": "",
                "UserId": ""

            }
            const formData = new FormData();

            // Add other fields to FormData
            formData.append('UserId', "");
            formData.append('IsEncrypt', "");
            formData.append('SessionExpiryTime', "");
            formData.append('RequestId', "");
            formData.append('RequestData', encryptedlogindata);
            const reaponse = await axios.post(RemoteUrls.postLoginWithOTPUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },

            })
            // return
            const plaintextoflogindata = AESExtensions.decryptString(reaponse.data.responseData)
            console.log("Asdasdasd", plaintextoflogindata);
            if (reaponse.status === 200) {
                // console.log("otpresponse", reaponse.data);
                // Alert.alert("Success", plaintextoflogindata.ErrorDesc)
                setisotpsent(true)
                setisbuttonchange(true)
                // return
            }


        }
        catch (error) {
            Alert.alert("error", error)
        }
        finally {
            setloading(false)
        }

    }
    const handleotpverificationSubmit = async () => {
        const requestdata = {
            "Username_MobileNo": contactnumber,
            "OTP": confirmotp
        }

        // console.log(requestdata);
        const encryptedlogindata = AESExtensions.encryptS(requestdata)
        console.log("encrypted", encryptedlogindata);


        const payload = {
            "RequestId": "",
            "IsEncrypt": "",
            "RequestData": encryptedlogindata,
            "SessionExpiryTime": "",
            "UserId": ""

        }
        const formData = new FormData();

        // Add other fields to FormData
        formData.append('UserId', "");
        formData.append('IsEncrypt', "");
        formData.append('SessionExpiryTime', "");
        formData.append('RequestId', "");
        formData.append('RequestData', encryptedlogindata);
        const reaponse = await axios.post(RemoteUrls.postLoginOTPVerificationUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },

        })
        // return
        const plaintextoflogindata = AESExtensions.decryptString(reaponse.data.responseData)
        console.log("Asdasdasd", plaintextoflogindata);
        if (reaponse.status === 200) {
            navigation.navigate('ChangePassword')
            console.log("otpresponse", reaponse.data);
            // Alert.alert("Success", plaintextoflogindata.ErrorDesc)
            // return
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Login with OTP</Text>
            {/* <View style={styles.mpinContainer}>
        {mpin.map((digit, index) => (
          <TextInput

            key={index}
            style={styles.mpinInput}
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={text => handleMPinChange(text, index)}
          />
        ))}
      </View>

      <Text style={styles.headerText}>Confirm Your M-Pin</Text>
      <View style={styles.mpinContainer}>
        {confirmmpin.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.mpinInput}
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={text => handleMPinConfirm(text, index)}
          />
        ))}
      </View> */}
            <TextInput
                readOnly={isotpsent}
                style={styles.input}
                maxLength={10}
                keyboardType='number-pad'
                placeholder='Contact number'
                value={contactnumber}
                onChangeText={value => {
                    setcontactnumber(value)
                }}
            />

            {/* Text for confirming M-Pin */}
            {/* <Text style={styles.headerText}>Confirm Your M-Pin</Text> */}

            {/* Second CodeField for confirming PIN */}
            {
                isotpsent === true ?
                    <CodeField
                        ref={ref1}
                        value={confirmotp}
                        onChangeText={setconfirmotp} // Ensure setconfirmpin is properly defined and used here
                        cellCount={CELL_COUNT}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        autoComplete={Platform.select({ android: 'sms-otp', default: 'one-time-code' })}
                        testID="my-code-input-confirm"
                        renderCell={({ index, symbol, isFocused }) => (
                            <Text
                                key={index}
                                style={[styles.cell, isFocused && styles.focusCell]}
                                onLayout={getCellOnLayoutHandler1(index)}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        )}
                    /> :
                    <></>
            }
            {
                isbuttonchange ?
                    <TouchableOpacity style={styles.button} onPress={handleotpverificationSubmit}>
                        {
                            loading ?
                                <ActivityIndicator size={'small'} color='black' /> :
                                <Text style={styles.buttonText}>Veryfy OTP</Text>
                        }

                    </TouchableOpacity> :
                    <TouchableOpacity style={styles.button} onPress={handleotploginSubmit}>
                        {
                            loading ?
                                <ActivityIndicator size={'small'} color='black' /> :
                                <Text style={styles.buttonText}>Send OTP</Text>
                        }

                    </TouchableOpacity>
            }
        </View>
    );
};


export default LoginWithOTP;
