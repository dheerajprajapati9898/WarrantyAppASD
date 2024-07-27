import { ImageBackground, Text, TouchableOpacity, View, ScrollView, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import style from "./styles";
// import tractor_image from "../../components/images/Tractor_Image";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { setupDatabase } from '../../db/Registration/database';
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
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import NetInfo from '@react-native-community/netinfo';
import RemoteUrls from "../apiUrl";
import { AESExtensions } from "../AESExtensions";
import { getAllLoginItems } from "../../db/Login/Login";
const HomeScreen = () => {
  const [isConnected, setIsConnected] = useState(null);
  const navigation = useNavigation();
  const tractor_image = () => require('../../assets/images/tractor_image.webp');
  const iconColor = '#666';
  const iconSize = 40;
  // const [selectedItem, setSelectedItem] = useState(null);
  const scrollViewRef = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const options = [
    { apiname: 'State Master', status: false },
    { apiname: 'City Master', status: false },
    { apiname: 'District Master', status: false },
    { apiname: 'Pincode Master', status: false },
    { apiname: 'Vehicle Type Master', status: false },
    { apiname: 'Vehicle Make Master', status: false },
    { apiname: 'Vehicle Modal Master', status: false },
    { apiname: 'Photo Category', status: false },
  ];
  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;

    // Adjust this threshold as needed to trigger refresh
    if (distanceFromBottom < 100 && !isLoadingMore) {
      setIsLoadingMore(true);
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
      // fetchItems()
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    // Simulated refreshing action

    setTimeout(() => {
      setData([]);
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
      // fetchItems()
      setRefreshing(false);
    }, 1000);
  }
  // Simulated delay
  useEffect(() => {

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
    warrantycount()
    onlinewarrantycount()
    onlinemissingimagecount()
    // getMissingImageCount()
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
  }, [])
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [items, setItems] = useState(0)
  const [todayWRCount, setTodayWRCount] = useState(0)
  const [monthWRCount, setMonthWRCount] = useState(0)
  const [overallWRCount, setOverallWRCount] = useState(0)
  const [missingimagecount, setmissingimagecount] = useState(0)
  const [onlineWRCount, setOnlineWRCount] = useState({
    current_day_count: 0,
    current_month_count: 0,
    current_year_count: 0
  });
  const [missingImage, setMissingImage] = useState({
    WarrantyImageMissingCount: 0
  });
  const onlinemissingimagecount = async () => {
    const userData = await getAllLoginItems()
    const specificData = {
      Username: userData.Username
    };
    try {
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
      console.log("Asdasdasdimage", plaintextoflogindata.length);
      setmissingimagecount(plaintextoflogindata.length)
    } catch (error) {
      console.log(error);

    }
  }
  const warrantycount = async () => {
    // const todayTotalWarrantyCount=items.lenght
    const todayRegistrationCount = await getTodayWarrantyDashbaordCount(db)
    console.log("todayRegistrationCount", todayRegistrationCount);
    setTodayWRCount(todayRegistrationCount)
    const monthRegistrationCount = await getMonthWarrantyDashbaordCount(db)
    console.log("monthRegistrationCount", monthRegistrationCount);
    setMonthWRCount(monthRegistrationCount)
    // console.log("overall", items)

  }
  const onlinewarrantycount = async () => {
    try {
      const response = await axios.get(RemoteUrls.getWarrantyCountUrl);
      const plaintextoflogindata = AESExtensions.decryptString(response.data.responseData)
      console.log("Asdasdasd", plaintextoflogindata);
      // return
      // const responseData = JSON.parse(response.data.responseData);
      setOnlineWRCount(plaintextoflogindata);
    } catch (error) {
      console.error("Error fetching warranty count:", error);
    }

  }
  const getMissingImageCount = async () => {
    const payload = {
      "requestId": "",
      "isEncrypt": "",
      "requestData": "",
      "sessionExpiryTime": "",
      "userId": ""
    };

    try {
      const response = await axios.post('https://warrantyuat.tyrechecks.com/api/Warranty/GetWarrantyImageMissingCount', payload);
      const responseData = JSON.parse(response.data.responseData);
      console.log("responseData", responseData);
      setMissingImage(responseData[0])
    } catch (error) {
      console.error("Error fetching warranty count:", error);
    }
  };

  const fetchItems = async (database: SQLiteDatabase) => {
    try {
      const item = await getAllItems(database);
      if (item === null) {
        setItems(0)
      }
      else {
        setItems(item);
      }

      console.log("item", items.length)
    } catch (error) {
      console.error(error);
    }
  };

  return (

    <ScrollView style={style.container}
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16} // Adjust scroll event throttle as needed
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >

      <ImageBackground source={tractor_image()} resizeMode="cover">
        <View style={style.tractor_Image_container}></View>
      </ImageBackground>

      <View style={style.upper_card_container}>

        <Text style={style.warranty_counts_text}>Warranty Counts</Text>
        <View style={style.cardGroup}>

          <View style={style.text_card}>
            <Text style={style.text}>Today</Text>

          </View>

          <View style={style.text_card}>
            <Text style={style.text}>Monthly</Text>
          </View>

          <View style={style.text_card}>
            <Text style={style.text}>Overall</Text>
          </View>
        </View>

        <View style={style.cardGroup}>
          <View style={style.number_card}>
            <Text style={style.text}>
              {isConnected ? onlineWRCount.current_day_count : todayWRCount}
            </Text>
          </View>
          <View style={style.number_card}>
            <Text style={style.text}>
              {isConnected ? onlineWRCount.current_month_count : monthWRCount}
            </Text>
          </View>
          <View style={style.number_card}>
            <Text style={style.text}>
              {isConnected ? onlineWRCount.current_year_count : items.length}
            </Text>
          </View>
        </View>


      </View>

      <View style={style.lower_card_container}>

        <View style={style.cardGroup}>
          <TouchableOpacity style={style.card} onPress={() => navigation.navigate('Registration' as never)}>
            <Icon name="wpforms" size={iconSize} color={iconColor} />
            <Text style={style.text}>Warranty Registration</Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.card} onPress={() => navigation.navigate('Dashboard' as never)}>
            <Icon2 name="desktop-mac-dashboard" size={iconSize} color={iconColor} />
            <Text style={style.text}>Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View style={style.cardGroup}>
          <TouchableOpacity style={style.card} onPress={() => navigation.navigate('AddImage' as never)}>
            <Icon name="image" size={iconSize} color={iconColor} />
            <Text style={style.text}>Missing Images</Text>
            {
              isConnected ? <Text style={{ color: 'red' }}>MissingImage Count : {missingimagecount}</Text> :
                <Text style={{ color: 'red' }}>Warranty Count : 0</Text>
            }

          </TouchableOpacity>
          <TouchableOpacity style={style.card} onPress={() => navigation.navigate('Outbox' as never)}>
            <Icon name="share-square-o" size={iconSize} color={iconColor} />
            <Text style={style.text}>Draft</Text>
            <Text style={{ color: 'red' }}>Warranty Count : {items.length}</Text>
          </TouchableOpacity>
        </View>

      </View>

    </ScrollView>
  );
}

export default HomeScreen;