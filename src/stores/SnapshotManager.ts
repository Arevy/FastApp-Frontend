// import { autorun } from 'mobx';
// import RootStore from './RootStore';

// export const initializeSnapshot = (rootStore: RootStore) => {
//     autorun(() => {
//         const snapshot = {
//             userStore: rootStore.userStore,
//             serviceStore: rootStore.serviceStore,
//             appointmentStore: rootStore.appointmentStore,
//             authStore: rootStore.authStore,
//             // ... alte store-uri
//         };
//         console.log('Snapshot: ', snapshot);
//         // Salvarea sau gestionarea snapshot-ului după necesități
//     });
// };

import { autorun } from 'mobx';
import RootStore from './RootStore';
import apolloClient from 'src/apollo/config';

// const apolloClient = new ApolloClient({
//   uri: "http://your-graphql-endpoint.com/graphql",
//   cache: new InMemoryCache(),
// });

const rootStore = new RootStore(apolloClient);

autorun(() => {
  // Here you can access any property in the rootStore to trigger the reaction
  // For example, if you want to "track" userStore.users:
  console.log(rootStore.userStore.users);

  // If you need a full "snapshot" of the rootStore, you must serialize the stores manually
  const snapshot = {
    userStore: JSON.parse(JSON.stringify(rootStore.userStore)),
    serviceStore: JSON.parse(JSON.stringify(rootStore.serviceStore)),
    appointmentStore: JSON.parse(JSON.stringify(rootStore.appointmentStore)),
    authStore: JSON.parse(JSON.stringify(rootStore.authStore)),
    // ... serialize other stores as needed
  };

  console.log('Snapshot: ', snapshot);
  // Here you can save the snapshot in localStorage or send it to a server, etc.
});
