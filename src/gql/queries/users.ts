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
