<template>
    <div class="min-h-screen flex flex-col bg-gray-50">
        <AppNavbar />

        <div class="flex flex-grow pt-16">
            <!-- Sidebar -->
            <div class="bg-white w-64 shadow-md pt-6 hidden md:block">
                <div class="px-6 pb-6 border-b">
                    <h2 class="text-xl font-bold text-primary-purple">Admin Panel</h2>
                </div>

                <nav class="mt-6 px-3">
                    <NuxtLink to="/admin" class="flex items-center px-3 py-2.5 mb-1 rounded-lg"
                        :class="$route.path === '/admin' ? 'bg-purple-50 text-primary-purple' : 'text-gray-700 hover:bg-gray-100'">
                        <Icon name="entypo:gauge" class="mr-3" />
                        Dashboard
                    </NuxtLink>

                    <NuxtLink to="/admin/users" class="flex items-center px-3 py-2.5 mb-1 rounded-lg"
                        :class="$route.path.includes('/admin/users') ? 'bg-purple-50 text-primary-purple' : 'text-gray-700 hover:bg-gray-100'">
                        <Icon name="entypo:users" class="mr-3" />
                        Users
                    </NuxtLink>

                    <NuxtLink to="/admin/services" class="flex items-center px-3 py-2.5 mb-1 rounded-lg"
                        :class="$route.path.includes('/admin/services') ? 'bg-purple-50 text-primary-purple' : 'text-gray-700 hover:bg-gray-100'">
                        <Icon name="entypo:briefcase" class="mr-3" />
                        Services
                    </NuxtLink>

                    <NuxtLink to="/admin/categories" class="flex items-center px-3 py-2.5 mb-1 rounded-lg"
                        :class="$route.path.includes('/admin/categories') ? 'bg-purple-50 text-primary-purple' : 'text-gray-700 hover:bg-gray-100'">
                        <Icon name="entypo:list" class="mr-3" />
                        Categories
                    </NuxtLink>

                    <NuxtLink to="/admin/appointments" class="flex items-center px-3 py-2.5 mb-1 rounded-lg"
                        :class="$route.path.includes('/admin/appointments') ? 'bg-purple-50 text-primary-purple' : 'text-gray-700 hover:bg-gray-100'">
                        <Icon name="entypo:calendar" class="mr-3" />
                        Appointments
                    </NuxtLink>
                </nav>

                <div class="mt-auto px-6 py-4 border-t">
                    <NuxtLink to="/" class="flex items-center text-gray-600 hover:text-primary-purple">
                        <Icon name="entypo:arrow-left" class="mr-2" />
                        Back to Site
                    </NuxtLink>
                </div>
            </div>

            <!-- Main content -->
            <div class="flex-grow p-6 overflow-y-auto">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['admin'] // Create this middleware to check for admin role
});
</script>