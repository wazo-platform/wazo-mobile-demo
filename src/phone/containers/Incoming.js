import React from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    zIndex: 50,
    top: 0,
    paddingTop: 50,
    width: "100%",
    alignItems: "center"
  },
  title: {
    fontSize: 20,
  },
  buttons: {
    display: "flex",
    flexDirection: "row"
  },
  button: {
    width: 50,
    height: 50,
    backgroundColor: "#95CC39",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  reject: {
    width: 50,
    height: 50,
    backgroundColor: "#FA3535",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  }
});

const Incoming = () => {
  return (
    <BlurView intensity={70} style={styles.modal} blurRadius={1}>
      <Text style={styles.title}>
        Incoming call from Johnny
      </Text>
      <View style={styles.buttons}>
        <Pressable style={styles.button}>
          <Ionicons size={30} color="#fff" name="call" />
        </Pressable>
        <Pressable style={styles.button}>
          <Ionicons size={30} color="#fff" name="videocam" />
        </Pressable>
        <Pressable style={styles.reject}>
          <MaterialCommunityIcons size={30} color="#fff" name="phone-hangup" />
        </Pressable>
      </View>
    </BlurView>
  );
};

export default Incoming;
