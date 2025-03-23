import useApiClient from "./useApiClient"

export default function useAppointmentsApi() {
    const apiClient = useApiClient()
    
    return {
      // Get all appointments
      getAll() {
        return apiClient.get('/api/Appointment')
      },
      
      // Get open appointments
      getOpen() {
        return apiClient.get('/api/Appointment/open')
      },
      
      // Get a single appointment by ID
      getById(id: number) {
        return apiClient.get(`/api/Appointment/${id}`)
      },
      
      // Book an appointment (for users)
      book(id: number) {
        return apiClient.post(`/api/Appointment/book/${id}`, {})
      },
      
      // Cancel an appointment
      cancel(id: number) {
        return apiClient.put(`/api/Appointment/cancel/${id}`, {})
      },
      
      // Create a new appointment (for providers)
      create(appointmentData: {
        serviceId: number;
        scheduledAt: string;
      }) {
        return apiClient.post('/api/Appointment', appointmentData)
      },
      
      // Update an appointment
      update(id: number, appointmentData: {
        id: number;
        scheduledAt: string;
        status: number;
      }) {
        return apiClient.put(`/api/Appointment/${id}`, appointmentData)
      },
      
      // Delete an appointment
      delete(id: number) {
        return apiClient.delete(`/api/Appointment/${id}`)
      }
    }
  }