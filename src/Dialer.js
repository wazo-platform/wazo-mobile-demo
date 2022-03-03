import React, { useReducer, useEffect } from 'react';
import { StyleSheet, Text, Image, View, Dimensions, Platform } from 'react-native';
import RNCallKeep from 'react-native-callkeep';
import ramdomUuid from 'uuid-random';
import { Container, FormControl, Input, Box, Button, Stack, NativeBaseProvider } from 'native-base';
import { RTCPeerConnection, RTCSessionDescription, MediaStream, mediaDevices, RTCView } from 'react-native-webrtc';
import { Ionicons } from '@expo/vector-icons';
import Wazo from '@wazo/sdk/lib/simple';
import AsyncStorage from '@react-native-async-storage/async-storage';

global.MediaStream = MediaStream;
global.RTCSessionDescription = RTCSessionDescription;
global.RTCPeerConnection = RTCPeerConnection;
global.navigator.mediaDevices = {
  ...global.navigator.mediaDevices,
  getUserMedia: mediaDevices.getUserMedia,
};

const styles = StyleSheet.create({
  back: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 16,
    bottom: 0
  },
  content: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  main: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  welcome: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  buttonsContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  button: {
    margin: 10,
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 100,
    width: 60,
    height: 60,
    backgroundColor: '#95CB39'
  },
  logout: {
    marginTop: 50,
    backgroundColor: 'red'
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  centeredText: {
    alignItems: 'center',
    textAlign: 'center',
  },
  localVideo: {
    width: 100,
    height: 100,
    position: 'absolute',
    right: 10,
    bottom: 60,
  },
  remoteVideo: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    margin: 0,
    padding: 0,
    aspectRatio: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    overflow: 'hidden',
    alignItems: 'center',
  },
});

const isIOS = Platform.OS === 'ios';

const reducer = (state, action) => ({ ...state, ...action});
const initialState = {
  ready: false,
  number: '',
  ringing: false,
  inCall: false,
  held: false,
  videoHeld: false,
  error: null,
  localStreamURL: null,
  remoteStreamURL: null,
};

let currentSession;

const Dialer = ({ onLogout }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);
  const { number, ringing, inCall, held, localStreamURL, remoteStreamURL, ready, videoHeld } = state;
  let currentCallId;
  let localStream;
  let remoteStream;

  const getCurrentCallId = () => {
    if (!currentCallId) {
      currentCallId = ramdomUuid().toLowerCase();
    }

    return currentCallId;
  };

  const init = async () => {
    await initializeWebRtc();
    await initializeCallKeep();
    displayLocalVideo();

    dispatch({ ready: true });
  };

  const initializeWebRtc = async () => {
    await Wazo.Phone.connect({ audio: true, video: true });

    Wazo.Phone.on(Wazo.Phone.ON_CALL_INCOMING, callSession => {
      setupCallSession(callSession);
      currentSession = callSession;
      dispatch({ ringing: true });

      // Tell callkeep that we a call is incoming for audio calls
      const { number } = callSession;
      RNCallKeep.displayIncomingCall(getCurrentCallId(), number, number, 'number', true);
    });
  };

  const initializeCallKeep = async () => {
    try {
      RNCallKeep.setup({
      ios: {
        appName: 'WazoReactNativeDemo',
      },
      android: {
        alertTitle: 'Permissions required',
        alertDescription: 'This application needs to access your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'ok',
      }
    });
      RNCallKeep.setAvailable(true);
    } catch (err) {
      console.error('initializeCallKeep error:', err.message);
    }

    // Add RNCallKit Events
    RNCallKeep.addEventListener('didReceiveStartCallAction', onNativeCall);
    RNCallKeep.addEventListener('answerCall', onAnswerCallAction);
    RNCallKeep.addEventListener('endCall', onEndCallAction);
    RNCallKeep.addEventListener('didDisplayIncomingCall', onIncomingCallDisplayed);
    RNCallKeep.addEventListener('didPerformSetMutedCallAction', onToggleMute);
    RNCallKeep.addEventListener('didPerformDTMFAction', onDTMF);
  };

  const getLocalStream = () => mediaDevices.getUserMedia({
    audio: true,
    video: {
      mandatory: {
        minWidth: 500,
        minHeight: 300,
        minFrameRate: 30
      },
      facingMode: 'user',
    }
  });

  const displayLocalVideo = () => {
    getLocalStream().then((stream) => {
      dispatch({ localStreamURL: stream.toURL() });
    });
  };

  const setupCallSession = callSession => {
    currentSession = callSession;

    Wazo.Phone.on(Wazo.Phone.ON_CALL_FAILED, (response, cause) => {
      dispatch({ error: cause, ringing: false, inCall: false });
    });

    Wazo.Phone.on(Wazo.Phone.ON_CALL_ENDED, () => {
      onCallTerminated();
    });

    Wazo.Phone.on(Wazo.Phone.ON_CALL_ACCEPTED, () => {
      const session = Wazo.Phone.getCurrentSipSession();
      // Setup local stream
      if (callSession.cameraEnabled) {
        const { peerConnection } = session.sessionDescriptionHandler;
        localStream = peerConnection.getLocalStreams().find(stream => !!stream.getVideoTracks().length);
        remoteStream = peerConnection.getRemoteStreams().find(stream => !!stream.getVideoTracks().length);

        dispatch({
          localStreamURL: localStream ? localStream.toURL() : null,
          remoteStreamURL: remoteStream ? remoteStream.toURL() : null,
        });

        // On Android display the app when answering a video call
        if (!isIOS) {
          RNCallKeep.backToForeground();
        }
      }
    });
  };

  const call = async (number, video = false) => {
    const session = await Wazo.Phone.call(number, video);
    setupCallSession(session);

    dispatch({ inCall: true, ringing: false });

    RNCallKeep.startCall(getCurrentCallId(), number, number, 'number', video);
  };

  const answer = withVideo => {
    dispatch({ inCall: true, ringing: false });
    RNCallKeep.setCurrentCallActive();

    Wazo.Phone.accept(currentSession, withVideo);
  };

  const hangup = async () => {
    const currentCallId = getCurrentCallId();
    if (!currentSession || !currentCallId) {
      return;
    }

    try {
      await Wazo.Phone.hangup(currentSession);
    } catch (e) {
      // Nothing to do
    }

    onCallTerminated();
  };

  const onCallTerminated = () => {
    if (currentCallId) {
      RNCallKeep.endCall(currentCallId);
    }
    dispatch({
      inCall: false,
      ringing: false,
      currentCallId: null,
      remoteStreamURL: null,
      localStreamURL: null,
    });

    if (remoteStream) {
      remoteStream.release();
      remoteStream = null;
    }
    if (localStream) {
      localStream.release();
      localStream = null;
    }

    currentCallId = null;
    currentSession = null;

    displayLocalVideo();
  };

  const onAnswerCallAction = ({ callUUID }) => {
    answer(true);

    RNCallKeep.setCurrentCallActive(callUUID);

    if (!isIOS && currentSession.cameraEnabled) {
      RNCallKeep.backToForeground();
    }
  };

  const onIncomingCallDisplayed = ({ callUUID, handle, fromPushKit }) => {
  };

  const onNativeCall = ({ handle }) => {
    if (inCall) {
      return;
    }

    call(handle);
  };

  const toggleHold = () => {
    Wazo.Phone[held ? 'unhold' : 'hold'](currentSession);
    dispatch({ held: !held });
  };

  const toggleVideoHold = () => {
    Wazo.Phone[videoHeld ? 'turnCameraOn' : 'turnCameraOff'](currentSession);
    dispatch({ videoHeld: !videoHeld });
  };

  const onEndCallAction = ({ callUUID }) => {
    hangup();
  };

  const onToggleMute = (muted) => {
    // Called when the system or the user mutes a call
    Wazo.Phone[muted ? 'mute' : 'unmute'](currentSession);
  };

  const onDTMF = (action) => {
    console.log('onDTMF', action);
  };

  const logout = async () => {
    if (currentSession) {
      await hangup();
    }
    Wazo.Auth.logout();
    await AsyncStorage.removeItem('token');

    onLogout();
  };

  useEffect(() => {
    init();
  }, []);

  const isVideo = currentSession && currentSession.cameraEnabled;

  return (
    <NativeBaseProvider>
      <Image
        style={styles.back}
        source={require('./assets/day.png')}
      />
      <Container style={styles.content}>
        {!isIOS && localStreamURL && (<RTCView mirror streamURL={localStreamURL} style={styles.localVideo} zOrder={1} />)}

        {remoteStreamURL && <RTCView objectFit="cover" streamURL={remoteStreamURL} style={styles.remoteVideo} zOrder={15} />}
   
        
        <Box style={styles.main}>
          <FormControl style={styles.form}>
            <Text style={styles.welcome}>Hello Miguel 👋</Text>
          <Stack>
            <FormControl.Label>Dial the extension you want to reach</FormControl.Label>
            <Input
              autoCapitalize="none"
              onChangeText={value => dispatch({ number: value })}
              value={number}
            />
          </Stack>
          </FormControl>

          {!ringing && !inCall && (
            <View style={styles.buttonsContainer}>
              <Button block disabled={!ready} onPress={() => call(number, false)} style={styles.button}>
                <Ionicons name="call" size={25} />
              </Button>
              <Button block disabled={!ready} onPress={() => call(number, true)} style={styles.button}>
              <Ionicons name="videocam" size={25} />
              </Button>
            </View>
          )}

          {ringing && (
            <View style={styles.buttonsContainer}>
              <Button onPress={() => answer(false)} style={styles.button}>
                <Text style={styles.centeredText}>
                  Answer audio call from {currentSession.number}
                  </Text>
              </Button>
              <Button onPress={() => answer(true)} style={styles.button}>
                <Text style={styles.centeredText}>
                  Answer video call from {currentSession.number}
                  </Text>
              </Button>
            </View>
          )}

          {inCall && (
            <View style={styles.buttonsContainer}>
              <Button block onPress={hangup} style={styles.button}>
                <Text>Hangup</Text>
              </Button>
              <Button block onPress={toggleHold} style={styles.button}>
                <Text>{held ? 'Unhold' : 'Hold' }</Text>
              </Button>
              {isVideo && (
                <Button block onPress={toggleVideoHold} style={styles.button}>
                  <Text>{videoHeld ? 'Camera On' : 'Camera Off' }</Text>
                </Button>
              )}
            </View>
          )}
        </Box>

        {isIOS && localStreamURL && (<RTCView mirror streamURL={localStreamURL} style={styles.localVideo} zOrder={1} />)}
        
        <Box>
          <Button transparent onPress={logout} style={styles.logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </Button>
        </Box>
      </Container>
    </NativeBaseProvider>
  );
};

export default Dialer;
