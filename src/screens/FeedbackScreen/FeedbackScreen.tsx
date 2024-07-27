import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './style';

const FeedbackScreen = () => {
  const [message, setMessage] = useState('');
  const maxCharacters = 230;

  const onChangeText = (text) => {

    if (text.length <= maxCharacters) {
      setMessage(text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Feedback</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.outerLabel}>Message</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Type your message here..."
          placeholderTextColor="black"
          multiline
          value={message}
          onChangeText={onChangeText}
        />
        <Text style={styles.charCount}>{message.length}/{maxCharacters} characters</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>SEND</Text>
      </TouchableOpacity>
    </View>
  );
};


export default FeedbackScreen;