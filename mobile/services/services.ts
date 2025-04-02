import api from './api';

export interface Service {
  serviceId: number;
  userId: string;
  serviceName: string;
  price: number;
  description: string;
  address: string;
  duration: number;
}

export const servicesApi = {
  async getAll() {
    const response = await api.get<Service[]>('/api/Services');
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get<Service>(`/api/Services/${id}`);
    return response.data;
  },

  async create(service: Omit<Service, 'serviceId'>) {
    const response = await api.post<Service>('/api/Services', service);
    return response.data;
  },

  async update(id: number, service: Service) {
    const response = await api.put<Service>(`/api/Services/${id}`, service);
    return response.data;
  },

  async delete(id: number) {
    return await api.delete(`/api/Services/${id}`);
  }
};