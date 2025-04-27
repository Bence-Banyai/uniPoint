import useApiClient from "./useApiClient";

export default function useReviewsApi() {
	const apiClient = useApiClient();

	return {
		// Get all reviews
		getAll() {
			return apiClient.get("/api/Review");
		},
		// Create a new review
		create(payload: { serviceId: number; score: number; description: string }) {
			return apiClient.post("/api/Review", payload);
		},
		getById(id: number) {
			return apiClient.get(`/api/Review/${id}`);
		},
		update(
			id: number,
			payload: { reviewId: number; serviceId: number; score: number; description: string }
		) {
			return apiClient.put(`/api/Review/${id}`, payload);
		},
		delete(id: number) {
			return apiClient.delete(`/api/Review/${id}`);
		},
	};
}
