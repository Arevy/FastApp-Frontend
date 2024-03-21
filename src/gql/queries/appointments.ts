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

// Adaugă aici alte interogări și mutații pentru crearea, actualizarea și ștergerea programărilor
