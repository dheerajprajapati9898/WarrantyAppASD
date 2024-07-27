import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#d3d3d3',
      justifyContent : 'space-between',
    },
    header: {
      alignItems : 'center',
      padding: 20,
      justifyContent : 'center',
    },
    headerText: {
      color: 'black',
      fontSize: 35,
      fontWeight: 'bold',
    },
    inputContainer: {
      padding: 20,
      backgroundColor: 'white',
      marginTop: 10,
      marginHorizontal: 10,
      borderRadius: 5,
      borderColor: '#DDDDDD',
      borderWidth: 1,
      position: 'relative',
    },
    outerLabel: {
      fontSize: 16,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    textInput: {
      height: '50%', 
      borderColor: '#DDDDDD',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      textAlignVertical: 'top',
      color: 'black',
    },
    charCount: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      color: '#999999',
      fontSize: 12,
    },
    button: {
      backgroundColor: '#E11E30',
      padding: 15,
      alignItems: 'center',
      margin: 20,
      borderRadius: 5,  
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
    },
  });

  export default styles;