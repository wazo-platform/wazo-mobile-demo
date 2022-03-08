import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Platform } from 'react-native';
import { NativeBaseProvider, Container, Text, Content, FormControl, Stack, Box, Input, Button, Spinner, Footer } from 'native-base';
import Wazo from '@wazo/sdk/lib/simple';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VoipPushNotification from 'react-native-voip-push-notification';
import getApiClient from '@wazo/sdk/lib/service/getApiClient';

const isIOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  back: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 16,
    bottom: 0
  },
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  logoContainer: {
  },
  logo: {
    width: 200,
    height: 200
  },
  form: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300
  },
  button: {
    marginTop: 50,
    backgroundColor: '#95cb39',
    width: 150,
    height: 50
  },
  login: {
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  footer: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  spinner: {
    margin: 10
  },
  error: {
    marginTop: 10,
    textAlign: 'center',
    color: '#fc3503',
  },
  credit: {
    textAlign: 'center',
    color: '#fff'
  }
});

const Login = ({ defaultUsername = '', defaultPassword = '', defaultServer = '', onLogin = () => {} }) => {
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState(defaultPassword);
  const [server, setServer] = useState(defaultServer);
  const [error, setError] = useState(null);
  const [authenticating, setAuthenticating] = useState(false);
  let apnsToken;

  useEffect(() => {
    init();
  }, []);

  const init = () => {

    if (isIOS) {
      VoipPushNotification.addEventListener('register', async (token) => {
        apnsToken = token;
        console.log('setting apnsToken', apnsToken);
      });
    } 

    authenticateFromToken();
  };

  const authenticateFromToken = async () => {
    const host = await AsyncStorage.getItem('host');
    const token = await AsyncStorage.getItem('token');
    if (host) {
      setServer(host);
    }
    if (!host || !token) {
      return;
    }

    setAuthenticating(true);
    setError(null);
    Wazo.Auth.init();
    Wazo.Auth.setHost(host);

    const session = await Wazo.Auth.validateToken(token);
    if (session) {
      return authenticationSuccess(session, host);
    }

    setAuthenticating(false);
  };

  const login = async () => {
    setAuthenticating(true);
    setError(null);
    Wazo.Auth.init();
    Wazo.Auth.setHost(server);

    try {
      const session = await Wazo.Auth.logIn(username, password);
      authenticationSuccess(session, server);
    } catch (e) {
      setError('Authentication failed');
      setAuthenticating(false);
    }
  };

  const authenticationSuccess = async (session, host) => {
    await AsyncStorage.setItem('host', host);
    await AsyncStorage.setItem('token', session.token);

    if (apnsToken) {
      try {
         await Wazo.api.auth.removeDeviceToken(session.uuid);
      } catch (_) {
        // Avoid to fail when trying to remove a non-existent token
      }
      await getApiClient().auth.sendDeviceToken(session.session, null, apnsToken);
    }

    // Store information when authenticating from token
    Wazo.Auth.setHost(host);

    setAuthenticating(false);
    onLogin(session);
  };

  return (
    <NativeBaseProvider>
      <Image
        style={styles.back}
        source={require('./assets/dawn.png')}
      />
      <Container style={styles.container}>
        <View style={styles.form}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require('./assets/wazo-platform-square-dark.png')}
            />
          </View>

          <FormControl>
          <Stack>
            <FormControl.Label style={styles.label}>Username</FormControl.Label>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setUsername}
              value={username}
              onSubmitEditing={login}
            />
          </Stack>
          <Stack>
            <FormControl.Label style={styles.label}>Password</FormControl.Label>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setPassword}
              value={password}
              secureTextEntry
              onSubmitEditing={login}
            />
          </Stack>
          <Stack>
            <FormControl.Label style={styles.label}>Server</FormControl.Label>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType={isIOS ? 'url' : 'email-address'}
              value={server}
              onChangeText={setServer}
              onSubmitEditing={login}
            />
          </Stack>
          </FormControl>

          {authenticating && <Spinner style={styles.spinner} color="#95CB39" />}
          {!!error && <Text full style={styles.error}>{error}</Text>}
        </View>

        <Box style={styles.footer}>
          <Button full disabled={authenticating} onPress={login} style={styles.button}>
            <Text style={styles.login}>Login</Text>
          </Button>
        </Box>
      </Container>
      <Text style={styles.credit}>images created by jcomp</Text>
    </NativeBaseProvider>
  );
};

export default Login;
