// Create composables/useAdminApi.ts
export default function useAdminApi() {
	const apiClient = useApiClient();

	return {
		// Users
		getAllUsers() {
			return apiClient.get("/api/User");
		},
		getUserById(id: string) {
			return apiClient.get(`/api/User/${id}`);
		},
		createUser(userData: any) {
			return apiClient.post("/api/User", userData);
		},
		updateUser(id: string, userData: any) {
			return apiClient.put(`/api/User/${id}`, userData);
		},
		deleteUser(id: string) {
			return apiClient.delete(`/api/User/${id}`);
		},

		// Similar methods for services, appointments, and categories

		// Admin dashboard stats
		getDashboardStats() {
			return apiClient.get("/api/Admin/stats");
		},
	};
}
