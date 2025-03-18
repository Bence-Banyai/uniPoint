<template>
  <div class="container mx-auto px-4 py-8 flex">
    <div class="w-2/3 pr-8">
      <div class="bg-gray-200 h-96 mb-4"></div>
      <div class="flex space-x-2">
        <div class="w-16 h-16 bg-gray-200 border-2 border-purple-600"></div>
        <div class="w-16 h-16 bg-gray-200"></div>
        <div class="w-16 h-16 bg-gray-200"></div>
        <div class="w-16 h-16 bg-gray-200"></div>
      </div>
    </div>
    <div class="w-1/3 bg-white p-6 rounded-lg shadow-md">
      <div class="flex items-center mb-4">
        <div class="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
        <div>
          <h3 class="text-xl font-semibold">Service Provider Name</h3>
          <p class="text-gray-600">Professional Title</p>
        </div>
      </div>
      <h4 class="text-lg font-bold mb-2">About the Service</h4>
      <p class="text-gray-600 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
        nisi ut aliquip ex ea commodo consequat.</p>
      <div class="flex items-center mb-2">
        <Icon name="entypo:location-pin" class="h-5 w-5 text-gray-600 mr-2" />
        <span class="text-gray-600">San Francisco, CA</span>
      </div>
      <div class="flex items-center mb-2">
        <Icon name="entypo:phone" class="h-5 w-5 text-gray-600 mr-2" />
        <span class="text-gray-600">+1 (555) 123-4567</span>
      </div>
      <div class="flex items-center mb-4">
        <Icon name="entypo:mail" class="h-5 w-5 text-gray-600 mr-2" />
        <span class="text-gray-600">provider@email.com</span>
      </div>
      <button class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Contact Provider</button>
    </div>
  </div>
</template>