import {
  ApolloClient,
  NormalizedCacheObject,
  ObservableQuery,
} from '@apollo/client';
import { makeAutoObservable } from 'mobx';
import RootStore from './RootStore';
import {
  CREATE_SERVICE,
  DELETE_SERVICE,
  LIST_ALL_SERVICES,
  TOGGLE_SERVICE_ACTIVE,
  UPDATE_SERVICE,
} from 'src/gql/queries/services';
import { IService, Service } from 'src/gql/types';

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
          this.services = response.data.listAllServices.map(
            (service: IService) => ({
              ...service,
              serviceId: service._id,
            })
          );
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
  async updateService(serviceId: string, name: string, category: string) {
    this.isLoading = true;
    try {
      const result = await this.apolloClient.mutate({
        mutation: UPDATE_SERVICE,
        variables: { _id: serviceId, name, category },
      });
      this.isLoading = false;
      if (result.data.updateService) {
        // The logic for updating the list of services or displaying a success message
      }
    } catch (error) {
      this.error = error;
      this.isLoading = false;
    }
  }

  async deleteService(serviceId: string) {
    this.isLoading = true;
    try {
      const result = await this.apolloClient.mutate({
        mutation: DELETE_SERVICE,
        variables: { _id: serviceId },
      });
      this.isLoading = false;
      if (result.data.deleteService.success) {
        // Remove the service from the local state or refresh the list
        this.fetchServices();
      }
    } catch (error) {
      this.error = error;
      this.isLoading = false;
    }
  }

  toggleServiceActive = async (serviceId: string) => {
    console.log('Attempting to toggle active status for ID:', serviceId);
    this.isLoading = true;
    try {
      const result = await this.apolloClient.mutate({
        mutation: TOGGLE_SERVICE_ACTIVE,
        variables: { _id: serviceId },
        refetchQueries: [{ query: LIST_ALL_SERVICES }],
      });

      console.log('Mutation result:', result);
      if (result.data.toggleServiceActive) {
        console.log('Service active status toggled successfully');
        return result.data.toggleServiceActive;
      }
    } catch (error) {
      console.error('Error toggling service active status', error);
      this.error = error;
    } finally {
      this.isLoading = false;
    }
  };
  createService = async (name: string, category: string, isActive: boolean) => {
    this.isLoading = true;
    try {
      const result = await this.apolloClient.mutate({
        mutation: CREATE_SERVICE,
        variables: { name, category, isActive },
      });
      this.isLoading = false;
      if (result.data) {
        this.services.push(result.data.createService);
      }
    } catch (error) {
      this.isLoading = false;
      this.error = error;
    }
  };
}

export default ServiceStore;
