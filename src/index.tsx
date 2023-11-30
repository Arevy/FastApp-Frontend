
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import apolloClient from './apollo/config';
import { ApolloProvider } from '@apollo/client';

import * as serviceWorker from './serviceWorker';
import AuthContextProvider from './AuthContext'; // Import AuthProvider

import App from './App';
import React from 'react';


const container = document.getElementById('root');

if (container) {
	const root = createRoot(container);

	root.render(
		<AuthContextProvider>
			<ApolloProvider client={apolloClient}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</ApolloProvider>
		</AuthContextProvider>,
	);

	serviceWorker.unregister();
} else {
	console.error("Container with id 'root' not found.");
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
