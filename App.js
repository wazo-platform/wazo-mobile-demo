import React, { useState } from 'react';
import { NativeBaseProvider } from 'native-base';

import Login from './src/Login';
import Dialer from './src/Dialer';

const defaultUsername = '';
const defaultServer = 'demo.wazo.community';

const App = () => {
  const [session, setSession] = useState(null);
  
  if (!session) {
    return <NativeBaseProvider><Login defaultServer={defaultServer} defaultUsername={defaultUsername} onLogin={setSession} /></NativeBaseProvider>
  }

  return <NativeBaseProvider><Dialer onLogout={() => setSession(null)} /></NativeBaseProvider>
};

export default App;
