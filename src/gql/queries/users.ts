import { gql } from '@apollo/client';

export const LIST_ALL_USERS = gql`
  query listAllUsers {
    listAllUsers {
      _id
      email
      isAdmin
      isActive
      userName
      registrationDate
      lastLogin
      userType
    }
  }
`;


