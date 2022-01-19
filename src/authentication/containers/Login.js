import React, { useState } from 'react';
import { TextInput, Text, Pressable, StyleSheet, View } from 'react-native';
import Wazo from '@wazo/sdk/lib/simple';

import LogoSvg from '../../assets/white-logo-vertical.svg';
import BackSunset from '../../assets/back-sunset.svg';

Wazo.Auth.init('wazo-mobile-demo');

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
  form: {},
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
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('');

  const authenticate = async (username, password, server) => {
    try {
      Wazo.Auth.setHost(server);

      session = await Wazo.Auth.logIn(username, password).catch();
      session.server = server;
      setSessionOnStorage(session);
    } catch (e) {
      displayAuthError(e);
    }
  };

  const handleLogin = () => {
    authenticate(email, password, server);
    setEmail('');
    setPassword('');
    setServer('');
  };

  return (
    <View style={styles.container}>
      <BackSunset style={styles.back} />
      <View style={styles.main}>
        <LogoSvg style={styles.logo} width={300} height={300} />
        <View style={styles.form}>
          <Text style={styles.labels}>user e-mail address</Text>
          <TextInput
            style={styles.inputs}
            onChangeText={setEmail}
            placeholder='miguel@wazo.io'
            placeholderTextColor='#DAD9D9'
          />
          <Text style={styles.labels}>password</Text>
          <TextInput
            style={styles.inputs}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder='****'
            placeholderTextColor='#DAD9D9'
          />
          <Text style={styles.labels}>server domain name</Text>
          <TextInput
            style={styles.inputs}
            onChangeText={setServer}
            placeholder='server.wazo.io'
            placeholderTextColor='#DAD9D9'
          />
        </View>
        <Pressable onPress={handleLogin} style={styles.submit}>
          <Text style={styles.submitText}>login</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Login;
