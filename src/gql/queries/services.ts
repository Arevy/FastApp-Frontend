import { gql } from '@apollo/client';

export const LIST_ALL_SERVICES = gql`
  query listAllServices {
    listAllServices {
      _id
      name
      category
      isActive
      description
      imageBase64
      imageContentType
    }
  }
`;

export const CREATE_SERVICE = gql`
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
      _id
      name
      category
      isActive
      description
      imageBase64
      imageContentType
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService($_id: ID!, $input: CreateServiceInput) {
    updateService(_id: $_id, input: $input) {
      _id
      name
      category
      isActive
      description
      imageBase64
      imageContentType
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($_id: ID!) {
    deleteService(_id: $_id) {
      success
      message
    }
  }
`;

export const TOGGLE_SERVICE_ACTIVE = gql`
  mutation ToggleServiceActive($_id: ID!) {
    toggleServiceActive(_id: $_id) {
      _id
      name
      category
      isActive
      description
      imageBase64
      imageContentType
    }
  }
`;

export const LIST_SERVICES_BY_CATEGORY = gql`
  query listServicesByCategory($category: String!) {
    listServicesByCategory(category: $category) {
      _id
      name
      category
      isActive
      description
      imageBase64
      imageContentType
    }
  }
`;
