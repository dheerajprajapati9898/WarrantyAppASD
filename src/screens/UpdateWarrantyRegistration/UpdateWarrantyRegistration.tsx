import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Alert, RefreshControl, Modal, ActivityIndicator, Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import { RadioButton, List } from 'react-native-paper';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SelectList } from 'react-native-dropdown-select-list';
import { setupDatabase } from '../../db/Registration/database';
import {
  Item,
  insertItem,
  getAllItems,
  updateItem,
  deleteItem,
} from '../../db/Registration/sqliteOperations';
import { launchCamera } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { setupStateDatabase, getAllStateItems } from './../../db/Registration/StateDb';
import { setupPinCodeDatabase, getAllPinCodeItems } from './../../db/Registration/PinCodeDb';
import {
  setupTractorMakeDatabase,
  getAllTractorMakeItems, getVehicleByVehTypeid, getmakeids
} from './../../db/Registration/TractorMakeDb';
import { setupTractorModelDatabase, getAllTractorModelItems, insertTractorModelItems, getVehicleModelByVehTypeid } from './../../db/Registration/TractorModelDb';
import { setupBrandNasadmeDatabase, getAllBrandNasadmeItems, insertBrandNasadmeItems, getbrandids } from './../../db/Registration/BrandName';
import { setupProductNameDatabase, getAllProductNameItems, insertProductNameItems, getProductNameByProductId } from './../../db/Registration/ProductNameDb';
import { setupTyreSizeDatabase, getAllTyreSizeItems, insertTyreSizeItems, gettyresize } from './../../db/Registration/TyreSizeDb';
import { setupOldTyreBrandNameDatabase, getAllOldTyreBrandNameItems, insertOldTyreBrandNameItems } from './../../db/Registration/OldTyreBrandName';
import { setupOldTyreCompanyDatabase, getAllOldTyreCompanyItems, insertOldTyreCompanyItems } from './../../db/Registration/OldTyreCompany';
import { setupVehicleVariantDatabase, getAllVehicleVariantItems, insertVehicleVariantItems, clearVehicleVariantTable, getVariantByMakeID } from './../../db/Registration/VehicleVariant'
import axios from 'axios';
import { getAllVehicleTypeItems, setupVehicleTypeDatabase, getvehtype } from '../../db/Registration/VehicleTypeDb';

const UpdateWarrantyRegistration = ({ selectedItem, setSelectedItem }) => {
  const RadioButtonColor: string = '#e11e30';
  const placeholderTextColor: string = '#666';
  const iconColor = '#000';
  const [fromDate, setFromDate] = useState(new Date());
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const handleFromDateConfirm = (selectedDate) => {
    setOpenFromDate(false); // Close From Date picker
    setFromDate(selectedDate);
    // Update From Date state
    console.log("date", selectedDate.toLocaleDateString());
    setoldinvoiceDate(selectedDate.toLocaleDateString())
  };
  // Function to handle cancellation of Date pickers
  const handleCancel = () => {
    setOpenFromDate(false); // Close From Date picker
    setOpenToDate(false); // Close To Date picker
  };
  const [modalVisible, setModalVisible] = useState(false);
  // Picker


  // Changes for List Accordions --------------------------------------

  const [expanded, setExpanded] = React.useState(true);

  const [isVehicleRegistrationAvailable, setIsVehicleRegistrationAvailable] =
    useState(false);

  const handlePress = () => setExpanded(!expanded);
  const [selectedNumberOfTyre, setSelectedNumberOfTyre] = React.useState('');
  const NumberOfTyredata = [
    { key: 1, value: '1' },
    { key: 2, value: '2' },
  ];
  const [selectedOldTyreSize, setSelectedOldTyreSize] = React.useState('');
  const OldTyreSizedata = [
    { key: 1, value: '1' },
    { key: 2, value: '2' },
  ];
  //database variables
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  // const [items, setItems] = useState<Item[]>([]);
  //----------------------------------------------------------------

  // State variables to manage visibility of input fields -----------------------------------
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [showOptionalDetails, setShowOptionlDetails] = useState(false);
  const [showOldTyreDetails, setShowOldTyreDetails] = useState(false);

  // Toggle functions
  const toggleCustomerDetails = () => {
    if (registrationOption === null) {
      Alert.alert("Validation Error", "Selection is required!")
      return
    }
    setShowCustomerDetails(prev => !prev);

  };

  const toggleVehicleDetails = () => {
    if (registrationOption === null) {
      Alert.alert("Validation Error", "Selection is required!")
      return
    }
    setShowVehicleDetails(prev => !prev);
  };

  const toggleOptionalDetails = () => {
    if (registrationOption === null) {
      Alert.alert("Validation Error", "Selection is required!")
      return
    }
    setShowOptionlDetails(prev => !prev);
  };

  const toggleOldTyreDetails = () => {
    if (registrationOption === null) {
      Alert.alert("Validation Error", "Selection is required!")
      return
    }
    setShowOldTyreDetails(prev => !prev);
  };

  // ------------------------------------------------------------------------------------------
  const [isDisable, setIsDisable] = useState(false);

  const [registrationOption, setRegistrationOption] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [registrationDate, setRegistrationDate] = useState(null);
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
  const [serial_1, setserial_1] = useState('');
  const [serial_2, setserial_2] = useState('');

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [a, seta] = useState('');
  const cameraRef = useRef(null);

  const handleRadioButtonChange = option => {
    setRegistrationOption(option);
    if (option === 'available') {
      setIsVehicleRegistrationAvailable(true); // Set state for available option
    } else {
      setIsVehicleRegistrationAvailable(false); // Set state for other options
    }
    setoldregistration(option)
  };

  const handleVehicleRegistrationChange = (field, value) => {
    setVehicleDetails(prevState => ({ ...prevState, [field]: value }));
  };

  const handleCustomerDetailsChange = (field, value) => {
    setCustomerDetails(prevState => ({ ...prevState, [field]: value }));
  };
  const [ismakeshow, setismakeshow] = useState(false)
  const [ismodelshow, setismodelshow] = useState(false)
  const [isvehiclevariantshow, setisvehiclevariantshow] = useState(false)
  const [isvehiclevariantcheck, setisvehiclevariantcheck] = useState(true)
  const [isvehiclemakedataitem, setisvehiclemakedataitem] = useState([])
  const [isvehiclemodeldataitem, setisvehiclemodeldataitem] = useState([])
  const [isvehtype, setisvehtype] = useState(false)
  const getVehicleMakeByVehiceTypeID = async (value) => {
    const helper = vehicleTypeItems.filter(element => element.value === value)

    setvehicletyedata(helper[0])
    let helperarray = await getVehicleByVehTypeid(helper[0].key)
    const makedataItems = helperarray.map(item => ({
      key: item.MakeID,
      value: item.MakeName
    }));
    console.log("makedataItems", makedataItems);

    setMakeNamesItems(makedataItems)
    // setoldmake
    let helpermodelarray = await getVehicleModelByVehTypeid(helper[0].key)
    const modeldataItems = helpermodelarray.map(item => ({
      key: item.makeName,
      value: item.modelName
    }));
    setModelItems(modeldataItems)
    setismakeshow(true)
    setismodelshow(true)
  }
  const [isVehicleVariantdataitem, setisVehicleVariantdataitem] = useState([])
  const getVehicleVariantById = async (value) => {
    const helper = makeINamestems.filter(element => element.value === value)
    const helperarray = await getVariantByMakeID(helper[0].key)
    const variantdataItems = helperarray.map(item => ({
      key: item.variantid,
      value: item.variantname
    }));
    setisVehicleVariantdataitem(variantdataItems)
    setVehicleVariantItems(variantdataItems)
    setisvehiclevariantshow(true)
  }
  const storeVehicleVariant = async (value) => {
    const helper = vehicleVariantItems.filter(element => element.value === value)
    // console.log("helper1", helper);
    setoldvariantid(helper[0].key)
    setoldvariantname(helper[0].value)
    setstateidvalue(helper[0])
  }
  const handleVehicleDetailsChange = async (field, value) => {
    setVehicleDetails(prevState => ({ ...prevState, [field]: value }));
    // if(productnameItems[0])
    // console.log("productnameItems", productnameItems);

  };

  const handleSelectedNumberOfTyre = selectedValue => {
    handleVehicleDetailsChange('tyreQuantity', selectedValue); // Update tyreQuantity in vehicleDetails
  };

  const handleOptionalDetailsChange = (field, value) => {
    setOptionalDetails(prevState => ({ ...prevState, [field]: value }));
  };

  const handleOldTyreDetailsChange = (field, value) => {
    setOldTyreDetails(prevState => ({ ...prevState, [field]: value }));
  };

  const handleCameraOpen = (p0: string) => {
    setIsCameraOpen(true);
  };

  const handleCameraClose = () => {
    setIsCameraOpen(false);
  };

  const handleCapture = async imageKey => {
    // if (cameraRef.current) {
    //   const capturedImage = await cameraRef.current.takePictureAsync();
    //   setCapturedImages((prevState) => ({ ...prevState, [imageKey]: capturedImage.uri }));
    //   handleCameraClose();
    // }
  };

  // const [isDatabaseInitialized, setIsDatabaseInitialized] = useState(false);
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


  // const [selectedItem, setSelectedItem] = useState(null);
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
      fetchStateItems();
      // fetchPinCodeItems();
      // fetchTractorMakeItems();
      // fetchTractorModelItems();
      // fetchBrandNasadmeItems();
      // fetchProductNameItems();
      // fetchTyreSizeItems();
      // fetchOldTyreBrandNameItems();
      // fetchOldTyreCompanyItems();
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    // Simulated refreshing action
    setTimeout(() => {
      setData([]);
      // fetchData();
      fetchStateItems();
      // console.log("state", selectedStates);

      // fetchPinCodeItems();
      // fetchTractorMakeItems();
      // fetchTractorModelItems();
      // fetchBrandNasadmeItems();
      // fetchProductNameItems();
      // fetchTyreSizeItems();
      // fetchOldTyreBrandNameItems();
      // fetchOldTyreCompanyItems();
      setRefreshing(false);
    }, 1000); // Simulated delay
  };
  const [oldregistration, setoldregistration] = useState(selectedItem.registrationOption)
  const [oldcustomername, setoldcustomername] = useState(selectedItem.customerName)
  const [oldmobilenumber, setoldmobilenumber] = useState(selectedItem.mobileNumber)
  const [oldaddress, setoldaddress] = useState(selectedItem.address)
  const [oldstatename, setoldstatename] = useState(selectedItem.state)
  const [oldstateid, setoldstateid] = useState(selectedItem.state_id)
  const [oldpincode, setoldpincode] = useState(selectedItem.pinCode)
  const [olddistrictid, setolddistrictid] = useState(selectedItem.districtid)
  const [olddistrictname, setolddistrictname] = useState(selectedItem.districtname)
  const [oldcityvillageid, setoldcityvillageid] = useState(selectedItem.cityvillageid)
  const [oldcityvillagename, setoldcityvillagename] = useState(selectedItem.cityvillagename)
  const [oldpincodeid, setoldpincodeid] = useState(selectedItem.pincodeid)
  const [oldregistrationnumber, setoldregistrationnumber] = useState(selectedItem.registrationNumber)
  const [oldregistrationDate, setoldregistrationDate] = useState(selectedItem.registrationDate)
  const [oldmake, setoldmake] = useState(selectedItem.make)
  const [oldmake_id, setoldmake_id] = useState(selectedItem.make_id)
  const [oldmodel, setoldmodel] = useState(selectedItem.model)
  const [oldbrand, setoldbrand] = useState(selectedItem.brand)
  const [oldbrandid, setoldbrandid] = useState(selectedItem.brandid)
  const [oldproductid, setoldproductid] = useState(selectedItem.productid)
  const [oldseries, setoldseries] = useState(selectedItem.series)
  const [oldproductName, setoldproductName] = useState(selectedItem.productName)
  const [oldtyreSize, setoldtyreSize] = useState(selectedItem.tyreSize)
  const [oldtyreQuantity, setoldtyreQuantity] = useState(selectedItem.tyreQuantity)
  const [oldtyre1SerialNumber2, setoldtyre1SerialNumber2] = useState(selectedItem.tyre1SerialNumber2)
  const [oldtyre1SerialNumber3, setoldtyre1SerialNumber3] = useState(selectedItem.tyre1SerialNumber3)
  const [oldtyre1Image, setoldtyre1Image] = useState(selectedItem.tyre1Image)
  const [oldtyre2SerialNumber2, setoldtyre2SerialNumber2] = useState(selectedItem.tyre2SerialNumber2)
  const [oldtyre2SerialNumber3, setoldtyre2SerialNumber3] = useState(selectedItem.tyre2SerialNumber3)
  const [oldtyre2Image, setoldtyre2Image] = useState(selectedItem.tyre2Image)
  const [oldinvoiceNumber, setoldinvoiceNumber] = useState(selectedItem.invoiceNumber)
  const [oldinvoiceImage, setoldinvoiceImage] = useState(selectedItem.invoiceImage)
  const [oldinvoiceDate, setoldinvoiceDate] = useState(selectedItem.invoiceDate)
  const [oldodoMeterReading, setoldodoMeterReading] = useState(selectedItem.odoMeterReading)
  const [oldodoMeterImage, setoldodoMeterImage] = useState(selectedItem.odoMeterImage)
  const [oldoldTyreCompany, setoldoldTyreCompany] = useState(selectedItem.oldTyreCompany)
  const [oldoldTyreBrand, setoldoldTyreBrand] = useState(selectedItem.oldTyreBrand)
  const [oldoldTyreSize, setoldoldTyreSize] = useState(selectedItem.oldTyreSize)
  const [oldtermsAccepted, setoldtermsAccepted] = useState(selectedItem.termsAccepted)
  // const [oldcreated_by, setoldcreated_by] = useState(selectedItem.created_by)
  const [oldveh_type_id, setoldveh_type_id] = useState(selectedItem.veh_type_id)
  const [oldveh_type_name, setoldveh_type_name] = useState(selectedItem.veh_type_name)
  const [oldvariantid, setoldvariantid] = useState(selectedItem.variantid)
  const [oldvariantname, setoldvariantname] = useState(selectedItem.variantname)
  const [oldnumberplateimage, setoldnumberplateimage] = useState(selectedItem.numberplateimage)
  useEffect(() => {
    // toggleCustomerDetails(
    console.log("selectedITem", selectedItem);
    // toggleOldTyreDetails()
    // toggleOptionalDetails()
    // toggleVehicleDetails()
    const formatDateForORM = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    getStateObjectByName(selectedItem.state)
    // Format fromDate and toDate as YYYY-MM-DD for ORM usage
    const registrationsate = formatDateForORM(new Date());
    setRegistrationDate(registrationsate)
    setoldregistrationDate(registrationsate)
    setupStateDatabase()

    fetchStateItems();

    setupPinCodeDatabase()
    fetchPinCodeItems();

    setupTractorMakeDatabase()
    setupVehicleVariantDatabase()
    // fetchTractorMakeItems();

    setupTractorModelDatabase()
    // fetchTractorModelItems();

    setupBrandNasadmeDatabase()
    fetchBrandNasadmeItems();

    setupProductNameDatabase()
    fetchProductNameItems();

    setupTyreSizeDatabase()
    fetchTyreSizeItems();

    setupOldTyreBrandNameDatabase()
    fetchOldTyreBrandNameItems();
    // // })
    // // .catch(error => {
    // //   console.error('Database initialization error:', error);
    // // })


    setupOldTyreCompanyDatabase()

    fetchOldTyreCompanyItems();
    setupVehicleTypeDatabase()

    fetchVehicleTypeItems();
    setupVehicleVariantDatabase()

    // fetchVehicleVariantItems()
    // })
    // .catch(error => {
    //   console.error('Database initialization error:', error);
    // })
    setStateObjectofkey(null)
    // console.log("pincodelist", pincodelist);

    const initializeDatabase = async () => {
      const database = await setupDatabase();
      setDb(database);
      fetchItems(database);
      // setVehicleDetails(prevDetails => ({
      //   ...prevDetails,
      //   tyre1Image: imageUri
      // }));
    };
    initializeDatabase();

  }, []);
  const [stateObjectofkey, setStateObjectofkey] = useState()
  const getStateObjectByName = async (stateName) => {
    const getstateItems = await getAllStateItems()
    const getstate = getstateItems.filter(state => state.statename === stateName)

    setStateObjectofkey(getstate[0].stateid)
    setoldstatename(getstate[0].statename)
    setoldstateid(getstate[0].stateid)
    console.log("getstate[0]", getstate[0]);

  }
  const [Stateitemdata, setStateitemdata] = useState([])
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
      setStateitemdata(formattedItems)
      setStateItems(formattedItems);

      // console.log("check state", stateItems)

    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [pincodelist, setPincodelist] = useState(null)

  const getPincode = async (pincodevalue) => {
    const getpincodeItems = await getAllPinCodeItems();
    const getpincode = getpincodeItems.filter(pincode => pincode.areapincode === pincodevalue)
    setPincodelist(getpincode[0])

    console.log("getpincode[0]", getpincode[0]);
    setoldpincode(getpincode[0].areapincode)
    setolddistrictid(getpincode[0].districtid)
    setolddistrictname(getpincode[0].districtname)
    setoldcityvillageid(getpincode[0].cityvillageid)
    setoldcityvillagename(getpincode[0].cityvillagename)
    setoldpincodeid(getpincode[0].pincodeid)
    // try {
    //   const itemsFromDb = await getAllPinCodeItems();
    //   const pincodeItems = itemsFromDb.map(item => pincodelist.push(item.areapincode));
    //   setPinCodeItems(pincodelist);

    // } catch (error) {
    //   console.error('Fetch error:', error);
    // }
  };
  const [pincodedata, setpincodedata] = useState([])
  const fetchPinCodeItems = async () => {
    try {
      const itemsFromDb = await getAllPinCodeItems();
      const pincodeItems = itemsFromDb.map(item => ({
        key: item.pincodeid,
        value: item.areapincode
      }));
      setpincodedata(pincodeItems)
      setPinCodeItems(pincodeItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  // const [isPopup, setIsPopup] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");
  // const filteredData = pincodeItems.filter((item) =>
  //   item.areapincode.includes(searchQuery)
  // );

  // const renderpincodeItem = ({ item }) => (
  //   <Pressable >
  //     <Text>{item.value}</Text>
  //   </Pressable>
  // );

  // const handleItemSelect = (item) => {onPress={() => handleItemSelect(item)}
  //   setSelectedItem(item); // Store selected item if needed
  //   setIsPopup(false); // Close the modal
  //   console.log(item); // Log the selected item
  // };
  const [getmakeid, setgetmakeid] = useState(null)
  const getmakeidlist = async (makeName) => {
    // const getstateItems = await getAllStateItems()
    const makeid = await getmakeids(makeName)
    setgetmakeid(makeid[0])
    console.log("makeasdasdasd", makeid[0]);
    setoldmake(makeid[0].MakeName)
    setoldmake_id(makeid[0].MakeID)
    setoldveh_type_id(makeid[0].Veh_Type_ID)
    // console.log(getstate[0].stateid);

  }
  const fetchTractorMakeItems = async () => {
    try {
      const TractorMake = await getAllTractorMakeItems();
      // console.log("TractorMake", TractorMake);

      setMakeItems(TractorMake)
      const makeItems = TractorMake.map(item => ({
        key: item.MakeID,
        value: item.MakeName
      }));
      setMakeNameItems(makeItems)
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const [getmodelid, setgetmodelid] = useState(null)
  const getmodelidlist = async (modelName) => {
    // const getstateItems = await getAllStateItems()
    const modelid = modelItems.filter(model => model.value === modelName)
    setgetmodelid(modelid[0].key)
    console.log(modelid[0].value);
    setoldmodel(modelid[0].value)
    // console.log(getstate[0].stateid);


  }


  // const fetchTractorModelItems = async () => {
  //   try {
  //     const itemsFromDb = await getAllTractorModelItems();
  //     const modelItems = itemsFromDb.map(item => ({
  //       key: item.id,
  //       value: item.modelName
  //     }));
  //     setModelItems(modelItems);
  //   } catch (error) {
  //     console.error('Fetch error:', error);
  //   }
  // };
  const getbrandlist = async (brand) => {
    // const getstateItems = await getAllStateItems()
    const makeid = await getbrandids(brand)
    console.log("makeasdasdasd", makeid[0]);
    // console.log(getstate[0].stateid);
    setoldbrand(makeid[0].brandname)
    setoldbrandid(makeid[0].brandid)
  }
  const [BrandNasadmeItemsdata, setBrandNasadmeItemsdata] = useState([])
  const fetchBrandNasadmeItems = async () => {
    try {
      const itemsFromDb = await getAllBrandNasadmeItems();
      const brandnameItems = itemsFromDb.map(item => ({
        key: item.brandid,
        value: item.brandname
      }));
      console.log("brandnameItems", brandnameItems[0].key);
      setBrandNasadmeItemsdata(brandnameItems)
      setBrandNameItems(brandnameItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const getProductNameById = async (value) => {
    const helper = productnameItems.filter(element => element.value === value)


    const helperarray = await getProductNameByProductId(helper[0].key)
    console.log('helperarray:', helperarray);
    setserialkey(helperarray[0].series)
    setProductName(helperarray[0])
    setoldproductName(helperarray[0].productName)
    setoldproductid(helperarray[0].productId)
    setoldseries(helperarray[0].series)
  }
  const [ProductNameItemsdata, setProductNameItemsdata] = useState([])
  const fetchProductNameItems = async () => {
    try {
      const itemsFromDb = await getAllProductNameItems();
      const productnameItems = itemsFromDb.map(item => ({
        key: item.id,
        value: item.productName
      }));
      setProductNameItemsdata(productnameItems)
      setProductNameItems(productnameItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const gettyresizes = async (tyresize) => {
    // const getstateItems = await getAllStateItems()
    const makeid = await gettyresize(tyresize)
    console.log("makeasdasdasd", makeid[0]);
    setoldtyreSize(makeid[0].sizeName)
  }
  const [TyreSizeItemsdata, setTyreSizeItemsdata] = useState([])
  const fetchTyreSizeItems = async () => {
    try {
      const itemsFromDb = await getAllTyreSizeItems();
      const tyresizeItems = itemsFromDb.map(item => ({
        key: item.id,
        value: item.sizeName
      }));
      console.log("tyresizeItems", tyresizeItems);
      setTyreSizeItemsdata(tyresizeItems)
      setTyreSizeItems(tyresizeItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [oldtyrebrandnameItemsdata, setoldtyrebrandnameItemsdata] = useState([])
  const fetchOldTyreBrandNameItems = async () => {
    try {
      const itemsFromDb = await getAllOldTyreBrandNameItems();
      const oldtyrebrandnameItems = itemsFromDb.map(item => ({
        key: item.id,
        value: item.brandpattern
      }));
      setoldtyrebrandnameItemsdata(oldtyrebrandnameItems)
      setoldoldTyreBrand(oldtyrebrandnameItems[0].value)
      setOldTyreBrandNameItems(oldtyrebrandnameItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const [oldtyrecompanynameItemsdata, setoldtyrecompanynameItemsdata] = useState([])
  const fetchOldTyreCompanyItems = async () => {
    try {
      const itemsFromDb = await getAllOldTyreCompanyItems();
      const oldtyrecompanyItems = itemsFromDb.map(item => ({
        key: item.id,
        value: item.tyre_company_name
      }));
      setoldtyrecompanynameItemsdata(oldtyrecompanyItems)
      setoldoldTyreCompany(oldtyrecompanyItems[0].value)
      setOldTyreCompanyItems(oldtyrecompanyItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const getvehtyprelist = async (vehtype) => {
    console.log("vehtype", vehtype);

    // const getstateItems = await getAllStateItems()
    const vehtypes = await getvehtype(vehtype)
    console.log("makeasdasdasd", vehtypes);
    setoldveh_type_name(vehtypes[0].Veh_Type_Name)
  }
  const [VehicleTypeItemsdata, setVehicleTypeItemsdata] = useState([])
  const fetchVehicleTypeItems = async () => {
    try {
      const itemsFromDb = await getAllVehicleTypeItems();
      const VehicleTypeItems = itemsFromDb.map(item => ({
        key: item.Veh_Type_ID,
        value: item.Veh_Type_Name
      }));
      setVehicleTypeItemsdata(VehicleTypeItems)
      setVehicleTypeItems(VehicleTypeItems);
      console.log("itemsFromDb", itemsFromDb);

    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  // const fetchVehicleVariantItems = async () => {
  //   try {
  //     const itemsFromDb = await getAllVehicleVariantItems();
  //     const VehicleVariantItems = itemsFromDb.map(item => ({
  //       key: item.variantid,
  //       value: item.variantname
  //     }));
  //     setVehicleVariantItems(VehicleVariantItems);
  //     // console.log("itemsFromDb", VehicleVariantItems);

  //   } catch (error) {
  //     console.error('Fetch error:', error);
  //   }
  // };
  const [items, setItems] = useState(null)
  const fetchItems = async (database: SQLiteDatabase) => {
    try {
      const item = await getAllItems(database);
      setItems(item);
      console.log(items)
    } catch (error) {
      console.error(error);
    }
  };
  //display the saved data (offline)
  // if you want to display the data then enable this code {in JSX you find the flatlist also }
  const renderItem = ({ item }: { item: Item }) => (

    <View>
      {/* <Text>id: {item.id}</Text>
      <Text>registrationOption: {item.registrationOption}</Text>
      <Text>customerName: {item.customerName}</Text>
      <Text>mobileNumber: {item.mobileNumber}</Text>
      <Text>address: {item.address}</Text>
      <Text>state: {item.state}</Text>
      <Text>pinCode: {item.pinCode}</Text>
      <Text>obileNumber: {item.mobileNumber}</Text>
      <Text>make: {item.make}</Text>
      <Text>model: {item.model}</Text>
      <Text>brand: {item.brand}</Text>
      <Text>productName: {item.productName}</Text>
      <Text>tyreSize: {item.tyreSize}</Text>
      <Text>stateid: {item.state_id}</Text>
      <Text>tyreQuantity: {item.tyreQuantity}</Text>
      <Text>tyre1SerialNumber: {item.tyre1SerialNumber1}</Text>
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
      <Text>oldTyreCompany: {item.OldTyreCompanyName}</Text> 
      <Text>oldTyreBrand: {item.OldTyreBrandName}</Text>
      <Text>oldTyreSize: {item.OldTyreSize}</Text>
      <Text>termsAccepted: {item.termsAccepted}</Text> 
      <Text>date: {item.registrationDate}</Text> */}
      {/* <Button
        title="Delete"
        onPress={async () => {
          if (!db) return;
          await deleteItem(db, item.id);
          fetchItems(db);
        }}
      /> */}
      {/* <Button
        title="update"
        onPress={async () => {
          if (!db) return;
          await updateItem(db, item.id);
          fetchItems(db);
        }}
      /> */}
    </View>
  );
  //Camera module to open the camera and pick the pitcures
  const [invoiceImageUri, setInvoiceImageUri] = useState(null);
  const [ODOMeterImageUri, setODOMeterImageUri] = useState(null);
  const [tyre1Image, setTyre1Image] = useState(null);
  const [tyre2Image, setTyre2Image] = useState(null);
  // const [tyre2Image, setTyre2Image] = useState(null);
  const [numberplate, setnumberplate] = useState(null);
  // const [tyre2Image, setTyre2Image] = useState(null);
  const numberplateimage = async () => {
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
          setoldnumberplateimage(response.assets[0].uri);
          // Assuming you want to set the image in tyre1Image or tyre2Image based on which is selected
          // if (vehicleDetails.tyreQuantity === 1) {
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
          setoldinvoiceImage(response.assets[0].uri);
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
          setoldodoMeterImage(response.assets[0].uri);
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
          setoldtyre1Image(response.assets[0].uri);
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
          setoldtyre2Image(response.assets[0].uri);
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
  const navigation = useNavigation();
  const handleSubmit = async () => {
    const nameRegex = /^[a-zA-Z '-]+$/; // Regex pattern: alphabets, hyphen, apostrophe, and space
    const contactRegex = /^[0-9+\-]+$/;
    try {
      if (!db) return;

      // setVehicleDetails(prevDetails => ({
      //   ...prevDetails,
      //   tyre1Image: imageUri
      // }));
      // console.log(registrationOption)


      // console.log(pincodelist.districtid, pincodelist.districtname, pincodelist.cityvillageid, pincodelist.cityvillagename, pincodelist.pincodeid)
      // setModalVisible(true)
      // console.log("vehicletyedata", stateidvalue.value);

      // console.log("data: ", stateObjectofkey, pincodelist.districtid, pincodelist.districtname, pincodelist.cityvillageid, stateidvalue, pincodelist.cityvillagename, pincodelist.pincodeid, getmakeid, productname.brandId, productname.productId, productname.series, vehicletyedata.key, vehicletyedata.value, stateidvalue.key, stateidvalue.value);
      // return
      // console.log("data updated", selectedItem.id, oldregistration, oldcustomername, oldmobilenumber, oldaddress, oldstatename, oldstateid, oldpincode, olddistrictid, olddistrictname, oldcityvillageid, oldcityvillagename, oldpincodeid, oldregistrationnumber, oldregistrationDate, oldmake, oldmake_id, oldmodel, oldbrand, oldbrandid, oldproductid, oldseries, oldproductName, oldtyreSize, oldtyreQuantity, oldtyre1SerialNumber2, oldtyre1SerialNumber3, oldtyre1Image, oldtyre2SerialNumber2, oldtyre2SerialNumber3, oldtyre2Image, oldinvoiceNumber, oldinvoiceImage, oldinvoiceDate, oldodoMeterReading, oldodoMeterImage, oldoldTyreCompany, oldoldTyreBrand, oldoldTyreSize, oldtermsAccepted, oldveh_type_id, oldveh_type_name, oldvariantid, oldvariantname);
      // return

      updateItem(db, selectedItem.id, oldregistration, oldcustomername, oldmobilenumber, oldaddress, oldstatename, oldstateid, oldpincode, olddistrictid, olddistrictname, oldcityvillageid, oldcityvillagename, oldpincodeid, oldregistrationnumber, oldregistrationDate, oldmake, oldmake_id, oldmodel, oldbrand, oldbrandid, oldproductid, oldseries, oldproductName, oldtyreSize, oldtyreQuantity, oldtyre1SerialNumber2, oldtyre1SerialNumber3, oldtyre1Image, oldtyre2SerialNumber2, oldtyre2SerialNumber3, oldtyre2Image, oldinvoiceNumber, oldinvoiceImage, oldinvoiceDate, oldodoMeterReading, oldodoMeterImage, oldoldTyreCompany, oldoldTyreBrand, oldoldTyreSize, oldtermsAccepted, oldveh_type_id, oldveh_type_name, oldvariantid, oldvariantname, oldnumberplateimage)
      Alert.alert("Success", "Registration updated successfully!", [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to another screen after pressing OK
            navigation.goBack();

            // console.log("done");

          },
        },
      ])

      // console.log("stateObjectofkey", stateObjectofkey, pincodelist.districtid, pincodelist.districtname, pincodelist.cityvillageid, pincodelist.cityvillagename, pincodelist.pincodeid, getmakeid, productname.brandId, productname.productId, productname.series, vehicletyedata.key, vehicletyedata.value, stateidvalue.key, stateidvalue.value);

      // const itemId = await insertItem(db, newItem, stateObjectofkey, pincodelist.districtid, pincodelist.districtname, pincodelist.cityvillageid, pincodelist.cityvillagename, pincodelist.pincodeid, getmakeid, productname.brandId, productname.productId, productname.series, vehicletyedata.key, vehicletyedata.value, stateidvalue.key, stateidvalue.value);
      // console.log("itemId", stateObjectofkey);



    } catch (error) {
      console.error(error);
    }
    // console.log(registrationDate)
  };
  const search = async () => {
    const payload = {
      WarrantyID: 'uiuyu',
      MobileNo: null,
      CustomerName: null,
      RegistrationNo: null,
      CreatedDate: 'khkhjh',
      CreatedBy: null,
      BrandName: null,
      ProductName: null,
      Size: null,
      wcUserName: null,
      DealerState: null,
      CustomerState: null
    };

    try {
      const response = await axios.post('https://warrantyuat.tyrechecks.com/api/Warranty/SearchWarranty', payload)
      console.log("response", response)
    } catch (error) {
      console.log(error)
    }

  }
  const [isPopup, setIsPopup] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [searchQuery, setSearchQuery] = useState();
  const filteredData = pincodedata.filter((item) => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toString()

      // Convert searchQuery to string
      let searchString = searchQuery

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  }
  );


  const renderItem1 = ({ item }) => (
    <Pressable onPress={() => {
      handleItemSelect(item); setSelectedId(item.key); console.log('idsadasdasdasda', item);
      getPincode(item.value)
      handleCustomerDetailsChange('pinCode', item.value)
    }}>
      <Text style={{ paddingTop: 5, paddingBottom: 5 }}>{item.value}</Text>
    </Pressable>
  );
  const [pincodevaluedata, setpincodevaluedata] = useState(null);
  const handleItemSelect = (item) => {
    // setSelectedItem(item); // Store selected item if needed
    setIsPopup(false); // Close the modal
    setpincodevaluedata(item.value)
    console.log("some data", item.value); // Log the selected item
  };





  const [isStatemodalPopup, setisStatemodalPopup] = useState(false);
  const [searchStateQuery, setsearchStateQuery] = useState('');

  const filteredStateData = Stateitemdata.filter((item) => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toString().toLowerCase()

      // Convert searchQuery to string
      let searchString = searchStateQuery.toString().toLowerCase()

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  }
  );
  const renderStateItem = ({ item }) => (
    <Pressable onPress={() => {
      handleStateItemSelect(item); console.log('idsadasdasdasda', item);
      handleCustomerDetailsChange('state', item.value);
      getStateObjectByName(item.value)
      // getPincode(item.value)
    }}>
      <Text style={{ paddingTop: 5, paddingBottom: 5 }}>{item.value}</Text>
    </Pressable>
  );
  const [Statedata, setStatedata] = useState(null);
  const handleStateItemSelect = (item) => {
    // setSelectedItem(item); // Store selected item if needed
    setisStatemodalPopup(false); // Close the modal
    setStatedata(item.value)
    console.log("some data", item.value); // Log the selected item
  };








  const [isVehicleTypemodalPopup, setisVehicleTypemodalPopup] = useState(false);
  const [selectedvehicletypeId, setSelectedvehicletypeId] = useState();

  const [searchVehicleTypeQuery, setsearchVehicleTypeQuery] = useState('');

  const filteredVehicleTypeData = VehicleTypeItemsdata.filter((item) => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toString().toLowerCase()

      // Convert searchQuery to string
      let searchString = searchVehicleTypeQuery.toString().toLowerCase()

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  }
  );
  const renderVehicleTypeItem = ({ item }) => (
    <Pressable onPress={() => {
      handleVehicleTypeItemSelect(item); setSelectedvehicletypeId(item.key); console.log('idsadasdasdasda', item.key);

      // getPincode(item.value)
    }}>
      <Text style={{ paddingTop: 5, paddingBottom: 5 }}>{item.value}</Text>
    </Pressable>
  );
  const [VehicleTypedata, setVehicleTypedata] = useState(null);
  const handleVehicleTypeItemSelect = (item) => {
    // setSelectedItem(item); // Store selected item if needed
    setisVehicleTypemodalPopup(false); // Close the modal
    setVehicleTypedata(item.value)
    getVehicleMakeByVehiceTypeID(item.value)
    console.log("some data", item.value); // Log the selected item
  };






  const [isVehicleMakemodalPopup, setisVehicleMakemodalPopup] = useState(false);
  const [searchVehicleMakeQuery, setsearchVehicleMakeQuery] = useState('');

  const filteredVehicleMakeData = isvehiclemakedataitem.filter((item) => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toString().toLowerCase()

      // Convert searchQuery to string
      let searchString = searchVehicleMakeQuery.toString().toLowerCase()

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  }
  );
  const renderVehicleMakeItem = ({ item }) => (
    <Pressable onPress={() => {
      handleVehicleMakeItemSelect(item); console.log('idsadasdasdasda', item);

      // getPincode(item.value)
    }}>
      <Text style={{ paddingTop: 5, paddingBottom: 5 }}>{item.value}</Text>
    </Pressable>
  );
  const [VehicleMakedata, setVehicleMakedata] = useState(null);
  const handleVehicleMakeItemSelect = (item) => {
    // setSelectedItem(item); // Store selected item if needed
    setisVehicleMakemodalPopup(false); // Close the modal
    setVehicleMakedata(item.value)
    handleVehicleDetailsChange('make', item.value)
    getVehicleVariantById(item.value)
    getmakeidlist(item.value)
    console.log("some data", item.value); // Log the selected item
  };






  const [isVehicleVariantmodalPopup, setisVehicleVariantmodalPopup] = useState(false);
  const [searchVehicleVariantQuery, setsearchVehicleVariantQuery] = useState('');

  const filteredVehicleVariantData = isVehicleVariantdataitem.filter((item) => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toString().toLowerCase()

      // Convert searchQuery to string
      let searchString = searchVehicleVariantQuery.toString().toLowerCase()

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  }
  );
  const renderVehicleVariantItem = ({ item }) => (
    <Pressable onPress={() => {
      handleVehicleVariantItemSelect(item); console.log('idsadasdasdasda', item);

      // getPincode(item.value)
    }}>
      <Text style={{ paddingTop: 5, paddingBottom: 5 }}>{item.value}</Text>
    </Pressable>
  );
  const [VehicleVariantdata, setVehicleVariantdata] = useState(null);
  const handleVehicleVariantItemSelect = (item) => {
    // setSelectedItem(item); // Store selected item if needed
    setisVehicleVariantmodalPopup(false); // Close the modal
    setVehicleVariantdata(item.value)
    storeVehicleVariant(item.value)
    console.log("some data", item.value); // Log the selected item
  };







  const [isVehicleModelmodalPopup, setisVehicleModelmodalPopup] = useState(false);
  const [searchVehicleModelQuery, setsearchVehicleModelQuery] = useState('');

  const filteredVehicleModelData = isvehiclemodeldataitem.filter((item) => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toString().toLowerCase()

      // Convert searchQuery to string
      let searchString = searchVehicleModelQuery.toString().toLowerCase()

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  }
  );
  const renderVehicleModelItem = ({ item }) => (
    <Pressable onPress={() => {
      handleVehicleModelItemSelect(item); console.log('idsadasdasdasda', item);

      // getPincode(item.value)
    }}>
      <Text style={{ paddingTop: 5, paddingBottom: 5 }}>{item.value}</Text>
    </Pressable>
  );
  const [VehicleModeldata, setVehicleModeldata] = useState(null);
  const handleVehicleModelItemSelect = (item) => {
    // setSelectedItem(item); // Store selected item if needed
    setisVehicleModelmodalPopup(false); // Close the modal
    setVehicleModeldata(item.value)
    handleVehicleDetailsChange('model', item.value)
    getmodelidlist(item.value)
    console.log("some data", item.value); // Log the selected item
  };








  const [isTyreBrandmodalPopup, setisTyreBrandmodalPopup] = useState(false);
  const [searchTyreBrandQuery, setsearchTyreBrandQuery] = useState('');

  const filteredTyreBrandData = BrandNasadmeItemsdata.filter((item) => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toString().toLowerCase()

      // Convert searchQuery to string
      let searchString = searchTyreBrandQuery.toString().toLowerCase()

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  }
  );
  const renderTyreBrandItem = ({ item }) => (
    <Pressable onPress={() => {
      handleTyreBrandItemSelect(item); console.log('idsadasdasdasda', item);
      handleVehicleDetailsChange('brand', item.value);
      getbrandlist(item.value)
      // getPincode(item.value)
    }}>
      <Text style={{ paddingTop: 5, paddingBottom: 5 }}>{item.value}</Text>
    </Pressable>
  );
  const [TyreBranddata, setTyreBranddata] = useState(null);
  const handleTyreBrandItemSelect = (item) => {
    // setSelectedItem(item); // Store selected item if needed
    setisTyreBrandmodalPopup(false); // Close the modal
    setTyreBranddata(item.value)
    console.log("some data", item.value); // Log the selected item
  };







  const [isProductNamemodalPopup, setisProductNamemodalPopup] = useState(false);
  const [searchProductNameQuery, setsearchProductNameQuery] = useState('');

  const filteredProductNameData = ProductNameItemsdata.filter((item) => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toLowerCase()

      // Convert searchQuery to string
      let searchString = searchProductNameQuery.toLowerCase()

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  }
  );
  const renderProductNameItem = ({ item }) => (
    <Pressable onPress={() => {
      handleProductNameItemSelect(item); console.log('idsadasdasdasda', item);
      handleVehicleDetailsChange('productName', item.value);
      getProductNameById(item.value)
      // getPincode(item.value)
    }}>
      <Text style={{ paddingTop: 5, paddingBottom: 5 }}>{item.value}</Text>
    </Pressable>
  );
  const [ProductNamedata, setProductNamedata] = useState(null);
  const handleProductNameItemSelect = (item) => {
    // setSelectedItem(item); // Store selected item if needed
    setisProductNamemodalPopup(false); // Close the modal
    setProductNamedata(item.value)
    console.log("some data", item.value); // Log the selected item
  };








  const [isTyreSizemodalPopup, setisTyreSizemodalPopup] = useState(false);
  const [searchTyreSizeQuery, setsearchTyreSizeQuery] = useState('');

  const filteredTyreSizeData = TyreSizeItemsdata.filter((item) => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toLowerCase()

      // Convert searchQuery to string
      let searchString = searchTyreSizeQuery.toLowerCase()

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  }
  );
  const renderTyreSizeItem = ({ item }) => (
    <Pressable onPress={() => {
      handleTyreSizeItemSelect(item); console.log('idsadasdasdasda', item);
      handleVehicleDetailsChange('tyreSize', item.value)
      // getPincode(item.value)
    }}>
      <Text style={{ paddingTop: 5, paddingBottom: 5 }}>{item.value}</Text>
    </Pressable>
  );
  const [TyreSizedata, setTyreSizedata] = useState(null);
  const handleTyreSizeItemSelect = (item) => {
    // setSelectedItem(item); // Store selected item if needed
    setisTyreSizemodalPopup(false); // Close the modal
    setTyreSizedata(item.value)
    console.log("some data", item.value); // Log the selected item
  };










  const [isoldTyreCompanymodalPopup, setisoldTyreCompanymodalPopup] = useState(false);
  const [searcholdTyreCompanyQuery, setsearcholdTyreCompanyQuery] = useState('');

  const filteredoldTyreCompanyData = oldtyrecompanynameItemsdata.filter((item) => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toLowerCase()

      // Convert searchQuery to string
      let searchString = searcholdTyreCompanyQuery.toLowerCase()

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  }
  );
  const renderoldTyreCompanyItem = ({ item }) => (
    <Pressable onPress={() => {
      handleoldTyreCompanyItemSelect(item); console.log('idsadasdasdasda', item);
      handleOldTyreDetailsChange('oldTyreCompany', item.value)
      // getPincode(item.value)
    }}>
      <Text style={{ paddingTop: 5, paddingBottom: 5 }}>{item.value}</Text>
    </Pressable>
  );
  const [oldTyreCompanydata, setoldTyreCompanydata] = useState(null);
  const handleoldTyreCompanyItemSelect = (item) => {
    // setSelectedItem(item); // Store selected item if needed
    setisoldTyreCompanymodalPopup(false); // Close the modal
    setoldTyreCompanydata(item.value)
    console.log("some data", item.value); // Log the selected item
  };







  const [isoldTyreBrandmodalPopup, setisoldTyreBrandmodalPopup] = useState(false);
  const [searcholdTyreBrandQuery, setsearcholdTyreBrandQuery] = useState('');

  const filteredoldTyreBrandData = oldtyrebrandnameItemsdata.filter((item) => {
    if (item.value !== undefined && item.value !== null) {
      // Convert item.value to string before checking inclusion
      let itemString = item.value.toLowerCase()

      // Convert searchQuery to string
      let searchString = searcholdTyreBrandQuery.toLowerCase()

      // Check if itemString includes searchString
      return itemString.includes(searchString);
    }
  }
  );
  const renderoldTyreBrandItem = ({ item }) => (
    <Pressable onPress={() => {
      handleoldTyreBrandItemSelect(item); console.log('idsadasdasdasda', item);
      handleOldTyreDetailsChange('oldTyreBrand', item.value)
      // getPincode(item.value)
    }}>
      <Text style={{ paddingTop: 5, paddingBottom: 5 }}>{item.value}</Text>
    </Pressable>
  );
  const [oldTyreBranddata, setoldTyreBranddata] = useState(null);
  const handleoldTyreBrandItemSelect = (item) => {
    // setSelectedItem(item); // Store selected item if needed
    setisoldTyreBrandmodalPopup(false); // Close the modal
    setoldTyreBranddata(item.value)
    console.log("some data", item.value); // Log the selected item
  };
  return (
    <ScrollView contentContainerStyle={styles.container}
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16} // Adjust scroll event throttle as needed
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
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
          value={oldregistration}>
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
                inputMode='text'
                style={styles.input}
                placeholder="Vehicle registration number"
                placeholderTextColor={placeholderTextColor}
                onChangeText={setoldregistrationnumber
                }
                value={oldregistrationnumber}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.search_button}
            onPress={search}>
            <Text style={styles.buttonText}>Search </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.search_button}
            onPress={() => handleCameraOpen('tyre1Image')}>
            {/* <Text style={styles.buttonText}>Photo </Text>
            <Icon name="camera" size={15} color={'white'} />
          </TouchableOpacity> */}
          {oldnumberplateimage && (
            <Image
              source={{
                uri:
                  oldnumberplateimage + '?' + new Date().getTime(),
              }}
              width={320}
              height={300}
            />
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={numberplateimage}>
            <Icon
              style={{ marginLeft: 10, marginTop: 2 }}
              name="camera"
              size={20}
              color={'white'}
            />
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
                  onChangeText={setoldcustomername}
                  value={oldcustomername}
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
                  onChangeText={setoldmobilenumber

                  }
                  value={oldmobilenumber}
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
                  placeholder='Address'
                  placeholderTextColor={placeholderTextColor}
                  onChangeText={setoldaddress
                  }
                  value={oldaddress}
                />
              </View>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isStatemodalPopup}
              onRequestClose={() => {
                setisStatemodalPopup(false);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', color: 'black' }}>State</Text>
                    <Pressable style={{ marginBottom: 10, width: '100%' }}
                      onPress={() => setisStatemodalPopup(false)} // Close modal directly
                    >
                      <Text style={{ textAlign: 'right' }}>Close</Text>
                    </Pressable>
                  </View>
                  <TextInput
                    keyboardType='number-pad'
                    maxLength={6}
                    style={{ borderWidth: 1, borderRadius: 5, width: '100%', padding: 10 }}
                    placeholder="Search..."
                    onChangeText={(text) => setsearchStateQuery(text)}
                    value={searchStateQuery}
                  />{
                    searchStateQuery === undefined ?
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={Stateitemdata}
                        renderItem={renderStateItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedId}
                      /> :
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={filteredStateData}
                        renderItem={renderStateItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedId}
                      />
                  }
                </View>
              </View>
            </Modal>
            <View style={styles.outer_view}>
              <View style={styles.label_view}>
                <Text style={styles.label_View_text_style}>
                  State
                  <Text style={{ color: 'red' }}>*</Text>
                </Text>
              </View>
              <View style={styles.text_view}>
                <View style={styles.input}>
                  {/* <SelectList
                    dropdownStyles={styles.dropdownshow}
                    maxHeight={200}
                    data={stateItems}
                    value={oldstatename}
                    placeholder={`${selectedItem.state}`}
                    boxStyles={{ borderWidth: 0, padding: 0 }}
                    arrowicon={
                      <Icon name="chevron-down" size={12} color={'black'} />
                    }
                    setSelected={(value) => {
                      handleCustomerDetailsChange('state', value)
                      getStateObjectByName(value)


                    }
                    }
                    save="value"
                  /> */}
                  {
                    Statedata === null ?
                      <Pressable
                        style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {

                          setisStatemodalPopup(true)
                        }}>
                        <Text>{selectedItem.state}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>

                      </Pressable> :
                      <Pressable style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {

                        setisStatemodalPopup(true)
                      }}>

                        <Text>{Statedata}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>
                      </Pressable>
                  }
                </View>
              </View>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isPopup}
              onRequestClose={() => {
                setIsPopup(false);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', color: 'black' }}>PinCode</Text>
                    <Pressable style={{ marginBottom: 10, width: '100%' }}
                      onPress={() => setIsPopup(false)} // Close modal directly
                    >
                      <Text style={{ textAlign: 'right' }}>Close</Text>
                    </Pressable>
                  </View>
                  <TextInput
                    keyboardType='number-pad'
                    maxLength={6}
                    style={{ borderWidth: 1, borderRadius: 5, width: '100%', padding: 10 }}
                    placeholder="Search..."
                    onChangeText={(text) => setSearchQuery(text)}
                    value={searchQuery}
                  />{
                    searchQuery === undefined ?
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={pincodeItems}
                        renderItem={renderItem1}
                        keyExtractor={(item) => item.value}
                        extraData={selectedId}
                      /> :
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={filteredData}
                        renderItem={renderItem1}
                        keyExtractor={(item) => item.value}
                        extraData={selectedId}
                      />
                  }




                </View>
              </View>
            </Modal>

            <View style={styles.outer_view}>
              <View style={styles.label_view}>
                <Text style={styles.label_View_text_style}>
                  Pin Code
                  <Text style={{ color: 'red' }}>*</Text>
                </Text>
              </View>
              <View style={styles.text_view}>
                <View style={styles.input}>

                  {
                    pincodevaluedata === null ?
                      <Pressable
                        style={{ padding: 15, }} onPress={() => {

                          setIsPopup(true)
                        }}>
                        <Text>{selectedItem.pinCode}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>
                      </Pressable> :
                      <Pressable style={{ padding: 15, }} onPress={() => {
                        setIsPopup(true)
                      }}>
                        <Text>{pincodevaluedata}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>
                      </Pressable>
                  }


                  {/* <TextInput
                    editable={true}
                    placeholder="--Pincode--"
                    // value={searchQuery}
                    onPressIn={() => {
                      handleCustomerDetailsChange('pinCode', searchQuery)
                      getPincode(searchQuery)
                      setIsPopup(true)
                    }}
                    value={pincodevaluedata}
                  /> */}
                  {/* <Pressable onPress={() => {
                      handleCustomerDetailsChange('pinCode', searchQuery)
                      getPincode(searchQuery)
                      setIsPopup(true)
                    }

                    } /> */}

                </View>
              </View>
            </View>
            {/* <View style={styles.outer_view}>
              <View style={styles.label_view}>
                <Text style={styles.label_View_text_style}>
                  Pin Code
                  <Text style={{ color: 'red' }}>*</Text>
                </Text>
              </View>
              <View style={styles.text_view}>
                <View style={styles.input}>


                  {/* <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isPopup}
                    onRequestClose={() => {
                      Alert.alert("Modal has been closed.");
                      setIsPopup(false);
                    }}
                  >
                    <View >
                      <View>
                        <TextInput
                          placeholder="Search..."
                          onChangeText={(text) => setSearchQuery(text)}
                          value={searchQuery}
                        />
                        <FlatList
                          data={filteredData}
                          renderItem={renderpincodeItem}
                          keyExtractor={(item) => item.id}
                        />
                        <Pressable
                          onPress={() => setIsPopup(false)} // Close modal directly
                        >
                          <Text style={styles.textStyle}>Hide Modal</Text>
                        </Pressable>
                      </View>
                    </View>
                  </Modal>
                  <TextInput
                    style={styles.input}
                    placeholder="--Pincode--"
                    maxLength={10}
                    placeholderTextColor={placeholderTextColor}
                    readOnly={true}
                    onPressIn={setIsPopup(true)}

                    value={customerDetails.pinCode} />
                  <SelectList
                    dropdownStyles={styles.dropdownshow}
                    maxHeight={200}
                    data={pincodeItems}
                    value={oldpincode}
                    setSelected={value => {
                      setoldpincode
                      getPincode(value)
                    }
                    }
                    placeholder='PinCode'
                    boxStyles={{ borderWidth: 0, padding: 0 }}
                    arrowicon={
                      <Icon name="chevron-down" size={12} color={'black'} />
                    }
                    save="value"
                  />
                </View>
              </View>
            </View> */}
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
            <Modal
              animationType="slide"
              transparent={true}
              visible={isVehicleTypemodalPopup}
              onRequestClose={() => {
                setisVehicleTypemodalPopup(false);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', color: 'black' }}>Vehicle Type</Text>
                    <Pressable style={{ marginBottom: 10, width: '100%' }}
                      onPress={() => setisVehicleTypemodalPopup(false)} // Close modal directly
                    >
                      <Text style={{ textAlign: 'right' }}>Close</Text>
                    </Pressable>
                  </View>
                  <TextInput
                    keyboardType='number-pad'
                    maxLength={6}
                    style={{ borderWidth: 1, borderRadius: 5, width: '100%', padding: 10 }}
                    placeholder="Search..."
                    onChangeText={(text) => setsearchVehicleTypeQuery(text)}
                    value={searchVehicleTypeQuery}
                  />{
                    searchVehicleTypeQuery === undefined ?
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={VehicleTypeItemsdata}
                        renderItem={renderVehicleTypeItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedvehicletypeId}
                      /> :
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={filteredVehicleTypeData}
                        renderItem={renderVehicleTypeItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedvehicletypeId}
                      />
                  }
                </View>
              </View>
            </Modal>
            <View style={styles.outer_view}>
              <View style={styles.label_view}>
                <Text style={styles.label_View_text_style}>
                  Vehicle Type
                  <Text style={{ color: 'red' }}>*</Text>
                </Text>
              </View>
              <View style={styles.text_view}>
                <View style={styles.input}>
                  {
                    VehicleTypedata === null ?
                      <Pressable
                        style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {

                          setisVehicleTypemodalPopup(true)
                        }}>
                        <Text>{selectedItem.veh_type_name}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>

                      </Pressable> :
                      <Pressable style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {

                        setisVehicleTypemodalPopup(true)
                      }}>

                        <Text>{VehicleTypedata}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>
                      </Pressable>
                  }
                  {/* <SelectList
                    dropdownStyles={styles.dropdownshow}
                    maxHeight={200}
                    data={vehicleTypeItems}
                    setSelected={value => {
                      handleVehicleDetailsChange('make', value)
                      getVehicleMakeByVehiceTypeID(value)
                      getvehtyprelist(value)
                    }



                    }
                    value={oldveh_type_name}
                    placeholder={`${selectedItem.veh_type_name}`}
                    boxStyles={{ borderWidth: 0, padding: 0 }}
                    arrowicon={
                      <Icon name="chevron-down" size={12} color={'black'} />
                    }
                    save="value"
                  /> */}
                </View>
              </View>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isVehicleMakemodalPopup}
              onRequestClose={() => {
                setisVehicleMakemodalPopup(false);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', color: 'black' }}>Vehicle Make</Text>
                    <Pressable style={{ marginBottom: 10, width: '100%' }}
                      onPress={() => setisVehicleMakemodalPopup(false)} // Close modal directly
                    >
                      <Text style={{ textAlign: 'right' }}>Close</Text>
                    </Pressable>
                  </View>
                  <TextInput
                    maxLength={6}
                    style={{ borderWidth: 1, borderRadius: 5, width: '100%', padding: 10 }}
                    placeholder="Search..."
                    onChangeText={(text) => setsearchVehicleMakeQuery(text)}
                    value={searchVehicleMakeQuery}
                  />{
                    searchVehicleMakeQuery ?
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={isvehiclemakedataitem}
                        renderItem={renderVehicleMakeItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedvehicletypeId}
                      /> :
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={filteredVehicleMakeData}
                        renderItem={renderVehicleMakeItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedvehicletypeId}
                      />
                  }
                </View>
              </View>
            </Modal>
            {ismakeshow ? (<View style={styles.outer_view}>
              <View style={styles.label_view}>
                <Text style={styles.label_View_text_style}>
                  Vehicle Make
                  <Text style={{ color: 'red' }}>*</Text>
                </Text>
              </View>
              <View style={styles.text_view}>
                <View style={styles.input}>
                  {
                    VehicleMakedata === null ?
                      <Pressable
                        style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {

                          setisVehicleMakemodalPopup(true)
                        }}>
                        <Text>{selectedItem.make}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>

                      </Pressable> :
                      <Pressable style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {

                        setisVehicleMakemodalPopup(true)
                      }}>

                        <Text>{VehicleMakedata}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>
                      </Pressable>
                  }
                  {/* <SelectList
                    dropdownStyles={styles.dropdownshow}
                    maxHeight={200}
                    data={makeINamestems}
                    setSelected={value => {
                      handleVehicleDetailsChange('make', value)
                      getVehicleVariantById(value)
                      getmakeidlist(value)
                    }

                    }
                    value={oldmake}
                    placeholder={`${selectedItem.make}`}
                    boxStyles={{ borderWidth: 0, padding: 0 }}
                    arrowicon={
                      <Icon name="chevron-down" size={12} color={'black'} />
                    }
                    save="value"
                  /> */}
                </View>
              </View>
            </View>) : <></>}
            <Modal
              animationType="slide"
              transparent={true}
              visible={isVehicleVariantmodalPopup}
              onRequestClose={() => {
                setisVehicleVariantmodalPopup(false);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', color: 'black' }}>Vehicle Variant</Text>
                    <Pressable style={{ marginBottom: 10, width: '100%' }}
                      onPress={() => setisVehicleVariantmodalPopup(false)} // Close modal directly
                    >
                      <Text style={{ textAlign: 'right' }}>Close</Text>
                    </Pressable>
                  </View>
                  <TextInput
                    maxLength={6}
                    style={{ borderWidth: 1, borderRadius: 5, width: '100%', padding: 10 }}
                    placeholder="Search..."
                    onChangeText={(text) => setsearchVehicleVariantQuery(text)}
                    value={searchVehicleVariantQuery}
                  />{
                    searchVehicleVariantQuery ?
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={isVehicleVariantdataitem}
                        renderItem={renderVehicleVariantItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedvehicletypeId}
                      /> :
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={filteredVehicleVariantData}
                        renderItem={renderVehicleVariantItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedvehicletypeId}
                      />
                  }
                </View>
              </View>
            </Modal>
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
                      {
                        VehicleVariantdata === null ?
                          <Pressable
                            style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {

                              setisVehicleVariantmodalPopup(true)
                            }}>
                            <Text>{selectedItem.variantname}</Text>
                            <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                              <Icon name="chevron-down" size={12} color={'gray'} />
                            </View>

                          </Pressable> :
                          <Pressable style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {

                            setisVehicleVariantmodalPopup(true)
                          }}>

                            <Text>{VehicleVariantdata}</Text>
                            <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                              <Icon name="chevron-down" size={12} color={'gray'} />
                            </View>
                          </Pressable>
                      }
                      {/* <SelectList
                    dropdownStyles={styles.dropdownshow}
                    maxHeight={200}
                    data={vehicleVariantItems}
                    setSelected={value => {
                      storeVehicleVariant(value)

                    }
                    }
                    value={oldvariantname}
                    placeholder={`${selectedItem.variantname}`}
                    boxStyles={{ borderWidth: 0, padding: 0 }}
                    arrowicon={
                      <Icon name="chevron-down" size={12} color={'black'} />
                    }
                    save="value"
                  /> */}
                    </View>
                  </View>
                </View> : <></>}
            <Modal
              animationType="slide"
              transparent={true}
              visible={isVehicleModelmodalPopup}
              onRequestClose={() => {
                setisVehicleModelmodalPopup(false);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', color: 'black' }}>Vehicle Model</Text>
                    <Pressable style={{ marginBottom: 10, width: '100%' }}
                      onPress={() => setisVehicleModelmodalPopup(false)} // Close modal directly
                    >
                      <Text style={{ textAlign: 'right' }}>Close</Text>
                    </Pressable>
                  </View>
                  <TextInput
                    maxLength={6}
                    style={{ borderWidth: 1, borderRadius: 5, width: '100%', padding: 10 }}
                    placeholder="Search..."
                    onChangeText={(text) => setsearchVehicleModelQuery(text)}
                    value={searchVehicleModelQuery}
                  />{
                    searchVehicleModelQuery ?
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={isvehiclemodeldataitem}
                        renderItem={renderVehicleModelItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedvehicletypeId}
                      /> :
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={filteredVehicleModelData}
                        renderItem={renderVehicleModelItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedvehicletypeId}
                      />
                  }
                </View>
              </View>
            </Modal>
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
                      {
                        VehicleModeldata === null ?
                          <Pressable
                            style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {

                              setisVehicleModelmodalPopup(true)
                            }}>
                            <Text>{selectedItem.model}</Text>
                            <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                              <Icon name="chevron-down" size={12} color={'gray'} />
                            </View>

                          </Pressable> :
                          <Pressable style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {

                            setisVehicleModelmodalPopup(true)
                          }}>

                            <Text>{VehicleModeldata}</Text>
                            <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                              <Icon name="chevron-down" size={12} color={'gray'} />
                            </View>
                          </Pressable>
                      }
                      {/* <SelectList
                    dropdownStyles={styles.dropdownshow}
                    maxHeight={200}
                    data={modelItems}
                    setSelected={value => {
                      handleVehicleDetailsChange('model', value)
                      getmodelidlist(value)
                    }


                    }
                    value={oldmodel}
                    placeholder={`${selectedItem.model}`}
                    boxStyles={{ borderWidth: 0, padding: 0 }}
                    arrowicon={
                      <Icon name="chevron-down" size={12} color={'black'} />
                    }
                    save="value"
                  /> */}
                    </View>
                  </View>
                </View> : <></>}
            <Modal
              animationType="slide"
              transparent={true}
              visible={isTyreBrandmodalPopup}
              onRequestClose={() => {
                setisTyreBrandmodalPopup(false);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', color: 'black' }}>Tyre Brand</Text>
                    <Pressable style={{ marginBottom: 10, width: '70%' }}
                      onPress={() => setisTyreBrandmodalPopup(false)} // Close modal directly
                    >

                      <Text style={{ textAlign: 'right' }}>Close</Text>
                    </Pressable>
                  </View>
                  <TextInput
                    style={{ borderWidth: 1, borderRadius: 5, width: '100%', padding: 10 }}
                    placeholder="Search..."
                    onChangeText={(text) => setsearchTyreBrandQuery(text)}
                    value={searchTyreBrandQuery}
                  />{
                    searchTyreBrandQuery === undefined ?
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={BrandNasadmeItemsdata}
                        renderItem={renderTyreBrandItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedId}
                      /> :
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={filteredTyreBrandData}
                        renderItem={renderTyreBrandItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedId}
                      />
                  }
                </View>
              </View>
            </Modal>
            <View style={styles.outer_view}>
              <View style={styles.label_view}>
                <Text style={styles.label_View_text_style}>
                  Tyre Brand
                  <Text style={{ color: 'red' }}>*</Text>
                </Text>
              </View>
              <View style={styles.text_view}>
                <View style={styles.input}>
                  {
                    TyreBranddata === null ?
                      <Pressable
                        style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {

                          setisTyreBrandmodalPopup(true)
                        }}>
                        <Text>{selectedItem.brand}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>

                      </Pressable> :
                      <Pressable style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {
                        setisTyreBrandmodalPopup(true)
                      }}>

                        <Text>{TyreBranddata}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>
                      </Pressable>
                  }
                  {/* <SelectList
                    dropdownStyles={styles.dropdownshow}
                    maxHeight={200}
                    data={brandnameItems}
                    setSelected={value => {
                      handleVehicleDetailsChange('brand', value)
                      getbrandlist(value)

                    }

                    }
                    value={oldbrand}
                    placeholder={`${selectedItem.brand}`}
                    boxStyles={{ borderWidth: 0, padding: 0 }}
                    arrowicon={
                      <Icon name="chevron-down" size={12} color={'black'} />
                    }
                    save="value"
                  /> */}
                </View>
              </View>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isProductNamemodalPopup}
              onRequestClose={() => {
                setisProductNamemodalPopup(false);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', color: 'black' }}>Product Name</Text>
                    <Pressable style={{ marginBottom: 10, width: '64%' }}
                      onPress={() => setisProductNamemodalPopup(false)} // Close modal directly
                    >

                      <Text style={{ textAlign: 'right' }}>Close</Text>
                    </Pressable>
                  </View>
                  <TextInput
                    style={{ borderWidth: 1, borderRadius: 5, width: '100%', padding: 10 }}
                    placeholder="Search..."
                    onChangeText={(text) => setsearchProductNameQuery(text)}
                    value={searchProductNameQuery}
                  />{
                    searchProductNameQuery === undefined ?
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={ProductNameItemsdata}
                        renderItem={renderProductNameItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedId}
                      /> :
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={filteredProductNameData}
                        renderItem={renderProductNameItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedId}
                      />
                  }
                </View>
              </View>
            </Modal>
            <View style={styles.outer_view}>
              <View style={styles.label_view}>
                <Text style={styles.label_View_text_style}>
                  Product Name
                  <Text style={{ color: 'red' }}>*</Text>
                </Text>
              </View>
              <View style={styles.text_view}>
                <View style={styles.input}>
                  {
                    ProductNamedata === null ?
                      <Pressable
                        style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {

                          setisProductNamemodalPopup(true)
                        }}>
                        <Text>{selectedItem.productName}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>

                      </Pressable> :
                      <Pressable style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {

                        setisProductNamemodalPopup(true)
                      }}>

                        <Text>{ProductNamedata}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>
                      </Pressable>
                  }
                  {/* <SelectList
                    dropdownStyles={styles.dropdownshow}
                    maxHeight={200}
                    value={oldproductName}
                    data={productnameItems}
                    setSelected={value => {
                      handleVehicleDetailsChange('productName', value)
                      getProductNameById(value)
                    }

                    }
                    placeholder={`${selectedItem.productName}`}
                    boxStyles={{ borderWidth: 0, padding: 0 }}
                    arrowicon={
                      <Icon name="chevron-down" size={12} color={'black'} />
                    }
                    save="value"
                  /> */}
                </View>
              </View>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isTyreSizemodalPopup}
              onRequestClose={() => {
                setisTyreSizemodalPopup(false);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', color: 'black' }}>Tyre Size</Text>
                    <Pressable style={{ marginBottom: 10, width: '77%' }}
                      onPress={() => setisTyreSizemodalPopup(false)} // Close modal directly
                    >

                      <Text style={{ textAlign: 'right' }}>Close</Text>
                    </Pressable>
                  </View>
                  <TextInput
                    style={{ borderWidth: 1, borderRadius: 5, width: '100%', padding: 10 }}
                    placeholder="Search..."
                    onChangeText={(text) => setsearchTyreSizeQuery(text)}
                    value={searchTyreSizeQuery}
                  />{
                    searchTyreSizeQuery === undefined ?
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={TyreSizeItemsdata}
                        renderItem={renderTyreSizeItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedId}
                      /> :
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={filteredTyreSizeData}
                        renderItem={renderTyreSizeItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedId}
                      />
                  }
                </View>
              </View>
            </Modal>
            <View style={styles.outer_view}>
              <View style={styles.label_view}>
                <Text style={styles.label_View_text_style}>
                  Tyre Size
                  <Text style={{ color: 'red' }}>*</Text>
                </Text>
              </View>
              <View style={styles.text_view}>
                <View style={styles.input}>
                  {
                    TyreSizedata === null ?
                      <Pressable
                        style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {

                          setisTyreSizemodalPopup(true)
                        }}>
                        <Text>{selectedItem.tyreSize}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>

                      </Pressable> :
                      <Pressable style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {
                        setisTyreSizemodalPopup(true)
                      }}>

                        <Text>{TyreSizedata}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>
                      </Pressable>
                  }
                  {/* <SelectList
                    dropdownStyles={styles.dropdownshow}
                    maxHeight={200}
                    data={tyresizeItems}
                    value={oldtyreSize}
                    setSelected={value => {
                      handleVehicleDetailsChange('tyreSize', value)
                      gettyresizes(value)
                    }
                    }
                    placeholder={`${selectedItem.tyreSize}`}
                    boxStyles={{ borderWidth: 0, padding: 0 }}
                    arrowicon={
                      <Icon name="chevron-down" size={12} color={'black'} />
                    }
                    save="value"
                  /> */}
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
                    value={oldtyreQuantity}
                    setSelected={value => {
                      handleVehicleDetailsChange('tyreQuantity', value)
                      setoldtyreQuantity(value)
                    }
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
                    readOnly={true}
                    style={styles.Serial_number_input_small}
                    maxLength={1}
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={value => {
                      handleVehicleDetailsChange('tyre1SerialNumber1', value)
                      setoldseries
                    }
                    }
                    value={oldseries}
                  />
                  <TextInput
                    style={styles.Serial_number_input}
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={value => {
                      handleVehicleDetailsChange('tyre1SerialNumber2', value)
                      setoldtyre1SerialNumber2
                    }
                    }
                    value={vehicleDetails.tyre1SerialNumber2}
                  />
                  <TextInput
                    style={styles.Serial_number_input}
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={value => {
                      handleVehicleDetailsChange('tyre1SerialNumber3', value)
                      setoldtyre1SerialNumber3
                    }
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
                    style={{ marginLeft: 10, marginTop: 2 }}
                    name="camera"
                    size={20}
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
                    readOnly={true}
                    style={styles.Serial_number_input_small}
                    maxLength={1}
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={value => {
                      handleVehicleDetailsChange('tyre1SerialNumber1', value)
                      setoldseries
                    }
                    }
                    value={oldseries}
                  />
                  <TextInput
                    style={styles.Serial_number_input}
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={value => {
                      handleVehicleDetailsChange('tyre1SerialNumber2', value)
                      setoldtyre1SerialNumber2
                    }
                    }
                    value={vehicleDetails.tyre1SerialNumber2}
                  />
                  <TextInput
                    style={styles.Serial_number_input}
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={value => {
                      handleVehicleDetailsChange('tyre1SerialNumber3', value)
                      setoldtyre1SerialNumber3
                    }
                    }
                    value={vehicleDetails.tyre1SerialNumber3}
                  />
                </View>
                {/* {tyre2Image && <Image source={{ uri: tyre2Image }} width={320} height={300} />} */}
                {vehicleDetails.oldtyre1Image && (
                  <Image
                    source={{
                      uri:
                        vehicleDetails.oldtyre1Image + '?' + new Date().getTime(),
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
                    readOnly={true}
                    style={styles.Serial_number_input_small}
                    maxLength={1}
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={value => {
                      handleVehicleDetailsChange('tyre2SerialNumber1', value)
                      setoldseries
                    }
                    }
                    value={oldseries}
                  />
                  <TextInput
                    style={styles.Serial_number_input}
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={value => {
                      handleVehicleDetailsChange('tyre2SerialNumber2', value)
                      setoldtyre2SerialNumber2
                    }
                    }
                    value={vehicleDetails.tyre2SerialNumber2}
                  />
                  <TextInput
                    style={styles.Serial_number_input}
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={value => {
                      handleVehicleDetailsChange('tyre2SerialNumber3', value)
                      setoldtyre2SerialNumber3
                    }
                    }
                    value={vehicleDetails.tyre2SerialNumber3}
                  />
                </View>
                {vehicleDetails.oldtyre2Image && (
                  <Image
                    source={{
                      uri:
                        vehicleDetails.oldtyre2Image + '?' + new Date().getTime(),
                    }}
                    width={320}
                    height={300}
                  // style={{ width: 100, height: 100 }}
                  />
                )}
                <TouchableOpacity
                  style={styles.button}
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
                  placeholder='Invoice No'
                  placeholderTextColor={placeholderTextColor}
                  onChangeText={value => {
                    handleOptionalDetailsChange('invoiceNumber', value)
                    setoldinvoiceNumber
                  }
                  }
                  value={oldinvoiceNumber}
                />
              </View>
            </View>
            {optionalDetails.oldinvoiceImage && (
              <Image
                source={{
                  uri:
                    optionalDetails.oldinvoiceImage + '?' + new Date().getTime(),
                }}
                width={320}
                height={300}
              // style={{ width: 100, height: 100 }}
              />
            )}
            {/* {invoiceImageUri && <Image source={{ uri: invoiceImageUri }} width={320} height={300} />} */}
            <TouchableOpacity style={styles.button} onPress={invoicePickCamera}>
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
                {/* <TextInput
                  style={styles.input}
                  placeholder="Invoice Date"
                  placeholderTextColor={placeholderTextColor}
                  onChangeText={value =>
                    handleOptionalDetailsChange('invoiceDate', value)
                  }
                  value={optionalDetails.invoiceDate}
                /> */}
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
              </View>
            </View>
            {/* <TouchableOpacity
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
        /> */}

            <View style={styles.outer_view}>
              <View style={styles.label_view}>
                <Text style={styles.label_View_text_style}>Invoice ODO Meter</Text>
              </View>
              <View style={styles.text_view}>
                <TextInput
                  style={styles.input}
                  placeholder={`${selectedItem.odoMeterReading}`}
                  placeholderTextColor={placeholderTextColor}
                  onChangeText={value => {
                    handleOptionalDetailsChange('odoMeterReading', value)
                    setoldodoMeterReading
                  }
                  }
                  value={oldodoMeterReading}
                />
              </View>
            </View>

            {/* {ODOMeterImageUri && <Image source={{ uri: ODOMeterImageUri }} width={320} height={300} />} */}
            {optionalDetails.oldodoMeterImage && (
              <Image
                source={{
                  uri:
                    optionalDetails.oldodoMeterImage + '?' + new Date().getTime(),
                }}
                width={320}
                height={300}
              // style={{ width: 100, height: 100 }}
              />
            )}
            <TouchableOpacity
              style={styles.button}
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
            <Modal
              animationType="slide"
              transparent={true}
              visible={isoldTyreCompanymodalPopup}
              onRequestClose={() => {
                setisoldTyreCompanymodalPopup(false);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', color: 'black' }}>Old Tyre Company</Text>
                    <Pressable style={{ marginBottom: 10, width: '50%' }}
                      onPress={() => setisoldTyreCompanymodalPopup(false)} // Close modal directly
                    >

                      <Text style={{ textAlign: 'right' }}>Close</Text>
                    </Pressable>
                  </View>
                  <TextInput
                    style={{ borderWidth: 1, borderRadius: 5, width: '100%', padding: 10 }}
                    placeholder="Search..."
                    onChangeText={(text) => setsearcholdTyreCompanyQuery(text)}
                    value={searcholdTyreCompanyQuery}
                  />{
                    searcholdTyreCompanyQuery === undefined ?
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={oldtyrecompanynameItemsdata}
                        renderItem={renderoldTyreCompanyItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedId}
                      /> :
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={filteredoldTyreCompanyData}
                        renderItem={renderoldTyreCompanyItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedId}
                      />
                  }
                </View>
              </View>
            </Modal>
            <View style={styles.outer_view}>
              <View style={styles.label_view}>
                <Text style={styles.label_View_text_style}>
                  Old Tyre Company
                </Text>
              </View>
              <View style={styles.text_view}>
                <View style={styles.input}>
                  {
                    oldTyreCompanydata === null ?
                      <Pressable
                        style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {

                          setisoldTyreCompanymodalPopup(true)
                        }}>
                        <Text>{selectedItem.oldTyreCompany}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>

                      </Pressable> :
                      <Pressable style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {

                        setisoldTyreCompanymodalPopup(true)
                      }}>

                        <Text>{oldTyreCompanydata}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>
                      </Pressable>
                  }
                  {/* <SelectList
                    dropdownStyles={styles.dropdownshow}
                    maxHeight={200}
                    data={oldtyrecompanyItems}
                    setSelected={value =>
                      handleOldTyreDetailsChange('oldTyreCompany', value)
                    }
                    placeholder={`${selectedItem.oldTyreCompany}`}
                    boxStyles={{ borderWidth: 0, padding: 0 }}
                    arrowicon={
                      <Icon name="chevron-down" size={12} color={'black'} />
                    }
                    save="value"
                  /> */}
                </View>
              </View>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isoldTyreBrandmodalPopup}
              onRequestClose={() => {
                setisoldTyreBrandmodalPopup(false);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', color: 'black' }}>Old Tyre Brand Name</Text>
                    <Pressable style={{ marginBottom: 10, width: '60%' }}
                      onPress={() => setisoldTyreBrandmodalPopup(false)} // Close modal directly
                    >
                      <Text style={{ textAlign: 'right' }}>Close</Text>
                    </Pressable>
                  </View>
                  <TextInput
                    style={{ borderWidth: 1, borderRadius: 5, width: '100%', padding: 10 }}
                    placeholder="Search..."
                    onChangeText={(text) => setsearcholdTyreBrandQuery(text)}
                    value={searcholdTyreBrandQuery}
                  />{
                    searcholdTyreBrandQuery === undefined ?
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={oldtyrebrandnameItemsdata}
                        renderItem={renderoldTyreBrandItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedId}
                      /> :
                      <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        data={filteredoldTyreBrandData}
                        renderItem={renderoldTyreBrandItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedId}
                      />
                  }
                </View>
              </View>
            </Modal>
            <View style={styles.outer_view}>
              <View style={styles.label_view}>
                <Text style={styles.label_View_text_style}>
                  Old Tyre Brand Name
                </Text>
              </View>
              <View style={styles.text_view}>
                <View style={styles.input}>
                  {
                    oldTyreBranddata === null ?
                      <Pressable
                        style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {

                          setisoldTyreBrandmodalPopup(true)
                        }}>
                        <Text>{selectedItem.oldTyreBrand}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>

                      </Pressable> :
                      <Pressable style={{ padding: 15, flex: 1, flexDirection: 'row' }} onPress={() => {
                        setisoldTyreBrandmodalPopup(true)
                      }}>

                        <Text>{oldTyreBranddata}</Text>
                        <View style={{ position: 'absolute', right: '10%', top: '100%' }} >
                          <Icon name="chevron-down" size={12} color={'gray'} />
                        </View>
                      </Pressable>
                  }
                  {/* <SelectList
                    dropdownStyles={styles.dropdownshow}
                    maxHeight={200}
                    data={oldtyrebrandnameItems}
                    setSelected={value =>
                      handleOldTyreDetailsChange('oldTyreBrand', value)
                    }
                    placeholder={`${selectedItem.oldTyreBrand}`}
                    boxStyles={{ borderWidth: 0, padding: 0 }}
                    arrowicon={
                      <Icon name="chevron-down" size={12} color={'black'} />
                    }
                    save="value"
                  /> */}
                </View>
              </View>
            </View>

            <View style={styles.outer_view}>
              <View style={styles.label_view}>
                <Text style={styles.label_View_text_style}>Old Tyre Size</Text>
              </View>
              <View style={styles.text_view}>
                <View style={styles.input}>
                  <TextInput
                    placeholder={`${selectedItem.oldTyreSize}`}
                    placeholder="Old Tyre Size"
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={value => {
                      handleOldTyreDetailsChange('oldTyreSize', value)
                      setoldoldTyreSize(value)
                    }
                    }
                    value={oldoldTyreSize}
                  />
                  {/* <SelectList
                    dropdownStyles={styles.dropdownshow}
                    maxHeight={200}
                    data={OldTyreSizedata}
                    value={oldoldTyreSize}
                    setSelected={value => {
                      handleOldTyreDetailsChange('oldTyreSize', value)
                      setoldoldTyreSize(value)
                    }
                    }
                    placeholder={`${selectedItem.oldTyreSize}`}
                    boxStyles={{ borderWidth: 0, padding: 0 }}
                    arrowicon={
                      <Icon name="chevron-down" size={12} color={'black'} />
                    }
                    save="value"
                  /> */}
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
          onValueChange={value => { setTermsAccepted(value); setoldtermsAccepted(value) }}
          value={oldtermsAccepted}>
          <RadioButton.Item
            label="I accept the terms and conditions"
            value=''
            color={RadioButtonColor}
            style={styles.radioButton}
            labelStyle={styles.radioLabel}
          />
        </RadioButton.Group>
      </View>

      {/* Submit Button */}
      <View style={{ flexDirection: 'row', marginRight: 3 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{
          backgroundColor: '#e11e30',
          padding: 10,
          marginVertical: 10,
          marginLeft: 4,
          borderRadius: 5,
          width: '50%',
        }} >
          <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          backgroundColor: '#e11e30',
          padding: 10,
          marginVertical: 10,
          marginLeft: 4,
          borderRadius: 5,
          width: '50%',
        }} onPress={handleSubmit}>
          <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>
            Update
          </Text>
        </TouchableOpacity>
        {/* <Button title="Save (As a Draft)" onPress={handleSubmit} color="#e11e30" /> 
<Button title="Submit (Online Portal)" onPress={handleSubmit} color="#e11e30" /> */}

      </View>

      {/* <FlatList

      <View style={{flex:0.5, flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>
        <TouchableOpacity style={styles.submit_button}>
          <Text style={styles.buttonText}>Save</Text>
          <Text style={styles.buttonText}>( As a Draft )</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submit_button}>
          <Text style={styles.buttonText}>Submit</Text>
          <Text style={styles.buttonText}>( Online Portal )</Text>
        </TouchableOpacity>
        {/* <Button title="Save as Draft" onPress={handleSubmit} color="#e11e30"/>
        <Button title="Submit" onPress={handleSubmit} color="#e11e30" /></View> */}

      {/* <View>
     <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id? ?? ''}
        
      /> */}
    </ScrollView >
  );
};

export default UpdateWarrantyRegistration;
