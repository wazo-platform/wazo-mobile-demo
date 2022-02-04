import React, { useState } from 'react';
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

  if (logged) {
    return (
      <View style={styles.app}>
        <Home handleLogin={setLogged} />
        {/* <Call /> */}
        <Text style={styles.credits}>images created by Jcomp (Freepik)</Text>
      </View>
    );
  };

  return (
    <View style={styles.app}>
      <Login handleLogin={setLogged} />
      <Text style={styles.credits}>images created by Jcomp (Freepik)</Text>
    </View>
  ); 
};

export default App;
