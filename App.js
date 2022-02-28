import React, { useState } from 'react';

import Login from './src/Login';
import Dialer from './src/Dialer';

const defaultUsername = '';
const defaultServer = 'demo.wazo.community';

const App = () => {
  const [session, setSession] = useState(null);

  if (!session) {
    return <Login defaultServer={defaultServer} defaultUsername={defaultUsername} onLogin={setSession} />
  }

  return <Dialer onLogout={() => setSession(null)} />
};

export default App;
