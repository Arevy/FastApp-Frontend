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
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser(
    $email: String!
    $password: String!
    $userType: UserType!
    $userName: String!
  ) {
    registerUser(
      email: $email
      password: $password
      userType: $userType
      userName: $userName
    ) {
      token
      user {
        _id
        email
        userName
        isAdmin
        isActive
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
/* eslint-enable quotes */
