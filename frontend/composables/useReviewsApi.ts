import { useFetch } from "#app";

export default function useReviewsApi() {
	return {
		async getAll() {
			const { data, error } = await useFetch("/api/Review");
			if (error.value) throw error.value;
			return data.value;
		},
		// You can add more methods (getById, create, etc.) as needed
	};
}
