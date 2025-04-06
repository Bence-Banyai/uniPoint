<script setup lang="ts">
// No need to import defineProps, it's auto-imported by Nuxt
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        default: ''
    }
});
</script>

<template>
    <div class="space-y-6">
        <div>
            <h2 class="text-3xl font-extrabold text-gray-900">{{ title }}</h2>
            <p v-if="subtitle" class="mt-2 text-sm text-gray-600">{{ subtitle }}</p>
        </div>

        <slot></slot>
    </div>
</template>