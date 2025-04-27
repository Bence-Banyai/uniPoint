import { useRuntimeConfig } from "nuxt/app";
import { useAuthStore } from "../stores/auth";

export default function useApiClient() {
	const config = useRuntimeConfig();
	const baseURL = config.public.apiBaseUrl;
	const authStore = useAuthStore();

	const getToken = () => authStore.token || useCookie("auth-token").value;

	const getHeaders = () => {
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};
		const token = getToken();
		console.log("API Client: token used for request:", token);
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}
		console.log("API Client: headers used for request:", headers);
		return headers;
	};

	const handleResponseError = (response: Response, endpoint: string) => {
		if (response.status === 401) {
			console.error("Authentication error, redirecting to login");
			authStore.clearAuth();
			const cookie = useCookie("auth-token");
			cookie.value = null;
			navigateTo("/login");
			throw new Error("Authentication required");
		}
		if (response.status === 403) {
			console.error("Permission denied for this operation");
			throw new Error("Permission denied");
		}
		if (response.status === 404) {
			console.error(`Resource not found: ${endpoint}`);
			throw new Error("Resource not found");
		}
		throw new Error(`API error: ${response.status}`);
	};

	const api = {
		async get(endpoint: string) {
			try {
				const response = await fetch(`${baseURL}${endpoint}`, {
					method: "GET",
					headers: getHeaders(),
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
