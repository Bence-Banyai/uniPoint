<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <!-- Admin navigation cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <NuxtLink to="/admin/users"
                class="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow flex items-center">
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="entypo:users" class="text-purple-600 text-xl" />
                </div>
                <div>
                    <h3 class="text-lg font-medium text-gray-700">User Management</h3>
                    <p class="text-sm text-gray-500">Manage user accounts</p>
                </div>
            </NuxtLink>

            <NuxtLink to="/admin/services"
                class="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow flex items-center">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="entypo:briefcase" class="text-blue-600 text-xl" />
                </div>
                <div>
                    <h3 class="text-lg font-medium text-gray-700">Service Management</h3>
                    <p class="text-sm text-gray-500">Manage service listings</p>
                </div>
            </NuxtLink>

            <NuxtLink to="/admin/categories"
                class="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow flex items-center">
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="entypo:list" class="text-green-600 text-xl" />
                </div>
                <div>
                    <h3 class="text-lg font-medium text-gray-700">Category Management</h3>
                    <p class="text-sm text-gray-500">Manage service categories</p>
                </div>
            </NuxtLink>
        </div>

        <!-- Stats cards -->
        <h2 class="text-xl font-semibold mb-4">System Statistics</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white shadow-md rounded-lg p-6">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-lg font-medium text-gray-700">Total Users</h3>
                        <p class="text-3xl font-bold text-primary-purple mt-2">{{ stats.totalUsers }}</p>
                    </div>
                    <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Icon name="entypo:users" class="text-purple-600" />
                    </div>
                </div>
                <p class="text-sm text-gray-500 mt-2">
                    <span :class="stats.userGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
                        <Icon :name="stats.userGrowth >= 0 ? 'entypo:arrow-up' : 'entypo:arrow-down'"
                            class="inline-block" />
                        {{ Math.abs(stats.userGrowth) }}%
                    </span>
                    from last month
                </p>
            </div>

            <div class="bg-white shadow-md rounded-lg p-6">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-lg font-medium text-gray-700">Total Services</h3>
                        <p class="text-3xl font-bold text-primary-purple mt-2">{{ stats.totalServices }}</p>
                    </div>
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon name="entypo:briefcase" class="text-blue-600" />
                    </div>
                </div>
                <p class="text-sm text-gray-500 mt-2">
                    <span :class="stats.serviceGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
                        <Icon :name="stats.serviceGrowth >= 0 ? 'entypo:arrow-up' : 'entypo:arrow-down'"
                            class="inline-block" />
                        {{ Math.abs(stats.serviceGrowth) }}%
                    </span>
                    from last month
                </p>
            </div>

            <div class="bg-white shadow-md rounded-lg p-6">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-lg font-medium text-gray-700">Appointments Today</h3>
                        <p class="text-3xl font-bold text-primary-purple mt-2">{{ stats.appointmentsToday }}</p>
                    </div>
                    <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Icon name="entypo:calendar" class="text-green-600" />
                    </div>
                </div>
                <p class="text-sm text-gray-500 mt-2">
                    <span :class="stats.appointmentGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
                        <Icon :name="stats.appointmentGrowth >= 0 ? 'entypo:arrow-up' : 'entypo:arrow-down'"
                            class="inline-block" />
                        {{ Math.abs(stats.appointmentGrowth) }}%
                    </span>
                    from yesterday
                </p>
            </div>

            <div class="bg-white shadow-md rounded-lg p-6">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-lg font-medium text-gray-700">Active Categories</h3>
                        <p class="text-3xl font-bold text-primary-purple mt-2">{{ stats.activeCategories }}</p>
                    </div>
                    <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Icon name="entypo:list" class="text-yellow-600" />
                    </div>
                </div>
                <p class="text-sm text-gray-500 mt-2">Across all service types</p>
            </div>
        </div>

        <!-- Recent activity -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Recent appointments -->
            <div class="bg-white shadow-md rounded-lg p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Recent Appointments</h2>
                    <NuxtLink to="/admin/appointments" class="text-purple-600 hover:underline text-sm">View All
                    </NuxtLink>
                </div>

                <div v-if="loading" class="flex justify-center py-8">
                    <div class="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin">
                    </div>
                </div>

                <table v-else-if="recentAppointments.length > 0" class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Service
                            </th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="appointment in recentAppointments" :key="appointment.id">
                            <td class="px-4 py-2 whitespace-nowrap">
                                {{ appointment.userName }}
                            </td>
                            <td class="px-4 py-2 whitespace-nowrap">
                                {{ appointment.serviceName }}
                            </td>
                            <td class="px-4 py-2 whitespace-nowrap">
                                {{ formatDate(appointment.date) }}
                            </td>
                            <td class="px-4 py-2 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs rounded-full"
                                    :class="getStatusBadgeClass(appointment.status)">
                                    {{ appointment.status }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div v-else class="text-center py-8 text-gray-500">
                    No recent appointments found
                </div>
            </div>

            <!-- New users -->
            <div class="bg-white shadow-md rounded-lg p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">New Users</h2>
                    <NuxtLink to="/admin/users" class="text-purple-600 hover:underline text-sm">View All</NuxtLink>
                </div>

                <div v-if="loading" class="flex justify-center py-8">
                    <div class="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin">
                    </div>
                </div>

                <div v-else-if="newUsers.length > 0" class="space-y-4">
                    <div v-for="user in newUsers" :key="user.id"
                        class="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                        <div
                            class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4 text-purple-600 font-bold">
                            {{ user.userName[0].toUpperCase() }}
                        </div>
                        <div class="flex-grow">
                            <h4 class="font-medium">{{ user.userName }}</h4>
                            <p class="text-sm text-gray-500">{{ user.email }}</p>
                        </div>
                        <div>
                            <span class="px-2 py-1 text-xs rounded-full" :class="getRoleBadgeClass(user.role)">
                                {{ user.role }}
                            </span>
                        </div>
                    </div>
                </div>

                <div v-else class="text-center py-8 text-gray-500">
                    No new users
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

definePageMeta({
    layout: 'admin',
    middleware: ['admin'] // Create this middleware to check for admin role
});

const loading = ref(true);
const recentAppointments = ref([]);
const newUsers = ref([]);

// Stats would be fetched from the API
const stats = ref({
    totalUsers: 0,
    totalServices: 0,
    appointmentsToday: 0,
    activeCategories: 0,
    userGrowth: 0,
    serviceGrowth: 0,
    appointmentGrowth: 0
});

function getStatusBadgeClass(status) {
    switch (status) {
        case 'Completed':
            return 'bg-green-100 text-green-800';
        case 'Pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'Cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function getRoleBadgeClass(role) {
    switch (role) {
        case 'Admin':
            return 'bg-purple-100 text-purple-800';
        case 'Provider':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Fetch stats from your API endpoints
const fetchStats = async () => {
    try {
        // Replace with actual API calls
        const statsResponse = await fetch('/api/admin/stats');
        if (!statsResponse.ok) throw new Error('Failed to fetch stats');
        stats.value = await statsResponse.json();

        const appointmentsResponse = await fetch('/api/admin/recent-appointments');
        if (!appointmentsResponse.ok) throw new Error('Failed to fetch appointments');
        recentAppointments.value = await appointmentsResponse.json();

        const usersResponse = await fetch('/api/admin/new-users');
        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        newUsers.value = await usersResponse.json();
    } catch (error) {
        console.error('Error fetching admin data:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchStats();
});
</script>