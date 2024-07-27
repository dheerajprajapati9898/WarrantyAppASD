// @ -1,16 +1,27 @@

import { StyleSheet } from "react-native";
import { white } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    paddingLeft: 20,
    paddingRight: 20,
    // backgroundColor: '#f4f4f4',
    // backgroundColor: '#fff',
    paddingTop: 20,
  },
  headerText: {

    fontSize: 20,
    fontWeight: 'bold',
    color: '#e11e30',
    marginBottom: 20,
    justifyContent: 'center',
    textDecorationLine: 'underline'

  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  cardGroup: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  cardGroup1: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttoncard: {

    height: 40,
    width: '50%',
    backgroundColor: '#e11e30',
    marginTop: 0,
    margin: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonEnabled: {
    backgroundColor: '#e11e30', // or any other color for enabled state
  },
  buttonDisabled: {
    backgroundColor: '#eda9a4', // or any other color for disabled state
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 5,
    marginRight: 5
  },
  sectionHeaderContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#A3A3A3',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 5,
    paddingVertical: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    }, shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    // color: '#ff0000',
    marginVertical: 10,
  },

  outer_view: { flex: 0.5, flexDirection: 'row' },

  label_view: { width: '30%', justifyContent: 'center', paddingRight: 10 },
  label_View_text_style: { fontWeight: 'bold' },

  text_view: { width: '70%' },


  input: {
    borderWidth: 1,
    borderColor: 'gray',
    color: '#000',
    // padding: 10,
    marginVertical: 5,
    backgroundColor: 'white',
    // textAlign:'center'
    // paddingLeft : 10
  },

  Serial_number_input_view: {
    flexDirection: 'row',
    flex: 0.5,

  },

  Serial_number_input_small: {
    borderWidth: 1,
    borderColor: 'gray',
    color: '#000',
    // padding: 10,
    marginVertical: 5,
    backgroundColor: 'white',
    width: '20%',
    textAlign: 'center'
  },

  Serial_number_input: {
    borderWidth: 1,
    borderColor: 'gray',
    color: '#000',
    // padding: 10,
    marginVertical: 5,
    backgroundColor: 'white',
    minWidth: '40%',
    textAlign: 'center'
  },
  cameraButton: {
    backgroundColor: '#e11e30',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    flex: 0.5,
    justifyContent: 'space-between',
    alignContent: 'center'
  },
  button: {
    backgroundColor: '#e11e30',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    flex: 0.5,
    justifyContent: 'space-between',
    alignContent: 'center'
  },
  search_button: {
    backgroundColor: '#e11e30',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center'
    // alignContent:'center',
    // justifyContent : 'space-around'
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 400,
    backgroundColor: '#000',
  },

  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
  },

  capturedImage: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },

  // radioButton: {
  //   backgroundColor: '#D3D3D3',
  //   // backgroundColor: 'black',
  // },

  radioLabel: {
    color: '#000',
  },
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    paddingLeft: 20
  },

  dropdownshow: {
    borderRadius: 0,
    borderWidth: 0,
    borderTopWidth: 1
  },


  submit_button: {
    backgroundColor: '#e11e30',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    width: '48%'
    // alignContent:'center',
    // justifyContent : 'space-around'
  },

  subheaderText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  // @ -25,134 +36,205 @@



  radioButtonLabelContainer: {

    marginTop: 20,
    paddingHorizontal: 0,
    paddingVertical: 15,
    backgroundColor: '#000',
    margin: 2,
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    // justifyContent : 'space-around',
    // textAlign : 'center'

  },

  radioLabelHeader: {

    color: '#fff',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    // textDecorationLine : 'underline'

  },



  radioLabel_warranty_num: {

    color: '#e11e30',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    textDecorationLine: 'underline',

  },

  radioLabel_mobile_num: {

    color: '#e11e30',
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    // textDecorationLine : 'underline',

  },

  logoContainer: {

    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },

  syncContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  syncbutton: {
    // flex: 0.5,
    // flex: 0.5,
    backgroundColor: '#e11e30',
    padding: 10,
    marginVertical: 10,
    marginLeft: 4,
    borderRadius: 5,
    width: '100%',
  },

  displayMain: {
    marginTop: 20,
    borderColor: 'grey',
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 3,
  },

  displayContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,

  },

  displayText: {
    flex: 0.5,
    color: 'black',
    paddingTop: 10,
    fontSize: 17,
  },

  boldText: {
    fontWeight: 'bold',
  },

  displaybutton: {
    backgroundColor: '#ff0000',
    padding: 10,
    margin: 50,
    marginVertical: 10,
    borderRadius: 5,
  },

  checklogoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 230,
    paddingBottom: 30,
  },

  checktext: {
    color: '#355E3B',
  },

  exploretext: {
    color: '#B4C424',
  },

  powerByText: {
    color: 'black',
  }

});

export default styles;
