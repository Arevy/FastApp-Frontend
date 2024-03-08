import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { makeAutoObservable } from 'mobx';
import RootStore from './RootStore';
// import { userAppointments, createAppointment, updateAppointment, deleteAppointment } from '../graphql/queries'; // Import GraphQL queries

class AppointmentStore {
  appointments = [];

  private rootStore: RootStore;
  constructor(
    rootStore: RootStore,
    private apolloClient: ApolloClient<NormalizedCacheObject>
  ) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }
  // Example method to fetch appointments
  fetchAppointments = async () => {
    const query = gql`
      query ListAllAppointments {
        listAllAppointmentsShort {
          uuid
          date
          status
          // Add other fields as necessary
        }
      }
    `;

    try {
      const { data } = await this.apolloClient.query({ query });
      // Update state with fetched appointments
      console.log('data', data);
    } catch (error) {
      // Handle error
    }
  };

  // async fetchUserAppointments(userId) {
  //     const result = await userAppointments(userId); // GraphQL query
  //     this.appointments = result.data;
  // }

  // async scheduleAppointment(appointmentData) {
  //     const result = await createAppointment(appointmentData); // GraphQL mutation
  //     // Update store based on result
  // }

  // async modifyAppointment(appointmentId, newData) {
  //     await updateAppointment(appointmentId, newData); // GraphQL mutation
  //     // Update store based on result
  // }

  // async cancelAppointment(appointmentId) {
  //     await deleteAppointment(appointmentId); // GraphQL mutation
  //     // Update store based on result
  // }

  // Additional actions and computed values as needed
}

export default AppointmentStore;
