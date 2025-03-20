<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="h-40 bg-gray-200"></div>
    <div class="p-6">
      <h3 class="text-xl font-semibold mb-2">Service Name</h3>
      <p class="text-gray-600 mb-4">Service description goes here with some details about what is offered.</p>
      <div class="flex justify-between items-center">
        <NuxtLink :to="`/services/${id}`" class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
          View Details
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: {
    type: [String, Number],
    required: true
  }
});
</script>