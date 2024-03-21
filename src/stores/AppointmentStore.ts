import {
  ApolloClient,
  NormalizedCacheObject,
  ObservableQuery,
} from '@apollo/client';

import { makeAutoObservable, toJS } from 'mobx';
import RootStore from './RootStore';
// import { userAppointments, createAppointment, updateAppointment, deleteAppointment } from '../graphql/queries'; // Import GraphQL queries
import {
  LIST_ALL_APPOINTMENTS, //->  trebuie folosita varianta scurta pe viitor
  LIST_ALL_APPOINTMENTS_FULL,
} from 'src/gql/queries/appointments';
import { Appointment } from 'src/gql/types';
class AppointmentStore {
  appointments: Appointment[] = [];
  isLoading: boolean = false;
  error: Error | null = null;
  private queryObservable: ObservableQuery<any> | null = null;

  private rootStore: RootStore;
  constructor(
    rootStore: RootStore,
    private apolloClient: ApolloClient<NormalizedCacheObject>
  ) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  // fetchAppointments = async () => {
  //   try {
  //     const { data } = await this.apolloClient.query({
  //       query: LIST_ALL_APPOINTMENTS,
  //     });
  //     this.appointments = data.listAllAppointmentsShort;
  //     // Update state with fetched appointments
  //     console.log("data", data);
  //   } catch (error) {
  //     console.error("Eroare la preluarea programărilor:", error);
  //   }
  // };

  fetchAppointments = async () => {
    this.isLoading = true;
    this.error = null;
    try {
      this.queryObservable = this.apolloClient.watchQuery({
        query: LIST_ALL_APPOINTMENTS_FULL,
        fetchPolicy: 'network-only',
        pollInterval: 600000,
      });

      this.queryObservable.subscribe({
        next: (response) => {
          this.appointments = response.data.listAllAppointmentsFull;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.error =
            error instanceof Error
              ? error
              : new Error('An unknown error occurred on subscribe');
        },
      });
    } catch (error) {
      console.error(
        'Eroare la inițializarea interogării pentru programări:',
        error
      );
      this.isLoading = false;
      this.error =
        error instanceof Error ? error : new Error('An unknown error occurred');
    }
  };

  stopPolling = () => {
    if (this.queryObservable) {
      this.queryObservable.stopPolling();
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
