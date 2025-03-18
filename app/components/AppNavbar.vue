<template>
  <header class="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
    <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <NuxtLink to="/" class="font-bold text-xl text-purple-600">uniPoint</NuxtLink>
        <NuxtLink to="/" class="hover:text-purple-600">Home</NuxtLink>
        <NuxtLink to="/services" class="hover:text-purple-600">Services</NuxtLink>
        <NuxtLink to="/about" class="hover:text-purple-600">About</NuxtLink>
        <NuxtLink to="/contact" class="hover:text-purple-600">Contact</NuxtLink>
      </div>
      <div class="flex items-center space-x-4">
        <NuxtLink to="/login" class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
          Login
        </NuxtLink>
        <div class="relative">
          <button class="flex items-center space-x-1 text-purple-600 hover:text-purple-800 focus:outline-none">
            <span>EN</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
          <!-- Dropdown menu placeholder -->
          <div class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <NuxtLink to="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">EN</NuxtLink>
            <NuxtLink to="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">HU</NuxtLink>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>