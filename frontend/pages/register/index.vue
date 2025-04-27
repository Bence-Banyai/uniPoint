<template>
    <div class="min-h-screen py-16 relative overflow-hidden">
        <!-- Background decorative elements -->
        <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent-pink opacity-10 blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent-blue opacity-10 blur-3xl"></div>

        <div class="container mx-auto px-4 relative z-10">
            <div class="max-w-md mx-auto">
                <!-- Card with glass effect -->
                <div
                    class="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-raised p-8 border border-gray-100">
                    <!-- Logo -->
                    <div class="text-center mb-8">
                        <NuxtLink to="/" class="inline-flex items-center justify-center mb-4 group">
                            <div
                                class="h-12 w-12 bg-gradient-purple rounded-xl flex items-center justify-center shadow-purple-glow transition-all duration-300 group-hover:shadow-blue-glow">
                                <NuxtImg src="/logo.png" alt="uniPoint Logo" class="h-7 w-auto" />
                            </div>
                        </NuxtLink>
                        <h1
                            class="text-2xl font-bold bg-gradient-to-r from-primary-purple to-accent-blue bg-clip-text text-transparent">
                            Create your account
                        </h1>
                        <p class="text-gray-600 mt-2">Join our community today</p>
                    </div>

                    <form @submit.prevent="register" class="space-y-6 animate-fade-in">
                        <div class="space-y-4">
                            <div>
                                <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Icon name="entypo:user" class="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input id="username" type="text" v-model="form.userName"
                                        placeholder="Choose a username"
                                        class="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple focus:bg-white transition-all duration-300"
                                        required />
                                </div>
                            </div>

                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Icon name="entypo:mail" class="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input id="email" type="email" v-model="form.email" placeholder="Enter your email"
                                        class="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple focus:bg-white transition-all duration-300"
                                        required />
                                </div>
                            </div>

                            <div>
                                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Icon name="entypo:lock" class="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input id="password" :type="showPassword ? 'text' : 'password'"
                                        v-model="form.password" placeholder="Create a password"
                                        class="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple focus:bg-white transition-all duration-300"
                                        required />
                                    <button type="button" @click="showPassword = !showPassword"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                                        <Icon :name="showPassword ? 'entypo:eye-with-line' : 'entypo:eye'"
                                            class="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label for="location" class="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Icon name="entypo:location-pin" class="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input id="location" type="text" v-model="form.location"
                                        placeholder="Enter your city (e.g., Budapest)"
                                        class="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple focus:bg-white transition-all duration-300"
                                        required />
                                </div>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input id="terms" type="checkbox" v-model="acceptTerms"
                                    class="h-4 w-4 text-primary-purple focus:ring-primary-purple border-gray-300 rounded"
                                    required />
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="terms" class="text-gray-600">
                                    I agree to the
                                    <NuxtLink to="/terms"
                                        class="font-medium text-primary-purple hover:text-secondary-purple transition-colors">
                                        Terms of Service
                                    </NuxtLink>
                                    and
                                    <NuxtLink to="/privacy"
                                        class="font-medium text-primary-purple hover:text-secondary-purple transition-colors">
                                        Privacy Policy
                                    </NuxtLink>
                                </label>
                            </div>
                        </div>

                        <div>
                            <button type="submit" :disabled="isLoading || !acceptTerms"
                                class="w-full flex justify-center items-center px-6 py-3 bg-gradient-purple text-white font-medium rounded-xl shadow-soft hover:shadow-purple-glow transition-all duration-300 disabled:opacity-70">
                                <Icon v-if="isLoading" name="entypo:cycle" class="animate-spin mr-2" />
                                <span>{{ isLoading ? 'Creating account...' : 'Create account' }}</span>
                            </button>
                        </div>

                        <div v-if="error"
                            class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center animate-fade-in">
                            {{ error }}
                        </div>

                        <div v-if="success"
                            class="p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm text-center animate-fade-in">
                            {{ success }}
                        </div>
                    </form>

                    <div class="mt-8 text-center">
                        <p class="text-sm text-gray-600">
                            Already have an account?
                            <NuxtLink to="/login"
                                class="font-medium text-primary-purple hover:text-secondary-purple transition-colors">
                                Sign in
                            </NuxtLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/auth';

definePageMeta({
    layout: 'register',
    title: 'Register | UniPoint',
    description: 'Create a new account on UniPoint',
    meta: {
        guestOnly: true
    }
});

// Add SEO metadata
useSeoMeta({
    title: 'Create a UniPoint Account',
    description: 'Join UniPoint to access educational services and connect with professionals',
})

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);
const error = ref('');
const success = ref('');
const showPassword = ref(false);
const acceptTerms = ref(false);

const form = reactive({
    userName: '',
    email: '',
    password: '',
    location: '',
    role: 'User' // Default role
});

const register = async () => {
    try {
        error.value = '';
        success.value = '';
        isLoading.value = true;

        // Validate form (location is now required)
        if (!form.userName || !form.email || !form.password || !form.location) {
            error.value = 'Please fill in all required fields';
            isLoading.value = false;
            return;
        }

        const result = await authStore.register({
            userName: form.userName,
            email: form.email,
            password: form.password,
            location: form.location,
            role: form.role
        });

        if (result.success) {
            success.value = 'Registration successful! You can now log in.';

            // Try to automatically log in the user
            try {
                await authStore.login({
                    userNameOrEmail: form.userName,
                    password: form.password
                });

                // Reset form after successful login and redirect
                form.userName = '';
                form.email = '';
                form.password = '';
                form.location = '';

                // Redirect to profile page
                router.push('/profile');
            } catch (loginError) {
                console.error('Auto-login after registration failed:', loginError);

                // Reset form
                form.userName = '';
                form.email = '';
                form.password = '';
                form.location = '';

                // Redirect to login after a short delay
                setTimeout(() => {
                    router.push('/login');
                }, 1500);
            }
        } else {
            error.value = result.message || 'Registration failed';
        }
    } catch (err) {
        console.error('Registration failed:', err);
        error.value = err instanceof Error ? err.message : 'An unknown error occurred';
    } finally {
        isLoading.value = false;
    }
};
</script>