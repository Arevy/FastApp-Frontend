import { gql } from '@apollo/client';

export const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment(
    $userId: ID!
    $serviceId: ID!
    $date: String!
    $status: String!
  ) {
    createAppointment(
      userId: $userId
      serviceId: $serviceId
      date: $date
      status: $status
    ) {
      _id
      userId

      serviceId

      date
      status
    }
  }
`;
export const LIST_ALL_APPOINTMENTS = gql`
  query ListAllAppointments {
    listAllAppointmentsShort {
      _id
      userId
      serviceId
      date
      status
    }
  }
`;

export const LIST_ALL_APPOINTMENTS_FULL = gql`
  query ListAllAppointmentsFull {
    listAllAppointmentsFull {
      _id
      user {
        _id
        email
        userName
        __typename
      }
      service {
        _id
        name
        category
        __typename
      }
      date
      status
      __typename
    }
  }
`;

export const LIST_USER_APPOINTMENTS = gql`
  query ListUserAppointments($userId: ID!) {
    userAppointments(userId: $userId) {
      _id
      user {
        _id
        email
        userName
      }
      service {
        _id
        name
        category
      }
      date
      status
    }
  }
`;

export const CREATE_APPOINTMENTS = gql`
  mutation CreateAppointment($userId: ID!, $serviceId: ID!, $date: String!) {
    createAppointment(userId: $userId, serviceId: $serviceId, date: $date) {
      _id
      userId
      serviceId
      date
      status
    }
  }
`;

export const UPDATE_APPOINTMENTS = gql`
  mutation UpdateAppointment($_id: ID!, $newDate: String, $newStatus: String) {
    updateAppointment(_id: $_id, newDate: $newDate, newStatus: $newStatus) {
      _id
      date
      status
    }
  }
`;

export const DELETE_APPOINTMENTS = gql`
  mutation DeleteAppointment($_id: ID!) {
    deleteAppointment(_id: $_id) {
      success
      message
    }
  }
`;

export const FETCH_SERVICE_APPOINTMENTS = gql`
query FetchServiceAppointments($serviceId: ID!) {
  fetchServiceAppointments(serviceId: $serviceId) {
    _id
    user {
      _id
      email
      userName
    }
    service {
      _id
      name
      category
    }
    date
    status
  }
}
`;
