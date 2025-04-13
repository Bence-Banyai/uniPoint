<template>
    <div>
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
import useAdminApi from '../../composables/useAdminApi'; // Import the admin API composable

definePageMeta({
    layout: 'admin',
    middleware: ['admin']
});

const adminApi = useAdminApi(); // Initialize the API client
const loading = ref(true);
const isSubmitting = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const searchQuery = ref('');
const roleFilter = ref('');
const formError = ref('');
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
    try {
        // Replace with your API client call
        const response = await adminApi.getAllUsers();
        users.value = response;

        // Extract roles for each user if they're not already included
        for (const user of users.value) {
            if (!user.role && user.id) {
                try {
                    const userDetails = await adminApi.getUserById(user.id);
                    user.role = userDetails.role || 'User';
                } catch (error) {
                    console.warn(`Couldn't fetch role for user ${user.id}:`, error);
                    user.role = 'User'; // Default role
                }
            }
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        // Add error notification here if desired
    } finally {
        loading.value = false;
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
                location: userForm.value.location
            });
        } else {
            // Update existing user
            await adminApi.updateUser(userForm.value.id, {
                name: userForm.value.userName, // Note: backend expects "name" not "userName" here
                email: userForm.value.email,
                role: userForm.value.role,
                location: userForm.value.location
            });
        }

        // If successful, refresh user list and close modal
        await fetchUsers();
        closeModals();
    } catch (error) {
        console.error('Error saving user:', error);
        formError.value = error.message || 'An error occurred while saving the user';
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
    } catch (error) {
        console.error('Error deleting user:', error);
        formError.value = error.message || 'Failed to delete user';
    } finally {
        isSubmitting.value = false;
    }
}

onMounted(() => {
    fetchUsers();
});
</script>