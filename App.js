import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import Wazo from '@wazo/sdk/lib/simple';
import { StyleSheet, Text, View } from 'react-native';

import Login from './src/authentication/containers/Login';
import Home from './src/phone/containers/Home';
import Call from './src/phone/containers/Call';

const styles = StyleSheet.create({
  app: {
    flex: 1
  },
  credits: {
    color: '#DAD9D9',
    position: 'absolute',
    bottom: 20,
    left: 130,
    fontSize: 10
  } 
});

const App = () => {
  const [logged, setLogged] = useState(false);

  if (logged === false) {
    return (
      <View style={styles.app}>
        <Login handleLogin={setLogged} />
        <Text style={styles.credits}>images created by Jcomp (Freepik)</Text>
      </View>
    );
  } else if (logged === true) {
    return (
      <View style={styles.app}>
        <Home handleLogout={setLogged} />
        <Text style={styles.credits}>images created by Jcomp (Freepik)</Text>
      </View>
    );
  }; 
};

export default App;
