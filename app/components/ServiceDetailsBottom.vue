<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
    <!-- Service Description -->
    <div class="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Professional Hair Styling Services</h2>
      <p class="text-gray-600 mb-4">
        Experience premium hair styling services tailored to your unique style. Our expert stylists use professional-grade products and techniques to ensure you leave looking and feeling your best.
      </p>
      <div class="mb-4">
        <h3 class="font-semibold">Haircut & Styling</h3>
        <p class="text-gray-600">45 minutes • $65</p>
      </div>
      <div class="mb-4">
        <h3 class="font-semibold">Color Treatment</h3>
        <p class="text-gray-600">120 minutes • $120</p>
      </div>
      <div class="mb-4">
        <h3 class="font-semibold">Hair Treatment</h3>
        <p class="text-gray-600">60 minutes • $85</p>
      </div>
      <div class="mb-4">
        <h3 class="font-semibold">Location</h3>
        <p class="text-gray-600">123 Style Street, Fashion District, San Francisco, CA 94105</p>
      </div>
    </div>

    <!-- Opening Hours -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Opening Hours</h2>
      <ul class="text-gray-600">
        <li class="flex justify-between mb-2"><span>Monday</span><span>9:00 AM - 7:00 PM</span></li>
        <li class="flex justify-between mb-2"><span>Tuesday</span><span>9:00 AM - 7:00 PM</span></li>
        <li class="flex justify-between mb-2"><span>Wednesday</span><span>9:00 AM - 7:00 PM</span></li>
        <li class="flex justify-between mb-2"><span>Thursday</span><span>9:00 AM - 7:00 PM</span></li>
        <li class="flex justify-between mb-2"><span>Friday</span><span>9:00 AM - 7:00 PM</span></li>
        <li class="flex justify-between mb-2"><span>Saturday</span><span>10:00 AM - 6:00 PM</span></li>
        <li class="flex justify-between"><span>Sunday</span><span>Closed</span></li>
      </ul>
    </div>

    <!-- Book Appointment -->
    <div class="bg-white p-6 rounded-lg shadow-md mt-8 md:mt-0 md:col-span-3">
      <h2 class="text-xl font-bold mb-4">Book Appointment</h2>
      <form>
        <div class="mb-4">
          <label for="date" class="block text-gray-700">Select Date</label>
          <input type="date" id="date" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
        </div>
        <button type="submit" class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Book Now</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional script needed for this component
</script>