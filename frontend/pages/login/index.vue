<template>
    <BaseAuthForm title="Welcome back" subtitle="Please enter your details to sign in">
        <form @submit.prevent="login" class="mt-6 space-y-6">
            <div class="space-y-4">
                <FormInput id="identifier" label="Username" v-model="form.userNameOrEmail"
                    placeholder="Enter your username or email" required />

                <PasswordInput v-model="form.password" required />
            </div>

            <div>
                <FormButton :disabled="isLoading">
                    <span v-if="isLoading">Signing in...</span>
                    <span v-else>Sign in</span>
                </FormButton>
            </div>

            <div v-if="error" class="mt-3 text-sm text-center text-red-600">
                {{ error }}
            </div>
        </form>

        <div class="text-center mt-4">
            <NuxtLink to="/forgot-password" class="text-sm text-purple-600 hover:text-purple-800">Forgot your password?
            </NuxtLink>
        </div>

        <div class="text-center mt-2">
            <p class="text-sm text-gray-600">Don't have an account?
                <NuxtLink to="/register" class="font-medium text-purple-600 hover:text-purple-800">Sign up</NuxtLink>
            </p>
        </div>
    </BaseAuthForm>
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

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);
const error = ref('');

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