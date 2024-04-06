export interface User {
  uuid: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  registrationDate: string;
  lastLogin: string;
}

export interface User {
  email: string;
}

export interface Service {
  serviceId: string;
  name: string;
  category: string;
}

export interface FetchServicesOutput {
  listAllServices: Service[];
}
export interface Appointment {
  uuid: string;
  user: User;
  service: Service;
  date: string;
  status: string;
}

export interface FetchUserAppointmentsOutput {
  userAppointments: Appointment[];
}

export interface ScheduleAppointmentInput {
  userId: string;
  serviceId: string;
  date: string;
}

export interface ScheduleAppointmentOutput {
  createAppointment: Appointment;
}

export interface ModifyAppointmentInput {
  id?: string;
  newDate?: string;
  newStatus?: string;
}

export interface ModifyAppointmentOutput {
  updateAppointment: Appointment;
}

export interface CancelAppointmentInput {
  id: string;
}

export interface CancelAppointmentOutput {
  deleteAppointment: {
    success: boolean;
    message: string;
  };
}
