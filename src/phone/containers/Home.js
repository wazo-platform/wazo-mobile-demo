import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import BackDay from "../../assets/back-day.svg";

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  back: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 16,
    bottom: 0
  },
  container: {
    width: 400,
    height: 400,
    borderRadius: 20
  },
  welcome: {
    fontSize: 30,
    alignSelf: "center"
  },
  input: {
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#000",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: 250,
    height: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    paddingLeft: 10,
    color: "#fff",
    alignSelf: "center"
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#95CC39",
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  }
});

const Home = () => {
  return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.main}>
      <BackDay style={styles.back} />
      <View style={styles.container}>
        <Text style={styles.welcome}>Hello Miguel </Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholderTextColor="#DAD9D9" placeholder="Type a number" />
        <View style={styles.buttons}>
          <Pressable style={styles.button}>
            <Ionicons size={35} name="call" />
          </Pressable>
          <Pressable style={styles.button}>
            <Ionicons size={35} name="videocam" />
          </Pressable>
        </View>
      </View>
    </View>
  </TouchableWithoutFeedback>
  );
};

export default Home;
