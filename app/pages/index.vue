<template>
    <div>
        <!-- Hero Section -->
        <section class="bg-gradient-to-r from-purple-500 to-indigo-600 py-20 text-white">
            <div class="container mx-auto px-4 text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-6">Transforming Education Through Innovation</h1>
                <p class="text-xl mb-10 max-w-2xl mx-auto">UniPoint brings together students, educators, and
                    institutions on a single powerful platform.</p>
                <div class="flex justify-center space-x-4">
                    <NuxtLink to="/services"
                        class="px-6 py-3 bg-white text-purple-600 font-medium rounded-md hover:bg-purple-50 transition-colors">
                        Get Started
                    </NuxtLink>
                    <NuxtLink to="/about"
                        class="px-6 py-3 border-2 border-white text-white font-medium rounded-md hover:bg-white hover:bg-opacity-10 transition-colors">
                        Learn More
                    </NuxtLink>
                </div>
            </div>
        </section>

        <!-- How It Works Section -->
        <section class="py-16 bg-gray-50">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-center mb-12">How It Works</h2>
                <p class="text-center text-gray-600 mb-12">Your journey to professional services in six simple steps</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-purple-600 text-xl font-bold">1</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Register</h3>
                        <p class="text-gray-600">Create your account with basic information</p>
                    </div>
                    <div>
                        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-purple-600 text-xl font-bold">2</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Verify Email</h3>
                        <p class="text-gray-600">Confirm your email address</p>
                    </div>
                    <div>
                        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-purple-600 text-xl font-bold">3</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Complete Profile</h3>
                        <p class="text-gray-600">Add your preferences</p>
                    </div>
                    <div>
                        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-purple-600 text-xl font-bold">4</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Browse Services</h3>
                        <p class="text-gray-600">Explore available services</p>
                    </div>
                    <div>
                        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-purple-600 text-xl font-bold">5</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Book Appointment</h3>
                        <p class="text-gray-600">Schedule your service</p>
                    </div>
                    <div>
                        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-purple-600 text-xl font-bold">6</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Get Service</h3>
                        <p class="text-gray-600">Receive your service</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
definePageMeta({
    title: 'Home | UniPoint',
    description: 'Transforming Education Through Innovation'
})
</script>