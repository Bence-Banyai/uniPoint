<template>
    <div class="container mx-auto px-4 py-8">
        <div class="bg-purple-100 p-4 mb-4 rounded">
            <h1 class="text-2xl font-bold">Service Details for ID: {{ $route.params.id }}</h1>
        </div>
        <ServiceDetailsTop />
        <ServiceDetailsBottom />
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const serviceId = computed(() => route.params.id);

// Optional: Log the ID to verify it's being received
console.log('Service ID:', serviceId.value);

definePageMeta({
    layout: 'default',
    title: 'Service Details | UniPoint',
    description: 'Detailed information about the service'
});
</script>