import { useRuntimeConfig } from "nuxt/app";
import { useAuthStore } from "../stores/auth";

export default function useApiClient() {
	const config = useRuntimeConfig();
	const baseURL = config.public.apiBaseUrl;
	const authStore = useAuthStore();

	// Create headers with authentication token if available
	const getHeaders = () => {
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};

		// Add token from auth store or cookie if available
		if (authStore.token) {
			headers["Authorization"] = `Bearer ${authStore.token}`;
		} else {
			// Fallback to cookie if store is not yet hydrated
			const token = useCookie("auth-token").value;
			if (token) {
				headers["Authorization"] = `Bearer ${token}`;
			}
		}

		return headers;
	};

	// Handle API error responses
	const handleResponseError = (response: Response, endpoint: string) => {
		// Handle 401 Unauthorized - clear auth and redirect to login
		if (response.status === 401) {
			console.error("Authentication error, redirecting to login");
			authStore.clearAuth();
			const cookie = useCookie("auth-token");
			cookie.value = null;
			navigateTo("/login");
			throw new Error("Authentication required");
		}

		// Handle 403 Forbidden - user doesn't have permission
		if (response.status === 403) {
			console.error("Permission denied for this operation");
			throw new Error("Permission denied");
		}

		// Handle 404 Not Found
		if (response.status === 404) {
			console.error(`Resource not found: ${endpoint}`);
			throw new Error("Resource not found");
		}

		// Handle other errors
		throw new Error(`API error: ${response.status}`);
	};

	// Base API methods
	const api = {
		// GET request
		async get(endpoint: string) {
			try {
				const response = await fetch(`${baseURL}${endpoint}`, {
					method: "GET",
					headers: getHeaders(),
					credentials: "include",
				});

				if (!response.ok) {
					handleResponseError(response, endpoint);
				}

				return await response.json();
			} catch (error) {
				console.error(`Error getting from ${endpoint}:`, error);
				throw error;
			}
		},

		// POST request
		async post(endpoint: string, data: any) {
			try {
				const response = await fetch(`${baseURL}${endpoint}`, {
					method: "POST",
					headers: getHeaders(),
					body: JSON.stringify(data),
				});

				if (!response.ok) {
					handleResponseError(response, endpoint);
				}

				return await response.json();
			} catch (error) {
				console.error(`Error posting to ${endpoint}:`, error);
				throw error;
			}
		},

		// PUT request
		async put(endpoint: string, data: any) {
			try {
				const response = await fetch(`${baseURL}${endpoint}`, {
					method: "PUT",
					headers: getHeaders(),
					body: JSON.stringify(data),
				});

				if (!response.ok) {
					handleResponseError(response, endpoint);
				}

				return await response.json();
			} catch (error) {
				console.error(`Error updating ${endpoint}:`, error);
				throw error;
			}
		},

		// DELETE request
		async delete(endpoint: string) {
			try {
				const response = await fetch(`${baseURL}${endpoint}`, {
					method: "DELETE",
					headers: getHeaders(),
				});

				if (!response.ok) {
					handleResponseError(response, endpoint);
				}

				return await response.json();
			} catch (error) {
				console.error(`Error deleting ${endpoint}:`, error);
				throw error;
			}
		},
	};

	return api;
}
