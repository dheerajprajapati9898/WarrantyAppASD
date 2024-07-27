import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, TextInput, Modal, ScrollView, TouchableOpacity, Image, FlatList, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { setupDatabase } from './../../db/Registration/database'; // Adjust the import path as necessary
import { getAllItems, updateItem, deleteItem, getItemsById, getAll, updateSyncStatusWR } from "./../../db/Registration/sqliteOperations";
import Icon from 'react-native-vector-icons/FontAwesome';
import { SelectList } from 'react-native-dropdown-select-list';
import { setupStateDatabase, getAllStateItems, getStateid } from './../../db/Registration/StateDb';
import { setupPinCodeDatabase, getAllPinCodeItems } from './../../db/Registration/PinCodeDb';
import {
  setupTractorMakeDatabase,
  getAllTractorMakeItems, getVehicleByVehTypeid
} from './../../db/Registration/TractorMakeDb';
import { setupTractorModelDatabase, getAllTractorModelItems, insertTractorModelItems, getVehicleModelByVehTypeid } from './../../db/Registration/TractorModelDb';
import { setupBrandNasadmeDatabase, getAllBrandNasadmeItems, insertBrandNasadmeItems } from './../../db/Registration/BrandName';
import { setupProductNameDatabase, getAllProductNameItems, insertProductNameItems } from './../../db/Registration/ProductNameDb';
import { setupTyreSizeDatabase, getAllTyreSizeItems, insertTyreSizeItems } from './../../db/Registration/TyreSizeDb';
import { setupOldTyreBrandNameDatabase, getAllOldTyreBrandNameItems, insertOldTyreBrandNameItems } from './../../db/Registration/OldTyreBrandName';
import { setupOldTyreCompanyDatabase, getAllOldTyreCompanyItems, insertOldTyreCompanyItems } from './../../db/Registration/OldTyreCompany';
import styles from './styles';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import axios from 'axios';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import { SimultaneousGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gestureComposition';
import { setupLoginDatabase, getAllLoginItems, insertLoginItems, loginInsertChecked } from "./../../db/Login/Login"
import { getAllVehicleTypeItems, setupVehicleTypeDatabase } from '../../db/Registration/VehicleTypeDb';
import { setupVehicleVariantDatabase, getAllVehicleVariantItems, insertVehicleVariantItems, clearVehicleVariantTable, getVariantByMakeID } from './../../db/Registration/VehicleVariant'
import { longPressHandlerName } from 'react-native-gesture-handler/lib/typescript/handlers/LongPressGestureHandler';
import DeviceInfo from 'react-native-device-info';
import UpdateWarrantyRegistration from '../UpdateWarrantyRegistration/UpdateWarrantyRegistration';
import WarrantyRegistrationForm from '../RegistrationScreen/RegistrationScreen';
import { AESExtensions } from '../AESExtensions';
const Outbox = () => {

  const [option, setOption] = useState({});
  const [deviceName, setDeviceName] = useState('');
  // <<<<<<< HEAD
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [items, setItems] = useState<Item[] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [loginItems, setLoginItems] = useState();
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
    fetchItems(db)
    fetchogin()
    setTimeout(() => {
      setData([]);
      // fetchData();
      setRefreshing(false);
    }, 1000); // Simulated delay
  };
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const database = await setupDatabase();
        setDb(database);
        await fetchItems(database);
        await fetchogin()
        await setupLoginDatabase()
      } catch (error) {
        console.error('Error initializing database:', error);
      }

    };
    initializeDatabase();
    const value = items?.map(item => (

      console.log("Adsadasdasd", item.isStatus === 1)
    )
    )
    console.log(value);



    setWarrantyPostObject([])
    const fetchDeviceInfo = async () => {
      try {
        const name = await DeviceInfo.getDeviceName();
        setDeviceName(name);
      } catch (error) {
        console.error('Error fetching device name:', error);
      }
    };

    fetchDeviceInfo();
    // console.log("loginItems", loginItems);


  }, []);
  const fetchItems = async (database: SQLiteDatabase) => {
    try {
      const fetchedItems = await getAllItems(database);
      setItems(fetchedItems);
      console.log("fetchedItems", fetchedItems);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchogin = async () => {
    try {
      const fetchedItems = await getAllLoginItems();
      setLoginItems(fetchedItems);
      // console.log("fetchedItems", fetchedItems);
    } catch (error) {
      console.error(error);
    }
  };
  const openModal = (item: Item) => {
    console.log("itemadsasdasdasdas", item);

    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleUpdate = async () => {
    if (!db || !selectedItem) return;
    console.log("state", selectedItem.state, "stateid", selectedItem.state_id);

    try {

      await updateItem(db, selectedItem.id, selectedItem);
      fetchItems(db);
      closeModal();
      Alert.alert("Success", "Registration Form updated successfully!")
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };
  const [registrationOption, setRegistrationOption] = useState(null);
  const RadioButtonColor: string = '#e11e30';
  const [selectedOption, setSelectedOption] = useState(false);
  const [warrantyPostObject, setWarrantyPostObject] = useState([]);

  const handleRadioButtonChange = (value) => {
    console.log(value);

    setSelectedOption(value);
  };

  const handleCheckboxChange = async (index, item) => {
    item.isChecked = !item.isChecked
    if (item.isChecked) {
      console.log("item", item);
      const warrantyData = await getItemsById(db, item.id)
      console.log("warrantyData", warrantyData);
      setWarrantyPostObject([...warrantyPostObject, warrantyData[0]])
      console.log("warrantyData", warrantyPostObject);
    }


    else {

      const updatedItems = warrantyPostObject.filter(items => items.id !== item.id);
      console.log("updatedItems", updatedItems);

      setWarrantyPostObject(updatedItems)
    }

    // console.log(item)

  };
  const renderItem = ({ item }: { item: Item }) => (
    <View style={{ borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10 }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Text>id: {item.id}</Text>
        {
          item.isStatus ? <Text style={{ textAlign: 'center', backgroundColor: '#a6edb4', width: 80, color: 'black', borderRadius: 15 }}>complete</Text> :
            <Text style={{ textAlign: 'center', backgroundColor: '#9ec0f7', width: 80, color: 'black', borderRadius: 15 }}>pending</Text>
        }
      </View>
      {/* <Text>Registration Option: {item.registrationOption}</Text> */}
      {/* <Text>address: {item.address}</Text>
      <Text>state: {item.state}</Text>
      <Text>pinCode: {item.pinCode}</Text> */}
      {
        item.registrationNumber === null ?
          <Text>Regstration Number: {item.registrationNumber}</Text> :
          <></>
      }

      <Text>registrationOption: {item.registrationOption}</Text>
      <Text>customerName: {item.customerName}</Text>
      <Text>mobileNumber: {item.mobileNumber}</Text>
      <Text>brand: {item.brand}</Text>
      <Text>pinCode: {item.pinCode}</Text>
      <Text>tyreSize: {item.tyreSize}</Text>
      <Text>oldTyreCompany: {item.oldTyreCompany}</Text>
      <Text>oldTyreBrand: {item.oldTyreBrand}</Text>
      <Text>state: {item.state}</Text>
      {/* <Text>status: {item.isStatus}</Text> */}
      {/* <Text>make: {item.make}</Text>
      <Text>makeid: {item.make_id}</Text>
      <Text>model: {item.model}</Text>
     
      <Text>brandid: {item.brandid}</Text>
      <Text>productName: {item.productName}</Text> */}
      {/* <Text>address: {item.address}</Text> */}
      {/* 
      
      <Text>obileNumber: {item.mobileNumber}</Text>

      <Text>brand: {item.brand}</Text>
      <Text>productName: {item.productName}</Text>
      
      <Text>stateid: {item.state_id}</Text>
      <Text>tyreQuantity: {item.tyreQuantity}</Text>
      <Text>tyre1SerialNumber: {item.series}</Text>
      <Text>tyre1SerialNumber: {item.tyre1SerialNumber2}</Text>
      <Text>tyre1SerialNumber: {item.tyre1SerialNumber3}</Text>
      <Text>tyre1Image: {item.tyre1Image}</Text>
      <Text>tyre2SerialNumber: {item.tyre2SerialNumber1}</Text>
      <Text>tyre2SerialNumber: {item.tyre2SerialNumber2}</Text>
      <Text>tyre2SerialNumber: {item.tyre2SerialNumber3}</Text>
      <Text>tyre2Image: {item.tyre2Image}</Text>
      <Text>invoiceNumber: {item.InvoiceNumber}</Text>
      <Text>invoiceImage: {item.invoiceImage}</Text>
      <Text>invoiceDate: {item.InvoiceDate}</Text>
      <Text>odoMeterReading: {item.odoMeterReading}</Text>
      <Text>odoMeterImage: {item.odoMeterImage}</Text>
      
      <Text>oldTyreSize: {item.OldTyreSize}</Text>
      <Text>termsAccepted: {item.termsAccepted}</Text>
      <Text>date: {item.registrationDate}</Text>

      <Text>type: {item.veh_type_name}</Text>
      <Text>make: {item.make}</Text>
      <Text>variant: {item.variantname}</Text>
      <Text>make: {item.make}</Text>
      <Text>model: {item.model}</Text>
      <Text>brand: {item.brand}</Text>
      <Text>productName: {item.productName}</Text>
      <Text>tyreSize: {item.tyreSize}</Text>
      <Text>stateid: {item.state_id}</Text>
      <Text>tyreQuantity: {item.tyreQuantity}</Text>
      <Text>tyre1Image: {item.tyre1Image}</Text>
      <Text>tyre2Image: {item.tyre2Image}</Text>
      <Text>invoiceImage: {item.invoiceImage}</Text>
      <Text>odoMeterReading: {item.odoMeterReading}</Text>
      <Text>odoMeterImage: {item.odoMeterImage}</Text>
      <Text>in: {item.invoiceDate}</Text> */}

      {/*{
        item.termsAccepted ?
          <Text>termsAccepted: true</Text> :
          <Text>termsAccepted: false</Text>
      }
      {/* <Text>oldbrand: {item.oldTyreBrand}</Text>
         <Text>oldcompany: {item.oldTyreCompany}</Text>
         <Text>OLD TYRE SIZE: {item.oldTyreSize}</Text> */}
      <Text>Registration Date: {item.registrationDate}</Text>

      <View style={styles.cardGroup1}>


        <View style={[styles.buttoncard,
        item.isStatus ? styles.buttonDisabled : styles.buttonEnabled
        ]}>
          <TouchableOpacity disabled={item.isStatus === 1} onPress={async () => {
            if (!db) return;
            await deleteItem(db, item.id);
            fetchItems(db);
          }}>
            <Text style={{
              color: "white", fontWeight: 'bold', fontSize: 16
            }}>Delete</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.buttoncard,
        item.isStatus ? styles.buttonDisabled : styles.buttonEnabled

        ]}>
          <TouchableOpacity disabled={item.isStatus === 1} onPress={() => openModal(item)} >
            <Text style={{ color: "white", fontWeight: 'bold', fontSize: 16 }}>Edit</Text>
          </TouchableOpacity>
        </View>

      </View >

    </View >
  );
  const [loading, setloading] = useState(false);
  const Options = [
    { warrantyNo: '100019', mobileNo: '9865348796' },
    { warrantyNo: '100153', mobileNo: '9658214736' },
    { warrantyNo: '101459', mobileNo: '7985635489' },
    { warrantyNo: '102376', mobileNo: '9745213698' },
    { warrantyNo: '103258', mobileNo: '9874563210' },
    // { warrantyNo: '104567', mobileNo: '9658741236' },
    // { warrantyNo: '105432', mobileNo: '9987456321' },
    // { warrantyNo: '106789', mobileNo: '9765412387' },
    // { warrantyNo: '107654', mobileNo: '9876543210' },
    // { warrantyNo: '108765', mobileNo: '9658745698' },
    // { warrantyNo: '109876', mobileNo: '9876541230' },
    // { warrantyNo: '110987', mobileNo: '9987654321' },
    // { warrantyNo: '111098', mobileNo: '9876543210' },
    // { warrantyNo: '112233', mobileNo: '9658745698' },
    // { warrantyNo: '113355', mobileNo: '9876541230' }
  ];

  const navigateTo = (warrantyNo: any) => {
    Alert.alert(`Edit Warranty No. : ${warrantyNo}`);
    console.log(`navigating to page of warranty number :  ${warrantyNo}`);
  };
  const handleLoop = async () => {
    console.log("check", items);

    items.forEach((item, index) => {

      if (item.isChecked) {
        console.log("requestDatasdasa", item.id)
        console.log("requestDatasdasa", warrantyPostObject)

        const foundItem = warrantyPostObject.filter(warrantyitem => warrantyitem.id === item.id);
        console.log("requestDatasdasa", item.address)

        console.log("foundItem[0]", foundItem[0]);

        handlemodifyandsubmit(foundItem[0])
      }
    });
    // const filteredItems = items.filter(item => item.isChecked === true);
    // console.log("filteredItems", filteredItems);




    //  warrantyPostObject.filter(warrantyitem => warrantyitem.id === 1)
  }
  const handlemodifyandsubmit = async (foundItem) => {

    // console.log("foundItem", foundItem);
    // console.log("Registration_No", foundItem.registrationNumber, "CustomerName", foundItem.customerName, "MobileNo", foundItem.mobileNumber, "EmailId", loginItems.EmailId, "Remark", null, "Company", "YOKOHAMA", "IsDeclaretion", foundItem.termsAccepted, "Agency_Id", loginItems.AgencyId, "InvoiceNo", foundItem.invoiceNumber, "InvoiceDate", foundItem.invoiceDate, "InvoiceAmount", "User_Device_Formation", deviceName, "CreatedFor", "self", "MappingCodeCode", null, "Address", foundItem.address, "State_Id", foundItem.state_id, "State_Name", foundItem.state, "District_id", foundItem.districtid, "District_Name", foundItem.districtname, "City_Id", foundItem.cityvillageid, "City_Name", foundItem.cityvillagename, "PinCode_Id", foundItem.pincodeid, "PinCode_Name", foundItem.cityvillagename, "ODOMeter", foundItem.odoMeterReading, "Type_of_Machine_Id", foundItem.veh_type_id, "Type_of_Machine_Name", foundItem.veh_type_name, "Make_Id", foundItem.make_id, "Make_Name", foundItem.make, "Model_Id", null, "Model_Name", foundItem.model, "Variant_Id", foundItem.variantid, "Variant_Name", foundItem.variantname, "RegistrationDate", foundItem.registrationDate, "ManufacturerDate", null, "BrandName", foundItem.brand, "ProductName", foundItem.productName, "Serial_1", foundItem.series + foundItem.tyre1SerialNumber2 + foundItem.tyre1SerialNumber3, "Serial_2", foundItem.series + foundItem.tyre2SerialNumber2 + foundItem.tyre2SerialNumber3, "Serial_3", null, "Serial_4", null, "Serial_Number", null, "Createdby", loginItems.Name, "Photo_Temp_Id", null, "TyreSize", foundItem.tyreSize, "NoOfTyres", foundItem.tyreQuantity, "OldTyre_CompanyName", foundItem.oldTyreCompany, "OldTyre_BrandName", foundItem.oldTyreBrand, "OldTyre_Size", foundItem.oldTyreSize);

    // return

    const requestData = { "Registration_No": foundItem.registrationNumber, "CustomerName": foundItem.customerName, "MobileNo": foundItem.mobileNumber, "EmailId": loginItems.EmailId, "Remark": null, "Company": "YOKOHAMA", "IsDeclaretion": foundItem.termsAccepted, "Agency_Id": loginItems.AgencyId, "InvoiceNo": foundItem.invoiceNumber, "InvoiceDate": foundItem.invoiceDate, "InvoiceAmount": "1000", "User_Device_Formation": deviceName, "CreatedFor": "self", "MappingCodeCode": null, "Address": foundItem.address, "State_Id": foundItem.state_id, "State_Name": foundItem.state, "District_id": foundItem.districtid, "District_Name": foundItem.districtname, "City_Id": foundItem.cityvillageid, "City_Name": foundItem.cityvillagename, "PinCode_Id": foundItem.pincodeid, "PinCode_Name": foundItem.cityvillagename, "ODOMeter": foundItem.odoMeterReading, "Type_of_Machine_Id": foundItem.veh_type_id, "Type_of_Machine_Name": foundItem.veh_type_name, "Make_Id": foundItem.make_id, "Make_Name": foundItem.make, "Model_Id": null, "Model_Name": foundItem.model, "Variant_Id": foundItem.variantid, "Variant_Name": foundItem.variantname, "RegistrationDate": foundItem.registrationDate, "ManufacturerDate": null, "BrandName": foundItem.brand, "ProductName": foundItem.productName, "Serial_1": foundItem.series + foundItem.tyre1SerialNumber2 + foundItem.tyre1SerialNumber3, "Serial_2": foundItem.series + foundItem.tyre2SerialNumber2 + foundItem.tyre2SerialNumber3, "Serial_3": null, "Serial_4": null, "Serial_Number": null, "Createdby": loginItems.Name, "Photo_Temp_Id": null, "TyreSize": foundItem.tyreSize, "NoOfTyres": foundItem.tyreQuantity, "OldTyre_CompanyName": foundItem.oldTyreCompany, "OldTyre_BrandName": foundItem.oldTyreBrand, "OldTyre_Size": foundItem.oldTyreSize }

    const encryptedlogindata = AESExtensions.encryptSs(JSON.stringify(requestData))
    console.log("enc", JSON.stringify(JSON.stringify(requestData)));
    // return
    const payload = {
      "requestId": "",
      "isEncrypt": "",
      "requestData": encryptedlogindata,
      "sessionExpiryTime": "",
      "userId": ""
    };
    // console.log(payload);
    // return
    // console.log("warranty no ", warrantyPostObject)
    try {
      setloading(true)
      const response = await axios.post('https://warrantyuat.tyrechecks.com/api/Warranty/WarrantyRegistration', payload)
      console.log("response", response.data)
      // console.log("response", response.data)

      // const parsevalue = JSON.parse(response.data.requestData)
      const plaintextoflogindata = AESExtensions.decryptString(response.data.responseData)
      console.log("Asdasdasd", plaintextoflogindata);
      // return
      if (response.status === 200) {
        // console.log("success", response.data);
        await updateSyncStatusWR(db, foundItem.id, true)


      }
      else {
        console.error("Something went wrong");

      }
    } catch (error) {
      console.log(error)
    }
    finally {
      setloading(false)
      await fetchItems(db)
      await fetchogin()
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16} // Adjust scroll event throttle as needed
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/logo/tractor.png')} style={{height:100,width: 100}} resizeMode='contain' />
    </View> */}

      <View style={styles.logoContainer}>
        <Text style={styles.headerText}>Draft Warranty</Text>
      </View>

      <View style={styles.logoContainer}>
        <Text style={styles.subheaderText}>Unsync Warranty</Text>
      </View>

      {/* <View style={styles.radioButtonLabelContainer}>
          
      <View style = {{alignItems:'center', justifyContent:'center', width:'50%'}}>
        <Text style={styles.radioLabelHeader}>Warranty No.</Text>
      </View>

      <View style = {{  width:'50%'}}>
        <Text style={styles.radioLabelHeader}>Mobile No.</Text>
      </View>

    </View> */}

      {/* <View style={{width:'100%'}} >
        {Options.map((item, index) => (
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
          ))}
        </View> */}
      <Modal
        transparent={true}
        visible={loading}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setloading(!loading);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color="black" />
          </View>
        </View>
      </Modal>
      {items?.map((item, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {item.isStatus === 0 ? (  // Check if item.Status is not 1
            <>
              <Text style={{ color: '#000', fontSize: 18, marginLeft: 10 }}>Warranty No: {item.id}</Text>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => handleCheckboxChange(index, item)}
              >
                <View style={[styles.checkbox, { backgroundColor: item.isChecked ? '#E11E30' : '#fff' }]}>
                  {item.checked && <Icon name="check" size={10} color="#fff" />}
                </View>
              </TouchableOpacity>
            </>
          ) : <></>}
        </View>
      ))}


      {/* <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Text>id: {item.id}</Text>
        {
          item.isStatus ? <Text style={{ textAlign: 'center', backgroundColor: '#a6edb4', width: 80, color: 'black', borderRadius: 15 }}>complete</Text> :
            <Text style={{ textAlign: 'center', backgroundColor: '#9ec0f7', width: 80, color: 'black', borderRadius: 15 }}>pending</Text>
        }
      </View> */}


      {/* <View style={styles.syncContainer}>
        <TouchableOpacity style={styles.syncbutton} onPress={handleLoop}>
          <Text style={styles.buttonText}>Modify & Submit</Text>
        </TouchableOpacity>
      </View> */}
      {
        items?.length === 0 ? <Text style={{ textAlign: 'center' }}>No Warranty Registration found!</Text> :
          <>
            {items && items.length > 0 && items.every(item => item.isStatus === 1) ? <></> : (
              <View style={styles.syncContainer}>
                <TouchableOpacity style={styles.syncbutton} onPress={handleLoop}>
                  <Text style={styles.buttonText}>Modify & Submit</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
      }


      {/* <View style={styles.syncContainer}>
        <TouchableOpacity disabled={true} style={[styles.syncbutton, { opacity: false ? 1 : 0.5 }]} onPress={handleLoop}>
          <Text style={styles.buttonText}>Modify & Submit (In the work)</Text>
        </TouchableOpacity>
      </View> */}
      {/* >>>>>>> ac30e9dd1e878af22b51b760fef1e891272dcec9 */}



      <FlatList
        scrollEnabled={false}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() ?? ''}
      />

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <ScrollView>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <UpdateWarrantyRegistration
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />


              {/* <View style={styles.cardGroup}>
                <View style={styles.buttoncard}>
                  <TouchableOpacity onPress={closeModal}>
                    <Text style={{ color: "white", fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                  </TouchableOpacity>

                </View>
                <View style={styles.buttoncard}>
                  <TouchableOpacity onPress={handleUpdate} >
                    <Text style={{ color: "white", fontWeight: 'bold', fontSize: 16 }}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View> */}
            </View>
          </View>
        </ScrollView>
      </Modal>
      <View style={styles.checklogoContainer}>
        <Image source={require('../../assets/images/logo/tclogo.png')} style={{ height: 50, width: 100 }} resizeMode='contain' />
        <Text style={styles.powerByText}>Powered by <Text style={styles.checktext}>Check</Text><Text style={styles.exploretext}>Explore</Text> </Text>
      </View>
    </ScrollView >
  );
};

const WarrantyRegistrationFormToUpdate = ({ selectedItem, setSelectedItem }) => {
  const handleInputChange = (field, value) => {
    console.log(`Updating ${field} to ${value}`);
    setSelectedItem({ ...selectedItem, [field]: value });
  };
  const RadioButtonColor: string = '#e11e30';
  const placeholderTextColor: string = '#666';
  const iconColor = '#000';
  const [registrationOption, setRegistrationOption] = useState(null);
  const [registrationDate, setRegistrationDate] = useState(null);
  const [isVehicleRegistrationAvailable, setIsVehicleRegistrationAvailable] =
    useState(false);
  const handleRadioButtonChange = option => {
    setRegistrationOption(option);
    if (option === 'available') {
      setIsVehicleRegistrationAvailable(true); // Set state for available option
    } else {
      setIsVehicleRegistrationAvailable(false); // Set state for other options
    }
  };
  const [vehicleRegistration, setVehicleRegistration] = useState({
    reg_num: '',
    mobileNumber: '',
    address: '',
    state: '',
    pinCode: '',
  });
  const [customerDetails, setCustomerDetails] = useState({
    customerName: '',
    mobileNumber: '',
    address: '',
    state: '',
    pinCode: '',
  });
  const [vehicleDetails, setVehicleDetails] = useState({
    registrationNumber: '',
    make: '',
    model: '',
    brand: '',
    productName: '',
    tyreSize: '',
    tyreQuantity: '',
    tyre1SerialNumber1: '',
    tyre1SerialNumber2: '',
    tyre1SerialNumber3: '',
    tyre1Image: null,
    tyre2SerialNumber1: '',
    tyre2SerialNumber2: '',
    tyre2SerialNumber3: '',
    tyre2Image: null,
  });
  const [optionalDetails, setOptionalDetails] = useState({
    invoiceNumber: '',
    invoiceImage: null,
    invoiceDate: '',
    odoMeterReading: '',
    odoMeterImage: null,
  });
  const [oldTyreDetails, setOldTyreDetails] = useState({
    oldTyreCompany: '',
    oldTyreBrand: '',
    oldTyreSize: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  // State variables to manage visibility of input fields -----------------------------------
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [showOptionalDetails, setShowOptionlDetails] = useState(false);
  const [showOldTyreDetails, setShowOldTyreDetails] = useState(false);
  // Toggle functions
  const toggleCustomerDetails = () => {
    setShowCustomerDetails(prev => !prev);
  };

  const toggleVehicleDetails = () => {
    setShowVehicleDetails(prev => !prev);
  };

  const toggleOptionalDetails = () => {
    setShowOptionlDetails(prev => !prev);
  };

  const toggleOldTyreDetails = () => {
    setShowOldTyreDetails(prev => !prev);
  }; const NumberOfTyredata = [
    { key: 1, value: '1' },
    { key: 2, value: '2' },
  ];
  const OldTyreSizedata = [
    { key: 1, value: '1' },
    { key: 2, value: '2' },
  ];
  const [stateItems, setStateItems] = useState();

  const [pincodeItems, setPinCodeItems] = useState();
  const [makeItems, setMakeItems] = useState();
  const [makeINamestems, setMakeNamesItems] = useState();
  const [modelItems, setModelItems] = useState();
  const [brandnameItems, setBrandNameItems] = useState();
  const [productnameItems, setProductNameItems] = useState();
  const [productname, setProductName] = useState();
  const [tyresizeItems, setTyreSizeItems] = useState();
  const [oldtyrebrandnameItems, setOldTyreBrandNameItems] = useState();
  const [oldtyrecompanyItems, setOldTyreCompanyItems] = useState();
  const [vehicleTypeItems, setVehicleTypeItems] = useState();
  const [vehicleVariantItems, setVehicleVariantItems] = useState();
  const [serialkey, setserialkey] = useState();
  const [stateidvalue, setstateidvalue] = useState();
  const [vehicletyedata, setvehicletyedata] = useState();
  const [styrequantitySelected, setstyrequantitySelectedy] = useState("2");
  const [stateObjectofkey, setStateObjectofkey] = useState(null)
  const getStateObjectByName = async (stateName) => {
    const getstateItems = await getAllStateItems()
    const getstate = getstateItems.filter(state => state.statename === stateName)
    setStateObjectofkey(getstate[0].stateid)
    // console.log(getstate[0].stateid);

  }
  useEffect(() => {
    console.log("selectedItemuseEffect", selectedItem);

    // setupAndFetchStateItems();
    setupStateDatabase();

    fetchStateItems()
    setupAndFetchPinCodeItems();
    setupAndFetchTractorMakeItems();
    setupAndFetchTractorModelItems();
    setupAndFetchBrandNameItems();
    setupAndFetchProductNameItems();
    setupAndFetchTyreSizeItems();
    setupAndFetchOldTyreBrandNameItems();
    setupAndFetchOldTyreCompanyItems();
    setupVehicleVariantItems()
    setupVehicleTypeDatabase()

    fetchVehicleTypeItems();
    setupVehicleVariantDatabase()

    console.log("selectedItem.oldtyrebrandname", selectedItem.oldtyrebrandname);

  }, []);
  const fetchStateItems = async () => {
    try {
      // console.log("check")
      const itemsFromDb = await getAllStateItems();
      // console.log("check state", itemsFromDb.length)
      const formattedItems = itemsFromDb.map(item => ({
        key: item.stateid,
        value: item.statename,
      }));
      // console.log("check state", formattedItems)

      setStateItems(formattedItems);

      // console.log("check state", stateItems)

    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [ismakeshow, setismakeshow] = useState(false)
  const [ismodelshow, setismodelshow] = useState(false)
  const [isvehiclevariantshow, setisvehiclevariantshow] = useState(false)
  const getVehicleMakeByVehiceTypeID = async (value) => {
    const helper = vehicleTypeItems.filter(element => element.value === value)
    // console.log("helper", helper);

    setvehicletyedata(helper[0])
    let helperarray = await getVehicleByVehTypeid(helper[0].key)
    const makedataItems = helperarray.map(item => ({
      key: item.MakeID,
      value: item.MakeName
    }));
    setMakeNamesItems(makedataItems)

    let helpermodelarray = await getVehicleModelByVehTypeid(helper[0].key)
    const modeldataItems = helpermodelarray.map(item => ({
      key: item.makeName,
      value: item.modelName
    }));
    setModelItems(modeldataItems)
    setismakeshow(true)
    setismodelshow(true)
  }
  const getVehicleVariantById = async (value) => {
    const helper = makeINamestems.filter(element => element.value === value)
    const helperarray = await getVariantByMakeID(helper[0].key)
    const variantdataItems = helperarray.map(item => ({
      key: item.variantid,
      value: item.variantname
    }));
    setVehicleVariantItems(variantdataItems)
    setisvehiclevariantshow(true)
  }
  const storeVehicleVariant = async (value) => {
    const helper = vehicleVariantItems.filter(element => element.value === value)
    // console.log("helper1", helper);
    // 
    setstateidvalue(helper[0])
  }
  const [selectedState, setSelectedState] = useState('');
  const [selectedStateid, setSelectedStateid] = useState('');

  const setupAndFetchStateName = async (value) => {
    setSelectedState(value); // Setting the first item as the initial value
    console.log("Selected State:", value);
    handleInputChange('state', value); // Update state name
  };

  const setupAndFetchStateId = async (value) => {
    try {
      const stateid = await getStateid(value); // Get state ID asynchronously
      console.log("State ID:", stateid);
      handleInputChange('state_id', stateid[0].stateid); // Update state ID
    } catch (error) {
      console.error("Error fetching state ID:", error);
    }
  };

  const [pincodelist, setPincodelist] = useState(null)

  const getPincode = async (pincodevalue) => {
    const getpincodeItems = await getAllPinCodeItems();
    const getpincode = getpincodeItems.filter(pincode => pincode.areapincode === pincodevalue)
    setPincodelist(getpincode[0])
    // console.log(getpincode[0]);

    // try {
    //   const itemsFromDb = await getAllPinCodeItems();
    //   const pincodeItems = itemsFromDb.map(item => pincodelist.push(item.areapincode));
    //   setPinCodeItems(pincodelist);

    // } catch (error) {
    //   console.error('Fetch error:', error);
    // }
  };
  const [selectedPinCode, setSelectedPinCode] = useState('');

  const setupAndFetchPinCodeItems = async () => {
    try {
      // Initialize pincode database
      await setupPinCodeDatabase();

      // Fetch pincode items from database
      const itemsFromDb = await getAllPinCodeItems();
      const pincodeItems = itemsFromDb.map(item => ({
        key: item.pincodeid,
        value: item.areapincode
      }));
      // Update component state with pincode items
      setPinCodeItems(pincodeItems);
      if (pincodeItems.length > 0) {
        setSelectedPinCode(pincodeItems[0].value); // Setting the first item as the initial value
        handleInputChange('pinCode', pincodeItems[0].value); // Update your state accordingly
        // console.log("value", selectedItem);

      }
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  };

  const [getmakeid, setgetmakeid] = useState(null)
  const getmakeidlist = async (makeName) => {
    // const getstateItems = await getAllStateItems()
    const makeid = makeItems.filter(make => make.value === makeName)
    setgetmakeid(makeid[0].key)
    console.log(makeid[0].key);

    // console.log(getstate[0].stateid);

  }
  const [selectedTractoMake, setSelectedTractoMake] = useState('')
  const setupAndFetchTractorMakeItems = async () => {
    try {
      // Initialize pincode database
      await setupTractorMakeDatabase();

      // Fetch pincode items from database
      const itemsFromDb = await getAllTractorMakeItems();
      const makeItems = itemsFromDb.map(item => ({
        key: item.MakeID,
        value: item.MakeName
      }));

      // Update component state with pincode items
      setMakeItems(makeItems);
      if (makeItems.length > 0) {
        setSelectedTractoMake(makeItems[0].value); // Setting the first item as the initial value
        handleInputChange('make', makeItems[0].value); // Update your state accordingly
        // console.log("value", selectedItem);

      }
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  };
  const [selectedTractoModel, setSelectedTractoModel] = useState('')
  const setupAndFetchTractorModelItems = async () => {
    try {
      // Initialize pincode database
      await setupTractorModelDatabase();

      // Fetch pincode items from database
      const itemsFromDb = await getAllTractorModelItems();
      const modelItems = itemsFromDb.map(item => ({
        key: item.id,
        value: item.modelName
      }));

      // Update component state with pincode items
      setModelItems(modelItems);
      if (modelItems.length > 0) {
        setSelectedTractoModel(modelItems[0].value); // Setting the first item as the initial value
        handleInputChange('model', modelItems[0].value); // Update your state accordingly
        // console.log("value", selectedItem);

      }
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  };
  const [selectedBrandName, setSelectedBrandName] = useState('')
  const setupAndFetchBrandNameItems = async () => {
    try {
      // Initialize pincode database
      await setupBrandNasadmeDatabase();

      // Fetch pincode items from database
      const itemsFromDb = await getAllBrandNasadmeItems();
      const brandnameItems = itemsFromDb.map(item => ({
        key: item.id,
        value: item.brandname
      }));
      setBrandNameItems(brandnameItems);
      if (brandnameItems.length > 0) {
        setSelectedBrandName(brandnameItems[0].value); // Setting the first item as the initial value
        handleInputChange('brand', brandnameItems[0].value); // Update your state accordingly
        // console.log("value", selectedItem);

      }
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  };
  const [selectedProductName, setSelectedProductName] = useState('')
  const setupAndFetchProductNameItems = async () => {
    try {
      // Initialize pincode database
      await setupProductNameDatabase();

      // Fetch pincode items from database
      const itemsFromDb = await getAllProductNameItems();
      const productnameItems = itemsFromDb.map(item => ({
        key: item.id,
        value: item.productName
      }));
      setProductNameItems(productnameItems);
      if (productnameItems.length > 0) {
        setSelectedProductName(productnameItems[0].value); // Setting the first item as the initial value
        handleInputChange('productName', productnameItems[0].value); // Update your state accordingly
        // console.log("value", selectedItem);

      }
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  };
  const [selectedTyreSize, setSelectedTyreSize] = useState('')
  const setupAndFetchTyreSizeItems = async () => {
    try {
      // Initialize pincode database
      await setupTyreSizeDatabase();

      // Fetch pincode items from database
      const itemsFromDb = await getAllTyreSizeItems();
      const tyresizeItems = itemsFromDb.map(item => ({
        key: item.id,
        value: item.sizeName
      }));
      setTyreSizeItems(tyresizeItems);
      if (tyresizeItems.length > 0) {
        setSelectedTyreSize(tyresizeItems[0].value); // Setting the first item as the initial value
        handleInputChange('tyreSize', tyresizeItems[0].value); // Update your state accordingly
        // console.log("value", selectedItem);

      }
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  };
  const [selectedOldTyreBrandName, setSelectedOldTyreBrandName] = useState('')
  const setupAndFetchOldTyreBrandNameItems = async () => {
    try {
      // Initialize pincode database
      await setupOldTyreBrandNameDatabase();

      // Fetch pincode items from database
      const itemsFromDb = await getAllOldTyreBrandNameItems();
      const oldtyrebrandnameItems = itemsFromDb.map(item => ({
        key: item.id,
        value: item.brandpattern
      }));
      setOldTyreBrandNameItems(oldtyrebrandnameItems);
      if (oldtyrebrandnameItems.length > 0) {
        setSelectedOldTyreBrandName(oldtyrebrandnameItems.value); // Setting the first item as the initial value
        handleInputChange('oldTyreBrand', oldtyrebrandnameItems[0].value); // Update your state accordingly
        // console.log("value", selectedItem);

      }
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  };
  const [selectedOldTyreCompany, setSelectedOldTyreCompany] = useState('')
  const setupAndFetchOldTyreCompanyItems = async () => {
    try {
      // Initialize pincode database
      await setupOldTyreCompanyDatabase();

      // Fetch pincode items from database
      const itemsFromDb = await getAllOldTyreCompanyItems();
      const oldtyrecompanyItems = itemsFromDb.map(item => ({
        key: item.id,
        value: item.tyre_company_name
      }));
      setOldTyreCompanyItems(oldtyrecompanyItems);
      if (oldtyrecompanyItems.length > 0) {
        setSelectedOldTyreCompany(oldtyrecompanyItems[0].value); // Setting the first item as the initial value
        handleInputChange('oldTyreCompany', oldtyrecompanyItems[0].value); // Update your state accordingly
        // console.log("value", selectedItem);

      }
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  };
  const [selectedVehicleVariant, setSelectedVehicleVariant] = useState('')
  const setupVehicleVariantItems = async () => {
    try {
      if (vehicleVariantItems.length > 0) {
        setSelectedVehicleVariant(vehicleVariantItems[0].value); // Setting the first item as the initial value
        handleInputChange('variantname', vehicleVariantItems[0].value); // Update your state accordingly
        console.log("vehicleVariantItems", vehicleVariantItems[0].value);

      }
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  };
  const fetchVehicleTypeItems = async () => {
    try {
      const itemsFromDb = await getAllVehicleTypeItems();
      const VehicleTypeItems = itemsFromDb.map(item => ({
        key: item.Veh_Type_ID,
        value: item.Veh_Type_Name
      }));
      setVehicleTypeItems(VehicleTypeItems);
      console.log("itemsFromDb", itemsFromDb);

    } catch (error) {
      console.error('Fetch error:', error);
    }
  };


  // Call the setup and fetch functions when component mounts

  const handleVehicleDetailsChange = (field, value) => {
    setVehicleDetails(prevState => ({ ...prevState, [field]: value }));
  };
  const handleOldTyreDetailsChange = (field, value) => {
    setOldTyreDetails(prevState => ({ ...prevState, [field]: value }));
  };
  const [invoiceImageUri, setInvoiceImageUri] = useState(null);
  const [ODOMeterImageUri, setODOMeterImageUri] = useState(null);
  const [tyre1Image, setTyre1Image] = useState(null);
  const [tyre2Image, setTyre2Image] = useState(null);
  // const [tyre2Image, setTyre2Image] = useState(null);
  const invoicePickCamera = async () => {
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
          setInvoiceImageUri(response.assets[0].uri);
          // Assuming you want to set the image in tyre1Image or tyre2Image based on which is selected
          // if (vehicleDetails.tyreQuantity === 1) {
          setOptionalDetails(prevDetails => ({
            ...prevDetails,
            invoiceImage: response.assets[0].uri,
          }));
          // console.log(invoiceImageUri)
          // }
          //    else if (vehicleDetails.tyreQuantity === 2) {
          //      setVehicleDetails((prevDetails) => ({
          //        ...prevDetails,
          //        tyre2Image: response.assets[0].uri,
          //      }));
          //    }
          // }
          //  else {
          // console.log('No image assets found');
        }
      }
    });
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
          setODOMeterImageUri(response.assets[0].uri);
          // Assuming you want to set the image in tyre1Image or tyre2Image based on which is selected
          // if (vehicleDetails.tyreQuantity === 1) {
          setOptionalDetails(prevDetails => ({
            ...prevDetails,
            odoMeterImage: response.assets[0].uri,
          }));
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
  const tyre1ImagePickCamera = async () => {
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
          setTyre1Image(response.assets[0].uri);
          // Assuming you want to set the image in tyre1Image or tyre2Image based on which is selected
          // if (vehicleDetails.tyreQuantity === 1) {
          setVehicleDetails(prevDetails => ({
            ...prevDetails,
            tyre1Image: response.assets[0].uri,
          }));
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
  const tyre2ImagePickCamera = async () => {
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
          setTyre2Image(response.assets[0].uri);
          // Assuming you want to set the image in tyre1Image or tyre2Image based on which is selected
          // if (vehicleDetails.tyreQuantity === 1) {
          setVehicleDetails(prevDetails => ({
            ...prevDetails,
            tyre2Image: response.assets[0].uri,
          }));
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
  return (
    <>
      {/* <View>
      <TextInput
        placeholder="Enter address"
        value={selectedItem?.address ?? ''}
        onChangeText={(text) => handleInputChange('address', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter state"
        value={selectedItem?.state ?? ''}
        onChangeText={(text) => handleInputChange('state', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter pinCode"
        value={selectedItem?.pinCode ?? ''}
        onChangeText={(text) => handleInputChange('pinCode', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter mobile number"
        value={selectedItem?.mobileNumber ?? ''}
        onChangeText={(text) => handleInputChange('mobileNumber', text)}
        style={styles.input}
      />
      {/* Add more TextInput fields for other editable fields in a similar way </View> */}


      <ScrollView contentContainerStyle={styles.container}>
        {/*<Text>SQLite Database Example</Text>
     {isDatabaseInitialized && (
      <>
        <View style={styles.pickerContainer}>
          <SelectList
            data={items}
            setSelected={setSelectedItem}
            placeholder="Select an item"
            boxStyles={styles.picker}
          />
        </View>
        <Text>
          Selected Item: {selectedItem ? items.find(item => item.key === selectedItem)?.value : '-'}
        </Text>
        <Button title="Insert Sample Data" onPress={insertSampleData} />
      </>
    )} */}
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerText}>Warranty Registration</Text>

          {/* Radio Buttons */}
          <RadioButton.Group
            onValueChange={handleRadioButtonChange}
            value={registrationOption}>
            <RadioButton.Item
              label="Available - Vehicle Registration Number"
              value="available"
              color={RadioButtonColor}
              style={styles.radioButton}
              labelStyle={styles.radioLabel}

            />
            <RadioButton.Item
              label="Not Available - Vehicle Registration Number"
              value="notAvailable"
              color={RadioButtonColor}
              style={styles.radioButton}
              labelStyle={styles.radioLabel}
            />
            <RadioButton.Item
              label="New Vehicle"
              value="newVehicle"
              color={RadioButtonColor}
              style={styles.radioButton}
              labelStyle={styles.radioLabel}
            />
          </RadioButton.Group>
        </View>

        {/* Vehicle Registration Number */}
        {isVehicleRegistrationAvailable && (
          <View>
            <View style={styles.outer_view}>
              <View style={styles.label_view}>
                <Text style={styles.label_View_text_style}>
                  Vehicle Reg. No.
                  <Text style={{ color: 'red' }}>*</Text>
                </Text>
              </View>
              <View style={styles.text_view}>
                <TextInput
                  style={styles.input}
                  placeholder="Vehicle registration number"
                  placeholderTextColor={placeholderTextColor}
                  onChangeText={value =>
                    handleVehicleDetailsChange('registrationNumber', value)
                  }
                  value={vehicleDetails.registrationNumber}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.search_button}
            >
              <Text style={styles.buttonText}>Search </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.search_button}
            >
              {/* <Text style={styles.buttonText}>Photo </Text> */}
              <Icon name="camera" size={15} color={'white'} />
            </TouchableOpacity>
          </View>
        )}

        {/* Customer Details */}
        <View>
          <TouchableOpacity
            style={styles.sectionHeaderContainer}
            onPress={toggleCustomerDetails}>
            <Text style={styles.sectionHeader}>Customer Details</Text>
            <TouchableOpacity style={styles.toggleButton}>
              <Icon
                style={{ marginTop: 12 }}
                onPress={toggleCustomerDetails}
                name={showCustomerDetails ? 'caret-up' : 'caret-down'}
                size={25}
                color={iconColor}
              />
            </TouchableOpacity>
          </TouchableOpacity>

          {showCustomerDetails && (
            <>
              <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>
                    Customer Name
                    <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                </View>
                <View style={styles.text_view}>
                  <TextInput
                    style={styles.input}
                    placeholder="Customer Name"
                    placeholderTextColor={placeholderTextColor}
                    // onChangeText={value =>
                    //   handleCustomerDetailsChange('customerName', value)
                    // }
                    // value={customerDetails.customerName}
                    value={selectedItem?.customerName ?? ''}
                    onChangeText={(text) => handleInputChange('customerName', text)}
                  />
                </View>
              </View>

              <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>
                    Mobile Number
                    <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                </View>
                <View style={styles.text_view}>
                  <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    maxLength={10}
                    placeholderTextColor={placeholderTextColor}
                    // onChangeText={value =>
                    //   handleCustomerDetailsChange('mobileNumber', value)
                    // }
                    // value={customerDetails.mobileNumber}
                    value={selectedItem?.mobileNumber ?? ''}
                    onChangeText={(text) => handleInputChange('mobileNumber', text)}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>
                    Address
                    <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                </View>
                <View style={styles.text_view}>
                  <TextInput
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    style={styles.input}
                    placeholder="Address"
                    placeholderTextColor={placeholderTextColor}
                    value={selectedItem?.address ?? ''}
                    onChangeText={(text) => handleInputChange('address', text)}
                  />
                </View>
              </View>

              <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>
                    State
                    <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                </View>
                <View style={styles.text_view}>
                  <View style={styles.input}>
                    <SelectList
                      dropdownStyles={styles.dropdownshow}
                      maxHeight={200}
                      data={stateItems}
                      placeholder={`${selectedItem.state}`}
                      boxStyles={{ borderWidth: 0, padding: 0 }}
                      arrowicon={
                        <Icon name="chevron-down" size={12} color={'black'} />
                      }
                      value={selectedState}

                      setSelected={(value) => {
                        // setSelectedState(value);
                        // handleInputChange('state', value);

                        setupAndFetchStateName(value);
                        setupAndFetchStateId(value)

                      }}
                      // onSelect={selectedItem?.state ?? ''}
                      // value={selectedState}

                      // setSelected={(value) => {
                      //   setSelectedState(value);
                      //   handleCustomerDetailsChange('state', value)
                      // }}
                      // setSelected={value =>
                      //   handleCustomerDetailsChange('state', value)
                      // }
                      save="value"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>
                    Pin Code
                    <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                </View>
                <View style={styles.text_view}>
                  <View style={styles.input}>
                    <SelectList
                      dropdownStyles={styles.dropdownshow}
                      maxHeight={200}
                      data={pincodeItems
                      }
                      value={selectedPinCode}

                      setSelected={(value) => {
                        setSelectedPinCode(value);
                        handleInputChange('pinCode', value);
                      }}
                      //  setSelected={value =>
                      //   handleCustomerDetailsChange('pinCode', value)
                      // }
                      placeholder={`${selectedItem.pinCode}`}
                      boxStyles={{ borderWidth: 0, padding: 0 }}
                      arrowicon={
                        <Icon name="chevron-down" size={12} color={'black'} />
                      }
                      save="value"
                    />
                  </View>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Vehicle Details */}
        <View>
          <TouchableOpacity
            style={styles.sectionHeaderContainer}
            onPress={toggleVehicleDetails}>
            <Text style={styles.sectionHeader}>Vehicle Details</Text>
            <TouchableOpacity style={styles.toggleButton}>
              <Icon
                style={{ marginTop: 12 }}
                onPress={toggleVehicleDetails}
                name={showVehicleDetails ? 'caret-up' : 'caret-down'}
                size={25}
                color={iconColor}
              />
            </TouchableOpacity>
          </TouchableOpacity>

          {showVehicleDetails && (
            <>
              {/* <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>
                    Vehicle Make
                    <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                </View>
                <View style={styles.text_view}>
                  <View style={styles.input}>
                    <SelectList
                      dropdownStyles={styles.dropdownshow}
                      maxHeight={200}
                      data={makeItems}
                      value={selectedTractoMake}

                      setSelected={(value) => {
                        setSelectedTractoMake(value);
                        handleInputChange('make', value);
                      }}
                      // setSelected={value =>
                      //   handleVehicleDetailsChange('make', value)
                      // }
                      placeholder={`${selectedItem.make}`}
                      boxStyles={{ borderWidth: 0, padding: 0 }}
                      arrowicon={
                        <Icon name="chevron-down" size={12} color={'black'} />
                      }
                      save="value"
                    />
                  </View>
                </View>
              </View> */}
              <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>
                    Vehicle Type
                    <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                </View>
                <View style={styles.text_view}>
                  <View style={styles.input}>
                    <SelectList
                      dropdownStyles={styles.dropdownshow}
                      maxHeight={200}
                      data={vehicleTypeItems}
                      setSelected={value => {
                        handleVehicleDetailsChange('make', value)
                        getVehicleMakeByVehiceTypeID(value)
                      }
                      }
                      placeholder={`${selectedItem.veh_type_name}`}
                      boxStyles={{ borderWidth: 0, padding: 0 }}
                      arrowicon={
                        <Icon name="chevron-down" size={12} color={'black'} />
                      }
                      save="value"
                    />
                  </View>
                </View>
              </View>
              {
                ismakeshow ?
                  <View style={styles.outer_view}>
                    <View style={styles.label_view}>
                      <Text style={styles.label_View_text_style}>
                        Vehicle Make
                        <Text style={{ color: 'red' }}>*</Text>
                      </Text>
                    </View>
                    <View style={styles.text_view}>
                      <View style={styles.input}>
                        <SelectList
                          dropdownStyles={styles.dropdownshow}
                          maxHeight={200}
                          data={makeINamestems}
                          value={selectedTractoMake}
                          setSelected={value => {
                            handleVehicleDetailsChange('make', value)
                            getVehicleVariantById(value)
                            setSelectedTractoMake(value);
                            handleInputChange('make', value);
                          }

                          }
                          placeholder={`${selectedItem.make}`}
                          boxStyles={{ borderWidth: 0, padding: 0 }}
                          arrowicon={
                            <Icon name="chevron-down" size={12} color={'black'} />
                          }
                          save="value"
                        />
                      </View>
                    </View>
                  </View> :
                  <></>
              }

              {
                isvehiclevariantshow ?
                  <View style={styles.outer_view}>
                    <View style={styles.label_view}>
                      <Text style={styles.label_View_text_style}>
                        Vehicle Variant
                        <Text style={{ color: 'red' }}>*</Text>
                      </Text>
                    </View>
                    <View style={styles.text_view}>
                      <View style={styles.input}>
                        <SelectList
                          dropdownStyles={styles.dropdownshow}
                          maxHeight={200}
                          data={vehicleVariantItems}
                          value={selectedVehicleVariant}
                          setSelected={value => {
                            storeVehicleVariant(value)
                            setSelectedVehicleVariant(value)
                            handleInputChange('variantname', value);
                          }
                          }
                          placeholder={`${selectedItem.variantname}`}
                          boxStyles={{ borderWidth: 0, padding: 0 }}
                          arrowicon={
                            <Icon name="chevron-down" size={12} color={'black'} />
                          }
                          save="value"
                        />
                      </View>
                    </View>
                  </View> :
                  <></>
              }

              {
                ismodelshow ?
                  <View style={styles.outer_view}>
                    <View style={styles.label_view}>
                      <Text style={styles.label_View_text_style}>
                        Vehicle Model
                        <Text style={{ color: 'red' }}>*</Text>
                      </Text>
                    </View>
                    <View style={styles.text_view}>
                      <View style={styles.input}>
                        <SelectList
                          dropdownStyles={styles.dropdownshow}
                          maxHeight={200}
                          data={modelItems}
                          value={selectedTractoModel}

                          setSelected={(value) => {
                            setSelectedTractoModel(value);
                            handleInputChange('model', value);
                          }}
                          // setSelected={value =>
                          //   handleVehicleDetailsChange('model', value)
                          // }
                          placeholder={`${selectedItem.model}`}
                          boxStyles={{ borderWidth: 0, padding: 0 }}
                          arrowicon={
                            <Icon name="chevron-down" size={12} color={'black'} />
                          }
                          save="value"
                        />
                      </View>
                    </View>
                  </View> :
                  <></>
              }


              <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>
                    Tyre Brand
                    <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                </View>
                <View style={styles.text_view}>
                  <View style={styles.input}>
                    <SelectList
                      dropdownStyles={styles.dropdownshow}
                      maxHeight={200}
                      data={brandnameItems}
                      value={selectedBrandName}

                      setSelected={(value) => {
                        setSelectedBrandName(value);
                        handleInputChange('brand', value);
                      }}
                      // setSelected={value =>
                      //   handleVehicleDetailsChange('brand', value)
                      // }
                      placeholder={`${selectedItem.brand}`}
                      boxStyles={{ borderWidth: 0, padding: 0 }}
                      arrowicon={
                        <Icon name="chevron-down" size={12} color={'black'} />
                      }
                      save="value"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>
                    Product Name
                    <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                </View>
                <View style={styles.text_view}>
                  <View style={styles.input}>
                    <SelectList
                      dropdownStyles={styles.dropdownshow}
                      maxHeight={200}
                      data={productnameItems}
                      value={selectedProductName}

                      setSelected={(value) => {
                        setSelectedProductName(value);
                        handleInputChange('productName', value);
                      }}
                      // setSelected={value =>
                      //   handleVehicleDetailsChange('productName', value)
                      // }
                      placeholder={`${selectedItem.productName}`}
                      boxStyles={{ borderWidth: 0, padding: 0 }}
                      arrowicon={
                        <Icon name="chevron-down" size={12} color={'black'} />
                      }
                      save="value"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>
                    Tyre Size
                    <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                </View>
                <View style={styles.text_view}>
                  <View style={styles.input}>
                    <SelectList
                      dropdownStyles={styles.dropdownshow}
                      maxHeight={200}
                      data={tyresizeItems}
                      value={selectedTyreSize}

                      setSelected={(value) => {
                        setSelectedTyreSize(value);
                        handleInputChange('tyreSize', value);
                      }}
                      // setSelected={value =>
                      //   handleVehicleDetailsChange('tyreSize', value)
                      // }
                      placeholder={`${selectedItem.tyreSize}`}
                      boxStyles={{ borderWidth: 0, padding: 0 }}
                      arrowicon={
                        <Icon name="chevron-down" size={12} color={'black'} />
                      }
                      save="value"
                    />
                  </View>
                </View>
              </View>

              {/* <RadioButton.Group
        onValueChange={(value) => handleVehicleDetailsChange('tyreQuantity', value)}
        value={vehicleDetails.tyreQuantity}
      >
        <RadioButton.Item label="1" value={1} style={styles.radioButton} color={RadioButtonColor} labelStyle={styles.radioLabel} />
        <RadioButton.Item label="2" value={2} style={styles.radioButton} color={RadioButtonColor} labelStyle={styles.radioLabel} />
      </RadioButton.Group> */}

              <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>
                    Number of Tyres
                    <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                </View>
                <View style={styles.text_view}>
                  <View style={styles.input}>
                    <SelectList
                      dropdownStyles={styles.dropdownshow}
                      maxHeight={200}
                      data={NumberOfTyredata}
                      setSelected={value =>
                        handleVehicleDetailsChange('tyreQuantity', value)
                      }
                      placeholder={`${selectedItem.tyreQuantity}`}
                      // inputStyles={{color:'red'}}
                      boxStyles={{ borderWidth: 0, padding: 10 }}
                      arrowicon={
                        <Icon name="chevron-down" size={12} color={'black'} />
                      }
                      save="value"
                    />
                  </View>
                </View>
              </View>

              {vehicleDetails.tyreQuantity === '1' && (
                <View>
                  <View style={styles.Serial_number_input_view}>
                    <TextInput
                      style={styles.Serial_number_input_small}
                      placeholder=""
                      placeholderTextColor={placeholderTextColor}
                      onChangeText={value =>
                        handleVehicleDetailsChange('tyre1SerialNumber1', value)
                      }
                      value={vehicleDetails.tyre1SerialNumber1}
                    />
                    <TextInput
                      style={styles.Serial_number_input}
                      placeholder=""
                      placeholderTextColor={placeholderTextColor}
                      onChangeText={value =>
                        handleVehicleDetailsChange('tyre1SerialNumber2', value)
                      }
                      value={vehicleDetails.tyre1SerialNumber2}
                    />
                    <TextInput
                      style={styles.Serial_number_input}
                      placeholder=""
                      placeholderTextColor={placeholderTextColor}
                      onChangeText={value =>
                        handleVehicleDetailsChange('tyre1SerialNumber3', value)
                      }
                      value={vehicleDetails.tyre1SerialNumber3}
                    />
                  </View>
                  {/* {tyre1Image && <Image source={{ uri: tyre1Image }} width={320} height={300} />} */}
                  {vehicleDetails.tyre1Image && (
                    <Image
                      source={{
                        uri:
                          vehicleDetails.tyre1Image + '?' + new Date().getTime(),
                      }}
                      width={320}
                      height={300}
                    />
                  )}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={tyre1ImagePickCamera}>
                    <Text style={styles.buttonText}>
                      Take Tyre 1 Photo with Serial Number
                    </Text>
                    <Icon
                      style={{ marginLeft: 20 }}
                      name="camera"
                      size={15}
                      color={'white'}
                    />
                  </TouchableOpacity>

                  {/* {isCameraOpen && (
            <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
              <View style={styles.cameraControls}>
                <Button title="Capture" onPress={() => handleCapture('tyre1Image')} />
                <Button title="Close" onPress={handleCameraClose} />
              </View>
            </Camera>
          )} */}
                  {/* {capturedImages.tyre1Image && (
            <Image source={{ uri: capturedImages.tyre1Image }} style={styles.capturedImage} />
          )} */}
                </View>
              )}
              {vehicleDetails.tyreQuantity === '2' && (
                <View>
                  <View style={styles.Serial_number_input_view}>
                    <TextInput
                      style={styles.Serial_number_input_small}
                      placeholder=""
                      placeholderTextColor={placeholderTextColor}
                      onChangeText={value =>
                        handleVehicleDetailsChange('tyre1SerialNumber1', value)
                      }
                      value={vehicleDetails.tyre1SerialNumber1}
                    />
                    <TextInput
                      style={styles.Serial_number_input}
                      placeholder=""
                      placeholderTextColor={placeholderTextColor}
                      onChangeText={value =>
                        handleVehicleDetailsChange('tyre1SerialNumber2', value)
                      }
                      value={vehicleDetails.tyre1SerialNumber2}
                    />
                    <TextInput
                      style={styles.Serial_number_input}
                      placeholder=""
                      placeholderTextColor={placeholderTextColor}
                      onChangeText={value =>
                        handleVehicleDetailsChange('tyre1SerialNumber3', value)
                      }
                      value={vehicleDetails.tyre1SerialNumber3}
                    />
                  </View>
                  {/* {tyre2Image && <Image source={{ uri: tyre2Image }} width={320} height={300} />} */}
                  {vehicleDetails.tyre1Image && (
                    <Image
                      source={{
                        uri:
                          vehicleDetails.tyre1Image + '?' + new Date().getTime(),
                      }}
                      width={320}
                      height={300}
                    // style={{ width: 100, height: 100 }}
                    />
                  )}
                  <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={tyre1ImagePickCamera}>
                    <Text style={styles.buttonText}>
                      Take Tyre 1 Photo with Serial Number
                    </Text>
                    <Icon
                      style={{ marginLeft: 10, marginTop: 2 }}
                      name="camera"
                      size={20}
                      color={'white'}
                    />
                  </TouchableOpacity>

                  <View style={styles.Serial_number_input_view}>
                    <TextInput
                      style={styles.Serial_number_input_small}
                      placeholder=""
                      placeholderTextColor={placeholderTextColor}
                      onChangeText={value =>
                        handleVehicleDetailsChange('tyre2SerialNumber1', value)
                      }
                      value={vehicleDetails.tyre2SerialNumber1}
                    />
                    <TextInput
                      style={styles.Serial_number_input}
                      placeholder=""
                      placeholderTextColor={placeholderTextColor}
                      onChangeText={value =>
                        handleVehicleDetailsChange('tyre2SerialNumber2', value)
                      }
                      value={vehicleDetails.tyre2SerialNumber2}
                    />
                    <TextInput
                      style={styles.Serial_number_input}
                      placeholder=""
                      placeholderTextColor={placeholderTextColor}
                      onChangeText={value =>
                        handleVehicleDetailsChange('tyre2SerialNumber3', value)
                      }
                      value={vehicleDetails.tyre2SerialNumber3}
                    />
                  </View>
                  {vehicleDetails.tyre2Image && (
                    <Image
                      source={{
                        uri:
                          vehicleDetails.tyre2Image + '?' + new Date().getTime(),
                      }}
                      width={320}
                      height={300}
                    // style={{ width: 100, height: 100 }}
                    />
                  )}
                  <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={tyre2ImagePickCamera}>
                    <Text style={styles.buttonText}>
                      Take Tyre 2 Photo with Serial Number
                    </Text>
                    <Icon
                      style={{ marginLeft: 10, marginTop: 2 }}
                      name="camera"
                      size={20}
                      color={'white'}
                    />
                  </TouchableOpacity>

                  {/* {isCameraOpen && (
            <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
              <View style={styles.cameraControls}>
                <Button title="Capture" onPress={() => handleCapture('tyre2Image')} />
                <Button title="Close" onPress={handleCameraClose} />
              </View>
            </Camera>
          )}
          {capturedImages.tyre2Image && (
            <Image source={{ uri: capturedImages.tyre2Image }} style={styles.capturedImage} />
          )} */}
                </View>
              )}
            </>
          )}
        </View>

        {/* Optional Details */}
        <View>
          <TouchableOpacity
            style={styles.sectionHeaderContainer}
            onPress={toggleOptionalDetails}>
            <Text style={styles.sectionHeader}>Optional Details</Text>
            <TouchableOpacity style={styles.toggleButton}>
              <Icon
                style={{ marginTop: 12 }}
                onPress={toggleOptionalDetails}
                name={showOptionalDetails ? 'caret-up' : 'caret-down'}
                size={25}
                color={iconColor}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          {showOptionalDetails && (
            <>
              <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>Invoice No.</Text>
                </View>
                <View style={styles.text_view}>
                  <TextInput
                    style={styles.input}
                    placeholder="Invoice Number"
                    placeholderTextColor={placeholderTextColor}
                    // onChangeText={value =>
                    //   handleOptionalDetailsChange('invoiceNumber', value)
                    // }
                    // value={optionalDetails.invoiceNumber}
                    value={selectedItem?.invoiceNumber ?? ''}
                    onChangeText={(text) => handleInputChange('invoiceNumber', text)}
                  />
                </View>
              </View>
              {optionalDetails.invoiceImage && (
                <Image
                  source={{
                    uri:
                      optionalDetails.invoiceImage + '?' + new Date().getTime(),
                  }}
                  width={320}
                  height={300}
                // style={{ width: 100, height: 100 }}
                />
              )}
              {/* {invoiceImageUri && <Image source={{ uri: invoiceImageUri }} width={320} height={300} />} */}
              <TouchableOpacity style={styles.cameraButton} onPress={invoicePickCamera}>
                <Text style={styles.buttonText}>Take Invoice Photo</Text>
                <Icon
                  style={{ marginLeft: 10, marginTop: 2 }}
                  name="camera"
                  size={20}
                  color={'white'}
                />
              </TouchableOpacity>
              {/* {isCameraOpen && (
        <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
          <View style={styles.cameraControls}>
            <Button title="Capture" onPress={() => handleCapture('invoiceImage')} />
            <Button title="Close" onPress={handleCameraClose} />
          </View>
        </Camera>
      )}
      {capturedImages.invoiceImage && (
        <Image source={{ uri: capturedImages.invoiceImage }} style={styles.capturedImage} />
      )} */}

              <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>Invoice Date</Text>
                </View>
                <View style={styles.text_view}>
                  <TextInput
                    style={styles.input}
                    placeholder="Invoice Date"
                    placeholderTextColor={placeholderTextColor}
                    // onChangeText={value =>
                    //   handleOptionalDetailsChange('invoiceDate', value)
                    // }
                    // value={optionalDetails.invoiceDate}
                    value={selectedItem?.invoiceDate ?? ''}
                    onChangeText={(text) => handleInputChange('invoiceDate', text)}
                  />
                </View>
              </View>

              <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>Invoice Date</Text>
                </View>
                <View style={styles.text_view}>
                  <TextInput
                    style={styles.input}
                    placeholder="ODO Meter (Hr / Year)"
                    placeholderTextColor={placeholderTextColor}
                    // onChangeText={value =>
                    //   handleOptionalDetailsChange('odoMeterReading', value)
                    // }
                    // value={optionalDetails.odoMeterReading}

                    value={selectedItem?.odoMeterReading ?? ''}
                    onChangeText={(text) => handleInputChange('odoMeterReading', text)}
                  />
                </View>
              </View>

              {/* {ODOMeterImageUri && <Image source={{ uri: ODOMeterImageUri }} width={320} height={300} />} */}
              {optionalDetails.odoMeterImage && (
                <Image
                  source={{
                    uri:
                      optionalDetails.odoMeterImage + '?' + new Date().getTime(),
                  }}
                  width={320}
                  height={300}
                // style={{ width: 100, height: 100 }}
                />
              )}
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={ODOMeterPickCamera}>
                <Text style={styles.buttonText}>Take ODO Meter Photo</Text>
                <Icon
                  style={{ marginLeft: 10, marginTop: 2 }}
                  name="camera"
                  size={20}
                  color={'white'}
                />
              </TouchableOpacity>
              {/* {isCameraOpen && (
        <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
          <View style={styles.cameraControls}>
            <Button title="Capture" onPress={() => handleCapture('odoMeterImage')} />
            <Button title="Close" onPress={handleCameraClose} />
          </View>
        </Camera>
      )}
      {capturedImages.odoMeterImage && (
        <Image source={{ uri: capturedImages.odoMeterImage }} style={styles.capturedImage} />
      )} */}
            </>
          )}
        </View>

        {/* Old Tyre Details */}
        <View>
          <TouchableOpacity
            style={styles.sectionHeaderContainer}
            onPress={toggleOldTyreDetails}>
            <Text style={styles.sectionHeader}>Old Tyre Details</Text>
            <View style={styles.toggleButton}>
              <Icon
                style={{ marginTop: 12 }}
                onPress={toggleOldTyreDetails}
                name={showOldTyreDetails ? 'caret-up' : 'caret-down'}
                size={25}
                color={iconColor}
              />
            </View>
          </TouchableOpacity>

          {showOldTyreDetails && (
            <>
              <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>
                    Old Tyre Company
                  </Text>
                </View>
                <View style={styles.text_view}>
                  <View style={styles.input}>
                    <SelectList
                      dropdownStyles={styles.dropdownshow}
                      maxHeight={200}
                      data={oldtyrecompanyItems}
                      value={selectedOldTyreCompany}

                      setSelected={(value) => {
                        setSelectedOldTyreCompany(value);
                        handleInputChange('oldTyreCompany', value);
                      }}
                      // setSelected={value =>
                      //   handleOldTyreDetailsChange('oldTyreCompany', value)
                      // }
                      placeholder={`${selectedItem.oldTyreCompany}`}
                      boxStyles={{ borderWidth: 0, padding: 0 }}
                      arrowicon={
                        <Icon name="chevron-down" size={12} color={'black'} />
                      }
                      save="value"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>
                    Old Tyre Brand Name
                  </Text>
                </View>
                <View style={styles.text_view}>
                  <View style={styles.input}>
                    <SelectList
                      dropdownStyles={styles.dropdownshow}
                      maxHeight={200}
                      data={oldtyrebrandnameItems}
                      value={selectedOldTyreBrandName}

                      setSelected={(value) => {
                        setSelectedOldTyreBrandName(value);
                        handleInputChange('oldTyreBrand', value);
                      }}
                      // setSelected={value =>
                      //   handleOldTyreDetailsChange('oldTyreBrand', value)
                      // }
                      placeholder={`${selectedItem.oldTyreBrand}`}
                      boxStyles={{ borderWidth: 0, padding: 0 }}
                      arrowicon={
                        <Icon name="chevron-down" size={12} color={'black'} />
                      }
                      save="value"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.outer_view}>
                <View style={styles.label_view}>
                  <Text style={styles.label_View_text_style}>Old Tyre Size</Text>
                </View>
                <View style={styles.text_view}>
                  <View style={styles.input}>
                    <SelectList
                      dropdownStyles={styles.dropdownshow}
                      maxHeight={200}
                      data={OldTyreSizedata}
                      value={OldTyreSizedata}
                      setSelected={(value) => {
                        setSelectedOldTyreBrandName(value);
                        handleInputChange('oldTyreSize', value);
                      }}
                      // setSelected={value =>
                      //   handleOldTyreDetailsChange('oldTyreSize', value)
                      // }
                      placeholder="Old Tyre Size"
                      boxStyles={{ borderWidth: 0, padding: 0 }}
                      arrowicon={
                        <Icon name="chevron-down" size={12} color={'black'} />
                      }
                      save="value"
                    />
                  </View>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Terms and Conditions */}
        <View>
          <Text style={styles.sectionHeader}>Terms and Conditions</Text>
          <RadioButton.Group
            onValueChange={value => setTermsAccepted(value)}
            value={termsAccepted}>
            <RadioButton.Item
              label="I accept the terms and conditions"
              value={true}
              color={RadioButtonColor}
              style={styles.radioButton}
              labelStyle={styles.radioLabel}
            />
          </RadioButton.Group>
        </View>

        {/* Submit Button */}
        {/* <Button title="Submit" onPress={handleSubmit} color="#e11e30" /> */}
        {/* <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id?.toString() ?? ''}
      
    /> */}
      </ScrollView>
    </>
  );
};


export default Outbox;

