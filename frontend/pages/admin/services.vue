<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">Manage Services</h1>

        <!-- Toast notifications -->
        <div v-if="errorMessage"
            class="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 shadow-lg flex items-center">
            <span>{{ errorMessage }}</span>
            <button @click="errorMessage = ''" class="ml-4 text-red-500 hover:text-red-700">
                <Icon name="mdi:close" />
            </button>
        </div>
        <div v-if="successMessage"
            class="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 shadow-lg flex items-center">
            <span>{{ successMessage }}</span>
            <button @click="successMessage = ''" class="ml-4 text-green-500 hover:text-green-700">
                <Icon name="mdi:close" />
            </button>
        </div>

        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">Services</h2>
            <button @click="showAddModal = true"
                class="px-4 py-2 bg-gradient-purple text-white rounded-md hover:shadow-purple-glow transition-all">
                Add Service
            </button>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-12">
            <div class="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Services table -->
        <div v-else-if="services.length > 0" class="bg-white shadow-md rounded-lg overflow-x-auto">
            <table class="w-full min-w-[900px]">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="service in services" :key="service.serviceId">
                        <td class="px-6 py-4 whitespace-nowrap font-semibold">{{ service.serviceName }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span v-if="service.provider">{{ service.provider.userName }}<br><span
                                    class="text-xs text-gray-500">{{ service.provider.email }}</span></span>
                            <span v-else class="text-gray-400">-</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span v-if="service.category">{{ service.category.name }}</span>
                            <span v-else class="text-gray-400">-</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ formatPrice(service.price) }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ service.address }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <button @click="editService(service)" class="text-purple-600 hover:text-purple-900 mr-3">
                                <Icon name="entypo:edit" class="inline-block" /> Edit
                            </button>
                            <button @click="confirmDelete(service)" class="text-red-600 hover:text-red-900">
                                <Icon name="entypo:trash" class="inline-block" /> Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="bg-white shadow-md rounded-lg p-8 text-center">
            <p class="text-gray-500 mb-4">No services found.</p>
            <button @click="fetchServices" class="text-purple-600 hover:underline">Refresh</button>
        </div>

        <!-- Add/Edit Modal -->
        <div v-if="showAddModal || showEditModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 class="text-xl font-bold mb-4">{{ showAddModal ? 'Add Service' : 'Edit Service' }}</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" v-model="serviceForm.serviceName"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select v-model="serviceForm.categoryId"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option disabled value="">Select category</option>
                            <option v-for="cat in categories" :key="cat.categoryId" :value="cat.categoryId">{{ cat.name
                            }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input type="number" v-model.number="serviceForm.price"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input type="text" v-model="serviceForm.address"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea v-model="serviceForm.description"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                        <input type="number" v-model.number="serviceForm.duration"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div class="flex space-x-2">
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Opens At</label>
                            <input type="time" v-model="serviceForm.opensAt"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Closes At</label>
                            <input type="time" v-model="serviceForm.closesAt"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                    </div>
                </div>
                <div class="flex justify-end space-x-3 mt-6">
                    <button @click="closeModals"
                        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                    <button @click="saveService"
                        class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        :disabled="isSubmitting">
                        <Icon v-if="isSubmitting" name="entypo:cycle" class="animate-spin mr-1 inline-block" />
                        {{ showAddModal ? 'Add Service' : 'Save Changes' }}
                    </button>
                </div>
                <div v-if="formError" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{{ formError }}</div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 class="text-xl font-bold mb-4">Confirm Delete</h2>
                <p class="mb-6">Are you sure you want to delete service <strong>{{ serviceToDelete?.serviceName
                }}</strong>? This action cannot be undone.</p>
                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                    <button @click="deleteService" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        :disabled="isSubmitting">
                        <Icon v-if="isSubmitting" name="entypo:cycle" class="animate-spin mr-1 inline-block" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRuntimeConfig } from '#app';


definePageMeta({
    layout: 'admin',
    middleware: ['admin']
});

// You may want to create a composable for admin service API, but for now use fetch directly
const loading = ref(true);
const isSubmitting = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const formError = ref('');
const services = ref<any[]>([]);
const categories = ref<any[]>([]);
const serviceToDelete = ref<any>(null);
const serviceForm = ref<any>({
    serviceId: '',
    serviceName: '',
    categoryId: '',
    price: 0,
    address: '',
    description: '',
    duration: 0,
    opensAt: '',
    closesAt: ''
});

function formatPrice(price: number) {
    return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF' }).format(price);
}

function closeModals() {
    showAddModal.value = false;
    showEditModal.value = false;
    showDeleteModal.value = false;
    formError.value = '';
    resetForm();
}

function resetForm() {
    serviceForm.value = {
        serviceId: '',
        serviceName: '',
        categoryId: '',
        price: 0,
        address: '',
        description: '',
        duration: 0,
        opensAt: '',
        closesAt: ''
    };
}

function editService(service: any) {
    serviceForm.value = {
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        categoryId: service.categoryId,
        price: service.price,
        address: service.address,
        description: service.description,
        duration: service.duration,
        opensAt: service.opensAt ? service.opensAt.substring(0, 5) : '',
        closesAt: service.closesAt ? service.closesAt.substring(0, 5) : ''
    };
    showEditModal.value = true;
}

function confirmDelete(service: any) {
    serviceToDelete.value = service;
    showDeleteModal.value = true;
}

async function fetchServices() {
    loading.value = true;
    try {
        const config = useRuntimeConfig();
        const response = await $fetch(`${config.public.apiBaseUrl}/api/Service`);
        services.value = Array.isArray(response) ? response : [];
    } catch (error: any) {
        errorMessage.value = error?.message || 'Failed to load services.';
        services.value = [];
    } finally {
        loading.value = false;
    }
}

async function fetchCategories() {
    try {
        const config = useRuntimeConfig();
        const response = await $fetch(`${config.public.apiBaseUrl}/api/Category`);
        categories.value = Array.isArray(response) ? response : [];
    } catch (error: any) {
        categories.value = [];
    }
}

async function saveService() {
    formError.value = '';
    isSubmitting.value = true;
    try {
        const config = useRuntimeConfig();
        const payload = {
            serviceName: serviceForm.value.serviceName,
            categoryId: Number(serviceForm.value.categoryId),
            price: Number(serviceForm.value.price),
            address: serviceForm.value.address,
            description: serviceForm.value.description,
            duration: Number(serviceForm.value.duration),
            opensAt: serviceForm.value.opensAt,
            closesAt: serviceForm.value.closesAt
        };
        if (showAddModal.value) {
            await $fetch(`${config.public.apiBaseUrl}/api/Service`, {
                method: 'POST',
                body: payload
            });
            successMessage.value = 'Service added successfully!';
        } else if (showEditModal.value) {
            await $fetch(`${config.public.apiBaseUrl}/api/Service/${serviceForm.value.serviceId}`, {
                method: 'PUT',
                body: { ...payload, serviceId: serviceForm.value.serviceId }
            });
            successMessage.value = 'Service updated successfully!';
        }
        closeModals();
        await fetchServices();
        setTimeout(() => { successMessage.value = ''; }, 3000);
    } catch (error: any) {
        formError.value = error?.message || 'Failed to save service.';
    } finally {
        isSubmitting.value = false;
    }
}

async function deleteService() {
    if (!serviceToDelete.value) return;
    isSubmitting.value = true;
    try {
        const config = useRuntimeConfig();
        await $fetch(`${config.public.apiBaseUrl}/api/Service/${serviceToDelete.value.serviceId}`, {
            method: 'DELETE'
        });
        successMessage.value = 'Service deleted successfully!';
        showDeleteModal.value = false;
        serviceToDelete.value = null;
        await fetchServices();
        setTimeout(() => { successMessage.value = ''; }, 3000);
    } catch (error: any) {
        errorMessage.value = error?.message || 'Failed to delete service.';
    } finally {
        isSubmitting.value = false;
    }
}

onMounted(async () => {
    loading.value = true;
    await fetchCategories();
    await fetchServices();
    loading.value = false;
});
</script>
