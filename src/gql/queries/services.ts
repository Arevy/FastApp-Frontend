import { gql } from '@apollo/client';

export const LIST_ALL_SERVICES = gql`
  query ListAllServices {
    listAllServices {
      serviceId
      name
      category
      isActive
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

export const TOGGLE_SERVICE_ACTIVE = gql`
  mutation ToggleServiceActive($serviceId: ID!) {
    toggleServiceActive(serviceId: $serviceId) {
      serviceId
      name
      category
      isActive
    }
  }
`;
