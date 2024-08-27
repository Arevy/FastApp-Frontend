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
  LIST_SERVICES_BY_CATEGORY,
  TOGGLE_SERVICE_ACTIVE,
  UPDATE_SERVICE,
} from 'src/gql/queries/services';
import {
  CreateServiceInput,
  CreateServiceOutput,
  IService,
  Service,
  UpdateServiceInput,
  UpdateServiceOutput,
} from 'src/gql/types';

class ServiceStore {
  services: Service[] = [];
  currentService: Service | null = null;
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
          // this.setCurrentService();
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

  setCurrentService = () => {
    if (this.services.length > 0) {
      this.fetchServices();
    }
    const userId = this.rootStore.authStore.userData.serviceId;
    this.currentService =
      this.services.find((service) => service._id === userId) || null;
  };

  stopPolling = () => {
    this.queryObservable?.stopPolling();
  };

  updateService = async (userId: string, input: UpdateServiceInput) => {
    this.isLoading = true;
    try {
      const result = await this.apolloClient.mutate<UpdateServiceOutput>({
        mutation: UPDATE_SERVICE,
        variables: { userId, input },
      });
      this.isLoading = false;
      if (result.data?.updateService) {
        this.currentService = result.data.updateService;
        console.log('Service updated:', this.currentService);
        this.fetchServices(); // Actualizează lista serviciilor după update
      }
    } catch (error) {
      this.error = error;
      this.isLoading = false;
    }
  };

  deleteService = async (serviceId: string) => {
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
  };

  toggleServiceActive = async (serviceId: string) => {
    this.isLoading = true;
    try {
      const result = await this.apolloClient.mutate({
        mutation: TOGGLE_SERVICE_ACTIVE,
        variables: { _id: serviceId },
        refetchQueries: [{ query: LIST_ALL_SERVICES }],
      });

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

  createService = async (input: CreateServiceInput) => {
    this.isLoading = true;
    try {
      console.log('Creating service with input:', input);
      const result = await this.apolloClient.mutate<CreateServiceOutput>({
        mutation: CREATE_SERVICE,
        variables: { input },
      });
      this.isLoading = false;
      if (result.data) {
        console.log('Service created:', result.data.createService);
        this.services.push(result.data.createService);
        this.currentService = result.data.createService; // Setează currentService
        console.log('Service created:', this.currentService);

        if (this.rootStore.authStore.userData.userType === 'SERVICE_USER') {
          await this.rootStore.authStore.updateUserDetails(
            this.currentService._id, // Actualizează userId cu noul serviceId
            this.rootStore.authStore.userData.email,
            this.rootStore.authStore.userData.userName
          );
        }
      }
    } catch (error) {
      this.isLoading = false;
      this.error = error;
      console.error('Service creation failed:', error);
    }
  };

  fetchServicesByCategory = async (category: string) => {
    this.isLoading = true;
    this.error = null;
    try {
      const result = await this.apolloClient.query({
        query: LIST_SERVICES_BY_CATEGORY,
        variables: { category },
      });

      this.services = result.data.listServicesByCategory.map(
        (service: IService) => ({
          ...service,
          serviceId: service._id,
        })
      );
    } catch (error) {
      this.isLoading = false;
      this.error = error;
    } finally {
      this.isLoading = false;
    }
  };

  searchServices = (searchTerm: string) => {
    if (!searchTerm) {
      return this.services;
    }
    return this.services.filter(
      (service) =>
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
}

export default ServiceStore;
