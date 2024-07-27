import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#D3D3D3',
    justifyContent: 'space-evenly'
  },
  innerContainer: {
    flexDirection: 'column',
  },
  label: {
    // marginTop: 16,
    fontSize: 16,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    padding: 0,
    // marginTop: 8,
    color: 'black',
  },
  dropdownshow: {
    borderRadius: 0,
    borderWidth: 0,
    borderTopWidth: 1
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  rememberMeContainer: {
    flex: 0.5,
    flexDirection: 'row',
    // justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 6
  },
  button: {
    // marginVertical: 8,
    backgroundColor: '#e11e30',
    borderRadius: 5
  },

  radioButtonContainer: {
    flex: 0.5,
    flexDirection: 'row', // Align items horizontally
    // borderWidth: 1,
    borderRadius: 10,
    // padding: 10,
    // marginVertical: 10,
    justifyContent: 'center',
    // alignItems: 'center', // Align items vertically within the container
  },

  redioButtonItemContainer: { width: '35%', flexDirection: 'row', alignItems: 'center' },

  Registration_num_TF: { padding: 10, borderWidth: 1, borderRadius: 5, marginVertical: 10 },

  radioButton: {

    backgroundColor: '#D3D3D3',
    // backgroundColor: 'black',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: 5,
    padding: 10
  },
  radioLabel: {
    color: '#000',
  },
});

export default styles;