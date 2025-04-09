<script setup lang="ts">
// Simple layout for login/auth pages
</script>

<template>
    <div class="min-h-screen font-Montserrat bg-gray-50">
        <AppNavbar />

        <!-- Main content -->
        <main class="pt-16">
            <slot />
        </main>
    </div>
</template>