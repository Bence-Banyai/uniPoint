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
  userId: string;
  serviceId: number;
  scheduledAt: string;
  status: AppointmentStatus;
}

export const appointmentsApi = {
  async getAll() {
    const response = await api.get<Appointment[]>('/api/Appointments');
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get<Appointment>(`/api/Appointments/${id}`);
    return response.data;
  },

  async create(appointment: Omit<Appointment, 'id'>) {
    const response = await api.post<Appointment>('/api/Appointments', appointment);
    return response.data;
  },

  async update(id: number, appointment: Appointment) {
    const response = await api.put<Appointment>(`/api/Appointments/${id}`, appointment);
    return response.data;
  },

  async delete(id: number) {
    return await api.delete(`/api/Appointments/${id}`);
  }
};