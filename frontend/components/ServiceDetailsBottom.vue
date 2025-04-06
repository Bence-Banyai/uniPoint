<template>
    <div class="container mx-auto px-4 py-8">
        <div class="flex">
            <div class="w-2/3 pr-8">
                <div class="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 class="text-2xl font-bold mb-4">Service Description</h2>
                    <p class="text-gray-600 mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p class="text-gray-600 mb-4">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                        laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
                        beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                    </p>
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
                        <div class="space-y-4">
                            <div class="border-b pb-4">
                                <div class="flex items-center mb-2">
                                    <div class="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                                    <div>
                                        <h4 class="font-semibold">Jane Doe</h4>
                                        <div class="flex">
                                            <Icon name="entypo:star" class="h-4 w-4 text-yellow-400" />
                                            <Icon name="entypo:star" class="h-4 w-4 text-yellow-400" />
                                            <Icon name="entypo:star" class="h-4 w-4 text-yellow-400" />
                                            <Icon name="entypo:star" class="h-4 w-4 text-yellow-400" />
                                            <Icon name="entypo:star" class="h-4 w-4 text-gray-300" />
                                        </div>
                                    </div>
                                    <span class="ml-auto text-sm text-gray-500">2 months ago</span>
                                </div>
                                <p class="text-gray-600">Great service! Would highly recommend.</p>
                            </div>

                            <div class="border-b pb-4">
                                <div class="flex items-center mb-2">
                                    <div class="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                                    <div>
                                        <h4 class="font-semibold">John Smith</h4>
                                        <div class="flex">
                                            <Icon name="entypo:star" class="h-4 w-4 text-yellow-400" />
                                            <Icon name="entypo:star" class="h-4 w-4 text-yellow-400" />
                                            <Icon name="entypo:star" class="h-4 w-4 text-yellow-400" />
                                            <Icon name="entypo:star" class="h-4 w-4 text-yellow-400" />
                                            <Icon name="entypo:star" class="h-4 w-4 text-yellow-400" />
                                        </div>
                                    </div>
                                    <span class="ml-auto text-sm text-gray-500">1 month ago</span>
                                </div>
                                <p class="text-gray-600">Excellent service and very professional.</p>
                            </div>
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
                        <input type="date"
                            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 mb-2">Select Time</label>
                        <div class="grid grid-cols-2 gap-2">
                            <button class="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-purple-100">9:00
                                AM</button>
                            <button class="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-purple-100">10:00
                                AM</button>
                            <button class="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-purple-100">11:00
                                AM</button>
                            <button class="px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200">1:00
                                PM</button>
                            <button class="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-purple-100">2:00
                                PM</button>
                            <button class="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-purple-100">3:00
                                PM</button>
                        </div>
                    </div>
                    <button class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Book
                        Appointment</button>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-bold mb-4">Similar Services</h3>
                    <div class="space-y-4">
                        <div class="flex items-center">
                            <div class="w-16 h-16 bg-gray-200 mr-3"></div>
                            <div>
                                <h4 class="font-semibold">Related Service 1</h4>
                                <p class="text-sm text-gray-600">Brief description</p>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="w-16 h-16 bg-gray-200 mr-3"></div>
                            <div>
                                <h4 class="font-semibold">Related Service 2</h4>
                                <p class="text-sm text-gray-600">Brief description</p>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="w-16 h-16 bg-gray-200 mr-3"></div>
                            <div>
                                <h4 class="font-semibold">Related Service 3</h4>
                                <p class="text-sm text-gray-600">Brief description</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>