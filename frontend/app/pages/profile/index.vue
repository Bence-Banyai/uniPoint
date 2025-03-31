<template>
  <div class="min-h-screen flex flex-col">
    <AppNavbar />

    <main class="flex-grow pt-16 flex items-center justify-center bg-gray-50">
      <div class="container mx-auto px-4 py-8 pt-24">
        <h1 class="text-3xl font-bold text-center mb-8">My Profile</h1>

        <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div v-if="isLoading" class="flex justify-center p-8">
            <div class="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div v-else>
            <div class="flex items-center mb-6">
              <div
                class="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center text-2xl font-bold text-purple-600">
                {{ authStore.user.userName?.[0]?.toUpperCase() || 'U' }}
              </div>
              <div class="ml-4">
                <h2 class="text-2xl font-bold">{{ authStore.user.userName || 'User' }}</h2>
                <p class="text-gray-600">{{ authStore.user.email || 'No email provided' }}</p>
              </div>
            </div>

            <div class="mb-6">
              <h3 class="text-xl font-semibold mb-2">User Information</h3>
              <div class="bg-gray-50 p-4 rounded-md">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500">Username</p>
                    <p>{{ authStore.user.userName || 'Not set' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Email</p>
                    <p>{{ authStore.user.email || 'Not set' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Role</p>
                    <p>{{ authStore.user.role || 'User' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">User ID</p>
                    <p class="truncate">{{ authStore.userId || 'Not available' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Future sections for appointments, etc. -->
            <div>
              <h3 class="text-xl font-semibold mb-2">My Appointments</h3>
              <p v-if="appointments.length === 0" class="text-gray-600">You don't have any appointments yet.</p>
              <div v-else class="space-y-4">
                <!-- Appointment cards would go here -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../../stores/auth';
import useAppointmentsApi from '../../../composables/useAppointmentsApi';

definePageMeta({
  title: 'My Profile | UniPoint',
  description: 'View and manage your UniPoint profile',
  meta: {
    requiresAuth: true
  }
});

const authStore = useAuthStore();
const isLoading = ref(true);
const appointments = ref([]);

onMounted(async () => {
  isLoading.value = true;

  try {
    // First get user info
    await authStore.getUserInfo();

    // Then try to get appointments if user role is appropriate
    const appointmentsApi = useAppointmentsApi();
    const appointmentsResponse = await appointmentsApi.getAll();
    appointments.value = appointmentsResponse || [];
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped></style>
