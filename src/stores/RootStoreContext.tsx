import React from 'react';
import RootStore from './RootStore';
// import { ApolloClient, InMemoryCache } from '@apollo/client';
import apolloClient from 'src/apollo/config';

// Initialize Apollo Client

// Initialize RootStore with Apollo Client
// const rootStore = new RootStore(apolloClient);

// // Export RootStore instance
// export default rootStore;
export const RootStoreContext = React.createContext<RootStore>(new RootStore(apolloClient));

export const useStores = () => React.useContext(RootStoreContext);