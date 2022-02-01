import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import Wazo from '@wazo/sdk/lib/simple';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import BackDay from '../../assets/back-day.svg';

import Incoming from './Incoming';

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
  },
  back: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 16,
    bottom: 0
  },
  container: {
    width: 400,
    height: 400,
    borderRadius: 20,
    justifyContent: 'center'
  },
  welcome: {
    fontSize: 30,
    alignSelf: 'center'
  },
  input: {
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 250,
    height: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    paddingLeft: 10,
    color: '#fff',
    alignSelf: 'center'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: '#95CC39',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
  logout: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#FA3535',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutDisplay: {
    alignSelf: 'flex-end',
    marginRight: 40,
    paddingTop: 50
  }
});

const Home = ({ handleLogout }) => {
  const [displayName, setName] = useState('');

  const getName = async () => {
    const firstName = await SecureStore.getItemAsync('firstname');
    setName(firstName)
  };
  
  const logoutUser = async () => {
    try {
      await Wazo.Auth.logout();

      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('firstname');

    } catch (e) {
      console.log('error:', e);
    }
  }

  const logOut = () => {
    logoutUser();
    handleLogout(false);
  };

  useEffect(() => {
    getName();
  });

  return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.main}>
      {/* <Incoming /> */}
      <BackDay style={styles.back} />
      <View style={styles.logoutDisplay}>
        <Pressable onPress={logOut} style={styles.logout}>
          <Ionicons size={25} name='power' color='#fff' />
        </Pressable>
      </View>
      <View style={styles.container}>
        <Text style={styles.welcome}>Hello {displayName}</Text>
        <TextInput style={styles.input} keyboardType='numeric' placeholderTextColor='#DAD9D9' placeholder='Type a number' />
        <View style={styles.buttons}>
          <Pressable style={styles.button}>
            <Ionicons size={35} name='call' />
          </Pressable>
          <Pressable style={styles.button}>
            <Ionicons size={35} name='videocam' />
          </Pressable>
        </View>
      </View>
    </View>
  </TouchableWithoutFeedback>
  );
};

export default Home;
