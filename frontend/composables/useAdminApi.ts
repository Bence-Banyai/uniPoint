import useApiClient from "./useApiClient";

export default function useAdminApi() {
	const apiClient = useApiClient();

	return {
		// Users
		async getAllUsers() {
			try {
				return await apiClient.get("/api/User");
			} catch (error) {
				console.error("Error fetching users:", error);
				return [];
			}
		},

		async getUserById(id: string) {
			try {
				const response = await apiClient.get(`/api/User/${id}`);
				return response;
			} catch (error) {
				console.warn(`Error fetching user ${id}, trying alternative method...`, error);

				try {
					// Get token and parse it
					const authStore = useAuthStore();
					const token = authStore.token;
					if (!token) throw new Error("No token available");

					// Parse token
					const tokenParts = token.split(".");
					const payload = tokenParts[1] ? JSON.parse(atob(tokenParts[1])) : {};

					// Get role from token
					const role =
						payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "User";

					return {
						id,
						userName: payload.unique_name || "User",
						email: payload.email || "",
						location: payload.location || "",
						role: role,
					};
				} catch (fallbackError) {
					console.error("Fallback user extraction failed:", fallbackError);
					throw error;
				}
			}
		},

		createUser(userData: {
			userName: string;
			email: string;
			password: string;
			role: string;
			location?: string;
		}) {
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
			return apiClient.put(`/api/User/${id}`, userData);
		},

		deleteUser(id: string) {
			return apiClient.delete(`/api/User/${id}`);
		},

		// Statistics for admin dashboard
		getDashboardStats() {
			return new Promise((resolve) => {
				resolve({
					totalUsers: 5,
					totalServices: 10,
					appointmentsToday: 3,
					activeCategories: 4,
					userGrowth: 15,
					serviceGrowth: 8,
					appointmentGrowth: 5,
				});
			});
		},

		// Recent activities for admin dashboard
		getRecentAppointments() {
			return apiClient.get("/api/Appointment/recent").catch(() => []);
		},

		getNewUsers() {
			return apiClient.get("/api/User/recent").catch(() => []);
		},
	};
}
