import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert, FlatList } from 'react-native';
import { ActivityIndicator, RadioButton } from 'react-native-paper';
import styles from './styles';
import DatePicker from 'react-native-date-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import { launchCamera } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { setupDatabase } from '../../db/Registration/database';
import { useNavigation } from '@react-navigation/native';
import {
  Item,
  insertItem,
  getAllItems,
  updateItem,
  deleteItem,
  getAll,
  getTodayWarrantyDashbaordCount,
  getMonthWarrantyDashbaordCount
} from '../../db/Registration/sqliteOperations'
import axios from 'axios';
import UpdateMissingImage from './../UploadMissingImage/UploadMissingImage'
import RemoteUrls from '../apiUrl';
import { AESExtensions } from '../AESExtensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllLoginItems } from '../../db/Login/Login';
const AddImage = () => {
  const navigation = useNavigation();

  const [date, setDate] = useState(new Date());
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);

  // const Options = [
  //   { warrantyNo: '100019', mobileNo: '9865348796' },
  //   { warrantyNo: '100153', mobileNo: '9658214736' },
  //   { warrantyNo: '101459', mobileNo: '7985635489' },
  //   { warrantyNo: '102376', mobileNo: '9745213698' },
  //   { warrantyNo: '103258', mobileNo: '9874563210' },
  // ];


  const [warrantyNumber, setWarrantyNumber] = useState('');
  const [mobilenumber, setmobilenumber] = useState('9768546820');

  // const handleInputChange = (text) => {
  //   const sanitizedText = text.replace(/[^0-9\b]/g, '');
  //   const limitedText = sanitizedText.slice(0, 6);

  //   // setWarrantyNumber(limitedText);
  // };

  const [mobileNumber, setMobileNumber] = useState('');

  const handleMobileNumberInputChange = (num) => {
    const sanitizedText = num.replace(/[^0-9\b]/g, '');
    const limitedText = sanitizedText.slice(0, 10);

    setMobileNumber(limitedText);
  };

  const navigateTo = (warrantyNo: any) => {
    Alert.alert(`Edit Warranty No. : ${warrantyNo}`);
    console.log(`navigating to page of warranty number :  ${warrantyNo}`);
  };
  const ODOMeterPickCamera = async () => {
    const permission = await check(PERMISSIONS.ANDROID.CAMERA);

    if (permission === RESULTS.DENIED || permission === RESULTS.BLOCKED) {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      if (result !== RESULTS.GRANTED) {
        console.log('Camera permission denied');
        return;
      }
    }
    const options = {
      mediaType: 'photo',
      cameraType: 'back',
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        console.log('Response:', response);
        if (response.assets && response.assets.length > 0) {
          console.log('Image URI:', response.assets[0].uri);
          // setODOMeterImageUri(response.assets[0].uri);
          // Assuming you want to set the image in tyre1Image or tyre2Image based on which is selected
          // if (vehicleDetails.tyreQuantity === 1) {
          setImages(response.assets[0].uri);
          // }

          //    else if (vehicleDetails.tyreQuantity === 2) {
          //      setVehicleDetails((prevDetails) => ({
          //        ...prevDetails,
          //        tyre2Image: response.assets[0].uri,
          //      }));
          //    }
          // } else {
          //   console.log('No image assets found');
          // }
        }
      }
    });
  };
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  useEffect(() => {
    const initializeDatabase = async () => {
      const database = await setupDatabase();
      setDb(database);
      fetchItems(database);
    };
    initializeDatabase();
    fetchingTheMissigImage()
  }, [])
  const [items, setItems] = useState(null)
  const fetchItems = async (database: SQLiteDatabase) => {
    try {
      const item = await getAllItems(database);
      setItems(item);

      // console.log("item", items.length)
    } catch (error) {
      console.error(error);
    }
  };
  const [missingimage, setmissingimage] = useState([])
  const [isloading, setisloading] = useState(false)

  const fetchingTheMissigImage = async () => {
    // const savedUserId = await AsyncStorage.getItem('userid');
    const userData = await getAllLoginItems()
    const specificData = {
      Username: userData.Username
    };
    const jsonString = JSON.stringify(specificData);
    // const dataval = JSON.stringify(jsonString)
    // Output the JSON string
    console.log("jsonString", jsonString); // Output: "{\"Username\":\"dealer\"}"
    // console.log("deghiudsyhrewiu", userData.Username);

    // return

    try {
      // setisloading(true);
      const encryptedlogindata = AESExtensions.encryptString(specificData)
      console.log("encrypted", encryptedlogindata);
      const payload = {
        "requestId": "",
        "isEncrypt": "",
        "requestData": encryptedlogindata,
        "sessionExpiryTime": "",
        "userId": ""
      };
      const response = await axios.post(RemoteUrls.postWarrantyImageMissingListUrl, payload);
      // console.log("againparsedata", response.data.responseData);
      const plaintextoflogindata = AESExtensions.decryptString(response.data.responseData)
      console.log("Asdasdasd", plaintextoflogindata);
      // console.log("fdgerdrgerg");

      // return
      // const responseData = response.data.responseData; // Assuming response.data.responseData is an array
      // const pasrsevalue = JSON.parse(responseData)
      // console.log("againparsedata", pasrsevalue.MobileNo);
      // Process responseData here
      // pasrsevalue.forEach(item => {
      //   console.log("Mobile No:", item.MobileNo);
      //   // Perform other operations with item properties as needed
      // });
      setmissingimage(plaintextoflogindata)
      // Ensure response data is an array (or handle accordingly if it's not)

    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle fetch error (e.g., show error message)
    }
    // finally {
    //   setisloading(false);
    // }
  };

  const [searchresult, setsearchresult] = useState([]);

  const handleSearchMissingImage = async () => {
    try {
      setisloading(true)
      const result = missingimage.filter(item => item.MobileNo === mobilenumber)
      setsearchresult(result)
      console.log("result", result);
      // navigation.navigate
    } catch (err) {
      console.log(err);

    }

    finally {
      setisloading(false)
    }

  }
  const Item = ({ item }) => (
    // <TouchableOpacity
    //   onPress={onPress}
    // >
    <Text>{item.MobileNo}</Text>
    // </TouchableOpacity>
  );
  const renderItem = ({ missingimage }) => {
    return (
      <Item
        item={missingimage.MobileNo}
      // onPress={() => setSelectedId(item.id)}
      />
    );
  };
  const handleMissingImageUpload = async (item) => {
    const params = {
      mobileNumber: item.MobileNo,
      missing_image: item.MissingPhoto
    };
    console.log("checking data", item.MissingPhoto);

    navigation.navigate('UploadMissingImage', params);
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.logoContainer}>
        <Text style={styles.headerText}>Missing Image</Text>
      </View>

      <View style={{ flexDirection: 'row', width: '100%' }}>

        <View style={{ width: '50%' }}>
          <TextInput
            style={styles.input}
            placeholder="Warranty Number"
            placeholderTextColor="#888"
            onChangeText={value => (setWarrantyNumber(value))}
            value={warrantyNumber}
          />
        </View>

        <View style={{ width: '50%' }}>
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            placeholderTextColor="#888"
            onChangeText={value => (setmobilenumber(value))}
            value={mobilenumber}
          />
        </View>

      </View>
      <TouchableOpacity style={styles.button} onPress={handleSearchMissingImage}>
        <Text style={styles.buttonText}> Search   <Icon name="search" size={20} color="white" /></Text>
      </TouchableOpacity>

      {
        isloading ?
          <ActivityIndicator size={20} color='black' /> :
          <>
            <View style={styles.radioButtonLabelContainer}>

              <View style={{ alignItems: 'center', justifyContent: 'center', width: '50%' }}>
                <Text style={styles.radioLabelHeader}>Warranty No.</Text>
              </View>

              <View style={{ width: '50%' }}>
                <Text style={styles.radioLabelHeader}>Mobile No.</Text>
              </View>

            </View>

            {/* <View style={{width:'100%'}} >
{searchresult.map((item, index) => (
    <View style={{justifyContent:'center', width:'100%'}}>
        <TouchableOpacity style={styles.radioButton} onPress={() => navigateTo(item.warrantyNo)}>
            <View style={{width : '50%'}}>
              <Text style={styles.radioLabel_warranty_num}>{item.warrantyNo}</Text>
            </View>
            <View style={{width : '50%'}}>
              <Text style={styles.radioLabel_mobile_num}>{item.mobileNo}</Text>
            </View>    
        </TouchableOpacity>
    </View>
  ))} */}
            <View style={{ width: '100%' }}>
              {/* {isloading ? (
  <Text>Loading...</Text>
) : ( */}
              <View >
                {searchresult.map((item, index) => (
                  <View style={{ justifyContent: 'center', width: '100%' }}>
                    <TouchableOpacity style={styles.radioButton} onPress={() => handleMissingImageUpload(item)}>
                      <View style={{ width: '50%' }}>
                        {
                          item.WarrantyID === null ?
                            <Text style={styles.radioLabel_warranty_num}>--</Text> :
                            <Text style={styles.radioLabel_warranty_num}>{item.WarrantyID}</Text>
                        }

                      </View>
                      <View style={{ width: '50%' }}>
                        <Text style={styles.radioLabel_mobile_num}>{item.MobileNo}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}

                {/* <Text style={styles.text}>Missing Photo: {data.MissingPhoto}</Text>*/}
              </View>
              {/* )
} */}
            </View >
          </>
      }


      {/* <UpdateMissingImage /> */}

      {/* {missingimage && missingimage.map(item => (
        <Text>{item.MobileNo}</Text>
      ))} */}
      {/* {
        isloading ?
          <Text>loading</Text> :
          <FlatList
            data={missingimage}
            renderItem={renderItem}
            scrollEnabled={false}
          // keyExtractor={(item) => item.id}
          />
      } */}

      {/* <View style={styles.checklogoContainer}>
        <Image source={require('../../assets/images/logo/tclogo.png')} style={{height:50,width: 100}} resizeMode='contain' />
        <Text style={styles.powerByText}>Powered by <Text style={styles.checktext}>Check</Text><Text style={styles.exploretext}>Explore</Text> </Text>
    </View> */}


    </ScrollView >
  );
};



export default AddImage;
