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
  GET_SERVICE_BY_USER_ID,
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
        next: async (response) => {
          this.services = response.data.listAllServices.map(
            (service: IService) => ({
              ...service,
              serviceId: service._id,
            })
          );
          this.rootStore.authStore.userData.userType === 'SERVICE_USER' &&
            (await this.setCurrentService());
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

  setCurrentService = async () => {
    const userId = this.rootStore.authStore.userData._id;

    try {
      const { data } = await this.apolloClient.query({
        query: GET_SERVICE_BY_USER_ID,
        variables: { userId },
      });
      if (data?.serviceByUserId) {
        this.currentService = data.serviceByUserId;
      } else {
        this.currentService = null;
      }
    } catch (error) {
      this.currentService = null;
    }
  };

  stopPolling = () => {
    this.queryObservable?.stopPolling();
  };

  updateService = async (
    userId: string,
    input: UpdateServiceInput
  ): Promise<Service | null> => {
    this.isLoading = true;
    try {
      const result = await this.apolloClient.mutate<UpdateServiceOutput>({
        mutation: UPDATE_SERVICE,
        variables: { userId, input },
      });
      this.isLoading = false;
      if (result.data?.updateService?.service) {
        this.currentService = result.data.updateService.service;
        this.fetchServices();
        return result.data.updateService.service;
      }

      return null;
    } catch (error) {
      this.error = error;
      this.isLoading = false;
      return null;
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
        return result.data.toggleServiceActive;
      }
    } catch (error) {
      this.error = error;
    } finally {
      this.isLoading = false;
    }
  };

  createService = async (input: CreateServiceInput) => {
    this.isLoading = true;
    try {
      const result = await this.apolloClient.mutate<CreateServiceOutput>({
        mutation: CREATE_SERVICE,
        variables: { input },
      });
      this.isLoading = false;
      if (result.data) {
        this.services.push(result.data.createService);
        this.currentService = result.data.createService;

        if (this.rootStore.authStore.userData.userType === 'SERVICE_USER') {
          await this.rootStore.authStore.updateUserDetails(
            this.currentService._id,
            this.rootStore.authStore.userData.email,
            this.rootStore.authStore.userData.userName
          );
        }
      }
    } catch (error) {
      this.isLoading = false;
      this.error = error;
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
