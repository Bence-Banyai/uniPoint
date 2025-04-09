// Using Nuxt 3's built-in fetch capabilities instead of axios

export interface Category {
	categoryId: number;
	name: string;
	iconUrl: string;
}

export interface Service {
	serviceId: number;
	userId: string;
	categoryId: number;
	serviceName: string;
	price: number;
	description: string;
	address: string;
	duration: number;
	openingHours: number;
	imageUrls?: string[];
	provider?: {
		userName: string;
		email: string;
		phoneNumber: string;
		profilePictureUrl: string;
		location: string;
	};
	category?: Category;
}

export const serviceApi = {
	async getAllServices(page = 1, limit = 10) {
		try {
			console.log("Fetching all services...");

			// Get the runtime config to use the API base URL
			const config = useRuntimeConfig();
			const apiBaseUrl = config.public.apiBaseUrl;

			// Use the full URL instead of relying on the proxy
			const { data, error } = await useFetch<Service[]>(`${apiBaseUrl}/api/Service`);

			if (error.value) {
				console.error("Error response from API:", error.value);
				throw new Error(`API error: ${error.value.message}`);
			}

			console.log("Services data received:", data.value);
			return data.value || [];
		} catch (error) {
			console.error("Error fetching services:", error);
			throw error;
		}
	},

	async getServiceById(id: string | string[]) {
		try {
			console.log(`Fetching service with ID: ${id}`);

			// Get the runtime config to use the API base URL
			const config = useRuntimeConfig();
			const apiBaseUrl = config.public.apiBaseUrl;

			// Use the full URL instead of relying on the proxy
			const { data, error } = await useFetch<Service>(`${apiBaseUrl}/api/Service/${id}`);

			if (error.value) {
				console.error(`Error fetching service ${id}:`, error.value);
				throw new Error(`API error: ${error.value.message}`);
			}

			console.log("Service data received:", data.value);
			return data.value as Service;
		} catch (error) {
			console.error(`Error fetching service with id ${id}:`, error);
			throw error;
		}
	},

	async getAllCategories() {
		try {
			console.log("Fetching all categories...");

			// Get the runtime config to use the API base URL
			const config = useRuntimeConfig();
			const apiBaseUrl = config.public.apiBaseUrl;

			// Use the full URL instead of relying on the proxy
			const { data, error } = await useFetch<Category[]>(`${apiBaseUrl}/api/Category`);

			if (error.value) {
				console.error("Error fetching categories:", error.value);
				// Return empty array instead of throwing error so the page can still load
				return [];
			}

			console.log("Categories data received:", data.value);
			return data.value || [];
		} catch (error) {
			console.error("Error fetching categories:", error);
			// Return empty array instead of throwing error
			return [];
		}
	},

	async getServicesByCategory(categoryId: number) {
		try {
			console.log(`Fetching services for category ID: ${categoryId}`);

			// Get the runtime config to use the API base URL
			const config = useRuntimeConfig();
			const apiBaseUrl = config.public.apiBaseUrl;

			// Use the full URL instead of relying on the proxy
			const { data, error } = await useFetch<Service[]>(`${apiBaseUrl}/api/Service`);

			if (error.value) {
				console.error(`Error fetching services for category ${categoryId}:`, error.value);
				throw new Error(`API error: ${error.value.message}`);
			}

			const filteredServices = (data.value || []).filter(
				(service) => service.categoryId === categoryId
			);
			console.log(`Found ${filteredServices.length} services for category ${categoryId}`);
			return filteredServices;
		} catch (error) {
			console.error(`Error fetching services for category ${categoryId}:`, error);
			throw error;
		}
	},
};
