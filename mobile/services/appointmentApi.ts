import api from './api';

export enum AppointmentStatus {
  OPEN = 0,
  SCHEDULED = 1,
  DONE = 2,
  CANCELLED_BY_USER = 3,
  CANCELLED_BY_SERVICE = 4
}

export interface Appointment {
  id: number;
  userId?: string;
  serviceId: number;
  appointmentDate: string;
  status: AppointmentStatus;
  service?: {
    serviceId: number;
    serviceName: string;
    price: number;
  };
}

export const bookAppointment = async (appointmentId: number) => {
  try {
    const response = await api.post(`/api/Appointment/book/${appointmentId}`, {});
    console.log('Appointment booked:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error booking appointment:', error);
    throw error;
  }
};

export const createAppointment = async (appointmentData: { 
  serviceId: number; 
  appointmentDate: string;
  status?: AppointmentStatus;
}) => {
  try {
    const data = {
      ...appointmentData,
      status: appointmentData.status ?? AppointmentStatus.SCHEDULED
    };
    
    const response = await api.post('/api/Appointment', data);
    console.log('Appointment created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const cancelAppointment = async (appointmentId: number) => {
  try {
    const response = await api.put(`/api/Appointment/cancel/${appointmentId}`, {});
    console.log('Appointment cancelled:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
};

export const fetchAppointments = async () => {
  try {
    const response = await api.get('/api/Appointment/open');
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const fetchUserAppointments = async () => {
  try {
    const response = await api.get('/api/Appointment/myappointments');
    return response.data;
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    throw error;
  }
};

export const rescheduleAppointment = async (appointmentId: number, newDate: string) => {
  try {
    const response = await api.put(`/api/Appointment/reschedule/${appointmentId}`, {
      newDate: newDate
    });
    
    console.log('Appointment rescheduled:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    throw error;
  }
};