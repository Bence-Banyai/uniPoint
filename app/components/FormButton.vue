<script setup lang="ts">
// No imports needed, use type casting directly
const props = defineProps({
  type: {
    type: String as unknown as PropType<'submit' | 'button' | 'reset'>,
    default: 'submit'
  }
});
</script>

<template>
  <button :type="type"
    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
    <slot></slot>
  </button>
</template>