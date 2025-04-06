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
	};
	category?: Category;
}

export const serviceApi = {
	async getAllServices(page = 1, limit = 10) {
		try {
			const { data } = await useFetch<Service[]>("/api/Service", {
				params: { page, limit },
			});
			return data.value || [];
		} catch (error) {
			console.error("Error fetching services:", error);
			throw error;
		}
	},

	async getServiceById(id: string | string[]) {
		try {
			const { data } = await useFetch<Service>(`/api/Service/${id}`);
			return data.value as Service;
		} catch (error) {
			console.error(`Error fetching service with id ${id}:`, error);
			throw error;
		}
	},

	async getAllCategories() {
		try {
			const { data } = await useFetch<Category[]>("/api/Category");
			return data.value || [];
		} catch (error) {
			console.error("Error fetching categories:", error);
			throw error;
		}
	},

	async getServicesByCategory(categoryId: number) {
		try {
			// We're using the main service endpoint and filtering client-side
			const { data } = await useFetch<Service[]>("/api/Service");
			return (data.value || []).filter((service) => service.categoryId === categoryId);
		} catch (error) {
			console.error(`Error fetching services for category ${categoryId}:`, error);
			throw error;
		}
	},
};
