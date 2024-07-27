import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  container : {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#000',
  },

  checkexplorelogoContainer: {
    flex: 0.2, 
    backgroundColor: '#000',
    alignItems: 'center',
    paddingLeft: 0,
  },
  
  checkexploreLogo : {
    height : 100,
    width : 100,
    position: 'absolute',
    left: 130,
    paddingBottom: 10,
  },

  yokohamalogo : {
    height : 130,
    width : 180,
    position: 'absolute',
    left: 100,
    paddingBottom: 10,
  },

  checktext: {
    color: '#008080',
  },

  exploretext: {
    color: '#DFFF00',
  },  

  placeholdertext: {
    color: 'red',
  },

  contentContainer: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: '#000',
    
  },

  logintext : {
    color: '#fff',
    paddingBottom: 20,
    fontSize: 18,
    alignItems: 'center',
    paddingLeft: 40,
    fontFamily : 'monospace',
  },

  loginotptext : {
    color: 'grey',
    paddingBottom: 30,
    fontSize: 15,
    alignItems: 'center',
    paddingLeft: 40,
    fontFamily : 'Roboto',
  },

  helpandsupporttext : {
    color: 'white',
    paddingBottom: 10,
    fontSize: 15,
    alignItems: 'center',
    paddingLeft: 40,
    fontFamily : 'Roboto',
  },

  contacttext : {
    color: 'white',
    paddingBottom: 10,
    fontSize: 15,
    alignItems: 'center',
    paddingLeft: 40,
    fontFamily : 'Roboto',
  },

  languagetext : {
    color: 'white',
    paddingBottom: 30,
    fontSize: 15,
    alignItems: 'center',
    paddingLeft: 40,
    fontFamily : 'Roboto',
  },
  
  languageredtext : {
    color: 'red',
    fontSize: 15,
    fontFamily : 'Roboto',
  },

  inputView : {
    gap : 15,
    width : "100%",
    paddingHorizontal : 40,
    marginBottom  :5
  },
  input : {
    height : 50,
    paddingHorizontal : 20,
    borderColor : "red",
    borderWidth : 1,
    borderRadius: 7,
  },

  loginbutton : {
    backgroundColor : "red",
    height : 45,
    borderColor : "gray",
    borderWidth  : 1,
    borderRadius : 5,
    alignItems : "center",
    justifyContent : "center"
  },

  loginbuttonText : {
    color : "white"  ,
    fontSize: 18,
    fontWeight : "bold"
  }, 

  loginbuttonView :{
    width :"100%",
    paddingHorizontal : 40,
    paddingTop: 20,
    paddingBottom: 20,
  },

  yokohamalogContainer: {
    backgroundColor:'black',
    paddingBottom:10,
    paddingTop: 100
  },

  powerByText : {
    color : 'white',
  }



});

export default styles;