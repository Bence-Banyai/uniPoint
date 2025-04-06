<template>
    <button @click="logout"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
        Logout
    </button>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const logout = async () => {
    try {
        const result = await authStore.logout();
        if (result.success) {
            // Redirect to home page after logout
            router.push('/');
        } else {
            console.error('Logout failed:', result.message);
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
};
</script>