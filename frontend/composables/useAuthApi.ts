import useApiClient from "./useApiClient";
import { useAuthStore } from "../stores/auth";

export default function useAuthApi() {
	const apiClient = useApiClient();

	return {
		// Register a new user
		register(userData: {
			userName: string;
			email: string;
			location: string;
			password: string;
			role: string;
		}) {
			return apiClient.post("/api/Auth/register", userData);
		},

		// Login
		login(credentials: { userNameOrEmail: string; password: string }) {
			return apiClient.post("/api/Auth/login", credentials);
		},

		// Logout
		logout() {
			return apiClient.post("/api/Auth/logout", {});
		},

		// Get user info
		async getUserInfo() {
			try {
				const authStore = useAuthStore();
				const userId = authStore.userId;

				if (!userId) {
					throw new Error("No user ID found");
				}

				console.log("Fetching user data for ID:", userId);

				// Fetch user data from the API
				const response = await apiClient.get(`/api/User/${userId}`);
				console.log("User API response:", response);

				if (!response.location && response.location !== "") {
					console.warn("Location not found in API response, checking token fallback");
					const tokenData = this.parseUserFromToken();
					if (tokenData && tokenData.location) {
						response.location = tokenData.location;
						console.log("Using location from token:", tokenData.location);
					}
				}

				return response;
			} catch (error) {
				console.error("Failed to get user info:", error);

				return this.parseUserFromToken();
			}
		},

		// Helper method to parse user info from JWT token as a fallback
		parseUserFromToken() {
			try {
				const authStore = useAuthStore();
				const token = authStore.token;

				if (!token) {
					throw new Error("No token found");
				}

				const parts = token.split(".");
				if (parts.length !== 3) {
					throw new Error("Invalid token format");
				}

				if (!parts[1]) {
					throw new Error("Token payload is missing");
				}
				const payload = JSON.parse(atob(parts[1]));
				console.log("Token payload:", payload);

				// Extract location from token claims
				const location = payload.location || null;
				console.log("Location from token:", location);

				return {
					userName:
						payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
						payload.unique_name ||
						null,
					email:
						payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
						payload.email ||
						null,
					location: location,
					role:
						payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
						payload.role ||
						null,
				};
			} catch (error) {
				console.error("Failed to parse token:", error);
				return null;
			}
		},
	};
}
