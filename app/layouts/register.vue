<script setup lang="ts">
// No business logic or definePageMeta here, just layout structure
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppNavbar />

    <main class="flex-grow pt-16 flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <slot />
      </div>
    </main>

    <AppFooter />
  </div>
</template>