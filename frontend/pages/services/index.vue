<template>
    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-8">
            <div class="relative w-1/2">
                <input type="text" placeholder="Search services..." v-model="searchQuery"
                    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <button class="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
                    <Icon name="entypo:magnifying-glass" class="h-5 w-5" />
                </button>
            </div>
            <button @click="toggleSortByPopularity" class="px-4 py-2 rounded-md transition-colors"
                :class="{ 'bg-purple-600 text-white': sortByPopularity, 'bg-gray-200 text-gray-700': !sortByPopularity }">
                Sort by Price
            </button>
        </div>

        <div v-if="loading" class="flex justify-center items-center h-40">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>

        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{{ error }}</p>
            <button @click="fetchServices" class="mt-2 bg-red-500 text-white px-4 py-2 rounded">Retry</button>
        </div>

        <div v-else class="flex">
            <aside class="w-1/4 pr-8">
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h3 class="text-xl font-bold mb-4">Filters</h3>
                    <ul class="space-y-2">
                        <li>
                            <button @click="activeCategory = null" class="block w-full text-left"
                                :class="activeCategory === null ? 'text-purple-600 font-medium' : 'text-gray-700 hover:text-purple-600'">
                                All
                            </button>
                        </li>
                        <li v-for="category in categories" :key="category.categoryId">
                            <button @click="setActiveCategory(category.categoryId)"
                                class=" w-full text-left flex items-center space-x-2"
                                :class="activeCategory === category.categoryId ? 'text-purple-600 font-medium' : 'text-gray-700 hover:text-purple-600'">
                                <img v-if="category.iconUrl" :src="category.iconUrl" alt="icon"
                                    class="w-6 h-6 rounded-full object-cover mr-2" />
                                <span>{{ category.name }}</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </aside>

            <main class="w-3/4">
                <div v-if="displayedServices.length === 0" class="text-center py-10">
                    <p class="text-gray-500">No services found matching your criteria.</p>
                </div>
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ServiceCard v-for="service in displayedServices" :key="service.serviceId" :service="service" />
                </div>

                <div class="flex justify-center mt-8">
                    <Pagination v-if="totalPages > 1" :currentPage="currentPage" :totalPages="totalPages"
                        @page-change="handlePageChange" />
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { serviceApi, type Service, type Category } from '../../services/serviceApi';

definePageMeta({
    layout: "default",
    title: "Services | UniPoint",
    description: "Browse and book services on UniPoint",
});

// State
const services = ref<Service[]>([]);
const categories = ref<Category[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref("");
const activeCategory = ref<number | null>(null);
const sortByPopularity = ref(false);
const currentPage = ref(1);
const itemsPerPage = 9;

// Fetch data
const fetchServices = async () => {
    loading.value = true;
    error.value = null;

    try {
        // First, fix the Promise.all call - you were only fetching categories
        const servicesData = await serviceApi.getAllServices();
        const categoriesData = await serviceApi.getAllCategories();

        console.log('Fetched services:', servicesData);
        console.log('Fetched categories:', categoriesData);

        // Update state
        services.value = servicesData || [];
        categories.value = categoriesData || [];

        console.log('Updated services state:', services.value);
        console.log('Updated categories state:', categories.value);
    } catch (err) {
        error.value = "Failed to load services. Please try again later.";
        console.error("Error fetching services:", err);
    } finally {
        loading.value = false;
    }
};

// Filter and sort services
const filteredServices = computed(() => {
    let result = [...services.value];

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(service =>
            service.serviceName.toLowerCase().includes(query) ||
            service.description.toLowerCase().includes(query) ||
            service.address.toLowerCase().includes(query)
        );
    }

    // Filter by category
    if (activeCategory.value !== null) {
        result = result.filter(service => service.categoryId === activeCategory.value);
    }

    // Sort by popularity (simulated with price for now - you could use ratings in the future)
    if (sortByPopularity.value) {
        result.sort((a, b) => b.price - a.price);
    }

    return result;
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredServices.value.length / itemsPerPage));

const displayedServices = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredServices.value.slice(startIndex, endIndex);
});

// Methods
const toggleSortByPopularity = () => {
    sortByPopularity.value = !sortByPopularity.value;
};

const setActiveCategory = (categoryId: number) => {
    activeCategory.value = categoryId;
    currentPage.value = 1; // Reset to first page when changing category
};

const handlePageChange = (page: number) => {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Reset page when filters change
watch([searchQuery, activeCategory], () => {
    currentPage.value = 1;
});

// Fetch data on component mount
onMounted(() => {
    console.log('Component mounted, fetching services...');
    fetchServices();
});
</script>