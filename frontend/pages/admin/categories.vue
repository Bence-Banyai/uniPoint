<template>
    <div>
        <!-- Toast notifications -->
        <div v-if="errorMessage"
            class="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 shadow-lg flex items-center">
            <span>{{ errorMessage }}</span>
            <button @click="errorMessage = ''" class="ml-4 text-red-500 hover:text-red-700">
                <Icon name="mdi:close" />
            </button>
        </div>
        <div v-if="successMessage"
            class="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 shadow-lg flex items-center">
            <span>{{ successMessage }}</span>
            <button @click="successMessage = ''" class="ml-4 text-green-500 hover:text-green-700">
                <Icon name="mdi:close" />
            </button>
        </div>

        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Manage Categories</h1>
            <button @click="showAddModal = true"
                class="px-4 py-2 bg-gradient-purple text-white rounded-md hover:shadow-purple-glow transition-all">
                Add New Category
            </button>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-12">
            <div class="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Categories table -->
        <div v-else-if="categories.length > 0" class="bg-white shadow-md rounded-lg overflow-hidden">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="cat in categories" :key="cat.categoryId">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <img :src="cat.iconUrl" alt="icon" class="w-10 h-10 rounded-full object-cover border" />
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap font-semibold">{{ cat.name }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <button @click="editCategory(cat)" class="text-purple-600 hover:text-purple-900 mr-3">
                                <Icon name="entypo:edit" class="inline-block" /> Edit
                            </button>
                            <button @click="confirmDelete(cat)" class="text-red-600 hover:text-red-900 mr-3">
                                <Icon name="entypo:trash" class="inline-block" /> Delete
                            </button>
                            <button @click="showIconModalFor(cat)" class="text-blue-600 hover:text-blue-900">
                                <Icon name="mdi:image-edit" class="inline-block" /> Change Icon
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Empty state -->
        <div v-else class="bg-white shadow-md rounded-lg p-8 text-center">
            <p class="text-gray-500 mb-4">No categories found.</p>
            <button @click="fetchCategories" class="text-purple-600 hover:underline">Refresh</button>
        </div>

        <!-- Add/Edit Modal -->
        <div v-if="showAddModal || showEditModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 class="text-xl font-bold mb-4">{{ showAddModal ? 'Add New Category' : 'Edit Category' }}</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" v-model="categoryForm.name"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter category name" />
                    </div>
                </div>
                <div class="flex justify-end space-x-3 mt-6">
                    <button @click="closeModals"
                        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                    <button @click="saveCategory"
                        class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        :disabled="isSubmitting">
                        <Icon v-if="isSubmitting" name="entypo:cycle" class="animate-spin mr-1 inline-block" />
                        {{ showAddModal ? 'Add Category' : 'Save Changes' }}
                    </button>
                </div>
                <div v-if="formError" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{{ formError }}</div>
            </div>
        </div>

        <!-- Icon Upload Modal -->
        <div v-if="showIconModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 class="text-xl font-bold mb-4">Change Category Icon</h2>
                <div class="mb-4 flex flex-col items-center">
                    <img :src="iconModalCategory?.iconUrl" alt="icon"
                        class="w-20 h-20 rounded-full object-cover border mb-4" />
                    <input type="file" accept="image/*" @change="onIconFileChange" />
                </div>
                <div class="flex justify-end space-x-3 mt-6">
                    <button @click="closeIconModal"
                        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                    <button @click="uploadIcon" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        :disabled="isUploadingIcon">
                        <Icon v-if="isUploadingIcon" name="entypo:cycle" class="animate-spin mr-1 inline-block" />
                        Upload
                    </button>
                </div>
                <div v-if="iconError" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{{ iconError }}</div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 class="text-xl font-bold mb-4">Confirm Delete</h2>
                <p class="mb-6">Are you sure you want to delete category <strong>{{ categoryToDelete?.name }}</strong>?
                    This action cannot be undone.</p>
                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                    <button @click="deleteCategory" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        :disabled="isSubmitting">
                        <Icon v-if="isSubmitting" name="entypo:cycle" class="animate-spin mr-1 inline-block" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';

definePageMeta({
    layout: 'admin',
    middleware: ['admin']
});

const loading = ref(true);
const isSubmitting = ref(false);
const isUploadingIcon = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showIconModal = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const formError = ref('');
const iconError = ref('');
const categories = ref<any[]>([]);
const categoryToDelete = ref<any>(null);
const iconModalCategory = ref<any>(null);
const iconFile = ref<File | null>(null);
const categoryForm = ref<any>({
    categoryId: '',
    name: ''
});

function closeModals() {
    showAddModal.value = false;
    showEditModal.value = false;
    showDeleteModal.value = false;
    formError.value = '';
    resetForm();
}

function resetForm() {
    categoryForm.value = {
        categoryId: '',
        name: ''
    };
}

function editCategory(cat: any) {
    categoryForm.value = {
        categoryId: cat.categoryId,
        name: cat.name
    };
    showEditModal.value = true;
}

function confirmDelete(cat: any) {
    categoryToDelete.value = cat;
    showDeleteModal.value = true;
}

function showIconModalFor(cat: any) {
    iconModalCategory.value = cat;
    showIconModal.value = true;
    iconFile.value = null;
    iconError.value = '';
}

function closeIconModal() {
    showIconModal.value = false;
    iconModalCategory.value = null;
    iconFile.value = null;
    iconError.value = '';
}

function onIconFileChange(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
        iconFile.value = null;
    }
}

async function fetchCategories() {
    loading.value = true;
    try {
        const config = useRuntimeConfig();
        const response = await $fetch(`${config.public.apiBaseUrl}/api/Category`);
        categories.value = Array.isArray(response) ? response : [];
    } catch (error: any) {
        errorMessage.value = error?.message || 'Failed to load categories.';
        categories.value = [];
    } finally {
        loading.value = false;
    }
}

async function saveCategory() {
    formError.value = '';
    isSubmitting.value = true;
    try {
        const config = useRuntimeConfig();
        if (showAddModal.value) {
            await $fetch(`${config.public.apiBaseUrl}/api/Category`, {
                method: 'POST',
                body: { name: categoryForm.value.name }
            });
            successMessage.value = 'Category added successfully!';
        } else if (showEditModal.value) {
            await $fetch(`${config.public.apiBaseUrl}/api/Category/${categoryForm.value.categoryId}`, {
                method: 'PUT',
                body: { categoryId: categoryForm.value.categoryId, name: categoryForm.value.name }
            });
            successMessage.value = 'Category updated successfully!';
        }
        closeModals();
        await fetchCategories();
        setTimeout(() => { successMessage.value = ''; }, 3000);
    } catch (error: any) {
        formError.value = error?.message || 'Failed to save category.';
    } finally {
        isSubmitting.value = false;
    }
}

async function deleteCategory() {
    if (!categoryToDelete.value) return;
    isSubmitting.value = true;
    try {
        const config = useRuntimeConfig();
        await $fetch(`${config.public.apiBaseUrl}/api/Category/${categoryToDelete.value.categoryId}`, {
            method: 'DELETE'
        });
        successMessage.value = 'Category deleted successfully!';
        showDeleteModal.value = false;
        categoryToDelete.value = null;
        await fetchCategories();
        setTimeout(() => { successMessage.value = ''; }, 3000);
    } catch (error: any) {
        errorMessage.value = error?.message || 'Failed to delete category.';
    } finally {
        isSubmitting.value = false;
    }
}

async function uploadIcon() {
    iconError.value = '';
    isUploadingIcon.value = true;
    try {
        if (!iconFile.value || !iconModalCategory.value) {
            iconError.value = 'Please select an image.';
            return;
        }
        const config = useRuntimeConfig();
        const formData = new FormData();
        formData.append('file', iconFile.value);
        await $fetch(`${config.public.apiBaseUrl}/api/Category/${iconModalCategory.value.categoryId}/upload-categoryicon`, {
            method: 'POST',
            body: formData
        });
        successMessage.value = 'Icon uploaded successfully!';
        closeIconModal();
        await fetchCategories();
        setTimeout(() => { successMessage.value = ''; }, 3000);
    } catch (error: any) {
        iconError.value = error?.message || 'Failed to upload icon.';
    } finally {
        isUploadingIcon.value = false;
    }
}

onMounted(async () => {
    loading.value = true;
    await fetchCategories();
    loading.value = false;
});
</script>
