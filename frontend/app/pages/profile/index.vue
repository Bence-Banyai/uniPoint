<template>
  <div class="min-h-screen flex flex-col">
    <AppNavbar />

    <main class="flex-grow pt-16 flex items-center justify-center bg-gray-50">
      <div
        class="max-w-6xl w-full space-y-8 bg-white p-8 rounded-lg shadow-md flex"
      >
        <div class="w-1/3 p-4">
          <h2 class="text-2xl font-semibold mb-4">Personal Information</h2>
          <form class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Username</label
              >
              <input
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Email</label
              >
              <input
                type="email"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Password</label
              >
              <input
                type="password"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Location</label
              >
              <input
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <button
              type="button"
              class="w-full bg-red-600 text-white py-2 rounded-md"
            >
              Logout
            </button>
          </form>
        </div>

        <div class="w-2/3 p-4">
          <h2 class="text-2xl font-semibold mb-4">Service History</h2>
          <div class="flex justify-between mb-4">
            <button class="bg-gray-200 text-gray-700 py-2 px-4 rounded-md">
              All Categories
            </button>
            <button class="bg-gray-200 text-gray-700 py-2 px-4 rounded-md">
              Sort by Schedule
            </button>
          </div>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Service
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Scheduled
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">House Cleaning</td>
                <td class="px-6 py-4 whitespace-nowrap">Cleaning</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="bg-green-100 text-green-800 px-2 py-1 rounded-full"
                    >Completed</span
                  >
                </td>
                <td class="px-6 py-4 whitespace-nowrap">2024-02-15 14:00</td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">Lawn Mowing</td>
                <td class="px-6 py-4 whitespace-nowrap">Gardening</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
                    >Pending</span
                  >
                </td>
                <td class="px-6 py-4 whitespace-nowrap">2024-02-16 10:00</td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">Plumbing Fix</td>
                <td class="px-6 py-4 whitespace-nowrap">Maintenance</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                    >In Progress</span
                  >
                </td>
                <td class="px-6 py-4 whitespace-nowrap">2024-02-17 11:30</td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-center mt-8">
            <Pagination />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped>

</style>
