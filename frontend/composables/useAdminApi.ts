import useApiClient from "./useApiClient";

export default function useAdminApi() {
	const apiClient = useApiClient();

	return {
		// Users
		getAllUsers() {
			return apiClient.get("/api/User"); // Correct capitalization
		},
		getUserById(id: string) {
			return apiClient.get(`/api/User/${id}`); // Correct capitalization
		},
		createUser(userData: {
			userName: string;
			email: string;
			password: string;
			role: string;
			location?: string;
		}) {
			// For creating users, we actually need to use the Auth/register endpoint
			return apiClient.post("/api/Auth/register", userData);
		},
		updateUser(
			id: string,
			userData: {
				name: string;
				email: string;
				location?: string;
				role?: string;
			}
		) {
			return apiClient.put(`/api/User/${id}`, userData); // Correct capitalization
		},
		deleteUser(id: string) {
			return apiClient.delete(`/api/User/${id}`); // Correct capitalization
		},

		// Statistics for admin dashboard
		getDashboardStats() {
			// If you don't have this endpoint yet, you'll need to implement it
			return apiClient.get("/api/Admin/stats");
		},

		// Recent activities for admin dashboard
		getRecentAppointments() {
			return apiClient.get("/api/Appointment/recent");
		},

		getNewUsers() {
			return apiClient.get("/api/User/recent");
		},
	};
}
