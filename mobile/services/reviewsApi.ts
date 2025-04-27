import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Review {
  reviewId: number;
  userId: string;
  serviceId: number;
  score: number;
  description: string;
  createdAt: string;
  reviewer?: {
    userName: string;
    profilePictureUrl?: string;
  };
}

interface ReviewSubmission {
  serviceId: number;
  score: number;
  description: string;
}

const getAuthToken = async (): Promise<string | null> => {
  try {
    if (typeof localStorage !== 'undefined') {
      const tokenKeys = ['authToken', 'userToken', 'token'];
      for (const key of tokenKeys) {
        const token = localStorage.getItem(key);
        if (token) {
          console.log(`Found token in localStorage with key: ${key}`);
          return token;
        }
      }
    }
    
    if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
      const tokenKeys = ['authToken', 'userToken', 'token'];
      for (const key of tokenKeys) {
        const token = await AsyncStorage.getItem(key);
        if (token) {
          console.log(`Found token in AsyncStorage with key: ${key}`);
          return token;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

export const fetchReviews = async (serviceId: number): Promise<Review[]> => {
  try {
    const response = await api.get<Review[]>('/api/Review');
    return response.data.filter(review => review.serviceId === serviceId);
  } catch (error: any) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log('Note: Authentication required for reviews - guest users will see empty reviews list');
      return [];
    }
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const submitReview = async (review: ReviewSubmission): Promise<Review> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("You must be logged in to submit a review.");
    }
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    const payload = {
      serviceId: review.serviceId,
      score: review.score,
      description: review.description
    };
    const response = await api.post<Review>('/api/Review', payload, config);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error("You must be logged in to submit a review.");
    } else if (error.response && error.response.status === 403) {
      throw new Error("Your session has expired. Please log in again.");
    }
    throw error;
  }
};