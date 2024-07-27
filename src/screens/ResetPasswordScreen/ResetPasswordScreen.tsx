import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './style';
import axios from 'axios';
import { AESExtensions } from '../AESExtensions';
import { setupRegexDatabase, getAllRegexItems, insertRegexItems, clearRegexTable } from './../../db/regex/regex'

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute()
  // const { username } = route.params;
  const [otp, setOtp] = useState('');
  // const [newPassword, setNewPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');

  //   const { phoneNumber } = route.params;
  const [password, setPassword] = useState('11111111')
  const [confirmpassword, setcnfirmPassword] = useState('11111111')
  useEffect(() => {
    setupRegexDatabase()
    feItems()
  }, [])
  const [regex, setregex] = useState()
  const feItems = async () => {
    try {
      // console.log("check")
      const itemsFromDb = await getAllRegexItems();
      // console.log("check state", itemsFromDb.length)
      // console.log("check state", formattedItems)
      console.log("itemsFromDbadasdasdad", itemsFromDb)
      setregex(itemsFromDb);

      // console.log("check state", stateItems)

    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const handleResetPassword = async () => {
    const passwordRegex = regex[2].KeyValue
    console.log("regex[2].KeyValue", regex[2].KeyValue);

    if (!passwordRegex.test(password)) {
      Alert.alert('Validation Error', 'Password formate is invalid');
      return;
    }
    if (!passwordRegex.test(confirmpassword)) {
      Alert.alert('Validation Error', 'ConfirmPassword formate is invalid');
      return;
    }
    // return
    if (password === '' || confirmpassword === '') {
      Alert.alert("Please enter the password!")
      return
    }
    if (password != confirmpassword) {
      Alert.alert("Password doesn't match!")
      return
    }
    const requestdata = {
      "User_Name": "dealer",
      "NewPassword": password,
      "ConfirmPassword": confirmpassword
    }
    const encryptedlogindata = AESExtensions.encryptString(requestdata)
    console.log("encrypted", encryptedlogindata);

    const payload = {
      "requestId": "",
      "isEncrypt": "true",
      "requestData": encryptedlogindata,
      "sessionExpiryTime": "",
      "userId": ""
    }
    try {
      const response = await axios.post('http://dev.checkexplore.com:92/api/ChangePassword/Changepassword', payload);
      console.log("reponse", response.data);

      const plaintextoflogindata = AESExtensions.decryptString(response.data.responseData)
      console.log("Asdasdasd", plaintextoflogindata);
      if (plaintextoflogindata.ErrorCode === 200 || response.data.responseCode === 200) {

        Alert.alert(plaintextoflogindata.ErrorDesc)
        navigation.navigate('Login')
      }

    } catch (err) {
      Alert.alert("Error", err)
      console.log(err);

    }
    // if (otp.length === 4) {
    //   // Call your API to verify OTP
    //   const otpValid = true; // Replace with actual OTP validation result
    //   if (otpValid) {
    //     if (newPassword === confirmPassword) {
    //       // Call your API to reset the password
    //       Alert.alert('Password Reset', 'Your password has been reset successfully.');
    //       navigation.navigate('Login');
    //     } else {
    //       Alert.alert('Password Mismatch', 'The passwords do not match.');
    //     }
    //   } else {
    //     Alert.alert('Invalid OTP', 'The OTP you entered is invalid.');
    //   }
    // } else {
    //   Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP.');
    // }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Change Password</Text>
      {/* <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        placeholderTextColor="#999"
        maxLength={4}
      /> */}
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm new password"
        value={confirmpassword}
        onChangeText={setcnfirmPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};



export default ResetPasswordScreen;
