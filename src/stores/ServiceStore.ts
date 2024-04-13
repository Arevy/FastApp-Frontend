import {
  ApolloClient,
  NormalizedCacheObject,
  ObservableQuery,
} from '@apollo/client';
import { makeAutoObservable } from 'mobx';
import RootStore from './RootStore';
import {
  DELETE_SERVICE,
  LIST_ALL_SERVICES,
  TOGGLE_SERVICE_ACTIVE,
} from 'src/gql/queries/services';
import { Service } from 'src/gql/types';

class ServiceStore {
  services: Service[] = [];
  isLoading: boolean = false;
  error: Error | null | unknown | any = null;
  private queryObservable: ObservableQuery<any> | null = null;

  constructor(
    private rootStore: RootStore,
    private apolloClient: ApolloClient<NormalizedCacheObject>
  ) {
    makeAutoObservable(this);
  }

  fetchServices = async () => {
    this.isLoading = true;
    this.error = null;
    try {
      this.queryObservable = this.apolloClient.watchQuery({
        query: LIST_ALL_SERVICES,
        fetchPolicy: 'network-only',
        pollInterval: 600000, // 10 minutes
      });

      this.queryObservable.subscribe({
        next: (response) => {
          this.services = response.data.listAllServices;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = error;
          this.isLoading = false;
        },
      });
    } catch (error) {
      this.isLoading = false;
      this.error =
        error instanceof Error ? error : new Error('An unknown error occurred');
    }
  };

  stopPolling = () => {
    this.queryObservable?.stopPolling();
  };

  deleteService = async (serviceId: string) => {
    this.isLoading = true;
    try {
      const result = await this.apolloClient.mutate({
        mutation: DELETE_SERVICE,
        variables: { serviceId },
      });

      if (result.data.deleteService.success) {
        this.services = this.services.filter(
          (service) => service.serviceId !== serviceId
        );
      } else {
        console.error(result.data.deleteService.message);
      }
    } catch (e) {
      console.error('An error occurred while deleting the service', e);
      this.error = e;
    } finally {
      this.isLoading = false;
    }
  };

  toggleServiceActive = async (serviceId: string) => {
    this.isLoading = true;
    try {
      const result = await this.apolloClient.mutate({
        mutation: TOGGLE_SERVICE_ACTIVE,
        variables: { serviceId },
        refetchQueries: [{ query: LIST_ALL_SERVICES }], // Reîmprospătează lista de servicii după mutație
      });

      if (result.data.toggleServiceActive) {
        console.log('Service active status toggled successfully');
        return result.data.toggleServiceActive;
      }
    } catch (error) {
      console.error('Error toggling service active status', error);
    } finally {
      this.isLoading = false;
    }
  };

  // async addService(serviceData) {
  //     const result = await createService(serviceData); // GraphQL mutation
  //     // Update store based on result
  // }

  // async updateService(serviceId, newData) {
  //     await updateService(serviceId, newData); // GraphQL mutation
  //     // Update store based on result
  // }

  // async removeService(serviceId) {
  //     await deleteService(serviceId); // GraphQL mutation
  //     // Update store based on result
  // }

  // Additional actions and computed values as needed
}

export default ServiceStore;
