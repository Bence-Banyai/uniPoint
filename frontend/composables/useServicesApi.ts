import useApiClient from "./useApiClient";

export default function useServicesApi() {
	const apiClient = useApiClient();

	return {
		// Get all services
		getAll() {
			return apiClient.get("/api/Service");
		},

		// Get a single service by ID
		getById(id: number) {
			return apiClient.get(`/api/Service/${id}`);
		},

		// Create a new service
		create(serviceData: {
			serviceName: string;
			price: number;
			description: string;
			address: string;
			duration: number;
			opensAt: string;
			closesAt: string;
		}) {
			return apiClient.post("/api/Service", serviceData);
		},

		// Update a service
		update(
			id: number,
			serviceData: {
				serviceId: number;
				serviceName: string;
				price: number;
				description: string;
				address: string;
				duration: number;
				opensAt: string;
				closesAt: string;
			}
		) {
			return apiClient.put(`/api/Service/${id}`, serviceData);
		},

		// Delete a service
		delete(id: number) {
			return apiClient.delete(`/api/Service/${id}`);
		},
	};
}
