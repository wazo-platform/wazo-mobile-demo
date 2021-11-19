import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet
} from "react-native";

import BackDay from "../../assets/back-day.svg";

const styles = StyleSheet.create({
  main: {
    alignItems: "center",
    justifyContent: "center"
  },
  back: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 16,
    bottom: 0
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    width: 400,
    height: 200,
    borderRadius: 20
  },
  welcome: {
    color: "#fff"
  },
  input: {
    backgroundColor: "#000",
    width: 250,
    height: 50,
    borderRadius: 15,
    paddingLeft: 10,
    color: "#fff"
  }
});

const Home = () => {
  return (
    <View style={styles.main}>
      <BackDay style={styles.back} />
      <View style={styles.container}>
        <Text style={styles.welcome}>Hello Miguel</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholderTextColor="#DAD9D9" placeholder="Type a number" />
      </View>
    </View>
  );
};

export default Home;
