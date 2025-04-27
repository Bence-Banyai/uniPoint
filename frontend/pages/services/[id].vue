<template>
    <div class="container mx-auto px-4 py-8">
        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>

        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{{ error }}</p>
            <button @click="fetchServiceDetails" class="mt-2 bg-red-500 text-white px-4 py-2 rounded">Retry</button>
        </div>

        <div v-else>
            <div class="bg-purple-100 p-4 mb-4 rounded flex items-center justify-between">
                <div>
                    <NuxtLink to="/services" class="text-purple-600 hover:underline mb-2 inline-block">
                        <Icon name="entypo:chevron-left" class="inline" /> Back to services
                    </NuxtLink>
                    <h1 class="text-2xl font-bold">{{ service.serviceName }}</h1>
                </div>
                <div class="bg-purple-600 text-white px-4 py-2 rounded-full text-lg font-bold">
                    {{ formatPrice(service.price) }}
                </div>
            </div>

            <!-- Dynamic content based on actual service details -->
            <div class="container mx-auto px-4 py-8 flex">
                <div class="w-2/3 pr-8">
                    <div class="bg-gray-200 h-96 mb-4 relative">
                        <div v-if="service.imageUrls && service.imageUrls.length > 0" class="w-full h-full">
                            <img :src="service.imageUrls[selectedImageIndex]" alt="Service"
                                class="w-full h-full object-cover">
                        </div>
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <Icon name="entypo:image" class="text-gray-400 text-6xl" />
                        </div>
                    </div>
                    <div v-if="service.imageUrls && service.imageUrls.length > 1" class="flex space-x-2">
                        <div v-for="(image, index) in service.imageUrls" :key="index"
                            @click="selectedImageIndex = index" class="w-16 h-16 bg-gray-200 cursor-pointer"
                            :class="{ 'border-2 border-purple-600': selectedImageIndex === index }">
                            <img :src="image" alt="Service thumbnail" class="w-full h-full object-cover">
                        </div>
                    </div>
                </div>
                <div class="w-1/3 bg-white p-6 rounded-lg shadow-md">
                    <div class="flex items-center mb-4">
                        <div class="w-16 h-16 bg-gray-200 rounded-full mr-4 overflow-hidden">
                            <img v-if="service.provider && service.provider.profilePictureUrl"
                                :src="service.provider.profilePictureUrl" alt="Provider"
                                class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold">
                                {{ service.provider ? service.provider.userName : 'Service Provider' }}
                            </h3>
                            <p v-if="service.category" class="text-gray-600">{{ service.category.name }} Professional
                            </p>
                        </div>
                    </div>
                    <h4 class="text-lg font-bold mb-2">About the Service</h4>
                    <p class="text-gray-600 mb-4">{{ service.description }}</p>
                    <div class="flex items-center mb-2">
                        <Icon name="entypo:location-pin" class="h-5 w-5 text-gray-600 mr-2" />
                        <span class="text-gray-600">{{ service.address }}</span>
                    </div>
                    <!-- Display provider location instead of phone number if available -->
                    <div v-if="service.provider && service.provider.location" class="flex items-center mb-2">
                        <Icon name="entypo:home" class="h-5 w-5 text-gray-600 mr-2" />
                        <span class="text-gray-600">{{ service.provider.location }}</span>
                    </div>
                    <div v-if="service.provider && service.provider.email" class="flex items-center mb-4">
                        <Icon name="entypo:mail" class="h-5 w-5 text-gray-600 mr-2" />
                        <span class="text-gray-600">{{ service.provider.email }}</span>
                    </div>
                </div>
            </div>

            <ServiceDetailsBottom :service="service" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { serviceApi, type Service } from '~/services/serviceApi';

const route = useRoute();
const serviceId = computed(() => route.params.id);

// State
const service = ref<Service>({} as Service);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedImageIndex = ref(0);

// Fetch service details
const fetchServiceDetails = async () => {
    loading.value = true;
    error.value = null;

    try {
        if (!serviceId.value) {
            throw new Error("Service ID is undefined.");
        }
        const data = await serviceApi.getServiceById(serviceId.value as string | string[]);
        service.value = data;
    } catch (err) {
        error.value = "Failed to load service details. Please try again later.";
        console.error("Error fetching service details:", err);
    } finally {
        loading.value = false;
    }
};

// Format price
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF' }).format(price);
};

// Fetch data on component mount
onMounted(() => {
    fetchServiceDetails();
});

definePageMeta({
    layout: 'default',
    title: 'Service Details | UniPoint',
    description: 'Detailed information about the service'
});
</script>