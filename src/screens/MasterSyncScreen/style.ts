import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 5,
    marginLeft: 10,
  },
  centeredView1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView1: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modal_container: {
    backgroundColor: '#d3d3d3',
    maxHeight: '800%', // Ensure the modal doesn't exceed 80% of the screen height
    padding: 22,
    justifyContent: 'center',
  },
  scrollViewContent: {
    flexGrow: 1, // Add padding to ensure all items are visible
  },
  container1: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingVertical: 300,
    backgroundColor: '#d3d3d3',
  },
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#d3d3d3',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    paddingLeft: 10,
  },

  button: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10
  },

  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10, // Adjusted marginLeft to move the red dot to the left
  },
  // iconContainer1: {
  //   width: 30,
  //   height: 30,
  //   backgroundColor: '#6cf17a',
  //   borderRadius: 15,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginLeft: -10, // Adjusted marginLeft to move the red dot to the left
  // },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 10, // Added paddingLeft to move text a bit to the right
  },

  syncAllButton: {
    width: '100%',
    paddingVertical: 15,
    marginVertical: 10,
    backgroundColor: '#E11E30',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  popupOKButton: {
    width: '100%',
    paddingVertical: 15,
    marginVertical: 10,
    backgroundColor: '#E11E30',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  syncAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default styles;