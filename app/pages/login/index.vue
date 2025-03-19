<template>
  <BaseAuthForm title="Welcome back" subtitle="Please enter your details to sign in">
    <form @submit.prevent="login" class="mt-6 space-y-6">
      <div class="space-y-4">
        <FormInput id="identifier" label="Username" v-model="form.identifier" placeholder="Enter your username"
          required />

        <PasswordInput v-model="form.password" required />
      </div>

      <div>
        <FormButton>
          Sign in
        </FormButton>
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

<script setup>
definePageMeta({
  layout: 'login',
  title: 'Login | UniPoint',
  description: 'Sign in to your UniPoint account'
});

const form = reactive({
  identifier: '',
  password: ''
});

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