<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div class="flex justify-end">
        <NuxtLink to="/" class="text-purple-600 hover:text-purple-800">
          <Icon name="entypo:home" class="h-6 w-6" />
          Home
        </NuxtLink>
      </div>
      <div>
        <h2 class="text-3xl font-extrabold text-gray-900">Welcome back</h2>
        <p class="mt-2 text-sm text-gray-600">Please enter your details to sign in</p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="login">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="identifier" class="block text-sm font-medium text-gray-700">Username</label>
            <input id="identifier" name="identifier" type="text" required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Enter your username" v-model="form.identifier">
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="relative">
              <input id="password" name="password" :type="showPassword ? 'text' : 'password'" required
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Enter your password" v-model="form.password">
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button type="button" @click="showPassword = !showPassword"
                  class="text-gray-400 hover:text-gray-600 focus:outline-none">
                  <Icon :name="showPassword ? 'entypo:eye-with-line' : 'entypo:eye'" class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Sign in
          </button>
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
    </div>
  </div>
</template>

<script setup>
const form = reactive({
  identifier: '',
  password: ''
});

const showPassword = ref(false);

const login = async () => {
  try {
    // Will implement API connection later
    console.log('Logging in with:', form);
    // await $fetch('/api/auth/login', {
    //   method: 'POST',
    //   body: form
    // });
    // Navigate to dashboard on success
    // navigateTo('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
</script>