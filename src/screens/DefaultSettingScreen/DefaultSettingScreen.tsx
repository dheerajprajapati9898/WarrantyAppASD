import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Switch, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, Checkbox, Button } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import styles from './style';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { setupStateDatabase, getAllStateItems, clearStateTable } from './../../db/Registration/StateDb';
import { setupSettingDatabase, getSettingItems, insertSettingItems, clearSettingTable } from './../../db/setting/settings'
import RemoteUrls from '../apiUrl';
import { clearPinCodeTable, insertPinCodeItems } from '../../db/Registration/PinCodeDb';
import { updateMasterSyncUpdateItem } from '../../db/MasterSyncUpdate/MasterSyncUpdate';
const DefaultSettingScreen = () => {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [regNo, setRegNo] = useState('');
  const [insurer, setInsurer] = useState('Oriental Insurance');
  const [photoCompression, setPhotoCompression] = useState();
  const [leadAlert, setLeadAlert] = useState('');
  const [selfInspection, setSelfInspection] = useState('');
  const [status, setStatus] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  const [selectedDistrict, setSelectedDistrict] = React.useState('');
  const Districtdata = [
    { label: 'Mumbai', value: 'Mumbai' },
    { label: 'Ahmedabad', value: 'Ahmedabad' },
  ]


  const RadioButtonColor = '#e11e30'
  const switchTrackColor = { false: '#767577', true: '#f4f3f4' };
  const switchThumbColor = status ? '#e11e30' : '#f4f3f4';
  const [qualityCompressionOption, setQualityCompressionOption] = useState(null);
  const [isSelectedQualityCompression, setIsSelectedQualityCompression] = useState(false);

  const handleQualityCompressionChange = option => {
    setQualityCompressionOption(option);
    if (option === 'available') {
      setIsSelectedQualityCompression(true); // Set state for available option
    } else {
      setIsSelectedQualityCompression(false); // Set state for other options
    }
  };
  const clearSettings = async () => {
    setState('');
    setDistrict('');
    setVehicleType('');
    setRegNo('');
    setInsurer('Oriental Insurance');
    setPhotoCompression(60);
    setLeadAlert('');
    setSelfInspection('');
    setStatus(true);
    setRememberMe(false);
    await clearSettingTable('setting')
  };
  const [stateItems, setStateItems] = useState();
  const [stateItemsa, setStateItemsa] = useState();
  useEffect(() => {
    setupStateDatabase()
    setupSettingDatabase()
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

        console.log("check state", formattedItems)

      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchStateItems();
    const fetchStateItems1 = async () => {
      try {
        // console.log("check")
        const itemsFromDb = await getSettingItems();
        // console.log("check state", itemsFromDb.length)

        setStateItemsa(itemsFromDb);

        console.log("check state", itemsFromDb)

      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchStateItems1();
  }, []);
  const [customerDetails, setCustomerDetails] = useState({
    statename: '',
  });
  const handleCustomerDetailsChange = (field, value) => {
    setCustomerDetails(prevState => ({ ...prevState, [field]: value }));
  };

  const [stateObjectofkey, setStateObjectofkey] = useState('')
  const getStateObjectByName = async (stateName) => {
    const getstateItems = await getAllStateItems()
    const getstate = getstateItems.filter(state => state.statename === stateName)
    setStateObjectofkey(getstate[0].stateid)
    console.log(getstate[0].stateid);

  }
  const saveSettings = async () => {
    // console.log("itemId", qualityCompressionOption);
    // return
    try {
      // await clearSettingTable('setting')
      const itemId = await insertSettingItems(customerDetails.statename, stateObjectofkey, qualityCompressionOption);
      setQualityCompressionOption(null)
      setCustomerDetails({
        statename: '',
      });
      Alert.alert('Success', 'Data saved!')
    }
    catch (error) {
      console.error(error);
    }
  };
  const getDistrictMasterFromStateID = async (stateObjectofkey) => {

    const payload = {
      stateID: stateObjectofkey,

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

    } catch (error) {
      console.error('Error fetching state data:', error);

    }
  };
  return (
    <View style={styles.outerContainer}>
      {/* <View style={styles.innerContainer}> */}
      <Text style={styles.label}>Default State</Text>

      <View >
        <View style={styles.input}>
          <SelectList
            dropdownStyles={styles.dropdownshow}
            maxHeight={200}
            data={stateItems}
            setSelected={(value) => {
              handleCustomerDetailsChange('statename', value)
              getStateObjectByName(value)
            }}
            // setSelected={setSelectedState}
            placeholder="State"
            save="value"
            boxStyles={{ borderWidth: 0, padding: 0 }}
            arrowicon={<Icon name="chevron-down" size={12} color={'black'} />}
          />
        </View>
      </View>


      <Text style={styles.label}>Default District</Text>
      {/* <View > */}
      <View style={styles.input}>
        <SelectList
          data={Districtdata}
          setSelected={setSelectedDistrict}
          placeholder="District"
          boxStyles={{ borderWidth: 0, padding: 0 }}
          arrowicon={<Icon name="chevron-down" size={12} color={'black'} />}
        />
      </View>
      {/* </View> */}

      <Text style={styles.label}>Photo Compression %</Text>
      <View style={styles.radioButtonContainer}>
        <RadioButton.Group
          onValueChange={handleQualityCompressionChange}
          value={qualityCompressionOption}>
          <View style={styles.redioButtonItemContainer}>
            <RadioButton.Item
              label="20%"
              value="20"
              color={RadioButtonColor}
              style={styles.radioButton}
              labelStyle={styles.radioLabel}
            />
            <RadioButton.Item
              label="40%"
              value="40"
              color={RadioButtonColor}
              style={styles.radioButton}
              labelStyle={styles.radioLabel}
            />
            <RadioButton.Item
              label="60%"
              value="60"
              color={RadioButtonColor}
              style={styles.radioButton}
              labelStyle={styles.radioLabel}
            />
          </View>
        </RadioButton.Group>
      </View>

      <Button mode="contained" style={styles.button} onPress={saveSettings}>
        SAVE
      </Button>

      <Button mode="contained" style={styles.button} onPress={clearSettings}>
        CLEAR SETTINGS
      </Button>

      {/* {stateItemsa && Array.isArray(stateItemsa) && stateItemsa.length > 0 ? (
        stateItemsa.map((item, index) => (
          <Text key={index}>{item.statename}{item.quality_compression}{index}</Text>
        ))
      ) : (
        <Text>No items to display</Text>
      )} */}

      {/* </View> */}
    </View>
  );
};



export default DefaultSettingScreen;
