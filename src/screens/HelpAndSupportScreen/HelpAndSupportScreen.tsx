import {  View, Text, TouchableOpacity, Linking, Image } from 'react-native';
// import { ThemedView } from '@/components/ThemedView';
import styles from './style';

export default function HelpAndSupport() {
  const handleWhatsAppPress = () => {
    const phoneNumber = '+918591874895'; 
    const url = 'https://wa.me/${+918591874895}';
    
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.contactContainer}>
        <Text style={styles.contactText}>Contact Us</Text>
      </View>
      
      <View style={styles.boxContainer}>
        <View style={styles.box}>
          <Text style={styles.label}>Contact No:</Text>
          <Text style={[styles.field, styles.redText]}>+91 8591874895</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.label}>WhatsApp:</Text>
          <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsAppPress}>
            <Text style={styles.whatsappText}>Send WhatsApp Msg</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.box}>
          <Text style={styles.label}>Email:</Text>
          <Text style={[styles.field, styles.redText]}>warrantyuat.yokohama-oht.com</Text>
        </View>
      </View>
      
      <View style={styles.checklogoContainer}>
        <Image source={require('../../assets/images/logo/tclogo.png')} style={{height:50,width: 100}} resizeMode='contain' />
        <Text style={styles.powerByText}>Powered by <Text style={styles.checktext}>Check</Text><Text style={styles.exploretext}>Explore</Text> </Text>
      </View>
    
    </View>
  );
}

