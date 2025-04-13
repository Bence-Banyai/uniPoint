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
                        <input type="date" v-model="selectedDate"
                            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 mb-2">Select Time</label>
                        <div class="grid grid-cols-2 gap-2">
                            <button v-for="time in availableTimes" :key="time.value" :class="[
                                'px-3 py-2 rounded-md',
                                time.selected
                                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                    : time.available
                                        ? 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            ]" :disabled="!time.available" @click="selectTime(time)">
                                {{ time.label }}
                            </button>
                        </div>
                    </div>
                    <button class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        @click="bookAppointment">Book
                        Appointment</button>
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

const props = defineProps<{
    service: Service
}>();

const router = useRouter();
const authStore = useAuthStore();

const selectedDate = ref(new Date().toISOString().split('T')[0]);
const isLoading = ref(false);

// Mocked reviews data - in a real app, this would come from the API
const reviews = ref([
    {
        name: "Jane Doe",
        rating: 4,
        comment: "Great service! Would highly recommend.",
        date: "2 months ago",
        profilePicture: null
    },
    {
        name: "John Smith",
        rating: 5,
        comment: "Excellent service and very professional.",
        date: "1 month ago",
        profilePicture: null
    }
]);

interface TimeSlot {
    label: string;
    value: string;
    available: boolean;
    selected: boolean;
}

const availableTimes = ref<TimeSlot[]>([]);

const similarServices = ref<Service[]>([]);

// Methods
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF' }).format(price);
};

const formatOpeningHours = (hours: number) => {
    return `${hours}:00 - 18:00`;
};

const selectTime = (time: { label: string, value: string, available: boolean, selected: boolean }) => {
    if (!time.available) return;

    availableTimes.value.forEach(t => {
        t.selected = t.value === time.value;
    });
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

const fetchAvailableTimeSlots = async () => {
    if (!props.service?.serviceId || !selectedDate.value) return;

    isLoading.value = true;
    try {
        const appointmentsApi = useAppointmentsApi();
        const response = await appointmentsApi.getTimeSlots(
            props.service.serviceId,
            selectedDate.value
        );

        availableTimes.value = response.data.map((slot: { label: string, value: string, available: boolean }) => ({
            label: slot.label,
            value: slot.value,
            available: slot.available,
            selected: false
        }));
    } catch (error) {
        console.error("Error fetching time slots:", error);
    } finally {
        isLoading.value = false;
    }
};

const bookAppointment = async () => {
    if (!authStore.isAuthenticated) {
        router.push('/login');
        return;
    }

    const selectedTime = availableTimes.value.find(t => t.selected);
    if (!selectedTime || !selectedDate.value) {
        // Show error message
        return;
    }

    try {
        isLoading.value = true;
        const appointmentsApi = useAppointmentsApi();

        const appointmentData = {
            serviceId: props.service.serviceId,
            scheduledAt: `${selectedDate.value}T${selectedTime.value}:00`
        };

        const response = await appointmentsApi.create(appointmentData);
        await appointmentsApi.book(response.data.id);

        // Redirect or show success message
    } catch (error) {
        console.error("Error booking appointment:", error);
    } finally {
        isLoading.value = false;
    }
};

// Fetch similar services when the component mounts or service changes
watch(() => props.service, () => {
    if (props.service && props.service.serviceId) {
        fetchSimilarServices();
    }
}, { immediate: true });

// Watch for date changes to update time slots
watch(selectedDate, () => {
    fetchAvailableTimeSlots();
});

// Also fetch time slots when component mounts
onMounted(() => {
    fetchAvailableTimeSlots();
});
</script>