import {
  ApolloClient,
  ApolloQueryResult,
  FetchResult,
  NormalizedCacheObject,
  ObservableQuery,
} from '@apollo/client';

import { makeAutoObservable, toJS } from 'mobx';
import RootStore from './RootStore';
// import { userAppointments, createAppointment, updateAppointment, deleteAppointment } from '../graphql/queries'; // Import GraphQL queries
import {
  LIST_ALL_APPOINTMENTS, //->  trebuie folosita varianta scurta pe viitor
  LIST_ALL_APPOINTMENTS_FULL,
  LIST_USER_APPOINTMENTS,
  CREATE_APPOINTMENTS,
  UPDATE_APPOINTMENTS,
  DELETE_APPOINTMENTS,
} from 'src/gql/queries/appointments';
import {
  Appointment,
  CancelAppointmentOutput,
  FetchUserAppointmentsOutput,
  ModifyAppointmentInput,
  ModifyAppointmentOutput,
  ScheduleAppointmentInput,
  ScheduleAppointmentOutput,
} from 'src/gql/types';
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

  async fetchUserAppointments(userId: string) {
    this.isLoading = true;
    try {
      const result: ApolloQueryResult<FetchUserAppointmentsOutput> =
        await this.apolloClient.query({
          query: LIST_USER_APPOINTMENTS,
          variables: { userId },
        });
      this.appointments = result.data.userAppointments;
      this.isLoading = false;
    } catch (error) {
      console.error('Failed to fetch user appointments', error);
      this.isLoading = false;
    }
  }

  async scheduleAppointment(appointmentData: ScheduleAppointmentInput) {
    this.isLoading = true;
    try {
      const result: FetchResult<ScheduleAppointmentOutput> =
        await this.apolloClient.mutate({
          mutation: CREATE_APPOINTMENTS,
          variables: appointmentData,
        });
      if (result.data) {
        this.appointments.push(result.data.createAppointment);
      }
      this.isLoading = false;
    } catch (error) {
      console.error('Failed to schedule appointment', error);
      this.isLoading = false;
    }
  }

  async modifyAppointment(
    appointmentId: string,
    newData: ModifyAppointmentInput
  ) {
    this.isLoading = true;
    try {
      let isoDate;
      if (newData.newDate) {
        const date = new Date(newData.newDate);
        if (!isNaN(date.getTime())) {
          isoDate = date.toISOString();
        } else {
          throw new Error('Invalid date format'); // or handle invalid date more gracefully
        }
      }

      const result: FetchResult<ModifyAppointmentOutput> =
        await this.apolloClient.mutate({
          mutation: UPDATE_APPOINTMENTS,
          variables: {
            uuid: appointmentId,
            newDate: isoDate,
            newStatus: newData.newStatus || '',
          },
        });

      console.log('modifyAppointment', appointmentId, newData, result);
      if (result.data) {
        this.appointments = this.appointments.map((appointment) =>
          appointment.uuid === appointmentId
            ? { ...appointment, ...result?.data?.updateAppointment }
            : appointment
        );
      }
      this.isLoading = false;
    } catch (error) {
      console.error('Failed to modify appointment', error);
      this.isLoading = false;
    }
  }

  async cancelAppointment(appointmentId: string) {
    this.isLoading = true;
    try {
      await this.apolloClient.mutate({
        mutation: DELETE_APPOINTMENTS,
        variables: { uuid: appointmentId }, // Aici a fost schimbat de la `id` la `uuid`
      });
      console.log('__+__', appointmentId, this.appointments);
      this.appointments = this.appointments.filter(
        (appointment) => appointment.uuid !== appointmentId
      );
      this.isLoading = false;
    } catch (error) {
      console.error('Failed to cancel appointment', error);
      this.isLoading = false;
    }
  }
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
