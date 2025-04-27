import api from './api';

export interface Service {
  serviceId: number;
  userId: string;
  categoryId: number;
  serviceName: string;
  price: number;
  description: string;
  address: string;
  duration: number;
  provider?: {
    userName: string;
    email: string;
    location: string;
    profilePictureUrl?: string;
  };
  category?: {
    categoryId: number;
    name: string;
    iconUrl: string;
  };
  openingHours?: number;
  imageUrls?: string[];
  opensAt?: string;
  closesAt?: string;
}

export const fetchServices = async (): Promise<Service[]> => {
  try {
    const response = await api.get('/api/Service');
    console.log('Services fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const fetchServiceById = async (serviceId: number): Promise<Service> => {
  try {
    const response = await api.get(`/api/Service/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching service ${serviceId}:`, error);
    throw error;
  }
};

export const fetchServicesByCategory = async (categoryId: number): Promise<Service[]> => {
  try {
    const allServices = await fetchServices();
    return allServices.filter(service => service.categoryId === categoryId);
  } catch (error) {
    console.error(`Error fetching services for category ${categoryId}:`, error);
    throw error;
  }
};