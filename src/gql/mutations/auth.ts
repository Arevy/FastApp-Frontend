import { gql } from '@apollo/client';

/* eslint-disable quotes */
export const LOGIN = gql`
  mutation authUser($email: String!, $password: String!) {
    authUser(email: $email, password: $password) {
      token
      user {
        _id
        email
        isAdmin
        isActive
        userName
        userType
        serviceId
        __typename
      }
      __typename
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser(
    $email: String!
    $password: String!
    $userType: UserType!
    $userName: String!
    $serviceId: ID
  ) {
    registerUser(
      email: $email
      password: $password
      userType: $userType
      userName: $userName
      serviceId: $serviceId
    ) {
      token
      user {
        _id
        email
        userName
        isAdmin
        isActive
        serviceId
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser(
    $email: String!
    $password: String!
    $userType: UserType!
    $userName: String!
    $isActive: Boolean!
  ) {
    createUser(
      email: $email
      password: $password
      userType: $userType
      userName: $userName
      isActive: $isActive
    ) {
      _id
      email
      userName
      isAdmin
      isActive
      userType
      registrationDate
    }
  }
`;

export const UPDATE_USER_ADMIN_STATUS = gql`
  mutation UpdateUserAdminStatus(
    $_id: ID!
    $isAdmin: Boolean
    $isActive: Boolean
    $userType: UserType
  ) {
    updateUserAdminStatus(
      _id: $_id
      isAdmin: $isAdmin
      isActive: $isActive
      userType: $userType
    ) {
      success
      message
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($_id: ID!, $newPassword: String!) {
    updatePassword(_id: $_id, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export const UPDATE_USER_DETAILS = gql`
  mutation UpdateUserDetails($_id: ID!, $email: String, $userName: String) {
    updateUserDetails(_id: $_id, email: $email, userName: $userName) {
      success
      message
      user {
        _id
        email
        userName
        userType
        isAdmin
        isActive
      }
    }
  }
`;

export const DELETE_USER_BY_ID = gql`
  mutation deleteUserById($_id: ID!) {
    deleteUserById(_id: $_id) {
      success
      message
    }
  }
`;

/* eslint-enable quotes */
