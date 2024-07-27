
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
        container: {
                
                // flexGrow : 1,
                
                paddingLeft: 20,
                paddingRight: 20,
                // backgroundColor: '#fff',
                paddingTop : 20,
                
              },
        headerText: {

                fontSize: 20,
                fontWeight: 'bold',
                color: '#e11e30',
                marginBottom: 20,
                // justifyContent : 'center',
                textDecorationLine : 'underline'

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
                color: '#000',
                padding: 7,
                marginVertical: 5,
                // width:'49%',
                marginHorizontal : '1%',
                justifyContent : 'center',
                alignItems : 'center',
                textAlign : 'center',
                fontSize : 16,

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

        radioButtonLabelContainer:{

                marginTop : 20,
                paddingHorizontal : 0,
                paddingVertical : 15,
                backgroundColor: '#000',
                margin : 2,
                flex : 0.5,
                flexDirection : 'row',
                alignItems : 'center',
                borderTopLeftRadius : 5,
                borderBottomRightRadius : 5,
                // justifyContent : 'space-around',
                // textAlign : 'center'

        },

        radioLabelHeader: {

                color: '#fff',
                textAlign : 'center',
                alignItems : 'center',
                justifyContent : 'center',
                fontSize : 18,
                // textDecorationLine : 'underline'

              },

        radioButton: {

                backgroundColor: '#fff',
                margin : 2,
                flex : 0.5,
                flexDirection : 'row',
                alignItems : 'center',
                justifyContent : 'center',
                textAlign : 'center',
                width:'100%',
                paddingVertical : 10,
                borderBottomWidth : 2,
                borderBottomColor : '#bbb'

              },

        radioLabel_warranty_num: {

                color: '#ff0000',
                textAlign : 'center',
                alignItems : 'center',
                justifyContent : 'center',
                fontSize : 16,
                textDecorationLine : 'underline',

              },

              radioLabel_mobile_num: {

                color: '#ff0000',
                textAlign : 'center',
                alignItems : 'center',
                justifyContent : 'center',
                fontSize : 16,
                // textDecorationLine : 'underline',

              },

        logoContainer: {

                flex:1,
                alignItems:'center',
                justifyContent: 'center',

              },

        calenderContainer : {

                flex:1,
                flexDirection: 'row',
                justifyContent:'space-between',
                
        },

        calenderbutton: {
            flex: 0.5,
            backgroundColor: '#ff0000',
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
            backgroundColor: '#ff0000',
            padding: 10,
            margin: 50,
            marginVertical: 10,
            borderRadius: 5,
          },

          checklogoContainer: {
            flex:1,
            alignItems:'center',
            justifyContent: 'center',
            paddingTop: 15,
            paddingBottom: 20,
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

          // radioButton: {
          //   marginBottom: 10,
          // },
          // radioLabel: {
          //   fontSize: 16,
          // },
          tableCell: {
            flexDirection: 'row',
            alignItems: 'center',
          },
          tableHeader: {
            fontWeight: 'bold',
            paddingRight: 8,
          },
          tableData: {
            flex: 1,
          }
    
});

export default styles;