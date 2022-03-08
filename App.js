import React, { useState } from 'react';
import { NativeBaseProvider } from 'native-base';

import Login from './src/Login';
import Dialer from './src/Dialer';

const defaultUsername = '';
const defaultServer = 'stack.dev.wazo.io';

function App() {
  const [session, setSession] = useState(null);

  return (
    <NativeBaseProvider>
      {session ? 
        <Login
          defaultServer={defaultServer}
          defaultUsername={defaultUsername}
          onLogin={setSession}
        />
        :
        <Dialer onLogout={() => setSession(null)} />
      }
    </NativeBaseProvider>
  )
};

export default App;
