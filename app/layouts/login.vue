<script setup lang="ts">
definePageMeta({
    layout: 'login',
    title: 'Login | UniPoint',
    description: 'Sign in to your UniPoint account'
});

const form = reactive({
    identifier: '',
    password: ''
});

const showPassword = ref(false);

const login = async () => {
    try {
        // Will implement API connection later
        console.log('Logging in with:', form);
        // await useApi().post('/api/auth/login', form);
        // Navigate to dashboard on success
        // navigateTo('/dashboard');
    } catch (error) {
        console.error('Login failed:', error);
    }
};
</script>


<template>
    <div class="min-h-screen flex flex-col">
        <AppNavbar />

        <main class="flex-grow pt-16 flex items-center justify-center bg-gray-50">
            <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <slot />
            </div>
        </main>

        <AppFooter />
    </div>
</template>