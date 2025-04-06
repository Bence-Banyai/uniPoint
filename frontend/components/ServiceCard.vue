<script setup>
defineProps({
    id: {
        type: [Number, String],
        required: true
    }
});
</script>

<template>
    <NuxtLink :to="`/services/${id}`" class="block">
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div class="h-40 bg-gray-300"></div>
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">Service Title</h3>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore.
                </p>
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full bg-gray-400 mr-2"></div>
                        <span class="text-sm text-gray-700">Provider Name</span>
                    </div>
                    <div class="text-purple-600 font-semibold">$50</div>
                </div>
            </div>
        </div>
    </NuxtLink>
</template>