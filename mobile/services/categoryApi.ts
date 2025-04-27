import api from './api';

export interface Category {
  categoryId: number;
  name: string;
  iconUrl: string;
}


export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get('/api/Category');
    console.log('Categories fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};


export const fetchCategoryById = async (categoryId: number): Promise<Category> => {
  try {
    const response = await api.get(`/api/Category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${categoryId}:`, error);
    throw error;
  }
};