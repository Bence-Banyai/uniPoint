<template>
    <div class="container mx-auto px-4 py-8">
        <div class="flex">
            <div class="w-2/3 pr-8">
                <div class="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 class="text-2xl font-bold mb-4">Service Description</h2>
                    <p class="text-gray-600 mb-4">{{ service.description }}</p>

                    <div class="mt-6">
                        <h3 class="text-xl font-bold mb-2">Service Details</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="flex items-center space-x-2">
                                <Icon name="entypo:clock" class="text-purple-600" />
                                <span>Duration: {{ service.duration }} minutes</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <Icon name="entypo:price-tag" class="text-purple-600" />
                                <span>Price: {{ formatPrice(service.price) }}</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <Icon name="entypo:calendar" class="text-purple-600" />
                                <span>Open: {{ formatOpeningHours(service.openingHours) }}</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <Icon name="entypo:location-pin" class="text-purple-600" />
                                <span>{{ service.address }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h2 class="text-2xl font-bold mb-4">Reviews</h2>

                    <div class="mb-8">
                        <div class="flex items-center mb-4">
                            <div class="flex">
                                <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                                <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                                <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                                <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                                <Icon name="entypo:star" class="h-5 w-5 text-gray-300" />
                            </div>
                            <span class="ml-2 text-gray-600">4.0 out of 5</span>
                        </div>
                        <div v-if="reviews.length > 0" class="space-y-4">
                            <div v-for="(review, index) in reviews" :key="index" class="border-b pb-4">
                                <div class="flex items-center mb-2">
                                    <div class="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                                        <img v-if="review.profilePicture" :src="review.profilePicture" alt="Reviewer"
                                            class="w-full h-full object-cover">
                                    </div>
                                    <div>
                                        <h4 class="font-semibold">{{ review.name }}</h4>
                                        <div class="flex">
                                            <Icon v-for="i in 5" :key="i" name="entypo:star"
                                                :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                                                class="h-4 w-4" />
                                        </div>
                                    </div>
                                    <span class="ml-auto text-sm text-gray-500">{{ review.date }}</span>
                                </div>
                                <p class="text-gray-600">{{ review.comment }}</p>
                            </div>
                        </div>
                        <div v-else class="text-gray-500 text-center py-4">
                            No reviews yet. Be the first to review this service!
                        </div>
                    </div>

                    <button class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Write a
                        Review</button>
                </div>
            </div>

            <div class="w-1/3">
                <div class="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h3 class="text-xl font-bold mb-4">Book this Service</h3>
                    <div class="mb-4">
                        <label class="block text-gray-700 mb-2">Select Date</label>
                        <input type="date" v-model="selectedDate" :min="todayDate"
                            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 mb-2">Select Available Appointment</label>
                        <div v-if="isLoading" class="text-center text-gray-500">Loading...</div>
                        <div v-else-if="filteredOpenAppointments.length === 0" class="text-center text-gray-500">
                            No open appointments found for this date.
                        </div>
                        <div v-else class="space-y-2 max-h-48 overflow-y-auto">
                            <button v-for="appt in filteredOpenAppointments" :key="appt.id" :class="[
                                'w-full text-left px-3 py-2 rounded-md border',
                                selectedAppointmentId === appt.id
                                    ? 'bg-purple-100 text-purple-700 border-purple-300'
                                    : 'bg-gray-50 text-gray-700 hover:bg-purple-50 border-gray-200'
                            ]" @click="selectAppointment(appt.id)">
                                {{ formatAppointmentTime(appt.appointmentDate) }}
                            </button>
                        </div>
                    </div>
                    <button
                        class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="!selectedAppointmentId || isBooking" @click="bookSelectedAppointment">
                        <span v-if="isBooking">Booking...</span>
                        <span v-else>Book Selected Appointment</span>
                    </button>
                    <p v-if="bookingError" class="text-red-500 text-sm mt-2">{{ bookingError }}</p>
                    <p v-if="bookingSuccess" class="text-green-500 text-sm mt-2">{{ bookingSuccess }}</p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-bold mb-4">Similar Services</h3>
                    <div v-if="similarServices.length > 0" class="space-y-4">
                        <div v-for="similarService in similarServices" :key="similarService.serviceId"
                            class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-md"
                            @click="navigateToService(similarService.serviceId)">
                            <div class="w-16 h-16 bg-gray-200 mr-3 overflow-hidden">
                                <img v-if="similarService.imageUrls && similarService.imageUrls.length"
                                    :src="similarService.imageUrls[0]" alt="Service" class="w-full h-full object-cover">
                            </div>
                            <div>
                                <h4 class="font-semibold">{{ similarService.serviceName }}</h4>
                                <p class="text-sm text-gray-600">{{ truncateText(similarService.description, 40) }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-gray-500 text-center py-4">
                        No similar services found.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { Service } from '~/services/serviceApi';
import { serviceApi } from '~/services/serviceApi';
import useAppointmentsApi from '../composables/useAppointmentsApi';
import { useAuthStore } from '../stores/auth';
import type { Appointment } from '~/models/Appointment'; // Assuming you have this model defined

const props = defineProps<{
    service: Service
}>();

const router = useRouter();
const authStore = useAuthStore();
const appointmentsApi = useAppointmentsApi();

const todayDate = new Date().toISOString().split('T')[0];
const selectedDate = ref(todayDate);
const isLoading = ref(false);
const isBooking = ref(false);
const bookingError = ref<string | null>(null);
const bookingSuccess = ref<string | null>(null);

const allOpenAppointments = ref<Appointment[]>([]);
const selectedAppointmentId = ref<number | null>(null);

// Mocked reviews data - in a real app, this would come from the API
const reviews = ref([
    { name: "Jane Doe", rating: 4, comment: "Great service! Would highly recommend.", date: "2 months ago", profilePicture: null },
    { name: "John Smith", rating: 5, comment: "Excellent service and very professional.", date: "1 month ago", profilePicture: null }
]);

const similarServices = ref<Service[]>([]);

// Computed property to filter open appointments for the current service and selected date
const filteredOpenAppointments = computed(() => {
    if (!props.service?.serviceId || !selectedDate.value) {
        return [];
    }
    const targetDate = selectedDate.value;
    return allOpenAppointments.value.filter(appt => {
        const apptDate = appt.appointmentDate.split('T')[0]; // Compare only the date part
        return appt.serviceId === props.service.serviceId && apptDate === targetDate;
    });
});

// Methods
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF' }).format(price);
};

const formatOpeningHours = (hours: number | undefined) => {
    return hours ? `${hours}:00 - 18:00` : 'N/A'; // Handle undefined case
};

const formatAppointmentTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
};

const selectAppointment = (id: number) => {
    selectedAppointmentId.value = id;
    bookingError.value = null; // Clear previous errors on new selection
    bookingSuccess.value = null;
};

const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const navigateToService = (serviceId: number) => {
    router.push(`/services/${serviceId}`);
};

const fetchSimilarServices = async () => {
    try {
        if (!props.service || !props.service.categoryId) return;
        const services = await serviceApi.getServicesByCategory(props.service.categoryId);
        similarServices.value = services
            .filter(s => s.serviceId !== props.service.serviceId)
            .slice(0, 3);
    } catch (error) {
        console.error("Error fetching similar services:", error);
    }
};

// Fetch ALL open appointments initially and store them
const fetchAllOpenAppointments = async () => {
    isLoading.value = true;
    selectedAppointmentId.value = null; // Reset selection when fetching
    try {
        const response = await appointmentsApi.getOpen();
        allOpenAppointments.value = response || [];
    } catch (error) {
        console.error("Error fetching open appointments:", error);
        allOpenAppointments.value = []; // Clear on error
    } finally {
        isLoading.value = false;
    }
};

const bookSelectedAppointment = async () => {
    if (!authStore.isAuthenticated) {
        router.push('/login?redirect=' + encodeURIComponent(router.currentRoute.value.fullPath));
        return;
    }

    if (!selectedAppointmentId.value) {
        bookingError.value = "Please select an appointment time.";
        return;
    }

    isBooking.value = true;
    bookingError.value = null;
    bookingSuccess.value = null;

    try {
        const response = await appointmentsApi.book(selectedAppointmentId.value);
        bookingSuccess.value = response?.data?.message || "Appointment booked successfully!";
        // Refresh the list of open appointments as the booked one is no longer open
        await fetchAllOpenAppointments();
        selectedAppointmentId.value = null; // Clear selection after successful booking
        // Optionally redirect to profile/appointments page
        // router.push('/profile');
    } catch (error: any) {
        console.error("Error booking appointment:", error);
        bookingError.value = error?.response?.data?.message || error?.response?.data || "Failed to book appointment. It might have been taken.";
        // Also refresh list in case the appointment was booked by someone else simultaneously
        await fetchAllOpenAppointments();
    } finally {
        isBooking.value = false;
    }
};

// Fetch similar services when the component mounts or service changes
watch(() => props.service, () => {
    if (props.service && props.service.serviceId) {
        fetchSimilarServices();
        fetchAllOpenAppointments(); // Fetch open appointments when service changes
    }
}, { immediate: true });

// Watch for date changes to potentially clear selection (optional, but good UX)
watch(selectedDate, () => {
    selectedAppointmentId.value = null; // Reset selection when date changes
    bookingError.value = null;
    bookingSuccess.value = null;
    // No need to re-fetch all appointments, just rely on the computed property to filter
});

// Fetch all open appointments when component mounts
onMounted(() => {
    // fetchAllOpenAppointments is already called by the service watcher on immediate: true
});
</script>