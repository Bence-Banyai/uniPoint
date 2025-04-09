import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
	const authStore = useAuthStore();

	// Check if we should refresh user info
	const refreshUserInfo = () => {
		// If user is authenticated but missing some user data like location
		if (
			authStore.isAuthenticated &&
			(!authStore.user.userName || !authStore.user.email || !authStore.user.location)
		) {
			console.log("Auth middleware: Refreshing missing user data");
			authStore
				.getUserInfo()
				.catch((err) => console.error("Failed to refresh user data in middleware:", err));
		}
	};

	// If route requires auth and user isn't authenticated
	if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		return navigateTo("/login");
	}

	// If route is for guests only and user is authenticated
	if (to.meta.guestOnly && authStore.isAuthenticated) {
		return navigateTo("/");
	}

	// Refresh user info if needed
	refreshUserInfo();
});
