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

const actions = [
  {
    name: 'add',
    icon: <Ionicons name='add-outline' size={50}/>
  },
  {
    name: 'hold',
    icon: <Ionicons name='play-outline' size={40}/>,
    alt: <Ionicons name='pause-outline' size={50}/>
  },
  {
    name: 'speaker',
    icon: <Ionicons name='volume-high' size={40}/>
  },
  {
    name: 'mute',
    icon: <Ionicons name='mic-outline' size={50}/>,
    alt: <Ionicons name='mic-off-outline' size={50}/>
  },
  {
    name: 'keys',
    icon: <Ionicons name='apps-outline' size={40}/>
  },
  {
    name: 'transfer',
    icon: <Ionicons name='arrow-forward' size={50}/>
  }
];

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
    backgroundColor: '#fff',
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
  const [hold, setHold] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  const handleActions = ( name ) => {
    if (name === 'mute') {
      setMute(!mute);
    } else if (name === 'hold') {
      setHold(!hold);
    } else if (name === 'speaker') {
      setSpeaker(!speaker);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.calling}>
        <View style={styles.info}>
          <Text style={styles.callee}>Johnny Monnay</Text>
          <Text style={styles.timer}>03:14</Text>
        </View>
        <FlatList
          data={actions}
          renderItem={({ item }) => (
            <Pressable style={styles.action}>{item.icon}</Pressable>
          )}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
        />
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
