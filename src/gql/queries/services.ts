import { gql } from '@apollo/client';

export const LIST_ALL_SERVICES = gql`
  query listAllServices {
    listAllServices {
      _id
      name
      category
      isActive
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation updateService($_id: ID!, $name: String, $category: String) {
    updateService(_id: $_id, name: $name, category: $category) {
      _id
      name
      category
      isActive
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
    }
  }
`;

export const CREATE_SERVICE = gql`
  mutation CreateService(
    $name: String!
    $category: String!
    $isActive: Boolean!
  ) {
    createService(name: $name, category: $category, isActive: $isActive) {
      _id
      name
      category
      isActive
    }
  }
`;
