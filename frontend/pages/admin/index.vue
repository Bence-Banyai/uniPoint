<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <!-- Admin navigation cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            <NuxtLink to="/admin"
                class="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow flex items-center">
                <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    <Icon name="entypo:gauge" class="text-primary-purple text-xl" />
                </div>
                <div>
                    <h3 class="text-lg font-medium text-gray-700">Dashboard</h3>
                    <p class="text-sm text-gray-500">Overview & stats</p>
                </div>
            </NuxtLink>
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
            <NuxtLink to="/admin/appointments"
                class="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow flex items-center">
                <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="entypo:calendar" class="text-yellow-600 text-xl" />
                </div>
                <div>
                    <h3 class="text-lg font-medium text-gray-700">Appointment Management</h3>
                    <p class="text-sm text-gray-500">Manage appointments</p>
                </div>
            </NuxtLink>
        </div>

        <!-- System statistics unavailable -->
        <div class="bg-white shadow-md rounded-lg p-6 text-center text-gray-500">
            <p>System statistics and recent activity are not available in this version.</p>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
    middleware: ['admin'] // Create this middleware to check for admin role
});
</script>