<template>
  <BaseAuthForm title="Create account" subtitle="Please enter your details to sign up">
    <form @submit.prevent="register" class="mt-6 space-y-6">
      <div class="space-y-4">
        <FormInput id="username" label="Username" v-model="form.userName" placeholder="Enter your username" required />

        <FormInput id="email" label="Email" type="email" v-model="form.email" placeholder="Enter your email" required />

        <PasswordInput v-model="form.password" placeholder="Create a password" required />

        <FormInput id="phoneNumber" label="Phone Number" v-model="form.phoneNumber"
          placeholder="Enter your phone number" required />

        <!-- Make location optional by removing the required attribute -->
        <FormInput id="location" label="Location (Optional)" v-model="form.location"
          placeholder="Enter your location" />
      </div>

      <div>
        <FormButton :disabled="isLoading">
          <span v-if="isLoading">Creating account...</span>
          <span v-else>Create account</span>
        </FormButton>
      </div>

      <div v-if="error" class="mt-3 text-sm text-center text-red-600">
        {{ error }}
      </div>

      <div v-if="success" class="mt-3 text-sm text-center text-green-600">
        {{ success }}
      </div>
    </form>

    <div class="text-center mt-4">
      <p class="text-sm text-gray-600">Already have an account?
        <NuxtLink to="/login" class="font-medium text-purple-600 hover:text-purple-800">Sign in</NuxtLink>
      </p>
    </div>
  </BaseAuthForm>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../../stores/auth';

definePageMeta({
  layout: 'register',
  title: 'Register | UniPoint',
  description: 'Create a new account on UniPoint',
  meta: {
    guestOnly: true
  }
});

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);
const error = ref('');
const success = ref('');

const form = reactive({
  userName: '',
  email: '',
  password: '',
  phoneNumber: '',
  location: '',
  role: 'User' // Default role
});

const register = async () => {
  try {
    error.value = '';
    success.value = '';
    isLoading.value = true;

    // Validate form (note location is not required)
    if (!form.userName || !form.email || !form.password || !form.phoneNumber) {
      error.value = 'Please fill in all required fields';
      isLoading.value = false;
      return;
    }

    const result = await authStore.register({
      userName: form.userName,
      email: form.email,
      password: form.password,
      phoneNumber: form.phoneNumber,
      role: form.role
      // Location is no longer being sent to the backend
    });

    if (result.success) {
      success.value = 'Registration successful! You can now log in.';

      // Reset form
      form.userName = '';
      form.email = '';
      form.password = '';
      form.phoneNumber = '';
      form.location = '';

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 1500);
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