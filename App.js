import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Login from "./src/authentication/containers/Login";

const styles = StyleSheet.create({
  credits: {
    color: "#DAD9D9",
    textAlign: "center",
    marginTop: "20%",
    fontSize: 10
  } 
})

export default function App() {
  return (
    <View>
      <Login />
      <StatusBar style="auto" />
      <Text style={styles.credits}>images created by Jcomp (Freepik)</Text>
    </View>
  );
};
