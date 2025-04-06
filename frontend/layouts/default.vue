<script setup lang="ts">

</script>

<template>
    <div class="min-h-screen flex flex-col">
        <AppNavbar />

        <main class="flex-grow pt-16">
            <slot />
        </main>

        <AppFooter />
    </div>
</template>