import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './style';


const ForgotPasswordScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();



  const handleSendOTP = async () => {
    if (phoneNumber.length === 10) {
      // Call your API to send OTP
      Alert.alert('OTP Sent', 'An OTP has been sent to your phone number.');
      navigation.navigate('ResetPassword', { phoneNumber });
    } else {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
};



export default ForgotPasswordScreen;
