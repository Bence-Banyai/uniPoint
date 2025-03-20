<template>
  <BaseAuthForm title="Create account" subtitle="Please enter your details to sign up">
    <form @submit.prevent="register" class="mt-6 space-y-6">
      <div class="space-y-4">
        <FormInput id="username" label="Username" v-model="form.username" placeholder="Enter your username" required />

        <FormInput id="email" label="Email" type="email" v-model="form.email" placeholder="Enter your email" required />

        <PasswordInput v-model="form.password" placeholder="Create a password" required />

        <FormInput id="location" label="Location" v-model="form.location" placeholder="Enter your location" required />
      </div>

      <div>
        <FormButton>
          Create account
        </FormButton>
      </div>
    </form>

    <div class="text-center mt-4">
      <p class="text-sm text-gray-600">Already have an account?
        <NuxtLink to="/login" class="font-medium text-purple-600 hover:text-purple-800">Sign in</NuxtLink>
      </p>
    </div>
  </BaseAuthForm>
</template>

<script setup>
definePageMeta({
  layout: 'register',
  title: 'Register | UniPoint',
  description: 'Create a new account on UniPoint'
});

const form = reactive({
  username: '',
  email: '',
  password: '',
  location: ''
});

const register = async () => {
  try {
    // Will implement API connection later
    console.log('Registering with:', form);
    // await useApi().post('/api/auth/register', form);
    // Navigate to login on success
    // navigateTo('/login');
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
</script>