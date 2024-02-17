import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import apolloClient from './apollo/config';
import { ApolloProvider } from '@apollo/client';

import * as serviceWorker from './serviceWorker';
// import AuthContextProvider from './AuthContext'; // Import AuthProvider // don't use

import App from './App';
import React from 'react';
import { RootStoreContext } from './stores/RootStoreContext';
import RootStore from './stores/RootStore';

// Initialize the root store
const rootStore = new RootStore(apolloClient);

// Expose the store to the window object for debugging
if (process.env.NODE_ENV === 'development') {
  window.store = {
    rootStore,
    // Add other stores if needed
  };
}

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  root.render(
    <RootStoreContext.Provider value={new RootStore(apolloClient)}>
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApolloProvider>
    </RootStoreContext.Provider>
  );

  serviceWorker.unregister();
} else {
  console.error('Container with id \'root\' not found.');
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
