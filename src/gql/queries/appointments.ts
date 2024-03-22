// src/gql/queries/appointments.ts
import { gql } from '@apollo/client';

export const LIST_ALL_APPOINTMENTS = gql`
  query ListAllAppointments {
    listAllAppointmentsShort {
      uuid
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
      uuid
      user {
        email
      }
      service {
        serviceId
        name
        category
      }
      date
      status
    }
  }
`;

export const LIST_USER_APPOINTMENTS = gql`
  query UserAppointments($userId: ID!) {
    userAppointments(userId: $userId) {
      id
      serviceId
      date
      status
    }
  }
`;

export const CREATE_APPOINTMENTS = gql`
  mutation CreateAppointment($userId: ID!, $serviceId: ID!, $date: String!) {
    createAppointment(userId: $userId, serviceId: $serviceId, date: $date) {
      id
      userId
      serviceId
      date
      status
    }
  }
`;

export const UPDATE_APPOINTMENTS = gql`
  mutation UpdateAppointment($uuid: ID!, $newDate: String, $newStatus: String) {
    updateAppointment(uuid: $uuid, newDate: $newDate, newStatus: $newStatus) {
      uuid
      date
      status
    }
  }
`;

export const DELETE_APPOINTMENTS = gql`
  mutation DeleteAppointment($uuid: ID!) {
    deleteAppointment(uuid: $uuid) {
      success
      message
    }
  }
`;

