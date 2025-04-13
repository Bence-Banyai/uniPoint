// composables/useCategoriesApi.ts
export default function useCategoriesApi() {
	const apiClient = useApiClient();

	return {
		getAll() {
			return apiClient.get("/api/Category");
		},

		getById(id: number) {
			return apiClient.get(`/api/Category/${id}`);
		},

		create(categoryData: { name: string; iconUrl?: string }) {
			return apiClient.post("/api/Category", categoryData);
		},

		update(id: number, categoryData: any) {
			return apiClient.put(`/api/Category/${id}`, categoryData);
		},

		delete(id: number) {
			return apiClient.delete(`/api/Category/${id}`);
		},
	};
}
