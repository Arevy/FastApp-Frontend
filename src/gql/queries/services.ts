// src/gql/queries/services.ts
import { gql } from '@apollo/client';

export const LIST_ALL_SERVICES = gql`
  query ListAllServices {
    listAllServices {
      serviceId
      name
      category
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($serviceId: ID!) {
    deleteService(serviceId: $serviceId) {
      success
      message
    }
  }
`;
