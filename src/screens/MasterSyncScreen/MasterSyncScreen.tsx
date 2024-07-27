import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert, RefreshControl, ActivityIndicator
} from 'react-native';
import { Modal, Portal, PaperProvider, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';
import {
  setupStateDatabase,
  insertStateItems,
  getAllStateItems, clearStateTable
} from './../../db/Registration/StateDb';
import {
  setupPinCodeDatabase,
  insertPinCodeItems,
  getAllPinCodeItems,
  clearPinCodeTable
} from './../../db/Registration/PinCodeDb';
import {
  setupTractorMakeDatabase,
  insertTractorMakeItems,
  getAllTractorMakeItems, clearTractorMakeTable
} from './../../db/Registration/TractorMakeDb';
import { setupTractorModelDatabase, getAllTractorModelItems, insertTractorModelItems, clearTractorModelTable } from './../../db/Registration/TractorModelDb';
import { setupBrandNasadmeDatabase, getAllBrandNasadmeItems, insertBrandNasadmeItems, clearBrandNasadmeTable } from './../../db/Registration/BrandName';
import { setupProductNameDatabase, getAllProductNameItems, insertProductNameItems, clearProductNameTable } from './../../db/Registration/ProductNameDb';
import { setupTyreSizeDatabase, getAllTyreSizeItems, insertTyreSizeItems, clearTyreSizeTable } from './../../db/Registration/TyreSizeDb';
import { setupOldTyreBrandNameDatabase, getAllOldTyreBrandNameItems, insertOldTyreBrandNameItems, clearOldTyreBrandNameTable } from './../../db/Registration/OldTyreBrandName';
import { setupOldTyreCompanyDatabase, getAllOldTyreCompanyItems, insertOldTyreCompanyItems, clearOldTyreCompanyTable } from './../../db/Registration/OldTyreCompany';
import { setupVehicleVariantDatabase, getAllVehicleVariantItems, insertVehicleVariantItems, clearVehicleVariantTable } from './../../db/Registration/VehicleVariant'
import { setupVehicleTypeDatabase, getAllVehicleTypeItems, insertVehicleTypeItems, clearVehicleTypeTable } from './../../db/Registration/VehicleTypeDb'
import { setupMasterSyncUpdateDatabase, getAllMasterSyncUpdateItems, insertMasterSyncUpdateItems, clearMasterSyncUpdateTable, updateMasterSyncUpdateItem } from './../../db/MasterSyncUpdate/MasterSyncUpdate'
import { useNavigation } from '@react-navigation/native';

import NetInfo from '@react-native-community/netinfo';
import axios, { formToJSON } from 'axios';

import SQLite from 'react-native-sqlite-storage';
import { check } from 'react-native-permissions';
import RemoteUrls from '../apiUrl';

const PopUp = ({ visible, hideModal, onHideModalWithData }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [checkboxes, setCheckboxes] = useState([]);
  const isAnyCheckboxChecked = checkboxes.some(checkbox => checkbox.checked);
  useEffect(() => {


    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const stateresponse = await axios.get(RemoteUrls.getStateUrl);
      const initialState = stateresponse.data.map(state => ({ id: state.stateid, label: state.statename, checked: false }));
      setCheckboxes(initialState);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching state data:', error);
      setLoading(false);
    }
  };
  const [selectedStateId, serSelectedStateId] = useState('')
  // const [pincodeItems, setPinCodeItems] = useState();
  const getDistrictMasterFromStateID = async (selectedStateId) => {

    const payload = {
      stateID: selectedStateId,

    };
    try {
      const pincoderesponse = await axios.post(RemoteUrls.postPincodeUrl, payload);
      // setPinCodeItems(pincoderesponse.data)
      // setCheckboxes(initialState);
      // console.log(pincoderesponse.data)


      await clearPinCodeTable('pincodetable')
      // console.log(pincodeItems);

      await insertPinCodeItems(pincoderesponse.data);
      await updateMasterSyncUpdateItem('Pincode Master', true)

      setLoading(false);
    } catch (error) {
      console.error('Error fetching state data:', error);
      setLoading(false);
    }
  };

  const handleCheckboxChange = (index, checkbox) => {
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index].checked = !newCheckboxes[index].checked;
    setCheckboxes(newCheckboxes);
    serSelectedStateId(checkbox.id)

  };


  // const [stateItem, setStateItem] = useState();

  // const [makeItems, setMakeItems] = useState();
  // const [modelItems, setModelItems] = useState();
  // const [brandnameItems, setBrandNameItems] = useState();
  // const [productnameItems, setProductNameItems] = useState();
  // const [tyresizeItems, setTyreSizeItems] = useState();
  // const [oldtyrebrandnameItems, setOldTyreBrandNameItems] = useState();
  // const [oldtyrecompanyItems, setOldTyreCompanyItems] = useState();
  // const [items, setItems] = useState([])
  const fetchItems = async () => {

    try {


      const fetchedItems = await getAllMasterSyncUpdateItems();
      console.log("fetchedItems", fetchedItems);
      // setItems(fetchedItems);
    } catch (error) {
      console.error(error);
    }
  };
  const [onOksubmitloading, setonOksubmitloading] = useState(false)

  const onHideModalWithDataHandler = async () => {
    // console.log(selectedStateId);
    if (selectedStateId === '') {

      return
    }
    try {
      setonOksubmitloading(true)
      await getDistrictMasterFromStateID(selectedStateId)
      // console.log(pincodeItems);



      onHideModalWithData(checkboxes.filter(item => item.checked).map(item => item.label));
      hideModal();
      await fetchItems()
      Alert.alert('Success', 'Data added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to another screen after pressing OK
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.log(error);

    }
    finally {
      setonOksubmitloading(false)
    }



  };

  return (
    <ScrollView contentContainerStyle={styles.container1}
    // ref={scrollViewRef}
    // onScroll={handleScroll}
    // scrollEventThrottle={16} // Adjust scroll event throttle as needed
    // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}

    >
      {/* <Modal
        transparent={true}
        visible={onOksubmitloading}
        onRequestClose={() => {
          setonOksubmitloading(!onOksubmitloading);
        }}
      >
        <View style={styles.centeredView1}>
          <View style={styles.modalView1}>
            <ActivityIndicator size="large" color="black" />
          </View>
        </View>
      </Modal> */}

      {/* Conditional rendering based on popup visibility */}
      {loading ?
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="black" />
          <Text style={{ fontSize: 15, margin: 6, fontWeight: 'bold' }}>Loading state...</Text>
        </View>
        :

        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal_container}
        >



          <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>States</Text>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {checkboxes.map((checkbox, index) => (
              <View style={styles.checkboxContainer} key={index}>



                <TouchableOpacity onPress={() => handleCheckboxChange(index, checkbox)}>
                  <View style={[styles.checkbox, { backgroundColor: checkbox.checked ? '#E11E30' : '#fff' }]}>
                    {checkbox.checked && <Icon name="check" size={15} color="#fff" />}
                  </View>
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 18, marginLeft: 10 }}>{checkbox.label}</Text>

              </View>
            ))}
          </ScrollView>
          <TouchableOpacity disabled={!isAnyCheckboxChecked} style={[styles.popupOKButton, { opacity: isAnyCheckboxChecked ? 1 : 0.5 }]} onPress={onHideModalWithDataHandler}>
            {
              onOksubmitloading ?
                <ActivityIndicator size={'large'} color={'black'} /> :
                <Text style={styles.syncAllButtonText}>OK</Text>
            }

          </TouchableOpacity>

        </Modal>
      }
    </ScrollView>
  );
};
const MasterSync = () => {
  const navigation = useNavigation();
  const [visiblesnackbar, setVisibleSnackBar] = React.useState(false);

  const onToggleSnackBar = () => setVisibleSnackBar(!visiblesnackbar);
  const onDismissSnackBar = () => setVisibleSnackBar(false);
  const [errorMessage, setErrorMessage] = useState('')


  const [popupVisible, setPopupVisible] = React.useState(false);
  const showModal = () => {
    setPopupVisible(true);
  };
  const handleHideModal = (checkboxesData) => {
    // Use checkboxesData as needed in MasterSync component
    console.log('Checkbox data received:', checkboxesData);
    // You can update state or perform any actions with checkboxesData here

    setPopupVisible(false); // Example: Update stateItems with checkboxesData
  };
  // const [stateItems, setStateItems] = useState();
  const handleSyncSelected = async (checkboxesData) => {
    // Logic to handle syncing selected data

    try {
      const stateresponse = await axios.get('https://warrantyuat.tyrechecks.com/api/State/GetStateMaster');

      // Assuming stateresponse.data is an array of objects with `statid` and `statename` properties

      // console.log(checkboxesData);

    }
    catch (error) {
      console.error('Error fetching state data:', error);
    }
  }
  const hideModal = () => {

    setPopupVisible(false);
  };
  // const [isDatabaseInitialized, setIsDatabaseInitialized] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isConnected, setIsConnected] = useState(null);
  // const [selectedItem, setSelectedItem] = useState(null);
  const scrollViewRef = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [items, setItems] = useState([])
  const options = [
    { apiname: 'State Master', status: false },
    { apiname: 'City Master', status: false },
    { apiname: 'District Master', status: false },
    { apiname: 'Pincode Master', status: false },
    { apiname: 'Vehicle Type Master', status: false },
    { apiname: 'Vehicle Make Master', status: false },
    { apiname: 'Vehicle Modal Master', status: false },
    // { apiname: 'Photo Category', status: false },
  ];

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
    fetchItems()
    setTimeout(() => {
      setData([]);
      // fetchData();
      setRefreshing(false);
    }, 1000); // Simulated delay
  };
  useEffect(() => {

    setupStateDatabase();
    setupPinCodeDatabase();
    setupTractorMakeDatabase();
    setupTractorModelDatabase();
    setupBrandNasadmeDatabase();
    setupProductNameDatabase();
    setupTyreSizeDatabase();
    setupOldTyreBrandNameDatabase();
    setupOldTyreCompanyDatabase();
    setupVehicleTypeDatabase()
    setupVehicleVariantDatabase()
    setupMasterSyncUpdateDatabase()
    fetchStateItems();
    fetchPinCodeItems();
    fetchTractorMakeItems();
    fetchTractorModelItems();
    fetchBrandNasadmeItems();
    fetchProductNameItems();
    fetchTyreSizeItems();
    fetchOldTyreBrandNameItems();
    fetchOldTyreCompanyItems();
    fetchItems()
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
  const fetchItems = async () => {

    try {


      const fetchedItems = await getAllMasterSyncUpdateItems();
      console.log("fetchedItems", fetchedItems);
      setItems(fetchedItems);
    } catch (error) {
      console.error(error);
    }
  };
  const [syncValueCheck, setSyncValueCheck] = useState({
    isState: false,
    isPincode: false,
    isMake: false,
    isModel: false,
    isBrandName: false,
    isProductName: false,
    isTyreSize: false,
    isoldtyrebrandname: false,
    isoldtyrecompanyname: false,
  })
  // const colorchange=[{
  //   syncValueCheck
  // }]

  const [stateItem, setStateItem] = useState();
  const [pincodeItems, setPinCodeItems] = useState();
  const [makeItems, setMakeItems] = useState();
  const [modelItems, setModelItems] = useState();
  const [brandnameItems, setBrandNameItems] = useState();
  const [productnameItems, setProductNameItems] = useState();
  const [tyresizeItems, setTyreSizeItems] = useState();
  const [oldtyrebrandnameItems, setOldTyreBrandNameItems] = useState();
  const [oldtyrecompanyItems, setOldTyreCompanyItems] = useState();
  const fetchStateItems = async () => {
    try {
      // console.log("check")
      const itemsFromDb = await getAllStateItems();
      console.log("check state", itemsFromDb)
      const formattedItems = itemsFromDb.map(item => ({
        key: item.StateID.toString(),
        value: item.StateName,
      }));
      setStateItem(formattedItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchPinCodeItems = async () => {
    try {
      const itemsFromDb = await getAllPinCodeItems();
      const pincodeItems = itemsFromDb.map(item => ({
        key: item.id.toString(),
        value: item.AreaName
      }));
      setPinCodeItems(pincodeItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchTractorMakeItems = async () => {
    try {
      const itemsFromDb = await getAllTractorMakeItems();
      const makeItems = itemsFromDb.map(item => ({
        key: item.id.toString(),
        value: item.MakeName
      }));
      setMakeItems(makeItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchTractorModelItems = async () => {
    try {
      const itemsFromDb = await getAllTractorModelItems();
      const modelItems = itemsFromDb.map(item => ({
        key: item.id.toString(),
        value: item.ModelName
      }));
      setModelItems(modelItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchBrandNasadmeItems = async () => {
    try {
      const itemsFromDb = await getAllBrandNasadmeItems();
      const brandnameItems = itemsFromDb.map(item => ({
        key: item.id.toString(),
        value: item.BrandName
      }));
      setBrandNameItems(brandnameItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchProductNameItems = async () => {
    try {
      const itemsFromDb = await getAllProductNameItems();
      const productnameItems = itemsFromDb.map(item => ({
        key: item.id.toString(),
        value: item.ProductName
      }));
      setProductNameItems(productnameItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchTyreSizeItems = async () => {
    try {
      const itemsFromDb = await getAllTyreSizeItems();
      const tyresizeItems = itemsFromDb.map(item => ({
        key: item.id.toString(),
        value: item.size_name
      }));
      setTyreSizeItems(tyresizeItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchOldTyreBrandNameItems = async () => {
    try {
      const itemsFromDb = await getAllOldTyreBrandNameItems();
      const oldtyrebrandnameItems = itemsFromDb.map(item => ({
        key: item.id.toString(),
        value: item.brand_pattern
      }));
      setOldTyreBrandNameItems(oldtyrebrandnameItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchOldTyreCompanyItems = async () => {
    try {
      const itemsFromDb = await getAllOldTyreCompanyItems();
      const oldtyrecompanyItems = itemsFromDb.map(item => ({
        key: item.id.toString(),
        value: item.tyre_company_name
      }));
      setOldTyreCompanyItems(oldtyrecompanyItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [loading, setLoading] = useState(false);

  // const getstatedata = async () => {

  // }
  const handleSyncAllPress = async () => {
    showModal();
    // console.log('SYNC ALL button pressed');

    try {

      setLoading(true)
      await getstatedata()
      console.log("statedatacheck");

      await getmakedata()
      console.log("getmakedata");

      await getmodeldata()
      await getbrandnamedata()
      await getproductnamedata()
      await gettyresizedata()
      await getoldtyrecomapanydata()
      await getoldtyrebranddata()
      await getvehicletypedata()
      await getvehicletvariantdata()
      // const stateresponse = await axios.get('https://warrantyuat.tyrechecks.com/api/State/GetStateMaster');
      // const poincoderesponse = await axios.post('https://warrantyuat.tyrechecks.com/api/District/GetDistrictMasterFromStateID');
      // const makeresponse = await axios.get('https://warrantyuat.tyrechecks.com/GetIMakeMaster');
      // const modelresponse = await axios.get('https://warrantyuat.tyrechecks.com/GetAllModel');
      // const brandnameresponse = await axios.get('https://warrantyuat.tyrechecks.com/GetBrandMaster');
      // const productnameresponse = await axios.get('https://warrantyuat.tyrechecks.com/api/Product/GetProductWithBrand');
      // const tyresizeresponse = await axios.get('https://warrantyuat.tyrechecks.com/api/Tyre/GetTyreSizeMaster');
      // const oldtyrebrandresponse = await axios.get('https://warrantyuat.tyrechecks.com/GetOldTypeBrand');
      // const oldtyrecompanyresponse = await axios.get('https://warrantyuat.tyrechecks.com/GetOldTyreCompany');
      // const vehiicleType = await axios.get('https://warrantyuat.tyrechecks.com/GetVehicleTypeMaster')
      // const vehicleVariant = await axios.get('https://warrantyuat.tyrechecks.com/GetVariantMaster')

      // console.log("getVehihicleType", getVehihicleType.data);
      // await clearStateTable('states');
      // await clearPinCodeTable('pincodetable')
      // await clearTractorMakeTable('tractormake');
      // await clearTractorModelTable('tractormodel');
      // await clearBrandNasadmeTable('brandname');
      // await clearProductNameTable('productname');
      // await clearTyreSizeTable('tyresize');
      // await clearOldTyreCompanyTable('oldtyrecompany');
      // await clearOldTyreBrandNameTable('oldtyrebrandname');
      // // await clearVehicleTypeTable();
      // await clearVehicleVariantTable();


      // console.log("stateresponse", stateresponse.status);
      // return
      console.log("stateasdadasd");
      // await insertStateItems(stateresponse.data);
      // console.log("vehiicleType", vehiicleType.data);
      // return


      // await insertTractorMakeItems(makeresponse.data);
      // await insertTractorModelItems(modelresponse.data);
      // await insertBrandNasadmeItems(brandnameresponse.data);
      // await insertProductNameItems(productnameresponse.data);
      // await insertTyreSizeItems(tyresizeresponse.data);
      // await insertOldTyreBrandNameItems(oldtyrebrandresponse.data);
      // await insertOldTyreCompanyItems(oldtyrecompanyresponse.data);


      // await insertVehicleTypeItems('yz');
      // await insertVehicleVariantItems(vehicleVariant.data);
      // setStateItem()
      //  setMakeItems(makeresponse.data);
      //  setBrandNameItems(brandnameresponse.data);
      //   setModelItems(modelresponse.data);
      //  setProductNameItems(productnameresponse.data);
      //  setTyreSizeItems(tyresizeresponse.data);
      //   setOldTyreBrandNameItems(oldtyrebrandresponse.data);
      //   setOldTyreCompanyItems(oldtyrecompanyresponse.data);
      //    setStateItem(stateresponse.data)


    } catch (error) {
      console.error('API Error:', error);
      Alert.alert("Error", "Something went wrong")
      //     // Handle error (e.g., show an error message)
    } finally {
      setLoading(false);
    }
    //   if (isConnected) {
    //    
    //     // try {



    //     // } 
    //       // console.log(sampleItems)

    //       // fetchItems();
    //     //  catch (error) {
    //     //   console.error('Insert error:', error);
    //     // }
    //   }




    // Alert.alert('Success', 'Data added successfully!',[
    //   {
    //     text: 'OK',
    //     onPress: () => {
    //       // Navigate to another screen after pressing OK
    //       // navigation.navigate('Home');
    //     },
    //   },
    // ]);
    // else{
    //   Alert.alert("Error","Please check internet connection!")
    // }
  };
  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

  //     </View>
  //   );
  // }

  const getstatedata = async () => {
    try {
      const stateresponse = await axios.get(RemoteUrls.getStateUrl);

      if (stateresponse.status === 200) {
        await clearStateTable('states');
        await insertStateItems(stateresponse.data);

        await updateMasterSyncUpdateItem('State Master', true)
      }
      else {
        Alert.alert("Error", "fetching state data faild")
        await updateMasterSyncUpdateItem('State Master', false)
        setErrorMessage('fetching state data faild')
        onToggleSnackBar()
      }
    }
    catch (error) {
      Alert.alert("Error", "fetching state data faild")
      await updateMasterSyncUpdateItem('State Master', false)
      setErrorMessage('fetching state data faild')
      onToggleSnackBar()

    }
  }
  const getmakedata = async () => {
    try {
      const makeresponse = await axios.get(RemoteUrls.getVehicleMakeUrl);
      if (makeresponse.status === 200) {
        await clearTractorMakeTable('tractormake');
        await insertTractorMakeItems(makeresponse.data);
        await updateMasterSyncUpdateItem('Vehicle Make Master', true)
      }
      else {
        Alert.alert("Error", "fetching tractormake data faild")
        setErrorMessage('fetching tractormake data faild')
        onToggleSnackBar()
      }
    }
    catch (error) {
      Alert.alert("Error", "fetching tractormake data faild")
      setErrorMessage('fetching tractormake data faild')
      onToggleSnackBar()

    }
  }
  const getmodeldata = async () => {
    try {
      const modelresponse = await axios.get(RemoteUrls.getVehicleModelUrl);
      if (modelresponse.status === 200) {
        await clearTractorModelTable('tractormodel');
        await insertTractorModelItems(modelresponse.data);
        await updateMasterSyncUpdateItem('Vehicle Modal Master', true)
      }
      else {
        Alert.alert("Error", "fetching tractormodel data faild")
        setErrorMessage('fetching tractormodel data faild')
        onToggleSnackBar()
      }
    }
    catch (error) {
      Alert.alert("Error", "fetching tractormodel data faild")
      setErrorMessage('fetching tractormodel data faild')
      onToggleSnackBar()

    }
  }
  const getbrandnamedata = async () => {
    try {
      const brandnameresponse = await axios.get(RemoteUrls.getTyreBrandUrl);
      if (brandnameresponse.status === 200) {
        await clearBrandNasadmeTable('brandname');
        await insertBrandNasadmeItems(brandnameresponse.data);
        await updateMasterSyncUpdateItem('Tyre Brand Master', true)
      }
      else {
        Alert.alert("Error", "fetching brandname data faild")
        setErrorMessage('fetching brandname data faild')
        onToggleSnackBar()
      }
    }
    catch (error) {
      Alert.alert("Error", "fetching brandname data faild")
      setErrorMessage('fetching brandname data faild')
      onToggleSnackBar()

    }
  }
  const getproductnamedata = async () => {
    try {
      const productnameresponse = await axios.get(RemoteUrls.getProductUrl);
      if (productnameresponse.status === 200) {
        await clearProductNameTable('productname');
        await insertProductNameItems(productnameresponse.data);
        await updateMasterSyncUpdateItem('Product Name Master', true)
      }
      else {
        Alert.alert("Error", "fetching productname data faild")
        setErrorMessage('fetching productname data faild')
        onToggleSnackBar()
      }
    }
    catch (error) {
      Alert.alert("Error", "fetching productname data faild")
      setErrorMessage('fetching productname data faild')
      onToggleSnackBar()

    }
  }
  const gettyresizedata = async () => {
    try {
      const tyresizeresponse = await axios.get(RemoteUrls.getTyreSizeUrl);
      if (tyresizeresponse.status === 200) {
        await clearTyreSizeTable('tyresize');
        await insertTyreSizeItems(tyresizeresponse.data);
        await updateMasterSyncUpdateItem('Tyre Size Master', true)
      }
      else {
        Alert.alert("Error", "fetching tyresize data faild")
        setErrorMessage('fetching tyresize data faild')
        onToggleSnackBar()
      }
    }
    catch (error) {
      Alert.alert("Error", "fetching tyresize data faild")
      setErrorMessage('fetching tyresize data faild')
      onToggleSnackBar()

    }
  }
  const getoldtyrecomapanydata = async () => {
    try {
      const oldtyrecompanyresponse = await axios.get(RemoteUrls.getOldTyreCompanyUrl);
      if (oldtyrecompanyresponse.status === 200) {
        await clearOldTyreCompanyTable('oldtyrecompany');
        await insertOldTyreCompanyItems(oldtyrecompanyresponse.data);
        await updateMasterSyncUpdateItem('Old Tyre Company Master', true)
      }
      else {
        Alert.alert("Error", "fetching oldtyrecompany data faild")
        setErrorMessage('fetching oldtyrecompany data faild')
        onToggleSnackBar()
      }
    }
    catch (error) {
      Alert.alert("Error", "fetching oldtyrecompany data faild")
      setErrorMessage('fetching oldtyrecompany data faild')
      onToggleSnackBar()

    }
  }
  const getoldtyrebranddata = async () => {
    try {
      const oldtyrebrandresponse = await axios.get(RemoteUrls.getOldTyreBrandUrl);
      if (oldtyrebrandresponse.status === 200) {
        await clearOldTyreBrandNameTable('oldtyrebrandname');
        await insertOldTyreBrandNameItems(oldtyrebrandresponse.data);
        await updateMasterSyncUpdateItem('Old Tyre Brand Master', true)
      }
      else {
        Alert.alert("Error", "fetching oldtyrebrandname data faild")
        setErrorMessage('fetching oldtyrebrandname data faild')
        onToggleSnackBar()
      }
    }
    catch (error) {
      Alert.alert("Error", "fetching oldtyrebrandname data faild")
      setErrorMessage('fetching oldtyrebrandname data faild')
      onToggleSnackBar()

    }
  }
  const getvehicletypedata = async () => {
    try {
      const vehiicleType = await axios.get(RemoteUrls.getVehicleTypeUrl)
      if (vehiicleType.status === 200) {
        await clearVehicleTypeTable();
        // console.log("vehiicleTypeadasd");
        // return
        await insertVehicleTypeItems(vehiicleType.data);
        await updateMasterSyncUpdateItem('Vehicle Type Master', true)
      }
      else {
        Alert.alert("Error", "fetching vehiicleType data faild")
        setErrorMessage('fetching vehiicleType data faild')
        onToggleSnackBar()
      }
    }
    catch (error) {
      Alert.alert("Error", "fetching vehiicleType data faild")
      setErrorMessage('fetching vehiicleType data faild')
      onToggleSnackBar()

    }
  }
  const getvehicletvariantdata = async () => {
    try {
      const vehicleVariant = await axios.get(RemoteUrls.getVehicleVariantUrl)
      if (vehicleVariant.status === 200) {
        await clearVehicleVariantTable();
        await insertVehicleVariantItems(vehicleVariant.data);
        await updateMasterSyncUpdateItem('Vehicle Variant Master', true)
      }
      else {
        Alert.alert("Error", "fetching vehicleVariant data faild")
        setErrorMessage('fetching vehicleVariant data faild')
        onToggleSnackBar()
      }
    }
    catch (error) {
      Alert.alert("Error", "fetching vehicleVariant data faild")
      setErrorMessage('fetching vehicleVariant data faild')
      onToggleSnackBar()

    }
  }
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16} // Adjust scroll event throttle as needed
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Conditional rendering based on popup visibility */}
        <View>
          <Snackbar
            visible={visiblesnackbar}
            onDismiss={onDismissSnackBar}>
            {errorMessage}
          </Snackbar>
          {
            isConnected ?
              (!popupVisible ? (
                <View>
                  <Text style={styles.heading}>MASTER SYNC</Text>
                  {items.map((item, index) => (
                    <TouchableOpacity
                      // key={index}
                      style={styles.button}
                    >
                      {/* <Text style={styles.buttonText}>{item.label}</Text> */}
                      <Text style={styles.buttonText}>{item.apiname}</Text>
                      <View style={[
                        styles.iconContainer,
                        {
                          backgroundColor: item.status === 1 ? '#30c749' : '#c73030'
                        }
                      ]}></View>




                    </TouchableOpacity>
                  ))}
                  {
                    loading ?
                      <TouchableOpacity
                        style={styles.syncAllButton}>

                        <ActivityIndicator size="large" color="black" />
                        <Text> Please wait...</Text>
                      </TouchableOpacity>
                      :
                      <TouchableOpacity
                        style={styles.syncAllButton}
                        onPress={handleSyncAllPress}>
                        <Text style={styles.syncAllButtonText}>SYNC ALL</Text>
                      </TouchableOpacity>
                  }

                </View>
              ) : (
                <PopUp visible={popupVisible} hideModal={hideModal} onHideModalWithData={handleSyncSelected} />
              ))
              :
              (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{
                  textAlign: 'center', fontSize: 20, color: 'red',
                  fontWeight: 'bold',
                }}>Internet Connection is required!</Text>
              </View>)
          }

        </View>
      </ScrollView>
    </>
  );

};

export default MasterSync;
