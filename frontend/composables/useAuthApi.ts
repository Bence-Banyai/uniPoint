import useApiClient from "./useApiClient";
import { useAuthStore } from "../stores/auth";

export default function useAuthApi() {
	const apiClient = useApiClient();

	return {
		// Register a new user
		register(userData: {
			userName: string;
			email: string;
			phoneNumber: string;
			password: string;
			role: string;
		}) {
			return apiClient.post("/api/Auth/register", userData);
		},

		// Login a user
		async login(credentials: { userNameOrEmail: string; password: string }) {
			const response = await apiClient.post("/api/Auth/login", credentials);
			return response;
		},

		// Logout the current user
		logout() {
			return apiClient.post("/api/Auth/logout", {});
		},

		// Fetch user info from the User endpoint using the userId
		async getUserInfo() {
			try {
				const authStore = useAuthStore();

				if (!authStore.token || !authStore.userId) {
					return null;
				}

				// First try to get user info from the User API
				try {
					// Use the userId from the auth store to get the user details
					const userData = await apiClient.get(`/api/User/${authStore.userId}`);

					// Map the response to the expected user info format
					return {
						userName: userData.userName,
						email: userData.email,
						role: null, // Role might not be directly available from this endpoint
						phoneNumber: userData.phoneNumber,
						profilePictureUrl: userData.profilePictureUrl,
					};
				} catch (apiError) {
					console.error("Error fetching user info from API:", apiError);

					// Fallback to JWT parsing if API call fails
					return this.parseUserFromToken();
				}
			} catch (error) {
				console.error("Error getting user info:", error);
				return null;
			}
		},

		// Helper method to parse user info from JWT token as a fallback
		parseUserFromToken() {
			try {
				const authStore = useAuthStore();
				const token = authStore.token;

				if (!token) return null;

				const parts = token.split(".");
				if (parts.length !== 3) {
					console.error("Invalid token format");
					return null;
				}

				// Add this check to ensure parts[1] exists
				if (!parts[1]) {
					console.error("Invalid token structure: missing payload part");
					return null;
				}

				const payload = JSON.parse(atob(parts[1]));

				return {
					userName:
						payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
						payload.unique_name ||
						null,
					email:
						payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
						payload.email ||
						null,
					role:
						payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
						payload.role ||
						null,
				};
			} catch (error) {
				console.error("Error parsing token:", error);
				return null;
			}
		},
	};
}
