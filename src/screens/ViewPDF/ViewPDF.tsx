import React from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
// import { useParams } from '@react-navigation/native';
import { useRoute } from "@react-navigation/native"
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import styles from './styles';
const ViewPDF = () => {
  // const { id } = useParams();
  const route = useRoute();
  const { id, customername, mobileNumber, tyresize, customerstate, dealerstate, registrationdate } = route.params;
  const handledownloadpf = async () => {
    const htmlContent = `
  <html>
    <body>
      <h1>Customer Name: ${id}</h1>
      <p>Customer Name: ${customername}</p>
      <p>Mobile Number: ${mobileNumber}</p>
      <p>Warranty ID: ${id}</p>
      <p>Tyre Size: ${tyresize}</p>
      <p>Customer State: ${customerstate}</p>
      <p>Dealer State: ${dealerstate}</p>
      <p>Registration Date: ${registrationdate}</p>
    </body>
  </html>
`;
    const htmlFileName = `
<html>
    <body>
      <h1>${id}</h1>
    </body>
  </html>
`;
    // console.log(htmlContent);

    let options = {
      html: htmlContent,
      fileName: htmlFileName,
      directory: 'Download',
    };

    let file = await RNHTMLtoPDF.convert(options)
    console.log(file.filePath);
    Alert.alert("Download Successful", file.filePath);
  }
  return (
    <ScrollView>

      <View style={styles.displayMain}>
        <Text style={{ flexDirection: 'row', textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'black' }}>PDF Preview</Text>
        {/* Display fields */}
        {/* Example display fields, replace with your actual data */}
        <View style={styles.displayContainer}>
          <Text style={styles.displayText}>
            {' '}
            <Text style={styles.boldText}> Warranty Id :</Text>
          </Text>
          <Text style={styles.displayText}> {id}</Text>
        </View>

        <View style={styles.displayContainer}>
          <Text style={styles.displayText}>
            {' '}
            <Text style={styles.boldText}> Customer :</Text>
          </Text>
          <Text style={styles.displayText}> {customername}</Text>
        </View>

        <View style={styles.displayContainer}>
          <Text style={styles.displayText}>
            {' '}
            <Text style={styles.boldText}> Contact :</Text>
          </Text>
          <Text style={styles.displayText}> {mobileNumber}</Text>
        </View>

        <View style={styles.displayContainer}>
          <Text style={styles.displayText}>
            {' '}
            <Text style={styles.boldText}> Vehicle Number :</Text>
          </Text>
          <Text style={styles.displayText}> MH01SJ0809</Text>
        </View>

        <View style={styles.displayContainer}>
          <Text style={styles.displayText}>
            {' '}
            <Text style={styles.boldText}> Tyre Size :</Text>
          </Text>
          <Text style={styles.displayText}> {tyresize}</Text>
        </View>

        <View style={styles.displayContainer}>
          <Text style={styles.displayText}>
            {' '}
            <Text style={styles.boldText}>Customer State :</Text>
          </Text>
          <Text style={styles.displayText}> {customerstate}</Text>
        </View>

        <View style={styles.displayContainer}>
          <Text style={styles.displayText}>
            {' '}
            <Text style={styles.boldText}>Dealer State :</Text>
          </Text>
          <Text style={styles.displayText}> {dealerstate}</Text>
        </View>

        <View style={styles.displayContainer}>
          <Text style={styles.displayText}>
            {' '}
            <Text style={styles.boldText}>Registration Date :</Text>
          </Text>
          <Text style={styles.displayText}> {registrationdate}</Text>
        </View>

        {/* <TouchableOpacity
          style={styles.displaybutton}
          onPress={handledownloadpf}>
          <Text style={styles.buttonText}> Download </Text>
        </TouchableOpacity> */}
      </View>
      {/* <TouchableOpacity onPress={handledownloadpf} style={{ flexDirection: "row", justifyContent: "center", margin: 5 }}>
        <Text>Download</Text>
      </TouchableOpacity> */}
    </ScrollView>
  )
}

export default ViewPDF