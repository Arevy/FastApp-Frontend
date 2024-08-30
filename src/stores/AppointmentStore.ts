import {
  ApolloClient,
  ApolloQueryResult,
  FetchResult,
  NormalizedCacheObject,
  ObservableQuery,
} from '@apollo/client';

import { makeAutoObservable, observable, toJS } from 'mobx';
import RootStore from './RootStore';
// import { userAppointments, createAppointment, updateAppointment, deleteAppointment } from '../graphql/queries'; // Import GraphQL queries
import {
  // LIST_ALL_APPOINTMENTS, //->  trebuie folosita varianta scurta pe viitor
  LIST_ALL_APPOINTMENTS_FULL,
  LIST_USER_APPOINTMENTS,
  FETCH_SERVICE_APPOINTMENTS,
  CREATE_APPOINTMENTS,
  UPDATE_APPOINTMENTS,
  DELETE_APPOINTMENTS,
  CREATE_APPOINTMENT,
} from 'src/gql/queries/appointments';
import {
  // CancelAppointmentOutput,
  FetchUserAppointmentsOutput,
  IAppointment,
  ModifyAppointmentInput,
  ModifyAppointmentOutput,
  ScheduleAppointmentInput,
  ScheduleAppointmentOutput,
} from 'src/gql/types';
class AppointmentStore {
  appointments: IAppointment[] = [];
  isLoading: boolean = false;
  error: Error | null | unknown | any = null;
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

  async fetchAppointments() {
    this.isLoading = true;
    this.error = null;
    const userType = this.rootStore.authStore.userData.userType;
    const currentUserId = this.rootStore.authStore.userData._id;
    const currentServiceId = this.rootStore.authStore.userData.serviceId;

    try {
      let result;

      if (userType === 'NORMAL_USER') {
        result = await this.apolloClient.query({
          query: LIST_USER_APPOINTMENTS,
          variables: { userId: currentUserId },
          fetchPolicy: 'network-only',
        });
        this.appointments = result.data.userAppointments;
      } else if (userType === 'SERVICE_USER') {
        result = await this.apolloClient.query({
          query: FETCH_SERVICE_APPOINTMENTS,
          variables: { serviceId: currentServiceId },
          fetchPolicy: 'network-only',
        });
        this.appointments = result.data.fetchServiceAppointments;
        console.log(this.appointments);
        console.log(result.data.fetchServiceAppointments);
      } else if (userType === 'ADMIN_USER') {
        result = await this.apolloClient.query({
          query: LIST_ALL_APPOINTMENTS_FULL,
          fetchPolicy: 'network-only',
        });
        this.appointments = result.data.listAllAppointmentsFull;
      }

      this.isLoading = false;
    } catch (error) {
      console.error('Failed to load appointments:', error);
      this.error = error;
      this.isLoading = false;
    }
  }

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
  async createAppointment(
    userId: string,
    serviceId: string,
    date: string,
    status: string
  ) {
    this.error = null;
    this.isLoading = true;
    try {
      const result = await this.apolloClient.mutate({
        mutation: CREATE_APPOINTMENT,
        variables: { userId, serviceId, date, status },
      });
      this.isLoading = false;
      if (result.data) {
        this.appointments.push(result.data.createAppointment);
      }
    } catch (error) {
      this.isLoading = false;
      console.error('Failed to load appointments:', error);
      this.error = error;
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
            _id: appointmentId, // Change to _id
            newDate: isoDate,
            newStatus: newData.newStatus || '',
          },
        });

      console.log('modifyAppointment', appointmentId, newData, result);
      if (result.data) {
        await this.fetchAppointments();
        console.log('Update successful:', result.data.updateAppointment);
        this.appointments = this.appointments.map((appointment) =>
          appointment._id === appointmentId // Change to _id
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
        mutation: DELETE_APPOINTMENTS, // Change to deleteAppointment
        variables: { _id: appointmentId }, // Change to _id
      });
      console.log('__+__', appointmentId, this.appointments);
      this.appointments = this.appointments.filter(
        (appointment) => appointment._id !== appointmentId // Change to _id
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
