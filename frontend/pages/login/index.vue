<template>
    <div class="min-h-screen py-16 relative overflow-hidden">
        <!-- Background decorative elements -->
        <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent-blue opacity-10 blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent-pink opacity-10 blur-3xl"></div>

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
                            Welcome back
                        </h1>
                        <p class="text-gray-600 mt-2">Please enter your details to sign in</p>
                    </div>

                    <form @submit.prevent="login" class="space-y-6 animate-fade-in">
                        <div class="space-y-4">
                            <div>
                                <label for="identifier" class="block text-sm font-medium text-gray-700 mb-1">
                                    Username or Email
                                </label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Icon name="entypo:user" class="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input id="identifier" type="text" v-model="form.userNameOrEmail"
                                        placeholder="Enter your username or email"
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
                                        v-model="form.password" placeholder="Enter your password"
                                        class="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple focus:bg-white transition-all duration-300"
                                        required />
                                    <button type="button" @click="showPassword = !showPassword"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                                        <Icon :name="showPassword ? 'entypo:eye-with-line' : 'entypo:eye'"
                                            class="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button type="submit" :disabled="isLoading"
                                class="w-full flex justify-center items-center px-6 py-3 bg-gradient-purple text-white font-medium rounded-xl shadow-soft hover:shadow-purple-glow transition-all duration-300 disabled:opacity-70">
                                <Icon v-if="isLoading" name="entypo:cycle" class="animate-spin mr-2" />
                                <span>{{ isLoading ? 'Signing in...' : 'Sign in' }}</span>
                            </button>
                        </div>

                        <div v-if="error"
                            class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center animate-fade-in">
                            {{ error }}
                        </div>
                    </form>

                    <div class="mt-8 text-center">
                        <p class="text-sm text-gray-600">
                            Don't have an account?
                            <NuxtLink to="/register"
                                class="font-medium text-primary-purple hover:text-secondary-purple transition-colors">
                                Create an account
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
    layout: 'login',
    title: 'Login | UniPoint',
    description: 'Sign in to your UniPoint account',
    meta: {
        guestOnly: true
    }
});

// Add SEO metadata
useSeoMeta({
    title: 'Sign in to UniPoint',
    description: 'Access your account and book educational services on UniPoint',
})

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);
const error = ref('');
const showPassword = ref(false);

const form = reactive({
    userNameOrEmail: '',
    password: ''
});

const login = async () => {
    if (!form.userNameOrEmail || !form.password) {
        error.value = 'Please enter both username/email and password';
        return;
    }

    try {
        error.value = '';
        isLoading.value = true;

        const result = await authStore.login({
            userNameOrEmail: form.userNameOrEmail,
            password: form.password
        });

        if (result.success) {
            // Redirect to home/dashboard on successful login
            router.push('/');
        } else {
            error.value = result.message || 'Invalid username or password';
        }
    } catch (err) {
        console.error('Login failed:', err);
        error.value = err instanceof Error ? err.message : 'An unknown error occurred';
    } finally {
        isLoading.value = false;
    }
};
</script>