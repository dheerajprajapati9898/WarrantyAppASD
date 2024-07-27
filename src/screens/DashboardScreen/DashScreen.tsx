import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, ScrollView, Alert, Button, Platform, RefreshControl, Modal, ActivityIndicator } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import { setupDatabase } from '../../db/Registration/database';
// Import SQLite operations and database setup functions
import { searchItems, getAllItems } from '../../db/Registration/sqliteOperations';
import styles from './styles'; // Assuming you have a styles file for your component
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useNavigation } from '@react-navigation/native';
import ViewPDF from '../ViewPDF/ViewPDF';
import axios from 'axios';

import NetInfo from '@react-native-community/netinfo';
import { AESExtensions } from '../AESExtensions';
const Dashboard = () => {
  const navigation = useNavigation();
  const [values, setValues] = useState([]); // State for storing search results
  const [mobileNumber, setMobileNumber] = useState('9814524624'); // State for mobile number input
  const [warrantyId, setwarrantyId] = useState('101366'); // State for mobile number input
  const [fromDate, setFromDate] = useState(new Date()); // State for From Date picker
  const [toDate, setToDate] = useState(new Date()); // State for To Date picker
  const [openFromDate, setOpenFromDate] = useState(false); // State to control visibility of From Date picker
  const [display, setDisplay] = useState(false);
  const [openToDate, setOpenToDate] = useState(false); // State to control visibility of To Date picker
  const [modalVisible, setModalVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(null);

  // Function to handle confirmation of From Date picker
  const handleFromDateConfirm = (selectedDate) => {
    setOpenFromDate(false); // Close From Date picker
    setFromDate(selectedDate); // Update From Date state
  };

  // Function to handle confirmation of To Date picker
  const handleToDateConfirm = (selectedDate) => {
    setOpenToDate(false); // Close To Date picker
    setToDate(selectedDate); // Update To Date state
  };

  // Function to handle cancellation of Date pickers
  const handleCancel = () => {
    setOpenFromDate(false); // Close From Date picker
    setOpenToDate(false); // Close To Date picker
  };
  const [db, setDb] = useState<SQLiteDatabase | null>(null);


  useEffect(() => {
    // fetchData()
    // if (yourReferenceRef.current) {
    //   // Replace `yourReferenceOffset` with the actual offset you want to scroll to
    //   const yourReferenceOffset = yourReferenceRef.current.offsetTop;
    //   scrollViewRef.current.scrollTo({ y: yourReferenceOffset, animated: true });
    // }
    const initializeDatabase = async () => {
      const database = await setupDatabase();
      setDb(database);
      // fetchItems(database);
      // setVehicleDetails(prevDetails => ({
      //   ...prevDetails,
      //   tyre1Image: imageUri
      // }));
    };
    initializeDatabase();
    console.log("values", warrantySearchData);

    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type:', state.type);
      console.log('Is connected?', state.isConnected);
      setIsConnected(state.isConnected);
    });

    // Initial check when component mounts
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const [warrantySearchData, setWarrantySearchData] = useState();
  const clicked = async () => {
    const contactRegex = /^[0-9+\-]+$/; // Regex pattern: digits, plus sign, and hyphen
    if (!contactRegex.test(mobileNumber)) {
      Alert.alert('Validation Error', 'Contact number can only contain digits, plus sign (+), and hyphens (-)');
      return;
    }

    if (mobileNumber === '' || fromDate === null || toDate === null) {
      Alert.alert("Error", "Fields are required!")
      return
    }

    // Function to format date as YYYY-MM-DD
    const formatDateForORM = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Format fromDate and toDate as YYYY-MM-DD for ORM usage
    const fromDateORMFormat = formatDateForORM(fromDate);
    const toDateORMFormat = formatDateForORM(toDate);
    if (isConnected) {
      const requestdata = {
        "warranty_ID": warrantyId,
        'reg_no': "",
        'fromDate': "",
        "toDate": "",
        "user_Name": "",
        "dealer_Distributor": "",
        "custMobileNo": mobileNumber,
        "state_Id": ""
      }
      const encryptedlogindata = AESExtensions.encryptString(requestdata)
      console.log("encrypted", encryptedlogindata);
      // return
      const payload = {
        "requestId": "",
        "isEncrypt": "",
        "requestData": encryptedlogindata,
        "sessionExpiryTime": "",
        "userId": "1"
        // "requestId": "",
        // "isEncrypt": "",
        // "requestData": JSON.stringify({ helper }),
        // "sessionExpiryTime": "",
        // "userId": 1
        // warranty_ID: warrantyId, fromDate: fromDateORMFormat, toDate: toDateORMFormat, custMobileNo: 9814524624
        // WarrantyID: warrantyId,
        // CreatedDate: fromDateORMFormat
      };
      // console.log(payload);
      // return


      try {

        const response = await axios.post('https://warrantyuat.tyrechecks.com/api/Warranty/SearchWarranty', payload);
        const plaintextoflogindata = AESExtensions.decryptString(response.data.responseData)
        console.log("Asdasdasd", plaintextoflogindata);
        // console.log(response.data)

        setWarrantySearchData(plaintextoflogindata)
        console.log(datavalue);
        // return
        datavalue.forEach((item) => {
          console.log("CustomerName:", item.CustomerName);
        });
        // console.log("First item:", response.data.responseData);
        return
        setWarrantySearchData(response.data.responseData)
        // console.log("First item:", response.status);
        // if (response.data && response.data.success) {
        //   // setStateItem(response.data[0]);
        //   console.log("First item:", response.data[0]);
        // } else {
        //   console.log("No data received or response is not an array.");
        // }
        // const warrantyiddata = response.data.WarrantyID === 101987
        // console.log(stateItem)
        // if (response.data) {
        //   // Filter the response data based on WarrantyID
        //   const filterdata = response.data.filter(item => item.WarrantyID === warrantyId);

        //   // Log the filtered data
        //   console.log("Response:", filterdata);
        // } else {
        //   console.log("No data received from the server.");
        // }
      } catch (error) {
        console.error("Error fetching warranty data:", error);
      }

    }
    else {
      searchItems(db, mobileNumber, fromDateORMFormat, toDateORMFormat)
        .then((results) => {
          setValues(results); // Update items state with search results
        })
        .catch((error) => {
          console.error('Error searching items:', error);
          // Handle error if needed
        });
    }

    const helper = { warranty_ID: warrantyId, fromDate: fromDateORMFormat, toDate: toDateORMFormat, custMobileNo: 9814524624 }




    // }
  };
  const [value, setValue] = useState({
    name: '',
    mobilenumber: ''
  }

  )
  const scrollViewRef = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);


  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;

    // Adjust this threshold as needed to trigger refresh
    if (distanceFromBottom < 100 && !isLoadingMore) {
      setIsLoadingMore(true);
      // fetchData();
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    // Simulated refreshing action
    setTimeout(() => {
      setData([]);
      // fetchData();
      setRefreshing(false);
    }, 1000); // Simulated delay
  };
  const createPDF = (item) => {
    try {
      console.log("item", item)
      // let options = {
      //   html: '<h1>customer Name: ${customerName}</h1>',
      //   fileName: 'test',
      //   directory: 'Download',
      // };

      // let file = await RNHTMLtoPDF.convert(options)
      // // console.log(file.filePath);
      // Alert.alert(file.filePath);
      // console.log("path", file.filePath);
      const params = {
        id: item.WarrantyID,
        customername: item.CustomerName,
        mobileNumber: item.MobileNo,
        tyresize: item.Size,
        customerstate: item.CustomerState,
        dealerstate: item.DealerState,
        registrationdate: item.CreatedDate
      };
      console.log("clicking automatic");


      // Navigate to 'ViewPDF' screen and pass params
      navigation.navigate('ViewPDF', params);
    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <ScrollView contentContainerStyle={styles.container} ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16} // Adjust scroll event throttle as needed
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color="black" />
          </View>
        </View>
      </Modal>
      {/* <Button title='asdasdasdasdasdsa' onPress={handlePostRequest}/> */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo/tractor.png')}
          style={{ height: 100, width: 100 }}
          resizeMode="contain"
        />
      </View>

      <View>
        {
          isConnected ?
            <TextInput
              style={styles.input}
              placeholder="Warranty Number"
              placeholderTextColor="#000"
              // value={warrantyId}
              onChangeText={text => setwarrantyId(text)}
            /> :
            <TextInput
              style={styles.input}
              placeholder="Warranty Number (optional)"
              placeholderTextColor="#000"
              // value={warrantyId}
              onChangeText={text => setwarrantyId(text)}
            />
        }

        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor="#000"
          maxLength={10}

          onChangeText={text => setMobileNumber(text)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.calenderContainer}>
        <TouchableOpacity
          style={styles.calenderbutton}
          onPress={() => setOpenFromDate(true)}>
          <Text style={styles.buttonText}>
            {fromDate.toLocaleDateString()}{' '}
            <Icon name="calendar" size={20} color="white" />
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          mode="date"
          open={openFromDate}
          date={fromDate} // Ensure fromDate is a Date object
          onConfirm={handleFromDateConfirm}
          onCancel={handleCancel}
          buttonColor="#e11e30"
          dividerColor="#e11e30"
        />

        <TouchableOpacity
          style={styles.calenderbutton}
          onPress={() => setOpenToDate(true)}>
          <Text style={styles.buttonText}>
            {toDate.toLocaleDateString()}{' '}
            <Icon name="calendar" size={20} color="white" />
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          mode="date"
          open={openToDate}
          date={toDate} // Ensure toDate is a Date object
          onConfirm={handleToDateConfirm}
          onCancel={handleCancel}
          buttonColor="#e11e30"
          dividerColor="#e11e30"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={clicked}>
        <Text style={styles.buttonText}>
          {' '}
          Search <Icon name="search1" size={20} color="white" />
        </Text>
      </TouchableOpacity>

      {/* Display search results */}
      {
        isConnected ?
          <FlatList
            data={warrantySearchData}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (

              <>

                <View style={styles.displayMain}>

                  {/* Display fields */}
                  {/* Example display fields, replace with your actual data */}
                  <View style={styles.displayContainer}>
                    <Text style={styles.displayText}>
                      {' '}
                      <Text style={styles.boldText}> Warranty Id :</Text>
                    </Text>
                    <Text style={styles.displayText}> {item.WarrantyID}</Text>
                  </View>

                  <View style={styles.displayContainer}>
                    <Text style={styles.displayText}>
                      {' '}
                      <Text style={styles.boldText}> Customer :</Text>
                    </Text>
                    <Text style={styles.displayText}> {item.CustomerName}</Text>
                  </View>

                  <View style={styles.displayContainer}>
                    <Text style={styles.displayText}>
                      {' '}
                      <Text style={styles.boldText}> Contact :</Text>
                    </Text>
                    <Text style={styles.displayText}> {item.MobileNo}</Text>
                  </View>

                  <View style={styles.displayContainer}>
                    <Text style={styles.displayText}>
                      {' '}
                      <Text style={styles.boldText}> Vehicle Number :</Text>
                    </Text>
                    <Text style={styles.displayText}> MH01SJ0809</Text>
                  </View>

                  <View style={styles.displayContainer}>
                    <Text style={styles.displayText}>
                      {' '}
                      <Text style={styles.boldText}> Tyre Size :</Text>
                    </Text>
                    <Text style={styles.displayText}> {item.Size}</Text>
                  </View>

                  <View style={styles.displayContainer}>
                    <Text style={styles.displayText}>
                      {' '}
                      <Text style={styles.boldText}>Customer State :</Text>
                    </Text>
                    <Text style={styles.displayText}> {item.CustomerState}</Text>
                  </View>

                  <View style={styles.displayContainer}>
                    <Text style={styles.displayText}>
                      {' '}
                      <Text style={styles.boldText}>Dealer State :</Text>
                    </Text>
                    <Text style={styles.displayText}> {item.DealerState}</Text>
                  </View>

                  <View style={styles.displayContainer}>
                    <Text style={styles.displayText}>
                      {' '}
                      <Text style={styles.boldText}>Registration Date :</Text>
                    </Text>
                    <Text style={styles.displayText}> {item.CreatedDate}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.displaybutton}
                    onPress={() => createPDF(item)}>
                    <Text style={styles.buttonText}> View PDF </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          />
          :
          <FlatList
            data={values}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (

              <>

                <View style={styles.displayMain}>

                  {/* Display fields */}
                  {/* Example display fields, replace with your actual data */}
                  <View style={styles.displayContainer}>
                    <Text style={styles.displayText}>
                      {' '}
                      <Text style={styles.boldText}> Warranty Id :</Text>
                    </Text>
                    <Text style={styles.displayText}> {item.WarrantyID}</Text>
                  </View>

                  <View style={styles.displayContainer}>
                    <Text style={styles.displayText}>
                      {' '}
                      <Text style={styles.boldText}> Customer :</Text>
                    </Text>
                    <Text style={styles.displayText}> {item.CustomerName}</Text>
                  </View>

                  <View style={styles.displayContainer}>
                    <Text style={styles.displayText}>
                      {' '}
                      <Text style={styles.boldText}> Contact :</Text>
                    </Text>
                    <Text style={styles.displayText}> {item.MobileNo}</Text>
                  </View>

                  <View style={styles.displayContainer}>
                    <Text style={styles.displayText}>
                      {' '}
                      <Text style={styles.boldText}> Vehicle Number :</Text>
                    </Text>
                    <Text style={styles.displayText}> MH01SJ0809</Text>
                  </View>

                  <View style={styles.displayContainer}>
                    <Text style={styles.displayText}>
                      {' '}
                      <Text style={styles.boldText}> Tyre Size :</Text>
                    </Text>
                    <Text style={styles.displayText}> {item.Size}</Text>
                  </View>

                  <View style={styles.displayContainer}>
                    <Text style={styles.displayText}>
                      {' '}
                      <Text style={styles.boldText}>Customer State :</Text>
                    </Text>
                    <Text style={styles.displayText}> {item.CustomerState}</Text>
                  </View>

                  <View style={styles.displayContainer}>
                    <Text style={styles.displayText}>
                      {' '}
                      <Text style={styles.boldText}>Dealer State :</Text>
                    </Text>
                    <Text style={styles.displayText}> {item.DealerState}</Text>
                  </View>

                  <View style={styles.displayContainer}>
                    <Text style={styles.displayText}>
                      {' '}
                      <Text style={styles.boldText}>Registration Date :</Text>
                    </Text>
                    <Text style={styles.displayText}> {item.CreatedDate}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.displaybutton}
                    onPress={() => createPDF(item)}>
                    <Text style={styles.buttonText}> View PDF </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          />
      }


      <View style={styles.checklogoContainer}>
        <Image
          source={require('../../assets/images/logo/tclogo.png')}
          style={{ height: 50, width: 100 }}
          resizeMode="contain"
        />
        <Text style={styles.powerByText}>
          Powered by <Text style={styles.checktext}>Check</Text>
          <Text style={styles.exploretext}>Explore</Text>{' '}
        </Text>
      </View>






    </ScrollView>
  );
};

export default Dashboard;

