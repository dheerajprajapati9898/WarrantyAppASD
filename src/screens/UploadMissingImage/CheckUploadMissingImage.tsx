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
    Alert, RefreshControl, Modal, ActivityIndicator, Pressable,
    Platform
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import DatePicker from 'react-native-date-picker';
import { RadioButton, List } from 'react-native-paper';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SelectList } from 'react-native-dropdown-select-list';
import { setupDatabase } from '../../db/Registration/database';
import RNFetchBlob from 'rn-fetch-blob';
import {
    Item,
    insertItem,
    getAllItems,
    updateItem,
    deleteItem,
} from '../../db/Registration/sqliteOperations';
import { useRoute } from "@react-navigation/native"
import { launchCamera } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { setupStateDatabase, getAllStateItems } from './../../db/Registration/StateDb';
import { setupPinCodeDatabase, getAllPinCodeItems } from './../../db/Registration/PinCodeDb';
import {
    setupTractorMakeDatabase,
    getAllTractorMakeItems, getVehicleByVehTypeid
} from './../../db/Registration/TractorMakeDb';
import { setupTractorModelDatabase, getAllTractorModelItems, insertTractorModelItems, getVehicleModelByVehTypeid } from './../../db/Registration/TractorModelDb';
import { setupBrandNasadmeDatabase, getAllBrandNasadmeItems, insertBrandNasadmeItems, getbrandids } from './../../db/Registration/BrandName';
import { setupProductNameDatabase, getAllProductNameItems, insertProductNameItems, getProductNameByProductId } from './../../db/Registration/ProductNameDb';
import { setupTyreSizeDatabase, getAllTyreSizeItems, insertTyreSizeItems } from './../../db/Registration/TyreSizeDb';
import { setupOldTyreBrandNameDatabase, getAllOldTyreBrandNameItems, insertOldTyreBrandNameItems } from './../../db/Registration/OldTyreBrandName';
import { setupOldTyreCompanyDatabase, getAllOldTyreCompanyItems, insertOldTyreCompanyItems } from './../../db/Registration/OldTyreCompany';
import { setupVehicleVariantDatabase, getAllVehicleVariantItems, insertVehicleVariantItems, clearVehicleVariantTable, getVariantByMakeID } from './../../db/Registration/VehicleVariant'
import axios from 'axios';
import { getAllVehicleTypeItems, setupVehicleTypeDatabase } from '../../db/Registration/VehicleTypeDb';
import { useNavigation } from '@react-navigation/native';
import { getAllLoginItems } from '../../db/Login/Login';
import { AESExtensions } from '../AESExtensions';
import RemoteUrls from '../apiUrl';
const UpdateMissingImage = () => {
    const route = useRoute();
    const { mobileNumber, missing_image } = route.params;
    const RadioButtonColor: string = '#e11e30';
    const placeholderTextColor: string = '#666';
    const iconColor = '#000';
    const [fromDate, setFromDate] = useState(new Date());
    const [openFromDate, setOpenFromDate] = useState(false);
    const [openToDate, setOpenToDate] = useState(false);
    const handleFromDateConfirm = (selectedDate) => {
        setOpenFromDate(false); // Close From Date picker
        setFromDate(selectedDate); // Update From Date state
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
        // if (registrationOption === null) {
        //     Alert.alert("Validation Error", "Selection is required!")
        //     return
        // }
        setShowCustomerDetails(prev => !prev);

    };

    const toggleVehicleDetails = () => {
        // if (registrationOption === null) {
        //     Alert.alert("Validation Error", "Selection is required!")
        //     return
        // }
        setShowVehicleDetails(prev => !prev);
    };

    const toggleOptionalDetails = () => {
        // if (registrationOption === null) {
        //     Alert.alert("Validation Error", "Selection is required!")
        //     return
        // }
        setShowOptionlDetails(prev => !prev);
    };

    const toggleOldTyreDetails = () => {
        // if (registrationOption === null) {
        //     Alert.alert("Validation Error", "Selection is required!")
        //     return
        // }
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


        let helpermodelarray = await getVehicleModelByVehTypeid(helper[0].key)
        const modeldataItems = helpermodelarray.map(item => ({
            key: item.makeName,
            value: item.modelName
        }));
        setModelItems(modeldataItems)
        // setismakeshow(true)
        // setismodelshow(true)
    }
    const getVehicleVariantById = async (value) => {
        const helper = makeINamestems.filter(element => element.value === value)
        const helperarray = await getVariantByMakeID(helper[0].key)
        const variantdataItems = helperarray.map(item => ({
            key: item.variantid,
            value: item.variantname
        }));
        setVehicleVariantItems(variantdataItems)
        // setisvehiclevariantshow(true)
    }
    const storeVehicleVariant = async (value) => {
        const helper = vehicleVariantItems.filter(element => element.value === value)
        console.log("helper1", helper);

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
    const [stateItems, setStateItems] = useState()
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
    const [isloading, setisloading] = useState(false)
    const [missingimage, setmissingimage] = useState([])
    const [singlemissingimage, setsinglemissingimage] = useState()
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
        // setisloading(true);
        try {
            setisloading(true)
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
            console.log("Asdasdasd", plaintextoflogindata.MissingPhoto);
            // console.log("fdgerdrgerg");
            plaintextoflogindata.forEach(element => {
                if (element.MissingPhoto === missing_image) {
                    // console.log("yes", element);
                    setsinglemissingimage(element)
                }
            });

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
        } finally {
            setisloading(false);
        }
    };
    // if (isloading) {
    //     <View>
    //         <ActivityIndicator color={'black'} />
    //     </View>
    //     return
    // }
    useEffect(() => {
        fetchingTheMissigImage()
        // console.log("customerDetails.state", missingimage);

        // setShowCustomerDetails(false)
        // setShowOldTyreDetails(false)
        // setShowOptionlDetails(false)
        // setShowVehicleDetails(false)
        // toggleCustomerDetails(
        // vehicleDetails.tyreQuantity = "2"
        // setstyrequantitySelectedy(vehicleDetails.tyreQuantity)
        // toggleOldTyreDetails()
        // toggleOptionalDetails()
        // toggleVehicleDetails()
        const formatDateForORM = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        // Format fromDate and toDate as YYYY-MM-DD for ORM usage
        const registrationsate = formatDateForORM(new Date());
        setRegistrationDate(registrationsate)
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
        // console.log(getstate[0].stateid);

    }
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
    const [ispincodeloading, setispincodeloading] = useState(false)
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
        const makeid = makeItems.filter(make => make.value === makeName)
        setgetmakeid(makeid[0].key)
        console.log("makeasdasdasd", makeid[0].key);

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
        console.log(modelid[0].key);

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
    const fetchBrandNasadmeItems = async () => {
        try {
            const itemsFromDb = await getAllBrandNasadmeItems();
            const brandnameItems = itemsFromDb.map(item => ({
                key: item.id,
                value: item.brandname
            }));
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
        console.log('helperarrayasdasdasd:', helper);

        setProductName(helperarray[0].productName)
    }
    const fetchProductNameItems = async () => {
        try {
            const itemsFromDb = await getAllProductNameItems();
            const productnameItems = itemsFromDb.map(item => ({
                key: item.id,
                value: item.productName
            }));
            setProductNameItems(productnameItems);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };
    const [brandidget, setbrandidget] = useState()
    const getbrandlist = async (brand) => {
        // const getstateItems = await getAllStateItems()
        const makeid = await getbrandids(brand)
        console.log("makeasdasdasd", makeid[0]);
        // console.log(getstate[0].stateid);
        setbrandidget(makeid[0].brandid)
    }

    const fetchTyreSizeItems = async () => {
        try {
            const itemsFromDb = await getAllTyreSizeItems();
            const tyresizeItems = itemsFromDb.map(item => ({
                key: item.id,
                value: item.sizeName
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
                key: item.id,
                value: item.brandpattern
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
                key: item.id,
                value: item.tyre_company_name
            }));
            setOldTyreCompanyItems(oldtyrecompanyItems);
        } catch (error) {
            console.error('Fetch error:', error);
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
            <Text>id: {item.id}</Text>
            <Text>registrationOption: {item.registrationOption}</Text>
            {/* <Text>customerName: {item.CustomerName}</Text>
      <Text>mobileNumber: {item.MobileNo}</Text> */}
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
            {/* <Text>tyre1SerialNumber: {item.tyre1SerialNumber1}</Text>
      <Text>tyre1SerialNumber: {item.tyre1SerialNumber2}</Text>
      <Text>tyre1SerialNumber: {item.tyre1SerialNumber3}</Text> */}
            <Text>tyre1Image: {item.tyre1Image}</Text>
            {/* <Text>tyre2SerialNumber: {item.tyre2SerialNumber1}</Text>
      <Text>tyre2SerialNumber: {item.tyre2SerialNumber2}</Text>
      <Text>tyre2SerialNumber: {item.tyre2SerialNumber3}</Text> */}
            <Text>tyre2Image: {item.tyre2Image}</Text>
            {/* <Text>invoiceNumber: {item.InvoiceNumber}</Text> */}
            <Text>invoiceImage: {item.invoiceImage}</Text>
            {/* <Text>invoiceDate: {item.InvoiceDate}</Text> */}
            <Text>odoMeterReading: {item.odoMeterReading}</Text>
            <Text>odoMeterImage: {item.odoMeterImage}</Text>
            {/* <Text>oldTyreCompany: {item.OldTyreCompanyName}</Text> */}
            {/* <Text>oldTyreBrand: {item.OldTyreBrandName}</Text> */}
            {/* <Text>oldTyreSize: {item.OldTyreSize}</Text> */}
            <Text>termsAccepted: {item.termsAccepted}</Text>
            <Text>date: {item.registrationDate}</Text>
            <Button
                title="Delete"
                onPress={async () => {
                    if (!db) return;
                    await deleteItem(db, item.id);
                    fetchItems(db);
                }}
            />
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


                // setnumberplate(response)
                if (response.assets && response.assets.length > 0) {
                    console.log('Image URI:', response.assets[0].uri);
                    setnumberplate(response.assets[0].uri);
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
    const navigation = useNavigation();

    const handleSubmit = async () => {
        const nameRegex = /^[a-zA-Z '-]+$/; // Regex pattern: alphabets, hyphen, apostrophe, and space
        const contactRegex = /^[0-9+\-]+$/; // Regex pattern: digits, plus sign, and hyphen
        // if (registrationOption === null) {
        //   Alert.alert("Error", "Selection is required!")
        //   return
        // }
        // if (customerDetails.customerName === '') {
        //   Alert.alert("Error", "Customer Name is required!")
        //   return
        // }
        // if (customerDetails.mobileNumber === '') {
        //   Alert.alert("Error", "Mobile Number is required!")
        //   return
        // }
        // if (customerDetails.address === '') {
        //   Alert.alert("Error", "Address is required!")
        //   return
        // }
        // if (customerDetails.state === '') {
        //   Alert.alert("Error", "State is required!")
        //   return
        // }
        // if (customerDetails.pinCode === '') {
        //   Alert.alert("Error", "Pin Code is required!")
        //   return
        // }
        // if (vehicletyedata.value === '') {
        //   Alert.alert("Error", "Vehicle Type is required!")
        //   return
        // }
        // if (vehicleDetails.make === '') {
        //   Alert.alert("Error", "Vehicle Make is required!")
        //   return
        // }
        // if (stateidvalue.value === '') {
        //   Alert.alert("Error", "Vehicle Variant is required!")
        //   return
        // }
        // if (vehicleDetails.model === '') {
        //   Alert.alert("Error", "Vehicle Model is required!")
        //   return
        // }

        // if (vehicleDetails.tyreSize === '') {
        //   Alert.alert("Error", "Tyre Size is required!")
        //   return
        // }
        // if (vehicleDetails.brand === '') {
        //   Alert.alert("Error", "Tyre Brand is required!")
        //   return
        // }
        // if (vehicleDetails.productName === '') {
        //   Alert.alert("Error", "Product Name is required!")
        //   return
        // }
        // if (vehicleDetails.tyreQuantity === '') {
        //   Alert.alert("Error", "Number of Tyres is required!")
        //   return
        // }
        // if (vehicleDetails.tyre1SerialNumber2 === '') {
        //   Alert.alert("Error", "Number of Tyres details is required!")
        //   return
        // }
        // if (vehicleDetails.tyre1SerialNumber3 === '') {
        //   Alert.alert("Error", "Number of Tyres details is required!")
        //   return
        // }
        // if (vehicleDetails.tyre1Image === '') {
        //   Alert.alert("Error", "Tyre 1 photo is required!")
        //   return
        // }
        // // if (vehicleDetails.tyre2Image === '') {
        // //   Alert.alert("Error", "Tyre 2 photo is required!")
        // //   return
        // // }
        // if (!nameRegex.test(customerDetails.customerName)) {
        //   Alert.alert('Validation Error', 'Name can only contain letters, spaces, hyphens, and apostrophes');
        //   return;
        // } if (!contactRegex.test(customerDetails.mobileNumber)) {
        //   Alert.alert('Validation Error', 'Contact number can only contain digits, plus sign (+), and hyphens (-)');
        //   return;
        // }
        // if (termsAccepted === false) {
        //   Alert.alert("Error", "Terms & Condition is required!")
        //   return
        // }
        try {
            if (!db) return;

            // setVehicleDetails(prevDetails => ({
            //   ...prevDetails,
            //   tyre1Image: imageUri
            // }));
            // console.log(registrationOption)

            const newItem = {
                registrationOption,
                isChecked,
                registrationDate,
                ...customerDetails,
                ...vehicleDetails,
                ...optionalDetails,
                ...oldTyreDetails,
                termsAccepted,

            };
            // console.log(pincodelist.districtid, pincodelist.districtname, pincodelist.cityvillageid, pincodelist.cityvillagename, pincodelist.pincodeid)
            // setModalVisible(true)
            // console.log("vehicletyedata", stateidvalue.value);

            // console.log("data: ", stateObjectofkey, pincodelist.districtid, pincodelist.districtname, pincodelist.cityvillageid, stateidvalue, pincodelist.cityvillagename, pincodelist.pincodeid, getmakeid, productname.brandId, productname.productId, productname.series, vehicletyedata.key, vehicletyedata.value, stateidvalue.key, stateidvalue.value);
            // return
            const itemId = await insertItem(db, newItem, stateObjectofkey, pincodelist.districtid, pincodelist.districtname, pincodelist.cityvillageid, pincodelist.cityvillagename, pincodelist.pincodeid, getmakeid, brandidget, productname.productId, productname.series, vehicletyedata.key, vehicletyedata.value, stateidvalue.key, stateidvalue.value, numberplate);
            // console.log("itemId", stateObjectofkey);


            // Clear form fields

            setRegistrationOption(null)
            setIsChecked(false)
            setRegistrationDate(null)
            handleCustomerDetailsChange('state', ' ')
            setpincodevaluedata(null)
            setCustomerDetails({
                customerName: '',
                mobileNumber: '',
                address: '',
                state: '',
                pinCode: '',
            });
            setVehicleDetails({
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
            setOptionalDetails({
                invoiceNumber: '',
                invoiceImage: null,
                invoiceDate: '',
                odoMeterReading: '',
                odoMeterImage: null,
            });
            setOldTyreDetails({
                oldTyreCompany: '',
                oldTyreBrand: '',
                oldTyreSize: '',
            });
            setCapturedImages({});
            setTermsAccepted(false);
            // setStateItems('')
            // console.log('Inserted item with ID:', itemId);
            console.log(invoicePickCamera);
            // setModalVisible(!modalVisible)
            Alert.alert('Success', 'Data saved!'
                , {
                    text: 'OK',
                    onPress: () => {
                        // Navigate to another screen after pressing OK
                        navigation.navigate('HomeDrawer')
                    },
                },
            )
        } catch (error) {
            console.error(error);
        }
        // console.log(registrationDate)
    };
    const handleMissingimnageupload = async () => {
        // const [invoiceImageUri, setInvoiceImageUri] = useState(null);
        // const [ODOMeterImageUri, setODOMeterImageUri] = useState(null);
        // const [tyre1Image, setTyre1Image] = useState(null);
        // const [tyre2Image, setTyre2Image] = useState(null);
        // const [numberplate, setnumberplate] = useState(null);
        if (missing_image === 'InvoiceNumber') {
            // if (numberplate === null) {
            //     Alert.alert("error", "RegistrationNo image can not be black.")
            //     return
            // }
            // else {
            const timestamp = Date.now(); // Get current timestamp (milliseconds since Unix epoch)
            const generatedId = `uploadedimageby_${singlemissingimage.MobileNo}_${timestamp}`; // Create a temporary ID using timestamp
            // setTempId(generatedId);
            const userData = await getAllLoginItems();

            // Append the file to FormData
            const formData = new FormData();
            // formData.append('file', invoiceImageUri);

            // Add other fields to FormData
            const requestData = {
                WarrantyId: "",
                TempId: "",
                PhotoName: "",
                categoryId: "",
                PhotoURL: "",
                latitude: "",
                Longitude: "",
                PhotoCaptureLocation: "",
                InspectionBySystem: "",
            };
            formData.append("file", {
                uri: invoiceImageUri,
                type: "image/jpeg",
                name: invoiceImageUri.split("/").pop(),
            });
            formData.append("RequestId", "");
            formData.append("IsEncrypt", "");
            formData.append("RequestData", JSON.stringify(requestData));
            formData.append("SessionExpiryTime", "");
            formData.append("UserId", "");

            // Create requestData object

            const urlEncodedObject = Object.keys(requestData)
                .map(key => encodeURIComponent(key) + ':' + encodeURIComponent(requestData[key]))
                .join(',');

            // Append the URL-encoded string to FormData
            // formData.append('user', urlEncodedObject);
            // Stringify the requestData object and append it to FormData
            // formData.append('RequestData', "{" + urlEncodedObject + "}")

            formData.append("RequestData", JSON.stringify(requestData));
            console.log("formData", formData);

            // Payload is not needed as formData contains all required data
            try {

                const response = await axios.post(RemoteUrls.postUploadUrl, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Access-Control-Allow-Origin": "*",
                        Accept: "application/json",
                        "Cache-Control": "no-cache",

                    },

                })
                // const response = await fetch(RemoteUrls.postUploadUrl, {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'multipart/form-data',
                //     },
                //     body: formData,
                // });

                // if (!response.ok) {
                //     throw new Error(`HTTP error! Status: ${response.status}`);
                // }

                // const data = await response.json();
                console.log("Upload image response", response);
            } catch (error) {
                console.error("Upload image error", error.stack);
            }


            // }
        }
    }
    const [warrantyPostObject, setWarrantyPostObject] = useState([]);
    const handleLoop = async () => {
        console.log("check", items);

        items.forEach((item, index) => {
            if (item.isChecked === true) {
                const foundItem = warrantyPostObject.filter(warrantyitem => warrantyitem.id === item.id);

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
        const payload = {
            "requestId": "string",
            "isEncrypt": "string",
            "requestData": JSON.stringify({ "Registration_No": foundItem.registrationNumber, "CustomerName": foundItem.customerName, "MobileNo": foundItem.mobileNumber, "EmailId": loginItems.EmailId, "Remark": null, "Company": "YOKOHAMA", "IsDeclaretion": foundItem.termsAccepted, "Agency_Id": loginItems.AgencyId, "InvoiceNo": foundItem.invoiceNumber, "InvoiceDate": foundItem.invoiceDate, "InvoiceAmount": "1000", "User_Device_Formation": deviceName, "CreatedFor": "self", "MappingCodeCode": null, "Address": foundItem.address, "State_Id": foundItem.state_id, "State_Name": foundItem.state, "District_id": foundItem.districtid, "District_Name": foundItem.districtname, "City_Id": foundItem.cityvillageid, "City_Name": foundItem.cityvillagename, "PinCode_Id": foundItem.pincodeid, "PinCode_Name": foundItem.cityvillagename, "ODOMeter": foundItem.odoMeterReading, "Type_of_Machine_Id": foundItem.veh_type_id, "Type_of_Machine_Name": foundItem.veh_type_name, "Make_Id": foundItem.make_id, "Make_Name": foundItem.make, "Model_Id": null, "Model_Name": foundItem.model, "Variant_Id": foundItem.variantid, "Variant_Name": foundItem.variantname, "RegistrationDate": foundItem.registrationDate, "ManufacturerDate": null, "BrandName": foundItem.brand, "ProductName": foundItem.productName, "Serial_1": foundItem.series + foundItem.tyre1SerialNumber2 + foundItem.tyre1SerialNumber3, "Serial_2": foundItem.series + foundItem.tyre2SerialNumber2 + foundItem.tyre2SerialNumber3, "Serial_3": null, "Serial_4": null, "Serial_Number": null, "Createdby": loginItems.Name, "Photo_Temp_Id": null, "TyreSize": foundItem.tyreSize, "NoOfTyres": foundItem.tyreQuantity, "OldTyre_CompanyName": foundItem.oldTyreCompany, "OldTyre_BrandName": foundItem.oldTyreBrand, "OldTyre_Size": foundItem.oldTyreSize }),
            "sessionExpiryTime": "2024-12-31T23:59:59",
            "userId": loginItems.UserId
        };
        // console.log(payload);
        // return
        // console.log("warranty no ", warrantyPostObject)
        try {
            setloading(true)
            const response = await axios.post('https://warrantyuat.tyrechecks.com/api/Warranty/WarrantyRegistration', payload)
            // console.log("response", response.data)
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
        }}>
            <Text>{item.value}</Text>
        </Pressable>
    );
    const [pincodevaluedata, setpincodevaluedata] = useState(null);
    const handleItemSelect = (item) => {
        // setSelectedItem(item); // Store selected item if needed
        setIsPopup(false); // Close the modal
        setpincodevaluedata(item.value)
        console.log("some data", item.value); // Log the selected item
    };
    return (
        <>
            <Text style={{ fontWeight: 'bold', fontSize: 23, color: 'black', textAlign: 'center' }}>Upload {missing_image} Missing Photo</Text>
            <ScrollView contentContainerStyle={styles.container}
                ref={scrollViewRef}
                onScroll={handleScroll}
                scrollEventThrottle={16} // Adjust scroll event throttle as needed
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* <Modal
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
      </Modal> */}
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
                            disabled={true}
                            label="Not Available - Vehicle Registration Number"
                            value="notAvailable"
                            color={RadioButtonColor}
                            style={styles.radioButton}
                            labelStyle={styles.radioLabel}
                        />
                        <RadioButton.Item
                            disabled={true}
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
                                    placeholder={`${singlemissingimage.Registration_No}`}
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

                        {/* <TouchableOpacity
            style={styles.search_button}
            onPress={() => handleCameraOpen('tyre1Image')}>
            {/* <Text style={styles.buttonText}>Photo </Text> 
            <Icon name="camera" size={15} color={'white'} />
          </TouchableOpacity> */}
                        {
                            singlemissingimage.MissingPhoto === 'RegistrationNo' ?
                                <>
                                    {numberplate && (
                                        <Image
                                            source={{
                                                uri:
                                                    numberplate + '?' + new Date().getTime(),
                                            }}
                                            width={320}
                                            height={300}
                                        />
                                    )}
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={numberplateimage}>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Registration No</Text>
                                        <Icon
                                            style={{ marginLeft: 10, marginTop: 2 }}
                                            name="camera"
                                            size={20}
                                            color={'white'}
                                        />
                                    </TouchableOpacity>
                                </>
                                :
                                <TouchableOpacity
                                    disabled={true}
                                    style={styles.button}
                                    onPress={numberplateimage}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Registration No</Text>
                                    <Icon
                                        style={{ marginLeft: 10, marginTop: 2 }}
                                        name="camera"
                                        size={20}
                                        color={'white'}
                                    />
                                </TouchableOpacity>
                        }

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
                                        maxLength={50}
                                        style={styles.input}
                                        placeholder={`${singlemissingimage.CustomerName}`}
                                        placeholderTextColor={placeholderTextColor}
                                        onChangeText={value =>
                                            handleCustomerDetailsChange('customerName', value)
                                        }
                                        value={customerDetails.customerName}
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
                                        placeholder={`${singlemissingimage.MobileNo}`}
                                        maxLength={10}
                                        placeholderTextColor={placeholderTextColor}
                                        onChangeText={value =>
                                            handleCustomerDetailsChange('mobileNumber', value)
                                        }
                                        value={customerDetails.mobileNumber}
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
                                        placeholder={`${singlemissingimage.Address}`}
                                        placeholderTextColor={placeholderTextColor}
                                        onChangeText={value =>
                                            handleCustomerDetailsChange('address', value)
                                        }
                                        value={customerDetails.address}
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
                                        <TextInput
                                            readOnly={true}
                                            dropdownStyles={styles.dropdownshow}
                                            maxHeight={200}
                                            data={stateItems}
                                            placeholder={`${singlemissingimage.State_Name}`}
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
                                        />
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
                                        <Pressable style={{ marginBottom: 10, width: '100%' }}
                                            onPress={() => setIsPopup(false)} // Close modal directly
                                        >
                                            <Text style={{ textAlign: 'right' }}>Close</Text>
                                        </Pressable>
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
                                                        handleCustomerDetailsChange('pinCode', pincodevaluedata)
                                                        getPincode(pincodevaluedata)
                                                        setIsPopup(true)
                                                    }}>
                                                    <Text>--Pincode--</Text>

                                                </Pressable> :
                                                <Pressable style={{ padding: 15, }} onPress={() => {
                                                    handleCustomerDetailsChange('pinCode', pincodevaluedata)
                                                    getPincode(pincodevaluedata)
                                                    setIsPopup(true)
                                                }}>
                                                    {/* {`${singlemissingimage}`} */}
                                                    <Text></Text>

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
                            <View style={styles.outer_view}>
                                <View style={styles.label_view}>
                                    <Text style={styles.label_View_text_style}>
                                        Vehicle Type
                                        <Text style={{ color: 'red' }}>*</Text>
                                    </Text>
                                </View>
                                <View style={styles.text_view}>
                                    <View style={styles.input}>
                                        <TextInput
                                            readOnly={true}
                                            dropdownStyles={styles.dropdownshow}
                                            maxHeight={200}
                                            data={vehicleTypeItems}
                                            setSelected={value => {
                                                handleVehicleDetailsChange('make', value)
                                                getVehicleMakeByVehiceTypeID(value)
                                            }



                                            }
                                            placeholder={`${singlemissingimage}`}
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
                                        Vehicle Make
                                        <Text style={{ color: 'red' }}>*</Text>
                                    </Text>
                                </View>
                                <View style={styles.text_view}>
                                    <View style={styles.input}>
                                        <TextInput
                                            readOnly={true}
                                            dropdownStyles={styles.dropdownshow}
                                            maxHeight={200}
                                            data={makeINamestems}
                                            setSelected={value => {
                                                handleVehicleDetailsChange('make', value)
                                                getVehicleVariantById(value)
                                                getmakeidlist(value)
                                            }

                                            }
                                            placeholder={`${singlemissingimage.Make_Name}`}
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
                                        Vehicle Variant
                                        <Text style={{ color: 'red' }}>*</Text>
                                    </Text>
                                </View>
                                <View style={styles.text_view}>
                                    <View style={styles.input}>
                                        <TextInput

                                            readOnly={true}
                                            dropdownStyles={styles.dropdownshow}
                                            maxHeight={200}
                                            data={vehicleVariantItems}
                                            setSelected={value => storeVehicleVariant(value)
                                            }
                                            placeholder={`${singlemissingimage.Variant_Name}`}
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
                                        Vehicle Model
                                        <Text style={{ color: 'red' }}>*</Text>
                                    </Text>
                                </View>
                                <View style={styles.text_view}>
                                    <View style={styles.input}>
                                        <TextInput
                                            readOnly={true}
                                            dropdownStyles={styles.dropdownshow}
                                            maxHeight={200}
                                            data={modelItems}
                                            setSelected={value => {
                                                handleVehicleDetailsChange('model', value)
                                                getmodelidlist(value)
                                            }


                                            }
                                            placeholder={`${singlemissingimage.Model_Name}`}
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
                                        Tyre Brand
                                        <Text style={{ color: 'red' }}>*</Text>
                                    </Text>
                                </View>
                                <View style={styles.text_view}>
                                    <View style={styles.input}>
                                        <TextInput
                                            readOnly={true}
                                            dropdownStyles={styles.dropdownshow}
                                            maxHeight={200}
                                            data={brandnameItems}
                                            setSelected={value => {
                                                handleVehicleDetailsChange('brand', value)
                                                getbrandlist(value)
                                            }

                                            }
                                            placeholder={`${singlemissingimage.BrandName}`}
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
                                        <TextInput
                                            readOnly={true}
                                            dropdownStyles={styles.dropdownshow}
                                            maxHeight={200}
                                            data={productnameItems}
                                            setSelected={value => {
                                                handleVehicleDetailsChange('productName', value)
                                                getProductNameById(value)
                                            }

                                            }
                                            placeholder={`${singlemissingimage.ProductName}`}
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
                                        <TextInput
                                            readOnly={true}
                                            dropdownStyles={styles.dropdownshow}
                                            maxHeight={200}
                                            data={tyresizeItems}
                                            setSelected={value =>
                                                handleVehicleDetailsChange('tyreSize', value)
                                            }
                                            placeholder={`${singlemissingimage.TyreSize}`}
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
                                        Serial_1
                                        <Text style={{ color: 'red' }}>*</Text>
                                    </Text>
                                </View>
                                <View style={styles.text_view}>
                                    <View style={styles.input}>
                                        <TextInput
                                            readOnly={true}
                                            placeholder={`${singlemissingimage.Serial_1}`}
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
                            {
                                singlemissingimage.MissingPhoto === 'Serial_1' ?
                                    <>
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
                                    </> :
                                    <TouchableOpacity
                                        disabled={true}
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
                            }
                            <View style={styles.outer_view}>
                                <View style={styles.label_view}>
                                    <Text style={styles.label_View_text_style}>
                                        Serial_2
                                        <Text style={{ color: 'red' }}>*</Text>
                                    </Text>
                                </View>
                                <View style={styles.text_view}>
                                    <View style={styles.input}>
                                        <TextInput
                                            readOnly={true}
                                            placeholder={`${singlemissingimage.Serial_2}`}
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
                            {singlemissingimage.MissingPhoto === 'Serial_2' ?
                                <>
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
                                </> :
                                <TouchableOpacity
                                    disabled={true}
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
                            }
                            {/* {vehicleDetails.tyreQuantity === '1' && (
                            <View>
                                <View style={styles.Serial_number_input_view}>
                                    <TextInput
                                        readOnly={true}
                                        style={styles.Serial_number_input_small}
                                        placeholder=""
                                        maxLength={1}
                                        placeholderTextColor={placeholderTextColor}
                                        onChangeText={value =>
                                            handleVehicleDetailsChange('tyre1SerialNumber1', value)
                                        }
                                        value={serialkey}
                                    />
                                    <TextInput
                                        keyboardType='number-pad'
                                        maxLength={5}

                                        style={styles.Serial_number_input}
                                        placeholder=""
                                        placeholderTextColor={placeholderTextColor}
                                        onChangeText={value =>
                                            handleVehicleDetailsChange('tyre1SerialNumber2', value)
                                        }
                                        value={vehicleDetails.tyre1SerialNumber2}
                                    />
                                    <TextInput
                                        keyboardType='number-pad'
                                        maxLength={4}
                                        style={styles.Serial_number_input}
                                        placeholder=""
                                        placeholderTextColor={placeholderTextColor}
                                        onChangeText={value =>
                                            handleVehicleDetailsChange('tyre1SerialNumber3', value)
                                        }
                                        value={vehicleDetails.tyre1SerialNumber3}
                                    />
                                </View>
                                {/* {tyre1Image && <Image source={{ uri: tyre1Image }} width={320} height={300} />} 
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
            )} 
                    </View>
                        )}
                {vehicleDetails.tyreQuantity === '2' && (
                    <View>
                        <View style={styles.Serial_number_input_view}>
                            <TextInput
                                readOnly={true}
                                style={styles.Serial_number_input_small}
                                placeholder=""
                                maxLength={1}
                                placeholderTextColor={placeholderTextColor}
                                onChangeText={value =>
                                    handleVehicleDetailsChange('tyre1SerialNumber1', value)
                                }
                                value={serialkey}
                            />
                            <TextInput
                                keyboardType='number-pad'
                                maxLength={5}

                                style={styles.Serial_number_input}
                                placeholder=""
                                placeholderTextColor={placeholderTextColor}
                                onChangeText={value =>
                                    handleVehicleDetailsChange('tyre1SerialNumber2', value)
                                }
                                value={vehicleDetails.tyre1SerialNumber2}
                            />
                            <TextInput
                                keyboardType='number-pad'
                                maxLength={4}
                                style={styles.Serial_number_input}
                                placeholder=""
                                placeholderTextColor={placeholderTextColor}
                                onChangeText={value =>
                                    handleVehicleDetailsChange('tyre1SerialNumber3', value)
                                }
                                value={vehicleDetails.tyre1SerialNumber3}
                            />
                        </View>
                        {/* {tyre2Image && <Image source={{ uri: tyre2Image }} width={320} height={300} />} 
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

                                readOnly={true}
                                style={styles.Serial_number_input_small}
                                placeholder=""
                                maxLength={1}
                                placeholderTextColor={placeholderTextColor}
                                onChangeText={value =>
                                    handleVehicleDetailsChange('tyre2SerialNumber1', value)
                                }
                                value={serialkey}
                            />
                            <TextInput
                                keyboardType='number-pad'
                                maxLength={5}
                                style={styles.Serial_number_input}
                                placeholder=""
                                placeholderTextColor={placeholderTextColor}
                                onChangeText={value =>
                                    handleVehicleDetailsChange('tyre2SerialNumber2', value)
                                }
                                value={vehicleDetails.tyre2SerialNumber2}
                            />
                            <TextInput
                                keyboardType='number-pad'
                                maxLength={4}
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
            )} 
                    </View>
                )} */}
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
                                        readOnly={true}
                                        style={styles.input}
                                        placeholder={`${singlemissingimage.InvoiceNo}`}
                                        placeholderTextColor={placeholderTextColor}
                                        onChangeText={value =>
                                            handleOptionalDetailsChange('invoiceNumber', value)
                                        }
                                        value={optionalDetails.invoiceNumber}
                                    />
                                </View>
                            </View>
                            {
                                singlemissingimage.MissingPhoto === 'InvoiceNumber' ?
                                    <>
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
                                        <TouchableOpacity style={styles.button} onPress={invoicePickCamera}>
                                            <Text style={styles.buttonText}>Take Invoice Photo</Text>
                                            <Icon
                                                style={{ marginLeft: 10, marginTop: 2 }}
                                                name="camera"
                                                size={20}
                                                color={'white'}
                                            />
                                        </TouchableOpacity>
                                    </> :
                                    <TouchableOpacity disabled={true} style={styles.button} onPress={invoicePickCamera}>
                                        <Text style={styles.buttonText}>Take Invoice Photo</Text>
                                        <Icon
                                            style={{ marginLeft: 10, marginTop: 2 }}
                                            name="camera"
                                            size={20}
                                            color={'white'}
                                        />
                                    </TouchableOpacity>
                            }
                            {/* {optionalDetails.invoiceImage && ( 
                        //     <Image
                        //         source={{
                        //             uri:
                        //                 optionalDetails.invoiceImage + '?' + new Date().getTime(),
                        //         }}
                        //         width={320}
                        //         height={300}
                        //     // style={{ width: 100, height: 100 }}
                        //     />
                        // )}
                        // {/* {invoiceImageUri && <Image source={{ uri: invoiceImageUri }} width={320} height={300} />} */}
                            {/* // <TouchableOpacity style={styles.button} onPress={invoicePickCamera}>
                        //     <Text style={styles.buttonText}>Take Invoice Photo</Text>
                        //     <Icon */}
                            {/* //         style={{ marginLeft: 10, marginTop: 2 }}
                        //         name="camera"
                        //         size={20}
                        //         color={'white'}
                        //     />
                        // </TouchableOpacity>*/}
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
                                        disabled={true}
                                        style={styles.calenderbutton}
                                        onPress={() => setOpenFromDate(true)}>
                                        <Text style={styles.buttonText}>
                                            {`${singlemissingimage.InvoiceDate}`}{' '}
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
                                        readOnly={true}
                                        style={styles.input}
                                        placeholder={`${singlemissingimage.ODOMeter}`}
                                        placeholderTextColor={placeholderTextColor}
                                        onChangeText={value =>
                                            handleOptionalDetailsChange('odoMeterReading', value)
                                        }
                                        value={optionalDetails.odoMeterReading}
                                    />
                                </View>
                            </View>
                            {
                                singlemissingimage.MissingPhoto === 'ODOMeter' ?
                                    <>
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
                                    </> :
                                    <TouchableOpacity
                                        disabled={true}
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
                            }
                            {/* {ODOMeterImageUri && <Image source={{ uri: ODOMeterImageUri }} width={320} height={300} />} */}
                            {/* {/* {optionalDetails.odoMeterImage && (
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
                            style={styles.button}
                            onPress={ODOMeterPickCamera}>
                            <Text style={styles.buttonText}>Take ODO Meter Photo</Text>
                            <Icon
                                style={{ marginLeft: 10, marginTop: 2 }}
                                name="camera"
                                size={20}
                                color={'white'}
                            />
                        </TouchableOpacity> */}
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
                                        <TextInput
                                            readOnly={true}
                                            dropdownStyles={styles.dropdownshow}
                                            maxHeight={200}
                                            data={oldtyrecompanyItems}
                                            setSelected={value =>
                                                handleOldTyreDetailsChange('oldTyreCompany', value)
                                            }
                                            placeholder={`${singlemissingimage.OldTyre_CompanyName}`}
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
                                        <TextInput

                                            dropdownStyles={styles.dropdownshow}
                                            maxHeight={200}
                                            data={oldtyrebrandnameItems}
                                            setSelected={value =>
                                                handleOldTyreDetailsChange('oldTyreBrand', value)
                                            }
                                            placeholder={`${singlemissingimage.OldTyre_BrandName}`}
                                            boxStyles={{ borderWidth: 0, padding: 0 }}
                                            arrowicon={
                                                <Icon name="chevron-down" size={12} color={'black'} />
                                            }
                                            save="value"
                                            readOnly={true}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.outer_view}>
                                <View style={styles.label_view}>
                                    <Text style={styles.label_View_text_style}>Old Tyre Size</Text>
                                </View>
                                <View style={styles.text_view}>
                                    <View >
                                        <TextInput
                                            readOnly={true}
                                            style={styles.input}
                                            placeholder={`${singlemissingimage.OldTyre_Size}`}
                                            placeholderTextColor={placeholderTextColor}
                                            onChangeText={value =>
                                                handleOldTyreDetailsChange('oldTyreSize', value)
                                            }
                                            value={oldTyreDetails.oldTyreSize}
                                        />
                                        {/* <SelectList
                    dropdownStyles={styles.dropdownshow}
                    maxHeight={200}
                    data={OldTyreSizedata}
                    setSelected={value =>
                      handleOldTyreDetailsChange('oldTyreSize', value)
                    }
                    placeholder="Old Tyre Size"
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
                        onValueChange={value => setTermsAccepted(value)}
                        value={termsAccepted}>
                        <RadioButton.Item
                            disabled={true}
                            label="I accept the terms and conditions"
                            value={true}
                            color={RadioButtonColor}
                            style={styles.radioButton}
                            labelStyle={styles.radioLabel}
                        />
                    </RadioButton.Group>
                </View>

                {/* Submit Button */}
                {/* <View style={{ flexDirection: 'row', marginRight: 3 }}>
                <TouchableOpacity disabled={true} style={{
                    backgroundColor: '#e11e30',
                    padding: 10,
                    marginVertical: 10,
                    marginLeft: 4,
                    borderRadius: 5,
                    width: '50%',
                }} onPress={handleSubmit}>
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>
                        Save {'\n'}(As a Draft)
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLoop} disabled={true} style={{
                    backgroundColor: '#e11e30',
                    padding: 10,
                    marginVertical: 10,
                    marginLeft: 4,
                    borderRadius: 5,
                    width: '50%',
                }}>
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>
                        Submit {'\n'}(Online Portal)
                    </Text>
                </TouchableOpacity>
                {/* <Button title="Save (As a Draft)" onPress={handleSubmit} color="#e11e30" /> 
<Button title="Submit (Online Portal)" onPress={handleSubmit} color="#e11e30" />  </View> */}



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
                <View>
                    <TouchableOpacity style={styles.submit_button} onPress={handleMissingimnageupload}>
                        <Text style={styles.buttonText}>Upload Image</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView >
        </>
    );
};

export default UpdateMissingImage;
