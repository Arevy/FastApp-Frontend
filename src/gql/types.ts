
export interface Service {
  userId: string;
  _id: string;
  name: string;
  category: string;
  isActive: boolean;
  imageBase64?: string;
  imageContentType?: string;
  description?: string;
}
export interface FetchServicesOutput {
  listAllServices: Service[];
}

export interface UpdateServiceInput {
  name?: string;
  category?: string;
  isActive?: boolean;
  description?: string;
  imageBase64?: string;
  imageContentType?: string;
}

export interface UpdateServiceOutput {
  updateService: Service;
}

export interface CreateServiceInput {
  name: string;
  category: string;
  isActive: boolean;
  description?: string;
  imageBase64?: string;
  imageContentType?: string;
  userId?: string;
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
export interface IUser {
  _id: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  userName?: string;
  registrationDate: string | number;
  lastLogin: string | number;
  userType: UserType;
  serviceId?: string;
}

export interface IService {
  _id: string;
  name: string;
  category: string;
  isActive: boolean;
  imageUrl: string;
  description: string;
}

export interface IAppointment {
  user: any;
  _id: string;
  userId: string;
  serviceId: string;
  service?: IService; // Include nested service details
  date: string;
  status: string;
}

export interface FetchUserAppointmentsOutput {
  userAppointments: IAppointment[];
}

export interface ScheduleAppointmentInput {
  userId: string;
  serviceId: string;
  date: string;
}

export interface ScheduleAppointmentOutput {
  createAppointment: IAppointment;
}

export interface ModifyAppointmentInput {
  id?: string;
  newDate?: string;
  newStatus?: string;
}

export interface ModifyAppointmentOutput {
  updateAppointment: IAppointment;
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
