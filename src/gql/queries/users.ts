import { gql } from '@apollo/client';

export const LIST_ALL_USERS = gql`
  query listAllUsers {
    listAllUsers {
      email
      isAdmin
      isActive
      uuid
      registrationDate
      lastLogin
      userType
    }
  }
`;

export const UPDATE_USER_ADMIN_STATUS = gql`
  mutation UpdateUserAdminStatus($uuid: ID!, $isAdmin: Boolean, $isActive: Boolean, $userType: UserType) {
    updateUserAdminStatus(uuid: $uuid, isAdmin: $isAdmin, isActive: $isActive, userType: $userType) {
      success
      message
    }
  }
`;
