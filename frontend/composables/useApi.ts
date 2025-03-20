export function useApi() {
	const config = useRuntimeConfig();

	const fetchFromApi = async <T = any>(endpoint: string, options: any = {}) => {
		const baseURL = config.public.apiBaseUrl;
		const url = `${baseURL}${endpoint}`;

		// Get token from storage if available - safely access localStorage only on client side
		let token: string | null = null;
		if (process.client) {
			token = localStorage.getItem("auth_token");
		}

		const headers = {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		};

		try {
			return await $fetch<T>(url, {
				...options,
				headers,
			});
		} catch (error: any) {
			console.error(`API Error: ${endpoint}`, error);

			// Enhance error with better details
			if (error.response) {
				// The request was made and the server responded with a status code outside of 2xx range
				const statusCode = error.response.status;
				const message = error.response._data?.message || "An error occurred";

				throw createError({
					statusCode,
					message,
					fatal: statusCode >= 500,
				});
			}

			throw error;
		}
	};

	return {
		get: <T = any>(endpoint: string, options = {}) =>
			fetchFromApi<T>(endpoint, { method: "GET", ...options }),
		post: <T = any>(endpoint: string, body: any, options = {}) =>
			fetchFromApi<T>(endpoint, { method: "POST", body, ...options }),
		put: <T = any>(endpoint: string, body: any, options = {}) =>
			fetchFromApi<T>(endpoint, { method: "PUT", body, ...options }),
		delete: <T = any>(endpoint: string, options = {}) =>
			fetchFromApi<T>(endpoint, { method: "DELETE", ...options }),
	};
}
