import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const username = 'username'
const userid = 'userid'

export const setUserName = async (name) => {
    try {
        await AsyncStorage.setItem(username, name);
        console.log('Preferences saved successfully!');
    } catch (error) {
        console.error('Error saving preferences:', error);
    }
};
export const getUserName = async () => {
    try {
        const savedUsername = await AsyncStorage.getItem(username);
        if (savedUsername !== null) {
        }
    } catch (error) {
        console.error('Error loading preferences:', error);
    }
};

export const setUserId = async (id) => {
    try {
        await AsyncStorage.setItem(userid, id);
        console.log('Preferences saved successfully!');
    } catch (error) {
        console.error('Error saving preferences:', error);
    }
};
export const getUserId = async () => {
    try {
        const savedUserId = await AsyncStorage.getItem(userid);
        console.log("savedUserId", savedUserId);

        return savedUserId
    } catch (error) {
        console.error('Error loading preferences:', error);
    }
};

export const setIsLogin = async (available) => {
    try {
        await AsyncStorage.setItem('isLogin', available);
        console.log('Preferences saved successfully!');
    } catch (error) {
        console.error('Error saving preferences:', error);
    }
};

export default { setUserName, getUserName, setUserId, getUserId,setIsLogin }
