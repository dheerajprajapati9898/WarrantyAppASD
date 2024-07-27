import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TextInput, Pressable, TouchableOpacity, Alert, Modal, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../utils/types';
import axios from 'axios';
import { setupMasterSyncUpdateDatabase, getAllMasterSyncUpdateItems, insertMasterSyncUpdateItems, clearMasterSyncUpdateTable, updateMasterSyncUpdateItem } from './../../db/MasterSyncUpdate/MasterSyncUpdate'
type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;
import { setupLoginDatabase, getAllLoginItems, insertLoginItems, loginInsertChecked } from "./../../db/Login/Login"
import NetInfo from '@react-native-community/netinfo';
import { setUserName, getUserName, setUserId, getUserId, setIsLogin } from './../../components/SharedPreference'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AESExtensions } from '../AESExtensions';
import RemoteUrls from '../apiUrl';
import { setupRegexDatabase, getAllRegexItems, insertRegexItems, clearRegexTable } from './../../db/regex/regex'
import { setupMultiLanguageDatabase, getAllMultiLanguageItems, insertMultiLanguageItems, clearMultiLanguageTable } from './../../db/multilanguage/multilanguage'
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
function Login(props): React.JSX.Element {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [isConnected, setIsConnected] = useState(null);
  const [loginItems, setLoginItems] = useState([]);
  const navigation = useNavigation();
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('Pass@1234')
  const [modalVisible, setModalVisible] = useState(false);
  const options = [
    { apiname: 'State Master', is_status: false },
    // { apiname: 'City Master', is_status: false },
    // { apiname: 'District Master', is_status: false },
    { apiname: 'Pincode Master', is_status: false },
    { apiname: 'Vehicle Make Master', is_status: false },
    { apiname: 'Vehicle Modal Master', is_status: false },
    { apiname: 'Tyre Brand Master', is_status: false },
    { apiname: 'Product Name Master', is_status: false },
    { apiname: 'Tyre Size Master', is_status: false },
    { apiname: 'Old Tyre Company Master', is_status: false },
    { apiname: 'Old Tyre Brand Master', is_status: false },
    { apiname: 'Vehicle Type Master', is_status: false },
    { apiname: 'Vehicle Variant Master', is_status: false },


    // { apiname: 'Photo Category', is_status: false },
  ];

  useEffect(() => {
    setupMultiLanguageDatabase()
    setupRegexDatabase()
    clearRegexTable('regex')
    console.log("getlanguage", getAllMultiLanguageItems());

    setupMasterSyncUpdateDatabase()
    fetchingtheagencyfeture()
    console.log("Asdasdasdasdasdasdsads", getAllMultiLanguageItems());

    setupLoginDatabase()
    // const mpinStorage = async () => {
    //   const storedMpin = await AsyncStorage.getItem('mpin');
    //   console.log("storedMpin", storedMpin);
    //   if (storedMpin?.length === 4) {
    //     navigation.replace('MPIN_Login')
    //     return
    //   }
    // }

    // mpinStorage()
    // const unsubscribe = NetInfo.addEventListener(state => {
    //   console.log('Connection type:', state.type);
    //   console.log('Is connected?', state.isConnected);
    //   setIsConnected(state.isConnected);
    // });

    // // Initial check when component mounts
    // NetInfo.fetch().then(state => {
    //   setIsConnected(state.isConnected);
    // });

    // return () => {
    //   unsubscribe();
    // };

    camerapermission()
    requestLocationPermission()
  }, []);
  const camerapermission = async () => {
    const permission = await check(PERMISSIONS.ANDROID.CAMERA);

    if (permission === RESULTS.DENIED || permission === RESULTS.BLOCKED) {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      if (result !== RESULTS.GRANTED) {
        console.log('Camera permission denied');

      }
    }
  }
  const requestLocationPermission = async () => {
    try {
      let permission;
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      } else {
        permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      }

      const result = await request(permission);

      if (result === RESULTS.GRANTED) {
        console.log('Permission granted');
        // Location permission is granted
      } else if (result === RESULTS.DENIED) {
        console.log('Permission denied');
        // Location permission is denied
      } else if (result === RESULTS.BLOCKED) {
        console.log('Permission blocked');
        // Location permission is blocked
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };
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

  const fetchingtheagencyfeture = async () => {
    const payload = {
      "requestId": "",
      "isEncrypt": "",
      "requestData": "",
      "sessionExpiryTime": "",
      "userId": ""
    }
    try {
      const response = await axios.post(RemoteUrls.postAgencyFeatureUrl, payload);
      const parsevalue = JSON.parse(response.data.responseData)
      console.log("fetchingtheagencyfeture", parsevalue);
      if (Array.isArray(parsevalue)) {
        for (let i = 0; i < parsevalue.length; i++) {
          const {
            AgencyId,
            AgencyListId,
            DefaultValue,
            FeatureCode,
            FeatureDesc,
            FeatureID,
            FeatureShortName,
            KeyValue
          } = parsevalue[i];

          const newItem = {
            AgencyId,
            AgencyListId,
            DefaultValue,
            FeatureCode,
            FeatureDesc,
            FeatureID,
            FeatureShortName,
            KeyValue
          };

          console.log("New item:", newItem);

          // Assuming you want to insert each item into a database or perform further processing
          if (response.data.responseCode === 200 || response.status === 200) {

            await insertRegexItems(newItem);
          }
        }
      } else {
        console.error('Error: parsevalue is not an array or is undefined');
      }
    } catch (err) {
      console.log(err);

    }

  }
  const checkUserMpinExist = async () => {
    try {
      const itemsFromDb = await getAllLoginItems();
      // setModelItems(modelItems);
      console.log("itemsFromDb", itemsFromDb);
      if (itemsFromDb.mpin === null) {
        return false
      }
      else {
        return true
      }

    } catch (error) {
      console.error('Fetch error:', error);
      return false
    }
  };
  const [isLogin, setIsLogin] = useState(false);
  const [isPinAvailable, setIsPinAvailable] = useState(false);
  const [plainText, setplainText] = useState('');
  const [encryptedText, setencryptedText] = useState('');

  const handleLogin = async () => {
    // if(username===''||password===''){
    //   Alert.alert("Error","username & password is required!")
    //   return
    // }

    await clearMasterSyncUpdateTable('mastersync')
    await insertMasterSyncUpdateItems(options)
    const requestdata = {
      "Username": username,
      "Password": password
    }
    // const requestdata = `{\"Username\":\"${username}\",\"Password\":\"${password}\"}`
    // console.log("Asdasdasd", requestdata);
    // return

    // const requestdata = "{\"Username\":\"dealer\",\"Password\":\"Dealer@2022\"}"
    // console.log("Asdasdasd", requestdata);
    // return
    const encryptedlogindata = AESExtensions.encryptString(requestdata)
    console.log("encrypted", encryptedlogindata);

    // return
    try {
      // setModalVisible(true)
      const payload = {
        'requestId': "",
        "isEncrypt": "",
        "requestData": encryptedlogindata,
        "sessionExpiryTime": "",
        "userId": ""
      };
      // console.log(payload);

      // return
      const response = await axios.post(RemoteUrls.postloginUrl, payload);
      // const plaintextoflogindata = AESExtensions.decryptString(response.data.responseData)
      console.log("adasdasadadad", response.data);

      const plaintextoflogindata = AESExtensions.decryptString(response.data.responseData)
      console.log("Asdasdasdchecking", plaintextoflogindata);

      // return
      if (response.status === 200) {
        // const usernameRegex = regex[1].KeyValue
        // const passwordRegex = regex[2].KeyValue
        // if (!usernameRegex.test(username)) {
        //   Alert.alert('Validation Error', 'Username formate is invalid');
        //   return;
        // }
        // if (!passwordRegex.test(password)) {
        //   Alert.alert('Validation Error', 'Password formate is invalid');
        //   return;
        // }

        setModalVisible(true)
        // const responseData = JSON.parse(response.data.responseData);
        console.log("plaintextoflogindata.UserId", plaintextoflogindata.UserID);
        // return
        await insertLoginItems(plaintextoflogindata, plaintextoflogindata.UserID)
        await setUserId(plaintextoflogindata.UserID)

        // return

        await loginInsertChecked(plaintextoflogindata, plaintextoflogindata.UserID);

        const usermpin_exist = await checkUserMpinExist()
        // return
        navigation.replace('HomeDrawer');
        const response = await axios.get(RemoteUrls.postMultiLanguageUrl, {
          headers: {
            'Accept': '*/*',
          },
        });
        // Assuming response.data is an object
        // const data = response.data;
        // const datavlue = data['english.json']
        // const cleanedString = datavlue.replace(/^"|"$/g, '');
        // const jsonObject = JSON.parse(cleanedString);
        // // return
        // const items = Object.entries(jsonObject).map(([key, value]) => ({
        //   key,
        //   value
        // }));
        // // Call the insert function with the transformed data
        // await clearMultiLanguageTable('multilaguage');
        // await insertMultiLanguageItems(items);
        // console.log("Element:", items);

        if (usermpin_exist) {
          navigation.replace('MPIN_Login');

        }
        else {
          camerapermission()
          requestLocationPermission()
          navigation.replace('CreateMPIN');

        }



      }
      else {
        Alert.alert("Login failed", "Invaid email & passoword")
      }
    } catch (error) {
      Alert.alert("", "Something went wrong")
      console.error('Post Data Error:', error);
      throw error; // Throw the error for further handling
    } finally {
      setModalVisible(false)
    }
    // Perform login logic here
    // On success:
    //  navigation.replace('HomeDrawer');

  };
  // if(isLogin){
  //   navigation.replace('HomeDrawer');

  // }
  const [multilaugagaeloading, setmultilaugagaeloading] = useState(false)
  const handleFetchMultipleLanguage = async (language) => {

    try {
      setmultilaugagaeloading(true)
      if (language === 'english') {
        const response = await axios.get(RemoteUrls.postMultiLanguageUrl, {
          headers: {
            'Accept': '*/*',
          },
        });
        // Assuming response.data is an object
        const data = response.data;
        const datavlue = data['english.json']
        // const cleanedString = datavlue.replace(/^"|"$/g, '');
        // const jsonObject = JSON.stringify(cleanedString);
        // return
        // const items = Object.entries(jsonObject).map(([key, value]) => ({
        //   key,
        //   value
        // }));

        const dsasdas = await getAllMultiLanguageItems()

        const obj = dsasdas.value.slice(0, dsasdas.value.length - 1)
        console.log("adsasdfsamkhb fiuasdyefuishdaufuj", datavlue);
        console.log("adsasdfsamkhb fiuasdyefuishdaufujadasdasdasdas", obj.slice(0, 10));

        // Call the insert function with the transformed data
        // await clearMultiLanguageTable('multilaguage');
        // await insertMultiLanguageItems('english.json', datavlue);
        // console.log("Element:", items);
        return
      }
      if (language === 'hindi') {
        const response = await axios.get(RemoteUrls.postMultiLanguageUrl);
        // Assuming response.data is an object
        const data = response.data;
        const datavlue = data['hindi.json']
        const cleanedString = datavlue.replace(/^"|"$/g, '');
        const jsonObject = JSON.parse(cleanedString);
        // return
        const items = Object.entries(jsonObject).map(([key, value]) => ({
          key,
          value
        }));
        // Call the insert function with the transformed data
        await clearMultiLanguageTable('multilaguage');
        await insertMultiLanguageItems(items);
        console.log("Element:", items);
        return
      }
      if (language === "marathi") {
        const response = await axios.get(RemoteUrls.postMultiLanguageUrl, {
          headers: {
            'Accept': '*/*',
          },
        });
        // Assuming response.data is an object
        const data = response.data;
        const datavlue = data['marathi.json']
        const cleanedString = datavlue.replace(/^"|"$/g, '');
        const jsonObject = JSON.parse(cleanedString);
        // return
        const items = Object.entries(jsonObject).map(([key, value]) => ({
          key,
          value
        }));
        // Call the insert function with the transformed data
        await clearMultiLanguageTable('multilaguage');
        await insertMultiLanguageItems(items);
        console.log("Element:", items);
        return
      }
      if (language === "punjabi") {
        const response = await axios.get(RemoteUrls.postMultiLanguageUrl, {
          headers: {
            'Accept': '*/*',
          },
        });
        // Assuming response.data is an object
        const data = response.data;
        const datavlue = data['punjabi.json']
        const cleanedString = datavlue.replace(/^"|"$/g, '');
        const jsonObject = JSON.parse(cleanedString);
        // return
        const items = Object.entries(jsonObject).map(([key, value]) => ({
          key,
          value
        }));
        // Call the insert function with the transformed data
        await clearMultiLanguageTable('multilaguage');
        await insertMultiLanguageItems(items);
        console.log("Element:", items);
        return
      }
    }
    catch (error) {
      console.error("Error fetching data:", error);
      // Handle error if any
    }
    finally {
      setmultilaugagaeloading(false)
    }

  }

  return (

    <View style={styles.container}>
      {/* <View style={styles.yokohamalogContainer}>
      <Image source={require('./src/assets/images/logo/logo.png')} style={styles.yokohamalogo} resizeMode='contain' />

      </View> */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color="black" />
            <Text>Logging you in..</Text>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={multilaugagaeloading}
        onRequestClose={() => {
          setmultilaugagaeloading(!multilaugagaeloading);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color="black" />
            <Text>Please wait.</Text>
          </View>
        </View>
      </Modal>
      <View style={styles.contentContainer}>
        <Text style={styles.logintext}>LOGIN</Text>

        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            placeholder="MOBILE NUMBER / DEALER ID"
            cursorColor='white'
            color="white"
            placeholderTextColor="grey"
            autoCorrect={false}
            autoCapitalize='none'
            value={username}
            onChangeText={(val) => setUsername(val)}
          />
          <TextInput
            style={styles.input}
            placeholder="PASSWORD"
            cursorColor='white'
            color="white"
            secureTextEntry
            placeholderTextColor="grey"
            autoCorrect={false}
            autoCapitalize='none'
            value={password}
            onChangeText={(val) => setPassword(val)}
          />
        </View>

        <View style={styles.loginbuttonView}>
          <Pressable style={styles.loginbutton} onPress={handleLogin}>
            <Text style={styles.loginbuttonText}>LOGIN</Text>
          </Pressable>
        </View>

        <View style={{ flex: 0.5 }}>
          {/* <Text style={styles.forgot_password_text} onPress={() => props.navigation.navigate("ChangePassword")}>Forgot Password?</Text> */}
          <Text style={styles.MPinLoginText} onPress={() => props.navigation.navigate("LoginWithOTP")}>Login wit OTP</Text>
        </View>

        <View style={{ width: '100%', alignItems: 'center', flexDirection: 'column', flex: 0.5 }}>
          {/* <TouchableOpacity></TouchableOpacity> */}
          <Text style={styles.languagetext}>Language :
            <TouchableOpacity onPress={() => handleFetchMultipleLanguage('english')}>
              <Text style={styles.languageredtext}> English </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFetchMultipleLanguage('hindi')}>
              <Text style={styles.languageredtext}> हिंदी </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFetchMultipleLanguage('marathi')}>
              <Text style={styles.languageredtext}>
                मराठी </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFetchMultipleLanguage('punjabi')}>
              <Text style={styles.languageredtext}> ਪੰਜਾਬੀ </Text>
            </TouchableOpacity>
            {/* <Text style={styles.languageredtext}> English हिंदी ਪੰਜਾਬੀ </Text> */}

          </Text>
          <TouchableOpacity onPress={() => props.navigation.navigate("HelpAndSupport")}>
            <Text style={styles.helpandsupporttext}>Help & Support</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.checkexplorelogoContainer}>
        <Text style={styles.powerByText}>Powered by <Text style={styles.checktext}>Check</Text><Text style={styles.exploretext}>Explore</Text> </Text>
        <Image source={require('../../assets/images/logo/tclogo.png')} style={styles.checkexploreLogo} resizeMode='contain' />
      </View>



    </View>
  );
}

export default Login;



