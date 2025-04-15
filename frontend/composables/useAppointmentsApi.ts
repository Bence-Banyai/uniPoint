import useApiClient from "./useApiClient";
import type { Appointment } from '~/models/Appointment'; // Assuming you have this model defined

// Update your appointment API client with all necessary endpoints
export default function useAppointmentsApi() {
    const apiClient = useApiClient();

    return {
        getAll() {
            return apiClient.get("/api/Appointment") as Promise<Appointment[]>;
        },

        getOpen() {
            // Fetches ALL open appointments across all services
            return apiClient.get("/api/Appointment/open") as Promise<Appointment[]>;
        },

        getById(id: number) {
            return apiClient.get(`/api/Appointment/${id}`) as Promise<Appointment>;
        },

        book(id: number) {
            // Books a specific OPEN appointment by its ID
            return apiClient.post(`/api/Appointment/book/${id}`, {});
        },

        cancel(id: number) {
            return apiClient.put(`/api/Appointment/cancel/${id}`, {});
        },

        create(appointmentData: { serviceId: number; appointmentDate: string }) {
            // Creates a NEW appointment (likely for providers/admins)
            return apiClient.post("/api/Appointment", appointmentData) as Promise<Appointment>;
        },

        update(id: number, appointmentData: any) {
            return apiClient.put(`/api/Appointment/${id}`, appointmentData);
        },

        delete(id: number) {
            return apiClient.delete(`/api/Appointment/${id}`);
        },

        // getTimeSlots is removed as we are fetching open appointments directly
    };
}
