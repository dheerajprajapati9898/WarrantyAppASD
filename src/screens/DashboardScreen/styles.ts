
import { StyleSheet } from "react-native";
import {  Dimensions, View } from 'react-native';
const styles = StyleSheet.create({
        container: {
                // padding: 20,
                paddingLeft: 20,
                paddingRight: 20,
                backgroundColor: '#fff',
              },
              headerText: {
                fontSize: 20,
                fontWeight: 'bold',
                color: '#ff0000',
                marginBottom: 20,
              },
        sectionHeader: {
                fontSize: 18,
                fontWeight: 'bold',
                color: '#ff0000',
                marginVertical: 10,
              },

        input: {
                borderWidth: 1,
                borderColor: '#ff0000',
                color: 'black',

                padding: 10,
                marginVertical: 5,
              },

        button: {
                backgroundColor: '#e11e30',
                padding: 10,
                marginVertical: 10,
                borderRadius: 5,
              },

        buttonText: {
                color: '#fff',
                textAlign: 'center',
                fontSize:16,
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

        radioButton: {
                backgroundColor: '#000',
              },

        radioLabel: {
                color: '#ff0000',
              },

        logoContainer: {
            flex:1,
            alignItems:'center',
            justifyContent: 'center'
        },

        calenderContainer : {
            flex:1,
            flexDirection: 'row',
            justifyContent:'space-between'
        },
        pdf: {
          flex:1,
          width:Dimensions.get('window').width,
          height:Dimensions.get('window').height,
      },
        calenderbutton: {
            flex: 0.5,
            backgroundColor: '#e11e30',
            padding: 10,
            marginVertical: 10,
            marginLeft: 4,
            borderRadius: 5,
          },

          displayMain : {
            marginTop: 20,
            borderColor: 'grey',
            backgroundColor: 'white',
            borderRadius: 5,
            borderWidth: 3,
          },

          displayContainer: {
            flex:1,
            flexDirection: 'row',
            justifyContent:'space-between',
            paddingLeft: 20,
            paddingRight: 20,
            
          },

          displayText :{
            flex:0.5,
            color: 'black',
            paddingTop: 10,
            fontSize: 17,
          },

          boldText:{
            fontWeight: 'bold',
          },

          displaybutton: {
            backgroundColor: '#e11e30',
            padding: 10,
            margin: 50,
            marginVertical: 10,
            borderRadius: 5,
          },

          checklogoContainer: {
            flex:1,
            alignItems:'center',
            justifyContent: 'center',
            paddingTop: 10,
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
          },

          cardGroupContainer : {
            flex : 0.5,
            flexDirection : 'row',
            justifyContent : 'space-between',
            alignItems:'center',
            marginVertical : '10%',
            borderColor : '#000',
            borderWidth : 1,
            borderRadius : 5,
            padding : 10
          },

          cardGroup : {
            // backgroundColor : 'red',
            flexDirection : 'row',
            alignItems : 'center',
            justifyContent : "center",
            // paddingVertical : '10%',
            // height : 200
            marginBottom : 5
            },

            text_card : {

              // height : '50%',
              width : '100%',
              backgroundColor : '#fff',
              margin : 1,
              borderWidth : 1,
              borderRadius : 5,
              borderColor: 'gray',
              alignItems : 'center',
              justifyContent : 'center',
              borderBottomColor : 'white',
              padding : '2%'
              },

              number_card : {

                // height : '50%',
                // width : '100%',
                backgroundColor : '#fff',
                // marginTop : 0,
                // margin : 1,
                // borderWidth : 1,
                // borderColor: 'gray',
                // borderRadius : 5,
                alignItems : 'center',
                justifyContent : 'center',
                marginRight : '20%',
    
                },
                text : { fontSize : 18, fontWeight : 'bold', color : '#000', margin : 5},

                warranty_counts_text : {

                  color:'#e11e30', 
                  fontSize : 20, 
                  fontWeight : 'bold', 
                  // paddingBottom:10, 
              //     textDecorationLine:'underline'
                  
                  },   
    
});

export default styles;