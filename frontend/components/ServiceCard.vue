<template>
    <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
        <div class="h-48 bg-purple-100 relative">
            <div v-if="service.imageUrls && service.imageUrls.length" class="w-full h-full">
                <img :src="service.imageUrls[0]" alt="Service" class="w-full h-full object-cover">
            </div>
            <div v-else class="w-full h-full flex items-center justify-center">
                <Icon name="entypo:image" class="text-purple-300 text-5xl" />
            </div>
            <div class="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-sm">
                {{ formatPrice(service.price) }}
            </div>
        </div>
        <div class="p-4">
            <div class="flex items-center mb-2">
                <div class="w-2 h-2 rounded-full" :class="categoryColor"></div>
                <span class="text-xs text-gray-500 ml-1">
                    {{ service.category ? service.category.name : 'Unknown Category' }}</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ service.serviceName }}</h3>
            <p class="text-sm text-gray-600 h-12 overflow-hidden">
                {{ truncateDescription(service.description) }}
            </p>
            <div class="flex items-center mt-3 text-sm text-gray-500">
                <Icon name="entypo:location-pin" class="mr-1" />
                <span>{{ truncateAddress(service.address) }}</span>
            </div>
            <div class="flex items-center justify-between mt-4">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gray-200 rounded-full mr-2">
                        <img v-if="service.provider && service.provider.profilePictureUrl"
                            :src="service.provider.profilePictureUrl" alt="Provider"
                            class="w-full h-full object-cover rounded-full">
                    </div>
                    <span class="text-sm">{{ service.provider ? service.provider.userName : 'Unknown Provider' }}</span>
                </div>
                <NuxtLink :to="`/services/${service.serviceId}`"
                    class="text-purple-600 hover:underline text-sm font-medium">
                    Details
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Service } from '~/services/serviceApi';

const props = defineProps<{
    service: Service
}>();

const categoryColors = {
    1: 'bg-green-500',  // Healthcare
    2: 'bg-pink-500',   // Beauty
    3: 'bg-blue-500',   // Fitness
    4: 'bg-yellow-500', // Automotive
    5: 'bg-red-500',    // Legal
    6: 'bg-indigo-500', // Education
    7: 'bg-gray-500',   // Tech Support
    8: 'bg-teal-500',   // Cleaning
};

const categoryColor = computed(() => {
    const id = props.service.categoryId;
    return categoryColors[id as keyof typeof categoryColors] || 'bg-purple-500';
});

const truncateDescription = (description: string) => {
    return description.length > 80 ? description.substring(0, 80) + '...' : description;
};

const truncateAddress = (address: string) => {
    return address.length > 25 ? address.substring(0, 25) + '...' : address;
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF' }).format(price);
};
</script>