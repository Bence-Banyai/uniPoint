<template>
    <div class="container mx-auto px-4 py-8 pt-24">
        <h1 class="text-3xl font-bold text-center mb-8">My Profile</h1>

        <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <div v-if="isLoading" class="flex justify-center p-8">
                <div class="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <div v-else>
                <div class="flex items-center mb-6">
                    <div
                        class="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center text-2xl font-bold text-purple-600">
                        {{ authStore.user.userName?.[0]?.toUpperCase() || 'U' }}
                    </div>
                    <div class="ml-4">
                        <h2 class="text-2xl font-bold">{{ authStore.user.userName || 'User' }}</h2>
                        <p class="text-gray-600">{{ authStore.user.email || 'No email provided' }}</p>
                    </div>
                </div>

                <div class="mb-6">
                    <h3 class="text-xl font-semibold mb-2">User Information</h3>
                    <div class="bg-gray-50 p-4 rounded-md">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-500">Username</p>
                                <p>{{ authStore.user.userName || 'Not set' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Email</p>
                                <p>{{ authStore.user.email || 'Not set' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Role</p>
                                <p>{{ authStore.user.role || 'User' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Location</p>
                                <p>{{ authStore.user.location || 'Not set' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">User ID</p>
                                <p class="truncate">{{ authStore.userId || 'Not available' }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-8">
                    <h3 class="text-xl font-semibold mb-4">My Appointments</h3>

                    <div class="flex space-x-4 mb-4">
                        <button @click="activeFilter = 'all'"
                            :class="{ 'bg-purple-600 text-white': activeFilter === 'all', 'bg-gray-200': activeFilter !== 'all' }"
                            class="px-4 py-2 rounded-md transition-colors">
                            All
                        </button>
                        <button @click="activeFilter = 'upcoming'"
                            :class="{ 'bg-purple-600 text-white': activeFilter === 'upcoming', 'bg-gray-200': activeFilter !== 'upcoming' }"
                            class="px-4 py-2 rounded-md transition-colors">
                            Upcoming
                        </button>
                        <button @click="activeFilter = 'past'"
                            :class="{ 'bg-purple-600 text-white': activeFilter === 'past', 'bg-gray-200': activeFilter !== 'past' }"
                            class="px-4 py-2 rounded-md transition-colors">
                            Past
                        </button>
                    </div>

                    <div v-if="filteredAppointments.length > 0" class="space-y-4">
                        <div v-for="appointment in filteredAppointments" :key="appointment.id"
                            class="bg-white p-4 rounded-lg shadow-md border-l-4"
                            :class="getStatusClass(appointment.status)">
                            <div class="flex justify-between">
                                <div>
                                    <h4 class="font-bold text-lg">
                                        {{ appointment.service?.serviceName || 'Unknown Service' }}</h4>
                                    <p class="text-gray-600">{{ formatDateTime(appointment.appointmentDate) }}</p>
                                    <p class="text-gray-600">{{ appointment.service?.address || 'No address' }}</p>
                                </div>
                                <div>
                                    <span class="px-2 py-1 rounded-full text-xs"
                                        :class="getStatusBadgeClass(appointment.status)">
                                        {{ getStatusText(appointment.status) }}
                                    </span>
                                </div>
                            </div>

                            <div class="flex mt-4" v-if="canCancelAppointment(appointment)">
                                <button @click="cancelAppointment(appointment.id)"
                                    class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                    Cancel Appointment
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-else class="text-center py-8 bg-gray-50 rounded-lg">
                        <p class="text-gray-500">No appointments found.</p>
                        <NuxtLink to="/services"
                            class="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                            Book a Service
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth';
import useAppointmentsApi from '../../composables/useAppointmentsApi';

definePageMeta({
    title: 'My Profile | UniPoint',
    description: 'View and manage your UniPoint profile',
    meta: {
        requiresAuth: true
    }
});

const authStore = useAuthStore();
const isLoading = ref(true);
const appointments = ref([]);
const activeFilter = ref('all');

const filteredAppointments = computed(() => {
    if (activeFilter.value === 'all') {
        return appointments.value;
    }

    const now = new Date();

    if (activeFilter.value === 'upcoming') {
        return appointments.value.filter(app => {
            const appDate = new Date(app.appointmentDate);
            return appDate > now && app.status !== 3 && app.status !== 4; // Not cancelled
        });
    }

    // Past appointments
    return appointments.value.filter(app => {
        const appDate = new Date(app.appointmentDate);
        return appDate <= now || app.status === 3 || app.status === 4; // Past or cancelled
    });
});

const getStatusText = (status) => {
    switch (status) {
        case 0: return 'Open';
        case 1: return 'Scheduled';
        case 2: return 'Completed';
        case 3: return 'Cancelled by User';
        case 4: return 'Cancelled by Provider';
        default: return 'Unknown';
    }
};

const getStatusClass = (status) => {
    switch (status) {
        case 0: return 'border-blue-400';
        case 1: return 'border-green-400';
        case 2: return 'border-purple-400';
        case 3:
        case 4: return 'border-red-400';
        default: return 'border-gray-400';
    }
};

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 0: return 'bg-blue-100 text-blue-800';
        case 1: return 'bg-green-100 text-green-800';
        case 2: return 'bg-purple-100 text-purple-800';
        case 3:
        case 4: return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const canCancelAppointment = (appointment) => {
    // Can only cancel if appointment is scheduled and in the future
    const now = new Date();
    const appDate = new Date(appointment.appointmentDate);
    return appointment.status === 1 && appDate > now;
};

const cancelAppointment = async (id) => {
    try {
        const appointmentsApi = useAppointmentsApi();
        await appointmentsApi.cancel(id);

        // Refresh appointments
        fetchAppointments();
    } catch (error) {
        console.error("Error cancelling appointment:", error);
    }
};

const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
};

const fetchAppointments = async () => {
    try {
        const appointmentsApi = useAppointmentsApi();
        const response = await appointmentsApi.getAll();
        appointments.value = response.data;
    } catch (error) {
        console.error("Error fetching appointments:", error);
    }
};

onMounted(async () => {
    isLoading.value = true;

    try {
        // First get user info
        const userResult = await authStore.getUserInfo();

        if (!userResult.success) {
            console.error("Failed to fetch user info:", userResult.message);
        }

        // For debugging purposes
        console.log("Profile loaded user data:", {
            userName: authStore.user.userName,
            email: authStore.user.email,
            location: authStore.user.location || "Location not available",
            role: authStore.user.role
        });

        // If location is still null after getUserInfo, try to get it from localStorage (for web) or another source
        if (!authStore.user.location) {
            console.warn("Location still null, checking alternative sources");

            // For web platforms, check localStorage
            if (process.client && window.localStorage) {
                const storedLocation = localStorage.getItem('userLocation');
                if (storedLocation) {
                    console.log("Found location in localStorage:", storedLocation);
                    // Update the user in the store with this location
                    authStore.setUser({
                        ...authStore.user,
                        location: storedLocation
                    });
                }
            }
        }

        // Then try to get appointments if user role is appropriate
        const appointmentsApi = useAppointmentsApi();
        try {
            const appointmentsResponse = await appointmentsApi.getAll();
            appointments.value = appointmentsResponse || [];
        } catch (appointmentsError) {
            console.error("Error fetching appointments:", appointmentsError);
            // Continue without appointments
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    } finally {
        isLoading.value = false;
    }

    fetchAppointments();
});
</script>