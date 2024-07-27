
import { StyleSheet } from "react-native";

const style = StyleSheet.create({

    container : { flex : 1, backgroundColor : '#D3D3D3' },

    tractor_Image_container : { height : 200 },
    
    upper_card_container : {alignItems : 'center', justifyContent : 'space-between', marginTop : 15 , margin: 5},

    cardGroup : {

            flexDirection : 'row',
            alignItems : 'center',
            justifyContent : 'space-between',
            padding : 2
            
            },

    text_card : {

            height : 70,
            width : '32.5%',
            backgroundColor : '#fff',
            margin : 1,
            borderWidth : 1,
            borderRadius : 10,
            borderColor: 'gray',
            alignItems : 'center',
            justifyContent : 'center',
            borderBottomColor : 'white'

            },

    warranty_counts_text : {

            color:'#e11e30', 
            fontSize : 25, 
            fontWeight : 'bold', 
            paddingBottom:10, 
        //     textDecorationLine:'underline'
            
            },    

    number_card : {

            height : 50,
            width : '32.5%',
            backgroundColor : '#fff',
            marginTop : 0,
            margin : 1,
            borderWidth : 1,
            borderColor: 'gray',
            borderRadius : 10,
            alignItems : 'center',
            justifyContent : 'center'

            },

    lower_card_container : {alignItems : 'center', marginTop : 30, margin: 8},
    

    text : { fontSize : 16, fontWeight : 'bold', color : '#000', margin : 5},
    
    card : {

            height : 140,
            width : '49%',
            backgroundColor : '#fff',
            margin : 1,
            marginLeft: 3.5,
            marginRight: 3.5,
            borderWidth : 1,
            borderRadius : 10,
            borderColor: 'gray',
            alignItems : 'center',
            justifyContent : 'center',
        //     padding : 20,

            },
    
});

export default style;