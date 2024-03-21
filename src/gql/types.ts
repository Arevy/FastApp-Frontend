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

export interface Appointment {
  uuid: string;
  user: User;
  service: Service;
  date: string;
  status: string;
}
