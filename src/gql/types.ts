export interface User {
  uuid: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  registrationDate: string;
  lastLogin: string;
  userType: UserType;
}

export interface Service {
  serviceId: string;
  name: string;
  category: string;
  isActive: boolean;
}

export interface FetchServicesOutput {
  listAllServices: Service[];
}

export interface UpdateServiceInput {
  serviceId: string;
  name?: string;
  category?: string;
  isActive?: boolean;
}

export interface UpdateServiceOutput {
  updateService: Service;
}

export interface CreateServiceInput {
  name: string;
  category: string;
  isActive: boolean;

}

export interface CreateServiceOutput {
  createService: Service;
}

export interface DeleteServiceOutput {
  deleteService: {
    success: boolean;
    message: string;
  };
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

export enum UserType {
  NORMAL_USER = 'NORMAL_USER',
  SERVICE_USER = 'SERVICE_USER',
  ADMIN_USER = 'ADMIN_USER',
}

export const UserTypeLabels: { [key in UserType]: string } = {
  [UserType.NORMAL_USER]: 'Normal User',
  [UserType.SERVICE_USER]: 'Service User',
  [UserType.ADMIN_USER]: 'Administrator',
};

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export const AppointmentStatusLabels: { [key in AppointmentStatus]: string } = {
  [AppointmentStatus.PENDING]: 'Pending',
  [AppointmentStatus.CONFIRMED]: 'Confirmed',
  [AppointmentStatus.COMPLETED]: 'Completed',
  [AppointmentStatus.CANCELED]: 'Canceled',
};
