import React from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet
} from "react-native";

import LogoSvg from "../../assets/wazo-platform.svg";
import BackSunset from "../../assets/back-sunset.svg";

const styles = StyleSheet.create({
  back: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 16,
    bottom: 0
  },
  main: {
    backgroundColor: "#fff",
    width: 400,
    height: 700,
    marginTop: 100,
    borderRadius: 20,
    alignItems:"center",
    justifyContent: "center"
  },
  container: {
    justifyContent: "center",
    alignItems:"center",
  },
  form: {
  },
  labels: {
    textTransform: "uppercase"
  },
  inputs: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    height: 40,
    width: 250,
    marginBottom: 10
  }
})

const Login = () => {
  return (
    <View style={styles.container}>
      <BackSunset style={styles.back}/>
        <View style={styles.main}>
          <LogoSvg style={styles.logo} width={300} height={300}/>
          <View style={styles.form}>
            <Text style={styles.labels}>user e-mail address</Text>
            <TextInput style={styles.inputs} placeholder="miguel@wazo.io"/>
            <Text style={styles.labels}>password</Text>
            <TextInput style={styles.inputs} secureTextEntry={true} placeholder="****"/>
            <Text style={styles.labels}>server domain name</Text>
            <TextInput style={styles.inputs} placeholder="server.wazo.io"/>
          </View>
          <Pressable>
            <Text>login</Text>
          </Pressable>
        </View>
    </View>
  );
};

export default Login;