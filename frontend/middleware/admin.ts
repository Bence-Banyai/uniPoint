// middleware/admin.ts
import { useAuthStore } from "../stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
	const authStore = useAuthStore();

	// Make sure user is authenticated
	if (!authStore.isAuthenticated) {
		return navigateTo("/login");
	}

	// Check if user has admin role
	if (!authStore.user || authStore.user.role !== "Admin") {
		// Redirect to home page with a warning/error message
		return navigateTo({
			path: "/",
			query: {
				error: "You do not have permission to access the admin area",
			},
		});
	}
});
