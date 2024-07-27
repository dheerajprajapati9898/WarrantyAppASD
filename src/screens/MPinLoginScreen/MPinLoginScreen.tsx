import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupLoginDatabase, getAllLoginItems } from './../../db/Login/Login'
import { setupPinDatabase, insertPinItems, getAllPinItems } from './../../db/pin/pin'
import styles from './styles';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
const MPinLoginScreen = () => {
  const [mpin, setMPin] = useState(['', '', '', '']);
  const [getpin, setgetpin] = useState()
  const navigation = useNavigation();
  useEffect(() => {
    setupLoginDatabase()


    setupPinDatabase()
    const getpin = async () => {
      const savedUserId = await AsyncStorage.getItem('userid');
      const result = await getAllPinItems()
      console.log("Asdasddadasdas", savedUserId);
      const pin = result[0].pin

      // return
      setgetpin(pin)

    }
    getpin()
  }, [])
  const CELL_COUNT = 4;
  const [value, setValue] = useState('');
  const ref = useRef();

  const getCellOnLayoutHandler = index => {
    // Example handler for cell layout if needed
    return ({ nativeEvent: { layout: { width } } }) => {
      // Do something with cell layout if needed
    };
  };
  const handleMPinChange = (text: string, index: number) => {
    const newMPin = [...mpin];
    newMPin[index] = text;
    setMPin(newMPin);
  };

  const handleMPinSubmit = async () => {
    // console.log(getpin());
    // console.log(mpin.join(''));
    // console.log(getpin);
    // const pin = mpin.join('')
    // console.log(getpin, pin);
    // console.log(getpin.toString() === pin);

    // return
    const contactRegex = /^[0-9+\-]+$/;
    if (!contactRegex.test(value)) {
      Alert.alert('Validation Error', 'MPin can only contain digits.');
      return;
    }
    if (value.length !== 4) {
      Alert.alert("Error", 'Please enter a 4-digit MPin.')
      return
    }
    if (getpin === value) {

      Alert.alert('Login Successful', 'Welcome!');
      navigation.navigate('HomeDrawer');
    } else {
      console.log("getpin === value", getpin);

      Alert.alert('Invalid MPin', 'Please try again.');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Enter Your M-Pin</Text>
      {/* <View style={styles.mpinContainer}>
        {mpin.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.mpinInput}
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={(text) => handleMPinChange(text, index)}
          />
        ))}
      </View> */}
      <CodeField
        ref={ref}
        value={value}
        onChangeText={setValue} // Ensure setValue is properly defined and used here
        cellCount={CELL_COUNT}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete={Platform.select({ android: 'sms-otp', default: 'one-time-code' })}
        testID="my-code-input"
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={handleMPinSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};


export default MPinLoginScreen;
