import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#D3D3D3',
      
    },
    contactContainer: {
      position: 'absolute',
      top: 16,
      left: 16,
      alignItems : 'center',
    },
    contactText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    boxContainer: {
      marginTop: 80,
      paddingHorizontal: 16,
    },
    box: {
      marginBottom: 16,
      padding: 16,
      // borderWidth: 1,
      borderColor: '#000',
      borderRadius: 8,
      backgroundColor : '#fff',
    },
    label: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    field: {
      fontSize: 16,
      marginTop: 8,
    },
    redText: {
      color: '#FF0000',
    },
    whatsappButton: {
      marginTop: 8,
      padding: 10,
      backgroundColor: '#FF0000',
      borderRadius: 5,
      alignItems: 'center',
    },
    whatsappText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    checklogoContainer: {
      flex:1,
      alignItems:'center',
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
    
    powerByText : {
      color : 'black',
    }
  });

  export default styles;