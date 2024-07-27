import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D3D3D3',
    },
    root: { flex: 1 },
    cell: {
        margin: 5,
        width: 45,
        height: 45,

        // lineHeight: 38,
        fontSize: 30,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#e11e30',
        textAlign: 'center',
    },
    focusCell: {
        borderColor: '#e11e30',
    },
    headerText: {
        color: '#000',
        fontSize: 24,
        marginBottom: 10,
        fontFamily: 'Poppins_700Bold',
    },
    mpinContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    mpinInput: {
        height: 50,
        width: 50,
        borderColor: '#e11e30',
        borderWidth: 1,
        marginHorizontal: 5,
        textAlign: 'center',
        fontSize: 24,
        color: '#000',
        fontFamily: 'Poppins_700Bold',
    },
    input: {
        fontSize: 16,
        width: '88%',
        height: 50, marginBottom: 10,
        padding: 10,
        // borderColor: "red",
        borderWidth: 2,
        borderRadius: 7,
    },
    button: {
        marginTop: 10,
        // width: '70%',
        backgroundColor: '#e11e30',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
    },
});
export default styles;