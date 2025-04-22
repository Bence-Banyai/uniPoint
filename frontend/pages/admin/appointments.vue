<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">Manage Appointments</h1>

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
            <h2 class="text-xl font-semibold">Appointments</h2>
            <button @click="showAddModal = true"
                class="px-4 py-2 bg-gradient-purple text-white rounded-md hover:shadow-purple-glow transition-all">
                Add Open Appointment
            </button>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-12">
            <div class="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Appointments table -->
        <div v-else-if="appointments.length > 0" class="bg-white shadow-md rounded-lg overflow-x-auto">
            <table class="w-full min-w-[800px]">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booked By</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="appt in appointments" :key="appt.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div>
                                <div class="font-semibold">{{ appt.service?.serviceName || appt.serviceId }}</div>
                                <div class="text-xs text-gray-500">{{ appt.service?.address }}</div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            {{ formatDateTime(appt.appointmentDate) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 text-xs rounded-full" :class="getStatusBadgeClass(appt.status)">
                                {{ getStatusText(appt.status) }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span v-if="appt.booker">{{ appt.booker.userName }}<br><span
                                    class="text-xs text-gray-500">{{ appt.booker.email }}</span></span>
                            <span v-else class="text-gray-400">-</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <button @click="confirmDelete(appt)" class="text-red-600 hover:text-red-900">
                                <Icon name="entypo:trash" class="inline-block" /> Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="bg-white shadow-md rounded-lg p-8 text-center">
            <p class="text-gray-500 mb-4">No appointments found.</p>
            <button @click="fetchAppointments" class="text-purple-600 hover:underline">Refresh</button>
        </div>

        <!-- Add Appointment Modal -->
        <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 class="text-xl font-bold mb-4">Add Open Appointment</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Service</label>
                        <select v-model="newAppointment.serviceId"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option disabled value="">Select service</option>
                            <option v-for="service in services" :key="service.serviceId" :value="service.serviceId">
                                {{ service.serviceName }} ({{ service.address }})
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" v-model="newAppointment.date"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input type="time" v-model="newAppointment.time"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                </div>
                <div class="flex justify-end space-x-3 mt-6">
                    <button @click="closeAddModal" class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        Cancel
                    </button>
                    <button @click="createAppointment"
                        class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        :disabled="isSubmitting">
                        <Icon v-if="isSubmitting" name="entypo:cycle" class="animate-spin mr-1 inline-block" />
                        Add Appointment
                    </button>
                </div>
                <div v-if="formError" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {{ formError }}
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 class="text-xl font-bold mb-4">Confirm Delete</h2>
                <p class="mb-6">Are you sure you want to delete this appointment?</p>
                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        Cancel
                    </button>
                    <button @click="deleteAppointment"
                        class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" :disabled="isSubmitting">
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
import useAppointmentsApi from '../../composables/useAppointmentsApi';
import useServicesApi from '../../composables/useServicesApi';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
    layout: 'admin',
    middleware: ['admin']
});

const appointmentsApi = useAppointmentsApi();
const servicesApi = useServicesApi();
const authStore = useAuthStore();

const loading = ref(true);
const isSubmitting = ref(false);
const showAddModal = ref(false);
const showDeleteModal = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const formError = ref('');
const appointments = ref<any[]>([]);
const services = ref<any[]>([]);
const appointmentToDelete = ref<any>(null);

const newAppointment = ref({
    serviceId: '',
    date: '',
    time: ''
});

function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

function getStatusText(status: number) {
    switch (status) {
        case 0: return 'Open';
        case 1: return 'Scheduled';
        case 2: return 'Done';
        case 3: return 'Cancelled by User';
        case 4: return 'Cancelled by Service';
        default: return 'Unknown';
    }
}

function getStatusBadgeClass(status: number) {
    switch (status) {
        case 0: return 'bg-blue-100 text-blue-800';
        case 1: return 'bg-green-100 text-green-800';
        case 2: return 'bg-gray-100 text-gray-800';
        case 3: return 'bg-red-100 text-red-800';
        case 4: return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function closeAddModal() {
    showAddModal.value = false;
    formError.value = '';
    newAppointment.value = { serviceId: '', date: '', time: '' };
}

function confirmDelete(appt: any) {
    appointmentToDelete.value = appt;
    showDeleteModal.value = true;
}

async function fetchAppointments() {
    loading.value = true;
    try {
        const response = await appointmentsApi.getAll();
        appointments.value = Array.isArray(response) ? response : [];
    } catch (error: any) {
        errorMessage.value = error?.message || 'Failed to load appointments.';
        appointments.value = [];
    } finally {
        loading.value = false;
    }
}

async function fetchServices() {
    try {
        const response = await servicesApi.getAll();
        services.value = Array.isArray(response) ? response : [];
    } catch (error: any) {
        services.value = [];
    }
}

async function createAppointment() {
    formError.value = '';
    if (!newAppointment.value.serviceId || !newAppointment.value.date || !newAppointment.value.time) {
        formError.value = 'Please fill in all fields.';
        return;
    }
    isSubmitting.value = true;
    try {
        // Parse date and time as local time
        const [year = 0, month = 1, day = 0] = newAppointment.value.date.split('-').map(Number);
        const [hour = 0, minute = 0] = newAppointment.value.time.split(':').map(Number);
        // JS Date: months are 0-based
        const localDate = new Date(year, month - 1, day, hour, minute, 0, 0);

        // Log input and constructed date for debugging
        console.log('Input date:', newAppointment.value.date);
        console.log('Input time:', newAppointment.value.time);
        console.log('Parsed year:', year, 'month:', month, 'day:', day, 'hour:', hour, 'minute:', minute);
        console.log('Constructed localDate:', localDate);
        console.log('localDate.toISOString():', localDate.toISOString());

        if (isNaN(localDate.getTime())) {
            formError.value = 'Invalid date or time.';
            isSubmitting.value = false;
            return;
        }
        await appointmentsApi.createAsProvider({
            serviceId: Number(newAppointment.value.serviceId),
            appointmentDate: localDate.toISOString() // This will be UTC, but based on the local time you selected
        });
        successMessage.value = 'Appointment created successfully!';
        closeAddModal();
        await fetchAppointments();
        setTimeout(() => { successMessage.value = ''; }, 3000);
    } catch (error: any) {
        formError.value = error?.message || 'Failed to create appointment.';
    } finally {
        isSubmitting.value = false;
    }
}

async function deleteAppointment() {
    if (!appointmentToDelete.value) return;
    isSubmitting.value = true;
    try {
        await appointmentsApi.delete(appointmentToDelete.value.id);
        successMessage.value = 'Appointment deleted successfully!';
        showDeleteModal.value = false;
        appointmentToDelete.value = null;
        await fetchAppointments();
        setTimeout(() => { successMessage.value = ''; }, 3000);
    } catch (error: any) {
        errorMessage.value = error?.message || 'Failed to delete appointment.';
    } finally {
        isSubmitting.value = false;
    }
}

onMounted(async () => {
    loading.value = true;
    await fetchServices();
    await fetchAppointments();
    loading.value = false;
});
</script>
