import useApiClient from "./useApiClient";

export default function useReviewsApi() {
    const apiClient = useApiClient();

    return {
        // Get all reviews (public endpoint, but use apiClient for consistency)
        getAll() {
            return apiClient.get("/api/Review");
        },
        // Create a new review (requires authentication, apiClient attaches token)
        create(payload: { serviceId: number; score: number; description: string }) {
            return apiClient.post("/api/Review", payload);
        },
        // Optionally, get a single review by ID
        getById(id: number) {
            return apiClient.get(`/api/Review/${id}`);
        },
        // Optionally, update a review
        update(id: number, payload: { reviewId: number; serviceId: number; score: number; description: string }) {
            return apiClient.put(`/api/Review/${id}`, payload);
        },
        // Optionally, delete a review
        delete(id: number) {
            return apiClient.delete(`/api/Review/${id}`);
        },
    };
}
