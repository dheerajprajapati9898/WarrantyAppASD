import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { updateLoginItem } from './../../db/Login/Login'
const Logout = () => {
    const navigation = useNavigation();
    const handleLogout = async () => {
        const savedUserId = await AsyncStorage.getItem('userid');
        try {
            await AsyncStorage.clear();
            await updateLoginItem(savedUserId, null)
            console.log('AsyncStorage successfully cleared!');
            navigation.replace('Login');
        } catch (e) {
            console.log('Failed to clear AsyncStorage.');
        }
    };
    return (
        // <ScrollView>
        <View style={styles.container}>
            <Text style={styles.headerText}>After logout data is still store in the system.</Text>
            {/* <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        placeholderTextColor="#999"
        maxLength={4}
      /> */}
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
        // </ScrollView>
    )
}

export default Logout
