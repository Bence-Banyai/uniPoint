import { defineStore } from "pinia";
import useAuthApi from "../composables/useAuthApi";

export interface AuthState {
	token: string | null;
	userId: string | null;
	isAuthenticated: boolean;
	user: {
		userName: string | null;
		email: string | null;
		role: string | null;
	};
}

export const useAuthStore = defineStore("auth", {
	state: (): AuthState => ({
		token: null,
		userId: null,
		isAuthenticated: false,
		user: {
			userName: null,
			email: null,
			role: null,
		},
	}),

	actions: {
		async login(credentials: { userNameOrEmail: string; password: string }) {
			try {
				const authApi = useAuthApi();
				const response = await authApi.login(credentials);

				if (response.token) {
					this.setToken(response.token);
					this.setUserId(response.userId);
					this.setIsAuthenticated(true);

					// Store user information from the response
					if (response.userName || response.email || response.role) {
						this.setUser({
							userName: response.userName || null,
							email: response.email || null,
							role: response.role || null,
						});
					}

					// Store token in a secure cookie
					const cookie = useCookie("auth-token", {
						maxAge: 60 * 60 * 24, // 1 day
						secure: process.env.NODE_ENV === "production",
						sameSite: "strict",
					});
					cookie.value = response.token;

					return {
						success: true,
					};
				}

				return {
					success: false,
					message: response.message || "Login failed",
				};
			} catch (error) {
				console.error("Login error:", error);
				return {
					success: false,
					message: error instanceof Error ? error.message : "Unknown error occurred",
				};
			}
		},

		async register(userData: {
			userName: string;
			email: string;
			phoneNumber: string;
			password: string;
			role: string;
		}) {
			try {
				const authApi = useAuthApi();
				const response = await authApi.register(userData);

				return {
					success: true,
					message: response.message || "Registration successful",
				};
			} catch (error) {
				console.error("Registration error:", error);
				return {
					success: false,
					message: error instanceof Error ? error.message : "Unknown error occurred",
				};
			}
		},

		async logout() {
			try {
				const authApi = useAuthApi();
				await authApi.logout();

				// Clear auth state
				this.clearAuth();

				// Remove the cookie
				const cookie = useCookie("auth-token");
				cookie.value = null;

				return {
					success: true,
				};
			} catch (error) {
				console.error("Logout error:", error);
				return {
					success: false,
					message: error instanceof Error ? error.message : "Unknown error occurred",
				};
			}
		},

		// Add this to the actions section of useAuthStore
		async getUserInfo() {
			try {
				if (!this.token || !this.userId) {
					return {
						success: false,
						message: "Not authenticated",
					};
				}

				const authApi = useAuthApi();
				const userData = await authApi.getUserInfo();

				if (userData) {
					this.setUser({
						userName: userData.userName || null,
						email: userData.email || null,
						role: userData.role || null,
						// Store additional user data if needed
						// if (userData.phoneNumber) {
						// You might need to add phoneNumber to your user state
						// this.user.phoneNumber = userData.phoneNumber;
						// }
					});
				}

				return {
					success: true,
				};
			} catch (error) {
				console.error("Error fetching user info:", error);
				return {
					success: false,
					message: error instanceof Error ? error.message : "Unknown error occurred",
				};
			}
		},

		// Helper methods for state management
		setToken(token: string) {
			this.token = token;
		},

		setUserId(userId: string) {
			this.userId = userId;
		},

		setIsAuthenticated(status: boolean) {
			this.isAuthenticated = status;
		},

		setUser(user: { userName: string; email: string; role: string }) {
			this.user = user;
		},

		clearAuth() {
			this.token = null;
			this.userId = null;
			this.isAuthenticated = false;
			this.user = {
				userName: null,
				email: null,
				role: null,
			};
		},

		init() {
			const token = useCookie("auth-token").value as string | null;

			if (token) {
				this.setToken(token);
				this.setIsAuthenticated(true);

				try {
					const tokenParts = token.split(".");
					const payload = tokenParts[1] ? JSON.parse(atob(tokenParts[1])) : {};

					const userId =
						payload.sub ||
						payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
					if (userId) {
						this.setUserId(userId);
					}

					this.setUser({
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
					});
				} catch (error) {
					console.error("Error parsing token:", error);
					// Fall back to placeholder
					this.setUser({
						userName: "User",
						email: "",
						role: "User",
					});
				}

				// You can also try to fetch fresh user data if needed
				this.getUserInfo().catch((err) => {
					console.error("Failed to refresh user data:", err);
				});
			}
		},
	},
});
