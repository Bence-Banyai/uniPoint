// middleware/admin.ts
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
	const authStore = useAuthStore();

	// If not authenticated, redirect to login
	if (!authStore.isAuthenticated) {
		return navigateTo({
			path: "/login",
			query: { redirect: to.fullPath },
		});
	}

	// Try to refresh user info if role is missing
	if (!authStore.user.role) {
		try {
			await authStore.getUserInfo();
		} catch (error) {
			console.error("Failed to get user info:", error);
		}
	}

	// Check if user has admin role
	if (authStore.user.role !== "Admin") {
		// Redirect to home with error message
		return navigateTo({
			path: "/",
			query: { error: "You do not have permission to access the admin area" },
		});
	}
});
