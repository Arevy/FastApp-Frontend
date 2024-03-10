import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { makeAutoObservable } from 'mobx';
import RootStore from './RootStore';
// import { listAllServices, createService, updateService, deleteService } from '../graphql/queries'; // Import GraphQL queries

class ServiceStore {
  services = [];

  private rootStore: RootStore;
  constructor(
    rootStore: RootStore,
    private apolloClient: ApolloClient<NormalizedCacheObject>
  ) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  // async fetchServices() {
  //     // const result = await listAllServices(); // GraphQL query
  //     // this.services = result.data;
  // }

  /* eslint-disable quotes */
  fetchServices = async () => {
    const query = gql`
      query ListAllServices {
        listAllServices {
          serviceId
          name
          category
        }
      }
    `;
    /* eslint-enable quotes */
    try {
      const { data } = await this.apolloClient.query({ query });
      // Update state with fetched services
      console.log('data', data);
      return data;
    } catch (error) {
      // Handle error
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
