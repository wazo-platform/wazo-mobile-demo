import React, { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { TextInput, Text, Pressable, StyleSheet, View, KeyboardAvoidingView, Keyboard } from 'react-native';
import Wazo from '@wazo/sdk/lib/simple';

import LogoSvg from '../../assets/white-logo-vertical.svg';
import BackSunset from '../../assets/back-sunset.svg';
import { TouchableWithoutFeedback } from 'react-native-web';

Wazo.Auth.init('wazo-mobile-demo');
const isIOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  back: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 16,
    bottom: 0,
  },
  main: {
    backgroundColor: 'transparent',
    width: 400,
    height: 700,
    marginTop: 100,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labels: {
    textTransform: 'uppercase',
    color: '#fff',
  },
  inputs: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#fff',
    height: 40,
    width: 300,
    marginBottom: 30,
    paddingLeft: 10,
    color: '#fff'
  },
  submit: {
    backgroundColor: '#95CC39',
    padding: 10,
    width: 100,
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 30,
  },
  submitText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
  },
  errorContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 20,
    borderRadius: 50
  },
  error: {
    color: 'red'
  }
});

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState('miguel@wazo.io');
  const [password, setPassword] = useState('secret');
  const [server, setServer] = useState('stack.dev.wazo.io');
  const [error, setError] = useState('');

  const authenticate = async (username, password, server) => {
    try {
      Wazo.Auth.setHost(server);

      const newSession = await Wazo.Auth.logIn(username, password);
      await SecureStore.setItemAsync('token', newSession.token);
      await SecureStore.setItemAsync('firstname', newSession.profile.firstName);

    } catch (e) {
      const error = JSON.parse(e.message);
      const errorMessage = error.reason[0];
      setError(errorMessage);
    };
  };

  const logIn = async () => {
      await authenticate(email, password, server);
      if (!error) {
        handleLogin(true);
      };
  };

  return ( 
    <KeyboardAvoidingView behavior={isIOS ? 'padding' : 'height'} style={styles.container}>
      <BackSunset style={styles.back} />
      <View style={styles.main}>
        <LogoSvg style={styles.logo} width={300} height={300} />
        <View style={styles.form}>
          <Text style={styles.labels}>user e-mail address</Text>
          <TextInput
            style={styles.inputs}
            onChangeText={setEmail}
            value={email}
            placeholder="miguel@wazo.io"
            placeholderTextColor="#DAD9D9"
            autoCapitalize="none"
          />
          <Text style={styles.labels}>password</Text>
          <TextInput
            style={styles.inputs}
            onChangeText={setPassword}
            value={password}
            secureTextEntry={true}
            placeholder="****"
            placeholderTextColor="#DAD9D9"
          />
          <Text style={styles.labels}>server domain name</Text>
          <TextInput
            style={styles.inputs}
            onChangeText={setServer}
            value={server}
            placeholder='server.wazo.io'
            keyboardType={isIOS ? 'url' : 'email-address'}
            placeholderTextColor="#DAD9D9"
            autoCapitalize="none"
          />
        </View>
        <Pressable onPress={logIn} style={styles.submit}>
          <Text style={styles.submitText}>login</Text>
        </Pressable>
        {error ?
          <View style={styles.errorContainer}>
            <Text style={styles.error}>{error}</Text>

          </View>
        : null}
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
