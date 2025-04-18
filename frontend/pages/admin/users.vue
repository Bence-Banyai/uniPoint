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
            <h1 class="text-2xl font-bold">Manage Users</h1>
            <button @click="showAddModal = true"
                class="px-4 py-2 bg-gradient-purple text-white rounded-md hover:shadow-purple-glow transition-all">
                Add New User
            </button>
        </div>

        <!-- Search and filters -->
        <div class="mb-6 flex">
            <input type="text" v-model="searchQuery" placeholder="Search users..."
                class="px-4 py-2 border rounded-md mr-4 w-64" />
            <select v-model="roleFilter" class="px-4 py-2 border rounded-md">
                <option value="">All Roles</option>
                <option value="User">User</option>
                <option value="Provider">Provider</option>
                <option value="Admin">Admin</option>
            </select>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-12">
            <div class="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Users table -->
        <div v-else-if="users.length > 0" class="bg-white shadow-md rounded-lg overflow-hidden">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Username
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="user in filteredUsers" :key="user.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                            {{ user.userName }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            {{ user.email }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 text-xs rounded-full" :class="getRoleBadgeClass(user.role)">
                                {{ user.role }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            {{ user.location || 'Not specified' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <button @click="editUser(user)" class="text-purple-600 hover:text-purple-900 mr-3">
                                <Icon name="entypo:edit" class="inline-block" />
                                Edit
                            </button>
                            <button @click="confirmDeleteUser(user)" class="text-red-600 hover:text-red-900">
                                <Icon name="entypo:trash" class="inline-block" />
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Empty state -->
        <div v-else class="bg-white shadow-md rounded-lg p-8 text-center">
            <p class="text-gray-500 mb-4">No users found matching your criteria.</p>
            <button @click="fetchUsers" class="text-purple-600 hover:underline">Refresh</button>
        </div>

        <!-- Add/Edit Modal -->
        <div v-if="showAddModal || showEditModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 class="text-xl font-bold mb-4">{{ showAddModal ? 'Add New User' : 'Edit User' }}</h2>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input type="text" v-model="userForm.userName"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter username" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" v-model="userForm.email"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter email" />
                    </div>

                    <div v-if="showAddModal">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" v-model="userForm.password"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter password" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select v-model="userForm.role"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="User">User</option>
                            <option value="Provider">Provider</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input type="text" v-model="userForm.location"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter location" />
                    </div>
                </div>

                <div class="flex justify-end space-x-3 mt-6">
                    <button @click="closeModals" class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        Cancel
                    </button>
                    <button @click="saveUser" class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        :disabled="isSubmitting">
                        <Icon v-if="isSubmitting" name="entypo:cycle" class="animate-spin mr-1 inline-block" />
                        {{ showAddModal ? 'Add User' : 'Save Changes' }}
                    </button>
                </div>

                <div v-if="formError" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {{ formError }}
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 class="text-xl font-bold mb-4">Confirm Delete</h2>
                <p class="mb-6">Are you sure you want to delete user <strong>{{ userToDelete?.userName }}</strong>? This
                    action cannot be undone.</p>

                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        Cancel
                    </button>
                    <button @click="deleteUser" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        :disabled="isSubmitting">
                        <Icon v-if="isSubmitting" name="entypo:cycle" class="animate-spin mr-1 inline-block" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import useAdminApi from '../../composables/useAdminApi';
import { useAuthStore } from '~/stores/auth';
import { useRuntimeConfig } from '#app';

definePageMeta({
    layout: 'admin',
    middleware: ['admin']
});

const adminApi = useAdminApi();
const authStore = useAuthStore();
const loading = ref(true);
const isSubmitting = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const searchQuery = ref('');
const roleFilter = ref('');
const formError = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const users = ref([]);
const userToDelete = ref(null);
const userForm = ref({
    id: '',
    userName: '',
    email: '',
    password: '',
    role: 'User',
    location: ''
});

const filteredUsers = computed(() => {
    return users.value.filter(user => {
        // Filter by search query
        const matchesSearch =
            user.userName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            (user.location && user.location.toLowerCase().includes(searchQuery.value.toLowerCase()));

        // Filter by role
        const matchesRole = roleFilter.value ? user.role === roleFilter.value : true;

        return matchesSearch && matchesRole;
    });
});

function getRoleBadgeClass(role) {
    switch (role) {
        case 'Admin':
            return 'bg-purple-100 text-purple-800';
        case 'Provider':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function closeModals() {
    showAddModal.value = false;
    showEditModal.value = false;
    showDeleteModal.value = false;
    formError.value = '';
    resetForm();
}

function resetForm() {
    userForm.value = {
        id: '',
        userName: '',
        email: '',
        password: '',
        role: 'User',
        location: ''
    };
}

function editUser(user) {
    // Clone user data to form (omit password)
    userForm.value = {
        id: user.id,
        userName: user.userName,
        email: user.email,
        password: '', // Don't populate password
        role: user.role,
        location: user.location || ''
    };
    showEditModal.value = true;
}

function confirmDeleteUser(user) {
    userToDelete.value = user;
    showDeleteModal.value = true;
}

async function fetchUsers() {
    loading.value = true;
    errorMessage.value = '';
    console.log('Fetching users: start');
    try {
        // Get the runtime config to check the actual API URL being used
        const config = useRuntimeConfig();
        console.log('Using API base URL:', config.public.apiBaseUrl);
        
        // Only use the main endpoint
        const response = await adminApi.getAllUsers();
        console.log('Fetched users response:', response);

        // Accept both array and object with users property
        let userList = [];
        if (Array.isArray(response)) {
            userList = response;
        } else if (response && Array.isArray(response.users)) {
            userList = response.users;
        } else if (response && typeof response === 'object') {
            // Try to extract users from response object if possible
            console.log('Attempting to extract users from object response');
            userList = Object.values(response).filter(item => 
                item && typeof item === 'object' && 'userName' in item
            );
            if (userList.length === 0) {
                console.warn('Could not extract users from response:', response);
                userList = [];
            }
        } else {
            console.warn('Unexpected response format:', response);
            users.value = [];
            return;
        }

        users.value = userList;
        console.log('Processed userList:', userList);

        // Process user roles if needed
        if (users.value.length > 0) {
            for (const user of users.value) {
                if (user.role) continue;
                if (user.id) {
                    try {
                        const userDetails = await adminApi.getUserById(user.id);
                        user.role = userDetails && userDetails.role ? userDetails.role : 'User';
                        console.log('Fetched user details for', user.id, userDetails);
                    } catch (error) {
                        user.role = 'User';
                        console.error('Error fetching user details for', user.id, error);
                    }
                } else {
                    user.role = 'User';
                }
            }
        }
    } catch (error) {
        console.error('Error in fetchUsers:', error);
        
        // Add more detailed error logging
        if (error.response) {
            console.error('Response error details:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            });
        }
        
        if (error.response && error.response.status === 401) {
            errorMessage.value = 'Session expired or not authenticated. Please log in again.';
        } else if (error.message && error.message.includes('CORS')) {
            errorMessage.value = 'CORS error: Unable to connect to the API. Please check your network settings.';
        } else {
            errorMessage.value = 'Failed to load users. Please try again.';
        }
        users.value = [];
    } finally {
        loading.value = false;
        console.log('Fetching users: end');
    }
}

async function saveUser() {
    formError.value = '';

    // Validate form
    if (!userForm.value.userName || !userForm.value.email ||
        (showAddModal.value && !userForm.value.password)) {
        formError.value = 'Please fill in all required fields';
        return;
    }

    isSubmitting.value = true;

    try {
        if (showAddModal.value) {
            // Create new user
            await adminApi.createUser({
                userName: userForm.value.userName,
                email: userForm.value.email,
                password: userForm.value.password,
                role: userForm.value.role,
                location: userForm.value.location || ""
            });

            successMessage.value = "User created successfully!";
        } else {
            // Update existing user
            await adminApi.updateUser(userForm.value.id, {
                name: userForm.value.userName,
                email: userForm.value.email,
                role: userForm.value.role,
                location: userForm.value.location || ""
            });

            successMessage.value = "User updated successfully!";
        }

        // If successful, refresh user list and close modal
        await fetchUsers();
        closeModals();

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
            successMessage.value = '';
        }, 3000);
    } catch (error) {
        if (error.response && error.response.status === 403) {
            formError.value = "You can only update/delete your own user. Admin update/delete for any user is not yet supported.";
        } else {
            formError.value = error.message || 'An error occurred while saving the user';
        }
    } finally {
        isSubmitting.value = false;
    }
}

async function deleteUser() {
    if (!userToDelete.value) return;

    isSubmitting.value = true;

    try {
        await adminApi.deleteUser(userToDelete.value.id);

        // If successful, refresh user list and close modal
        await fetchUsers();
        showDeleteModal.value = false;
        userToDelete.value = null;

        // Show success message
        successMessage.value = "User deleted successfully!";

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
            successMessage.value = '';
        }, 3000);
    } catch (error) {
        if (error.response && error.response.status === 403) {
            formError.value = "You can only update/delete your own user. Admin update/delete for any user is not yet supported.";
        } else {
            formError.value = error.message || 'Failed to delete user';
        }
    } finally {
        isSubmitting.value = false;
    }
}

// Override the existing onMounted to include better error handling
onMounted(async () => {
    try {
        // Make sure we're authenticated
        console.log('Admin panel onMounted: checking authentication');
        if (!authStore.isAuthenticated) {
            const result = await authStore.getUserInfo();
            console.log('getUserInfo result:', result);
            if (!result.success) {
                errorMessage.value = "Authentication error. Please log in again.";
                return;
            }
        }

        // Fetch users
        await fetchUsers();
    } catch (error) {
        console.error("Error initializing admin panel:", error);
        errorMessage.value = "Error loading admin panel. Please refresh the page.";
    }
});
</script>