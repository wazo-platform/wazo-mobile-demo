import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import background from '../../assets/day.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  calling: {
    zIndex: 100,
    alignItems: 'center',
  },
  info: {
    alignItems: 'center',
    marginBottom: 35
  },
  callee:{
    fontSize: 30,
    marginBottom: 25,
    fontWeight: 'bold'
  },
  timer: {
    fontSize: 20
  },
  action: {
    margin: 10,
    backgroundColor: '#1CBC49',
    borderStyle: 'solid',
    borderColor: '#fff',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    width: 60,
    height: 60
  },
  actionOff: {
    margin: 10,
    backgroundColor: 'rgba(77, 77, 77, 0.33)',
    borderStyle: 'solid',
    borderColor: '#fff',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    width: 60,
    height: 60
  },
  hangup: {
    width: 70,
    height: 70,
    marginTop: 50,
    backgroundColor: '#FA3535',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  back: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 16,
    bottom: 0
  }
});

const Call = () => {
  const [mute, setMute] = useState(false);

  const handleMute = () => {
    setMute(!mute);
  };

  return (
    <View style={styles.container}>
      <View style={styles.calling}>
        <View style={styles.info}>
          <Text style={styles.callee}>Johnny Monnay</Text>
          <Text style={styles.timer}>03:14</Text>
        </View>
        <View>
          <Pressable style={mute ? styles.actionOff : styles.action } onPress={handleMute} >
            {mute ? <Ionicons color='#fff' size={45} name='mic-off-outline' /> : <Ionicons color="#fff" size={45} name="mic-outline" /> }
          </Pressable>
        </View>
        <Pressable style={styles.hangup}>
          <Ionicons 
            name='call' 
            size={40} 
            color='#fff'
            style={[{
              transform: [{ rotate: '135deg' }]
            }]}
          />
        </Pressable>
      </View>
      <Image style={styles.back} source={background} blurRadius={6} />
    </View>
  );
};

export default Call;
