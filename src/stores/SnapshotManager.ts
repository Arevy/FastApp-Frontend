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
  // Aici poți accesa orice proprietate din rootStore pentru a declanșa reacția
  // De exemplu, dacă vrei să "urmărești" userStore.users:
  console.log(rootStore.userStore.users);

  // Dacă ai nevoie de un "snapshot" complet al rootStore, trebuie să serializezi manual store-urile
  const snapshot = {
    userStore: JSON.parse(JSON.stringify(rootStore.userStore)),
    serviceStore: JSON.parse(JSON.stringify(rootStore.serviceStore)),
    appointmentStore: JSON.parse(JSON.stringify(rootStore.appointmentStore)),
    authStore: JSON.parse(JSON.stringify(rootStore.authStore)),
    // ... serializează și alte store-uri după necesități
  };

  console.log('Snapshot: ', snapshot);
  // Aici poți salva snapshot-ul în localStorage sau să îl trimiți pe un server, etc.
});
