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
                                <Icon v-for="i in 5" :key="i"
                                    :name="i <= averageScore ? 'entypo:star' : 'entypo:star-outlined'"
                                    :class="i <= averageScore ? 'text-yellow-400' : 'text-gray-300'" class="h-5 w-5" />
                            </div>
                            <span class="ml-2 text-gray-600">{{ averageScore.toFixed(1) }} out of 5</span>
                            <span class="ml-4 text-gray-500 text-sm">({{ reviews.length }} reviews)</span>
                        </div>
                        <div v-if="reviews.length > 0" class="space-y-4">
                            <div v-for="review in reviews" :key="review.reviewId" class="border-b pb-4">
                                <div class="flex items-center mb-2">
                                    <div class="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                                        <img v-if="review.reviewer?.profilePictureUrl"
                                            :src="review.reviewer.profilePictureUrl" alt="Reviewer"
                                            class="w-full h-full object-cover">
                                    </div>
                                    <div>
                                        <h4 class="font-semibold">{{ review.reviewer?.userName || 'User' }}</h4>
                                        <div class="flex">
                                            <Icon v-for="i in 5" :key="i"
                                                :name="i <= review.score ? 'entypo:star' : 'entypo:star-outlined'"
                                                :class="i <= review.score ? 'text-yellow-400' : 'text-gray-300'"
                                                class="h-4 w-4" />
                                        </div>
                                    </div>
                                    <span class="ml-auto text-sm text-gray-500">{{ formatReviewDate(review.createdAt)
                                        }}</span>
                                </div>
                                <p class="text-gray-600">{{ review.description }}</p>
                            </div>
                        </div>
                        <div v-else class="text-gray-500 text-center py-4">
                            No reviews yet. Be the first to review this service!
                        </div>
                    </div>

                    <div v-if="canWriteReview" class="mt-6 border-t pt-6">
                        <h3 class="text-lg font-semibold mb-2">Write a Review</h3>
                        <form @submit.prevent="submitReview" class="space-y-4">
                            <div>
                                <label class="block text-gray-700 mb-1">Your Rating</label>
                                <div class="flex items-center space-x-1">
                                    <button v-for="i in 5" :key="i" type="button" @click="reviewForm.score = i"
                                        :aria-label="`${i} star`">
                                        <Icon :name="i <= reviewForm.score ? 'iconoir:star-solid' : 'iconoir:star'"
                                            :class="i <= reviewForm.score ? 'text-yellow-400' : 'text-gray-300'"
                                            class="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label class="block text-gray-700 mb-1">Your Review</label>
                                <textarea v-model="reviewForm.description" rows="3"
                                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    maxlength="2000" placeholder="Share your experience..."></textarea>
                            </div>
                            <div>
                                <button type="submit"
                                    class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                    :disabled="isSubmitting || reviewForm.score < 1 || !reviewForm.description">
                                    <span v-if="isSubmitting">Submitting...</span>
                                    <span v-else>Submit Review</span>
                                </button>
                                <span v-if="reviewError" class="ml-4 text-red-500 text-sm">{{ reviewError }}</span>
                                <span v-if="reviewSuccess" class="ml-4 text-green-600 text-sm">{{ reviewSuccess
                                    }}</span>
                            </div>
                        </form>
                    </div>
                    <div v-else-if="userAlreadyReviewed" class="mt-6 text-green-700 text-sm">
                        You have already reviewed this service.
                    </div>
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
                        <label class="block text-gray-700 mb-2">Select Appointment</label>
                        <select v-model="selectedAppointmentId"
                            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            :disabled="filteredOpenAppointments.length === 0">
                            <option disabled value="">Select appointment</option>
                            <option v-for="appt in filteredOpenAppointments" :key="appt.id" :value="appt.id">
                                {{ new Date(appt.appointmentDate).toLocaleTimeString('hu-HU', {
                                    hour: '2-digit', minute:
                                        '2-digit'
                                }) }}
                            </option>
                        </select>
                        <div v-if="filteredOpenAppointments.length === 0" class="text-gray-500 text-sm mt-2">
                            No open appointments for this date.
                        </div>
                    </div>
                    <button
                        class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="!selectedAppointmentId || isBooking" @click="bookSelectedAppointment">
                        <span v-if="isBooking">Booking...</span>
                        <span v-else>Book Appointment</span>
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
import useReviewsApi from '../composables/useReviewsApi';
import { useAuthStore } from '../stores/auth';
import type { Appointment } from '~/models/Appointment';

const props = defineProps<{
    service: Service
}>();

const router = useRouter();
const authStore = useAuthStore();
const appointmentsApi = useAppointmentsApi();
const reviewsApi = useReviewsApi();

const todayDate = new Date().toISOString().split('T')[0];
const selectedDate = ref(todayDate);
const selectedAppointmentId = ref<number | null>(null);
const isLoading = ref(false);
const isBooking = ref(false);
const bookingError = ref<string | null>(null);
const bookingSuccess = ref<string | null>(null);

const allOpenAppointments = ref<Appointment[]>([]);

const reviews = ref<any[]>([]);
const isLoadingReviews = ref(false);
const reviewError = ref('');
const reviewSuccess = ref('');
const isSubmitting = ref(false);

const reviewForm = ref({
    score: 0,
    description: ''
});

const similarServices = ref<Service[]>([]);

const filteredOpenAppointments = computed(() => {
    if (!props.service?.serviceId || !selectedDate.value) return [];
    return allOpenAppointments.value.filter(appt => {
        if (appt.serviceId !== props.service.serviceId) return false;
        const [apptDate] = appt.appointmentDate.split('T');
        return apptDate === selectedDate.value;
    }).sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate));
});

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF' }).format(price);
};

const formatOpeningHours = (hours: number | undefined) => {
    return hours ? `${hours}:00 - 18:00` : 'N/A';
};

const formatAppointmentTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
};

const formatReviewDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' });
};

const averageScore = computed(() => {
    if (!reviews.value.length) return 0;
    return (
        reviews.value.reduce((sum, r) => sum + (r.score || 0), 0) / reviews.value.length
    );
});

const userAlreadyReviewed = computed(() => {
    if (!authStore.isAuthenticated) return false;
    return reviews.value.some(r => r.userId === authStore.userId);
});

const canWriteReview = computed(() => {
    return authStore.isAuthenticated && !userAlreadyReviewed.value;
});

const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Fetch reviews for the current service
async function fetchReviews() {
    if (!props.service?.serviceId) {
        reviews.value = [];
        return;
    }
    try {
        // Use the reviews API composable to fetch all reviews, then filter by serviceId
        const response = await reviewsApi.getAll();
        reviews.value = (Array.isArray(response) ? response : []).filter(r => r.serviceId === props.service.serviceId);
    } catch (error) {
        reviews.value = [];
    }
}

const submitReview = async () => {
    isSubmitting.value = true;
    reviewError.value = '';
    reviewSuccess.value = '';
    try {
        // TODO: Call your review API here
        // await apiClient.post('/api/Review', { ...reviewForm.value, serviceId: props.service.serviceId });
        reviewSuccess.value = 'Review submitted successfully!';
        // Optionally reset form
        reviewForm.value.score = 0;
        reviewForm.value.description = '';
        // Reload reviews after successful submission
        await fetchReviews();
    } catch (error: any) {
        reviewError.value = error?.message || 'Failed to submit review.';
    } finally {
        isSubmitting.value = false;
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

const navigateToService = (serviceId: number) => {
    router.push(`/services/${serviceId}`);
};

// Fetch reviews and similar services when the component mounts or service changes
watch(() => props.service, () => {
    if (props.service && props.service.serviceId) {
        fetchSimilarServices();
        fetchAllOpenAppointments();
        fetchReviews(); // Fetch reviews for the current service
    }
}, { immediate: true });

// Watch for date changes to clear selection
watch(selectedDate, () => {
    selectedAppointmentId.value = null;
    bookingError.value = null;
    bookingSuccess.value = null;
});

// Fetch all open appointments when component mounts
onMounted(() => {
    // fetchAllOpenAppointments is already called by the service watcher on immediate: true
    // fetchReviews is also called by the watcher
});

function fetchSimilarServices() {
    // Example: fetch services from the same category, excluding the current one
    if (!props.service?.categoryId) {
        similarServices.value = [];
        return;
    }
    serviceApi.getServicesByCategory(props.service.categoryId)
        .then(services => {
            similarServices.value = (services || []).filter(
                s => s.serviceId !== props.service.serviceId
            ).slice(0, 5); // Limit to 5 similar services
        })
        .catch(() => {
            similarServices.value = [];
        });
}
</script>