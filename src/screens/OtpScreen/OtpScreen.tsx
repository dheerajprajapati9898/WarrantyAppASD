import React from 'react';
import { Text,View,Image,TextInput,Pressable} from 'react-native';
import styles from './styles';


export const LoginOTP = (props) => {
  
  return (
    <View style={styles.container}>
      
      <View style={styles.contentContainer}>
        <Text style={styles.logintext}>LOGIN with OTP</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.input} placeholder='EMAIL / MOBILE NO' cursorColor='white' color="white" placeholderTextColor="grey" autoCorrect={false}
          autoCapitalize='none' />
          
        </View>
        <View style={styles.loginbuttonView}>
        <Pressable style={styles.loginbutton} onPress={()=> props.navigation.navigate("Home")} >
                <Text style={styles.loginbuttonText}>Send OTP</Text>
            </Pressable>
        </View>

        <Text style={styles.loginotptext} onPress={()=> props.navigation.navigate("Login")}>Login with Username/Password</Text>

        <Text style={styles.languagetext}>Languages : <Text style={styles.languageredtext}>English  हिंदी  ਪੰਜਾਬੀ </Text></Text>

        
      </View>

      <View style={styles.checkexplorelogoContainer}>
        <Text style={styles.powerByText}>Powered by <Text style={styles.checktext}>Check</Text><Text style={styles.exploretext}>Explore</Text>    </Text>
        <Image source={require('../../assets/images/logo/tclogo.png')} style={styles.checkexploreLogo} resizeMode='contain' />
      </View>
      
    </View>
  );
}

// const styles = StyleSheet.create({
//   container : {
//     flexDirection: 'column',
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   imageContainer: {
//     flex: 0.2, // Limits image view height
//     backgroundColor: '#000',
//     alignItems: 'center',
//     paddingLeft: 0,
//   },
//   image : {
//     height : 100,
//     width : 100,
//     position: 'absolute',
//     left: 130,
//     paddingBottom: 10,
//   },

//   text6: {
//     color: '#008080',
//   },

//   text7: {
//     color: '#DFFF00',
//   },  

//   contentContainer: {
//     flex: 1, // Allows content view to expand
//     // justifyContent: 'center',
//     paddingTop: 70,
//     // alignItems: 'center', 
//     backgroundColor: '#000',
    
//   },
//   text : {
//     color: '#fff',
//     paddingBottom: 20,
//     fontSize: 18,
//     alignItems: 'center',
//     paddingLeft: 40,
//     fontFamily : 'monospace',
//   },
//   text2 : {
//     color: 'grey',
//     paddingBottom: 30,
//     fontSize: 15,
//     alignItems: 'center',
//     paddingLeft: 40,
//     fontFamily : 'Roboto',
//   },
//   text3 : {
//     color: 'white',
//     paddingBottom: 10,
//     fontSize: 15,
//     alignItems: 'center',
//     paddingLeft: 40,
//     fontFamily : 'Roboto',
//   },
//   text5 : {
//     color: 'white',
//     paddingBottom: 30,
//     fontSize: 15,
//     alignItems: 'center',
//     paddingLeft: 40,
//     fontFamily : 'Roboto',
//   },
//   text4 : {
//     color: 'red',
//     // paddingBottom: 20,
//     fontSize: 15,
//     // alignItems: 'center',
//     // paddingLeft: 40,
//     fontFamily : 'Roboto',
//   },
//   inputView : {
//     gap : 15,
//     width : "100%",
//     paddingHorizontal : 40,
//     marginBottom  :5
//   },
//   input : {
//     height : 50,
//     paddingHorizontal : 20,
//     borderColor : "red",
//     borderWidth : 1,
//     borderRadius: 7,
//   },
//   button : {
//     backgroundColor : "red",
//     height : 45,
//     borderColor : "gray",
//     borderWidth  : 1,
//     borderRadius : 5,
//     alignItems : "center",
//     justifyContent : "center"
//   },
//   buttonText : {
//     color : "white"  ,
//     fontSize: 18,
//     fontWeight : "bold"
//   }, 
//   buttonView :{
//     width :"100%",
//     paddingHorizontal : 40,
//     paddingTop: 20,
//     paddingBottom: 20,
//   },
// });
