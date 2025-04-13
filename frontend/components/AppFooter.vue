<template>
    <footer class="bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div class="container mx-auto px-4">
            <!-- Main footer content -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <!-- Brand column -->
                <div class="space-y-4">
                    <NuxtLink to="/" class="flex items-center space-x-2 group">
                        <div
                            class="h-10 w-10 bg-gradient-purple rounded-lg flex items-center justify-center shadow-purple-glow transition-all duration-300 group-hover:shadow-blue-glow">
                            <NuxtImg src="/logo.png" alt="uniPoint Logo" class="h-6 w-auto" />
                        </div>
                        <span
                            class="font-bold text-xl bg-gradient-to-r from-primary-purple to-accent-blue bg-clip-text text-transparent">uniPoint</span>
                    </NuxtLink>
                    <p class="text-gray-600 max-w-xs">Connecting students and educators on a powerful digital platform
                        for educational services.</p>
                    <div class="flex space-x-4">
                        <a href="#"
                            class="w-10 h-10 rounded-full bg-purple-glass flex items-center justify-center text-primary-purple hover:bg-primary-purple hover:text-white transition-all duration-300">
                            <Icon name="entypo:facebook" />
                        </a>
                        <a href="#"
                            class="w-10 h-10 rounded-full bg-purple-glass flex items-center justify-center text-primary-purple hover:bg-primary-purple hover:text-white transition-all duration-300">
                            <Icon name="entypo:twitter" />
                        </a>
                        <a href="#"
                            class="w-10 h-10 rounded-full bg-purple-glass flex items-center justify-center text-primary-purple hover:bg-primary-purple hover:text-white transition-all duration-300">
                            <Icon name="entypo:instagram" />
                        </a>
                    </div>
                </div>

                <!-- Links column -->
                <div class="md:flex justify-center">
                    <div class="space-y-4">
                        <h3 class="font-bold text-lg text-dark-purple">Quick Links</h3>
                        <ul class="space-y-2">
                            <li>
                                <NuxtLink to="/services"
                                    class="text-gray-600 hover:text-primary-purple transition-colors">Services
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/about" class="text-gray-600 hover:text-primary-purple transition-colors">
                                    About Us</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/contact"
                                    class="text-gray-600 hover:text-primary-purple transition-colors">Contact</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/terms" class="text-gray-600 hover:text-primary-purple transition-colors">
                                    Terms</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/privacy"
                                    class="text-gray-600 hover:text-primary-purple transition-colors">Privacy</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/support"
                                    class="text-gray-600 hover:text-primary-purple transition-colors">Support</NuxtLink>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Contact column -->
                <div class="space-y-4">
                    <h3 class="font-bold text-lg text-dark-purple">Contact Us</h3>
                    <div class="space-y-3">
                        <div class="flex items-center">
                            <Icon name="entypo:email" class="text-accent-blue mr-3" />
                            <span class="text-gray-600">contact@unipoint.com</span>
                        </div>
                        <div class="flex items-center">
                            <Icon name="entypo:phone" class="text-accent-blue mr-3" />
                            <span class="text-gray-600">+1 234 567 890</span>
                        </div>
                        <div class="flex items-center">
                            <Icon name="entypo:location-pin" class="text-accent-blue mr-3" />
                            <span class="text-gray-600">123 Education Street, Learning City</span>
                        </div>
                    </div>

                    <!-- Newsletter sign-up -->
                    <div class="mt-6">
                        <h4 class="font-medium text-dark-purple mb-2">Subscribe to our newsletter</h4>
                        <div class="flex">
                            <input type="email" placeholder="Your email"
                                class="flex-grow px-4 py-2 rounded-l-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-purple" />
                            <button
                                class="bg-gradient-purple px-4 py-2 text-white rounded-r-xl hover:shadow-purple-glow transition-all duration-300">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom footer -->
            <div class="pt-8 mt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
                <p class="text-sm text-gray-600">© 2025 UniPoint. Bányai Bence, Sándor Kevin, Tiszolczi Jácint. All
                    rights reserved.</p>
                <div class="mt-4 md:mt-0">
                    <NuxtImg src="/payment-methods.png" alt="Payment Methods" class="h-8" />
                </div>
            </div>
        </div>
    </footer>
</template>