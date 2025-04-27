<template>
    <div class="min-h-screen">
        <!-- Hero Section: Enhanced with gradients and animations -->
        <section class="bg-gradient-purple py-24 text-white relative overflow-hidden">
            <!-- Background decorative elements -->
            <div class="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent-blue opacity-20 blur-3xl"></div>
            <div class="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-accent-pink opacity-20 blur-3xl"></div>

            <div class="container mx-auto px-4 text-center relative z-10">
                <h1 class="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">uniPoint.</h1>
                <p class="text-xl mb-10 max-w-2xl mx-auto text-blue-50">UniPoint allows you schedule your appointments
                    easily for your favourite services worldwide.</p>
                <div
                    class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up">
                    <NuxtLink to="/services"
                        class="px-6 py-3 bg-white text-primary-purple font-medium rounded-xl hover:bg-purple-50 transition-all duration-300 shadow-blue-glow">
                        Get Started
                    </NuxtLink>
                </div>
            </div>

            <!-- Wave shape divider -->
            <div class="absolute bottom-0 left-0 right-0 h-16">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="w-full h-full">
                    <path fill="#F9FAFB" fill-opacity="1"
                        d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,170.7C672,181,768,235,864,245.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                    </path>
                </svg>
            </div>
        </section>

        <!-- How It Works Section: Enhanced with cards and transitions -->
        <section class="py-20 bg-gray-50">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl md:text-4xl font-bold text-center mb-4 text-dark-purple">How It Works</h2>
                <p class="text-center text-gray-600 mb-12 max-w-3xl mx-auto">Your journey to professional services in
                    six simple steps</p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Process steps with enhanced cards -->
                    <div
                        class="bg-white p-6 rounded-2xl shadow-soft hover:shadow-raised transition-all duration-600 group">
                        <div
                            class="w-16 h-16 bg-gradient-to-br from-primary-purple to-light-purple rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-purple-glow transition-all duration-400">
                            <span class="text-white text-xl font-bold">1</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2 text-center">Register</h3>
                        <p class="text-gray-600 text-center">Create your account with basic information</p>
                    </div>

                    <div
                        class="bg-white p-6 rounded-2xl shadow-soft hover:shadow-raised transition-all duration-600 group">
                        <div
                            class="w-16 h-16 bg-gradient-to-br from-primary-purple to-light-purple rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-purple-glow transition-all duration-400">
                            <span class="text-white text-xl font-bold">2</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2 text-center">Browse Services</h3>
                        <p class="text-gray-600 text-center">Explore your favourite services</p>
                    </div>

                    <div
                        class="bg-white p-6 rounded-2xl shadow-soft hover:shadow-raised transition-all duration-600 group">
                        <div
                            class="w-16 h-16 bg-gradient-to-br from-primary-purple to-light-purple rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-purple-glow transition-all duration-400">
                            <span class="text-white text-xl font-bold">3</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2 text-center">Select your preferred service</h3>
                        <p class="text-gray-600 text-center">There's one for everyone :3</p>
                    </div>

                    <div
                        class="bg-white p-6 rounded-2xl shadow-soft hover:shadow-raised transition-all duration-600 group">
                        <div
                            class="w-16 h-16 bg-gradient-to-br from-primary-purple to-light-purple rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-purple-glow transition-all duration-400">
                            <span class="text-white text-xl font-bold">4</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2 text-center">Select Date&Time</h3>
                        <p class="text-gray-600 text-center">Choose from available open appointments</p>
                    </div>

                    <div
                        class="bg-white p-6 rounded-2xl shadow-soft hover:shadow-raised transition-all duration-600 group">
                        <div
                            class="w-16 h-16 bg-gradient-to-br from-primary-purple to-light-purple rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-purple-glow transition-all duration-400">
                            <span class="text-white text-xl font-bold">5</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2 text-center">Book Appointment</h3>
                        <p class="text-gray-600 text-center">Schedule your service</p>
                    </div>

                    <div
                        class="bg-white p-6 rounded-2xl shadow-soft hover:shadow-raised transition-all duration-600 group">
                        <div
                            class="w-16 h-16 bg-gradient-to-br from-primary-purple to-light-purple rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-purple-glow transition-all duration-400">
                            <span class="text-white text-xl font-bold">6</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2 text-center">Get Service</h3>
                        <p class="text-gray-600 text-center">Receive your service</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Featured Services Section: New section to highlight key services -->
        <section class="py-20 bg-white">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl md:text-4xl font-bold text-center mb-4 text-dark-purple">Featured Services</h2>
                <p class="text-center text-gray-600 mb-12 max-w-3xl mx-auto">Discover our most popular offerings</p>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <!-- Featured service cards -->
                    <div
                        class="bg-white rounded-2xl shadow-raised overflow-hidden group hover:transform hover:scale-105 transition-all duration-400">
                        <div class="h-48 bg-gradient-purple relative overflow-hidden">
                            <div class="absolute inset-0 bg-purple-glass flex items-center justify-center">
                                <Icon name="entypo:tools" class="text-white text-5xl" />
                            </div>
                            <div
                                class="absolute top-3 right-3 bg-accent-pink text-white px-3 py-1 rounded-pill text-sm shadow-pink-glow">
                                Featured
                            </div>
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold mb-2 text-primary-purple">Car Repair</h3>
                            <p class="text-gray-600 mb-4">Professional Engineering work</p>
                            <NuxtLink to="/services"
                                class="text-accent-blue font-medium hover:underline inline-flex items-center">
                                Explore
                                <Icon name="entypo:chevron-right" class="ml-1" />
                            </NuxtLink>
                        </div>
                    </div>

                    <div
                        class="bg-white rounded-2xl shadow-raised overflow-hidden group hover:transform hover:scale-105 transition-all duration-400">
                        <div class="h-48 bg-gradient-diagonal from-accent-blue to-accent-pink relative overflow-hidden">
                            <div class="absolute inset-0 bg-glass flex items-center justify-center">
                                <Icon name="entypo:mobile" class="text-white text-5xl" />
                            </div>
                            <div
                                class="absolute top-3 right-3 bg-accent-blue text-white px-3 py-1 rounded-pill text-sm shadow-blue-glow">
                                New
                            </div>
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold mb-2 text-primary-purple">Mobile Support</h3>
                            <p class="text-gray-600 mb-4">Professional IT services and phone troubleshooting</p>
                            <NuxtLink to="/services"
                                class="text-accent-blue font-medium hover:underline inline-flex items-center">
                                Explore
                                <Icon name="entypo:chevron-right" class="ml-1" />
                            </NuxtLink>
                        </div>
                    </div>

                    <div
                        class="bg-white rounded-2xl shadow-raised overflow-hidden group hover:transform hover:scale-105 transition-all duration-400">
                        <div class="h-48 bg-gradient-radial from-light-purple to-dark-purple relative overflow-hidden">
                            <div class="absolute inset-0 bg-glass-dark flex items-center justify-center">
                                <Icon name="entypo:scissors" class="text-white text-5xl" />
                            </div>
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold mb-2 text-primary-purple">Male Barbershop</h3>
                            <p class="text-gray-600 mb-4">Get a haircut at our best stylists!</p>
                            <NuxtLink to="/services"
                                class="text-accent-blue font-medium hover:underline inline-flex items-center">
                                Explore
                                <Icon name="entypo:chevron-right" class="ml-1" />
                            </NuxtLink>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-12">
                    <NuxtLink to="/services"
                        class="px-8 py-3 bg-gradient-purple text-white font-medium rounded-xl hover:shadow-purple-glow transition-all duration-300">
                        View All Services
                    </NuxtLink>
                </div>
            </div>
        </section>

        <!-- Testimonial Section: New section to build trust -->
        <section class="py-20 bg-gray-50">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl md:text-4xl font-bold text-center mb-4 text-dark-purple">What Our Users Say</h2>
                <p class="text-center text-gray-600 mb-12 max-w-3xl mx-auto">Join thousands of satisfied users on
                    UniPoint</p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="bg-white p-6 rounded-2xl shadow-soft">
                        <div class="flex mb-4">
                            <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                            <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                            <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                            <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                            <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                        </div>
                        <p class="text-gray-600 mb-4">"UniPoint has completely transformed how I connect with
                            educational services. Highly recommend!"</p>
                        <div class="flex items-center">
                            <div
                                class="w-10 h-10 bg-gradient-purple rounded-full flex items-center justify-center text-white font-bold mr-3">
                                J</div>
                            <div>
                                <p class="font-medium">Jane Doe</p>
                                <p class="text-sm text-gray-500">Student</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-2xl shadow-soft">
                        <div class="flex mb-4">
                            <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                            <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                            <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                            <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                            <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                        </div>
                        <p class="text-gray-600 mb-4">"As a service provider, UniPoint has helped me reach more clients
                            and grow my business significantly."</p>
                        <div class="flex items-center">
                            <div
                                class="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center text-white font-bold mr-3">
                                J</div>
                            <div>
                                <p class="font-medium">John Smith</p>
                                <p class="text-sm text-gray-500">Tutor</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-2xl shadow-soft">
                        <div class="flex mb-4">
                            <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                            <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                            <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                            <Icon name="entypo:star" class="h-5 w-5 text-yellow-400" />
                            <Icon name="entypo:star-outlined" class="h-5 w-5 text-yellow-400" />
                        </div>
                        <p class="text-gray-600 mb-4">"The platform is intuitive and the service quality has been
                            excellent. Very impressed with UniPoint!"</p>
                        <div class="flex items-center">
                            <div
                                class="w-10 h-10 bg-gradient-diagonal from-light-purple to-accent-pink rounded-full flex items-center justify-center text-white font-bold mr-3">
                                M</div>
                            <div>
                                <p class="font-medium">Maria Garcia</p>
                                <p class="text-sm text-gray-500">Parent</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section: Enhanced call to action -->
        <section class="py-20 bg-gradient-purple text-white">
            <div class="container mx-auto px-4 text-center">
                <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
                <p class="text-xl mb-10 max-w-2xl mx-auto">Join UniPoint today and discover a world of professional
                    services at your fingertips.</p>
                <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <NuxtLink to="/register"
                        class="px-8 py-4 bg-white text-primary-purple font-medium rounded-xl hover:bg-purple-50 transition-all duration-300 shadow-blue-glow">
                        Sign Up Now
                    </NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'default',
    title: 'Home | UniPoint',
    description: 'Transforming Education Through Innovation'
});

// Add SEO metadata for better optimization
useSeoMeta({
    title: 'UniPoint - Transforming Education Through Innovation',
    ogTitle: 'UniPoint - Connect with Educational Services',
    description: 'UniPoint brings together students, educators, and institutions on a single powerful platform.',
    ogDescription: 'Discover and book educational and professional services with UniPoint.',
    ogImage: '/images/unipoint-social.png',
})
</script>