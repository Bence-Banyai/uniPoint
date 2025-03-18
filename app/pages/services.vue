<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <div class="relative w-1/2">
        <input type="text" placeholder="Search services..." v-model="searchQuery"
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <button class="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
          <Icon name="entypo:search" class="h-5 w-5" />
        </button>
      </div>
      <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Most Popular</button>
    </div>

    <div class="flex">
      <aside class="w-1/4 pr-8">
        <div class="bg-white p-4 rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-4">Filters</h3>
          <ul class="space-y-2">
            <li><a href="#" class="block text-purple-600 font-medium">All</a></li>
            <li><a href="#" class="block text-gray-700 hover:text-purple-600">Business</a></li>
            <li><a href="#" class="block text-gray-700 hover:text-purple-600">Technology</a></li>
            <li><a href="#" class="block text-gray-700 hover:text-purple-600">Education</a></li>
            <li><a href="#" class="block text-gray-700 hover:text-purple-600">Marketing</a></li>
            <li><a href="#" class="block text-gray-700 hover:text-purple-600">Development</a></li>
          </ul>
        </div>
      </aside>

      <main class="w-3/4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Mock services data for demonstration -->
          <ServiceCard v-for="service in services" :key="service.id" :id="service.id" />
        </div>

        <div class="flex justify-center mt-8">
          <Pagination />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'Services | UniPoint',
  description: 'Browse and book services on UniPoint'
});

// Mock data for demonstration
// In a real application, this would come from an API
const services = ref([
  { id: 1, name: "Web Development", description: "Professional web development services" },
  { id: 2, name: "Mobile App Development", description: "Android and iOS app development" },
  { id: 3, name: "UI/UX Design", description: "User interface and experience design" },
  { id: 4, name: "SEO Services", description: "Search engine optimization" },
  { id: 5, name: "Content Writing", description: "Professional content creation" },
  { id: 6, name: "Digital Marketing", description: "Comprehensive marketing solutions" },
]);

const searchQuery = ref('');

// In a real application, you might implement search and filtering logic here
// For example:
// watch(searchQuery, (newQuery) => {
//   // Filter services based on the search query
// });
</script>