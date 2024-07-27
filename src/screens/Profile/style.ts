
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#d3d3d3',
        padding : '5%',
    
    },
    profileContainer : {
        flex : 1,
        backgroundColor : '#F2F2F2',
        alignItems : 'center',
        // justifyContent : 'center',
        padding : 10,
        // borderWidth : 2,
        // width : '100%',
        // height : '100%'
    },
    profileHeader : {
        // flex : 1,
        flexDirection : 'row',
        height : '15%',
        width : '100%',
        backgroundColor : '#F2F2F2',
        alignItems : 'center',
        justifyContent: 'space-evenly',
        marginBottom : '2%',
        // borderWidth : 2,
        // borderColor : '#e11e30',
        // borderRadius : 5,
    },
    profileHeaderText : {
        color : '#000',
        fontSize : 25,
        fontWeight : 'bold',

    },

    profileContent : {
        // height : '55%',
        width : '100%',
        backgroundColor : '#F2F2F2',
        alignItems : 'center',
        marginBottom : '2%',
        // borderWidth : 2,
        padding : '1%',
        flexDirection : 'column',
        margin : 15,
        borderColor : '#e11e30',
        borderRadius : 5,
    
    },
    profileContentText : {
        color : '#000',
        fontSize : 18,
        fontWeight : 'bold',
        textDecorationLine : 'underline',
    },
    profileContentDetailsContainer : {
        
        width : '100%',
        flexDirection : 'row',
        marginVertical : '5%',
        justifyContent : 'space-between'
    },
    profileContentDetailsLabel : {
        width : '20%',
        // alignItems : 'center',
        justifyContent : 'center',
        
       
    },
    profileContentDetailsLabelText : {
        fontWeight : 'bold',
        fontSize : 12,
    },
    profileContentDetailsTextFieldView : {
        width : '75%',

    },
    profileContentDetailsTextField : {
        color:'#000', 
        // backgroundColor : '#fff', 
        width: '100%',
        borderBottomWidth : 2,
        borderRadius : 5,
        fontSize : 16,
        padding : 2
        
    },
    updateButtonContent : {
        alignItems : 'center',
        justifyContent : 'center',
        height : '90%',
        width : '98%',
        backgroundColor : '#e11e30',
        // marginHorizontal : 5
        margin : '1%',
        borderRadius : 5,
    },
    updateButtonText : {
        color : '#fff'
    },
    buttonGroupContainer:{
        flexDirection : 'row',
        height : '10%',
        width : '100%',
        // backgroundColor : 'green',
        padding : 2,
        marginBottom : 0,
        // borderWidth : 2,
    },
    buttonContent : {
        height : '90%',
        width : '48%',
        backgroundColor : '#e11e30',
        borderRadius : 5,
        marginVertical : 2,
        alignItems : 'center',
        justifyContent : 'center',
        marginHorizontal : '1%',
    },
    profileButtonText : {
        color : '#fff'
    },
    
    checklogoContainer: {
       
        alignItems:'center',
        justifyContent: 'center',
       
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