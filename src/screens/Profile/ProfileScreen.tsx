import React, { useEffect, useState } from "react";
import { Text, View, TextInput, Image } from "react-native";
import styles from "./style";
import { getAllLoginItems } from "./../../db/Login/Login";
import Icon from 'react-native-vector-icons/FontAwesome';
export default function ProfileScreen() {
    const placeHolderTextColor = '#000';
    const [loginItems, setLoginItems] = useState(null); // Initialize with null or an empty object

    useEffect(() => {
        const fetchLoginItems = async () => {
            try {
                const fetchedItems = await getAllLoginItems();
                console.log(fetchedItems); // Check the structure of fetchedItems to see its properties

                setLoginItems(fetchedItems);
            } catch (error) {
                console.error('Error fetching login items:', error);
            }
        };

        fetchLoginItems();
    }, []);

    // Render conditionally based on whether loginItems is defined
    return (
        <View style={styles.container}>
            {loginItems ? (
                <View style={styles.profileContainer}>
                    <View style={styles.profileHeader}>
                        <View style={{ backgroundColor: '#000', height: '90%', width: '30%', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}>
                            {/* <Icon name="user" color='#e11e30' size={50} /> */}
                            {
                                loginItems.ProfileURL === null ?
                                    <Icon name="user" color='#e11e30' size={50} /> :
                                    <Image source={{ uri: `${loginItems.ProfileURL}` }} />
                            }

                        </View>
                        {/* <Text style={styles.profileHeaderText}>
                        User Profile
                    </Text> */}

                    </View>

                    <View style={styles.profileContent}>
                        <Text style={styles.profileHeaderText}>
                            User Profile
                        </Text>
                        {/* <Text style={styles.profileContentText}>
                        Details
                    </Text> */}
                        <View style={styles.profileContentDetailsContainer}>
                            <View style={styles.profileContentDetailsLabel}>
                                <Text style={styles.profileContentDetailsLabelText}>Name</Text>
                            </View>
                            <View style={styles.profileContentDetailsTextFieldView}>
                                <Text style={styles.profileContentDetailsTextField}>{loginItems.Name}</Text>
                            </View>
                        </View>

                        <View style={styles.profileContentDetailsContainer}>
                            <View style={styles.profileContentDetailsLabel}>
                                <Text style={styles.profileContentDetailsLabelText}>Mobile No.</Text>
                            </View>
                            <View style={styles.profileContentDetailsTextFieldView}>
                                <Text style={styles.profileContentDetailsTextField}>{loginItems.MobileNo}</Text>
                            </View>
                        </View>

                        <View style={styles.profileContentDetailsContainer}>
                            <View style={styles.profileContentDetailsLabel}>
                                <Text style={styles.profileContentDetailsLabelText}>Address</Text>
                            </View>
                            <View style={styles.profileContentDetailsTextFieldView}>
                                <Text style={styles.profileContentDetailsTextField}>{loginItems.Address}</Text>
                            </View>
                        </View>

                        <View style={styles.profileContentDetailsContainer}>
                            <View style={styles.profileContentDetailsLabel}>
                                <Text style={styles.profileContentDetailsLabelText}>Pincode</Text>
                            </View>
                            <View style={styles.profileContentDetailsTextFieldView}>
                                <Text style={styles.profileContentDetailsTextField}>{loginItems.Pin_Code}</Text>
                            </View>
                        </View>

                        <View style={styles.profileContentDetailsContainer}>
                            <View style={styles.profileContentDetailsLabel}>
                                <Text style={styles.profileContentDetailsLabelText}>Email</Text>
                            </View>
                            <View style={styles.profileContentDetailsTextFieldView}>
                                <Text style={styles.profileContentDetailsTextField}>{loginItems.EmailId}</Text>
                            </View>
                        </View>
                    </View>

                    {/* <View style={styles.buttonGroupContainer}>
                    <View style={styles.updateButtonContent}>
                        <Text style={styles.updateButtonText}>
                            Update
                        </Text>
                    </View>
                </View>

                <View style={styles.buttonGroupContainer}>
                    <View style={styles.buttonContent}>
                        <Text style={styles.profileButtonText}>
                            Settings
                        </Text>
                    </View>
                    <View style={styles.buttonContent}>
                        <Text style={styles.profileButtonText}>
                            Logout
                        </Text>
                    </View>
                </View> */}
                    <View style={{ height: '25%', width: '100%', justifyContent: 'center' }}>
                        <View style={styles.checklogoContainer}>
                            <Image source={require('../../assets/images/logo/tclogo.png')} style={{ height: '50%', width: '50%' }} resizeMode='contain' />
                            <Text style={styles.powerByText}>Powered by <Text style={styles.checktext}>Check</Text><Text style={styles.exploretext}>Explore</Text> </Text>
                        </View>
                    </View>
                </View>
            ) : (
                <Text></Text>
            )}
        </View>
    );
}
