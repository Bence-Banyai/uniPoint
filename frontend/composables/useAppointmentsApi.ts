import useApiClient from "./useApiClient";

// Update your appointment API client with all necessary endpoints
export default function useAppointmentsApi() {
	const apiClient = useApiClient();

	return {
		getAll() {
			return apiClient.get("/api/Appointment");
		},

		getOpen() {
			return apiClient.get("/api/Appointment/open");
		},

		getById(id: number) {
			return apiClient.get(`/api/Appointment/${id}`);
		},

		book(id: number) {
			return apiClient.post(`/api/Appointment/book/${id}`, {});
		},

		cancel(id: number) {
			return apiClient.put(`/api/Appointment/cancel/${id}`, {});
		},

		create(appointmentData: { serviceId: number; scheduledAt: string }) {
			return apiClient.post("/api/Appointment", appointmentData);
		},

		update(id: number, appointmentData: any) {
			return apiClient.put(`/api/Appointment/${id}`, appointmentData);
		},

		delete(id: number) {
			return apiClient.delete(`/api/Appointment/${id}`);
		},

		// New method for time slots
		getTimeSlots(serviceId: number, date: string) {
			// This endpoint needs to be created in your backend
			return apiClient.get(`/api/Appointment/timeslots/${serviceId}/${date}`);
		},
	};
}
