<template>
    <div class="flex items-center space-x-1">
        <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 rounded-md"
            :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'">
            <Icon name="entypo:chevron-left" />
        </button>

        <template v-for="page in visiblePages" :key="page">
            <button v-if="page === '...'" class="px-3 py-1 bg-gray-100 text-gray-500 rounded-md cursor-default">
                {{ page }}
            </button>
            <button v-else @click="goToPage(page)" class="px-3 py-1 rounded-md"
                :class="currentPage === page ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'">
                {{ page }}
            </button>
        </template>

        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 rounded-md"
            :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'">
            <Icon name="entypo:chevron-right" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    currentPage: number;
    totalPages: number;
}>();

const emit = defineEmits<{
    (e: 'page-change', page: number): void;
}>();

const visiblePages = computed(() => {
    const pages = [];
    const totalPages = props.totalPages;
    const currentPage = props.currentPage;

    if (totalPages <= 7) {
        // Show all pages if there are 7 or fewer
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        // Always include first page
        pages.push(1);

        if (currentPage > 3) {
            pages.push('...');
        }

        // Add pages around current page
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push('...');
        }

        // Always include last page
        pages.push(totalPages);
    }

    return pages;
});

function prevPage() {
    if (props.currentPage > 1) {
        emit('page-change', props.currentPage - 1);
    }
}

function nextPage() {
    if (props.currentPage < props.totalPages) {
        emit('page-change', props.currentPage + 1);
    }
}

function goToPage(page: number | string) {
    if (typeof page === 'number' && page !== props.currentPage) {
        emit('page-change', page);
    }
}
</script>