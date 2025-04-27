import { useAuthStore } from "../stores/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
	// Initialize auth store
	const authStore = useAuthStore();
	authStore.init();

	// Add navigation guards
	nuxtApp.hook("app:created", () => {
		const router = useRouter();
	});
});
