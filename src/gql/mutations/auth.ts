import { gql } from "@apollo/client";

/* eslint-disable quotes */
export const LOGIN = gql`
  mutation authUser($email: String!, $password: String!) {
    authUser(email: $email, password: $password) {
      token
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser(
    $email: String!
    $password: String!
    $userType: UserType!
  ) {
    registerUser(email: $email, password: $password, userType: $userType) {
      token
    }
  }
`;
/* eslint-enable quotes */
