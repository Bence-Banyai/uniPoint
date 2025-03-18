<template>
  <footer class="bg-gray-100 py-6">
    <div class="container mx-auto px-4 flex justify-between items-center">
      <NuxtLink to="/" class="font-bold text-xl text-purple-600">uniPoint</NuxtLink>
      <div class="flex space-x-4">
        <NuxtLink to="/terms" class="text-gray-600 hover:text-gray-800">Terms</NuxtLink>
        <NuxtLink to="/privacy" class="text-gray-600 hover:text-gray-800">Privacy</NuxtLink>
        <NuxtLink to="/support" class="text-gray-600 hover:text-gray-800">Support</NuxtLink>
      </div>
      <div class="text-gray-600">
        <p>contact@unipoint.com</p>
        <p>+1 234 567 890</p>
      </div>
    </div>
  </footer>
</template>