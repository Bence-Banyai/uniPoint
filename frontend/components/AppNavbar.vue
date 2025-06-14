<template>
    <header class="bg-white shadow-soft fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90">
        <nav class="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
            <div class="flex items-center space-x-4">
                <NuxtLink to="/" class="flex items-center space-x-2 group">
                    <div
                        class="h-10 w-10 bg-gradient-purple rounded-lg flex items-center justify-center shadow-purple-glow transition-all duration-300 group-hover:shadow-blue-glow">
                        <NuxtImg src="/logo.png" alt="uniPoint Logo" class="h-6 w-auto" />
                    </div>
                    <span
                        class="font-bold text-xl bg-gradient-to-r from-primary-purple to-accent-blue bg-clip-text text-transparent">uniPoint</span>
                </NuxtLink>

                <!-- Desktop Navigation -->
                <div class="hidden md:flex items-center space-x-6">
                    <NuxtLink to="/"
                        class="text-gray-700 hover:text-primary-purple transition-colors duration-300 relative nav-link">
                        Home</NuxtLink>
                    <NuxtLink to="/services"
                        class="text-gray-700 hover:text-primary-purple transition-colors duration-300 relative nav-link">
                        Services</NuxtLink>
                </div>
            </div>

            <div class="flex items-center space-x-4">
                <!-- Show logout and user info if authenticated -->
                <template v-if="authStore.isAuthenticated">
                    <!-- Add Admin Dashboard link for admins -->
                    <NuxtLink v-if="authStore.user && authStore.user.role === 'Admin'" to="/admin"
                        class="flex items-center px-4 py-2 bg-accent-blue text-white rounded-xl hover:shadow-blue-glow transition-all duration-300 mr-2">
                        <Icon name="entypo:cog" class="mr-2" />
                        <span>Admin</span>
                    </NuxtLink>

                    <NuxtLink to="/profile"
                        class="flex items-center px-4 py-2 bg-purple-glass rounded-xl hover:shadow-purple-glow transition-all duration-300">
                        <span
                            class="w-8 h-8 bg-gradient-to-br from-primary-purple to-light-purple rounded-full flex items-center justify-center text-white font-bold mr-2">
                            {{ authStore.user.userName ? authStore.user.userName[0].toUpperCase() : 'U' }}
                        </span>
                        <span>{{ authStore.user.userName || 'Profile' }}</span>
                    </NuxtLink>
                    <LogoutButton />
                </template>

                <!-- Show login if not authenticated -->
                <template v-else>
                    <NuxtLink to="/login"
                        class="hidden md:inline-block px-4 py-2 border border-primary-purple text-primary-purple rounded-xl hover:bg-purple-glass transition-all duration-300">
                        Login
                    </NuxtLink>
                    <NuxtLink to="/register"
                        class="px-4 py-2 bg-gradient-purple text-white rounded-xl hover:shadow-purple-glow transition-all duration-300">
                        Sign Up
                    </NuxtLink>
                </template>


                <!-- Mobile menu button -->
                <button class="md:hidden bg-purple-glass p-2 rounded-lg">
                    <Icon name="entypo:menu" class="h-6 w-6 text-primary-purple" />
                </button>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { ref } from 'vue';

// Get auth state for conditional rendering
const authStore = useAuthStore();
const isOpen = ref(false);
</script>

<style scoped>
.nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(to right, #6C1D92, #00D4FF);
    transition: width 0.3s ease;
}

.nav-link:hover::after {
    width: 100%;
}

.router-link-active {
    color: #6C1D92;
}

.router-link-active::after {
    width: 100%;
}
</style>