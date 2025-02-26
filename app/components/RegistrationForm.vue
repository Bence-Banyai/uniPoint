<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form @submit.prevent="handleSubmit" class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <!-- Username -->
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Username</label>
                <input v-model="form.username" type="text"
                    class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
                    :class="errors.username ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'"
                    @blur="validateUsername" />
                <p v-if="errors.username" class="text-red-500 text-xs mt-1">{{ errors.username }}</p>
            </div>

            <!-- Email -->
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input v-model="form.email" type="email"
                    class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
                    :class="errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'"
                    @blur="validateEmail" />
                <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
            </div>

            <!-- Phone -->
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                <input v-model="form.phone" type="tel"
                    class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
                    :class="errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'"
                    @blur="validatePhone" />
                <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
            </div>

            <!-- Password -->
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input v-model="form.password" type="password"
                    class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
                    :class="errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'"
                    @blur="validatePassword" />
                <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
            </div>

            <!-- Confirm Password -->
            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                <input v-model="form.confirmPassword" type="password"
                    class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
                    :class="errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'"
                    @blur="validateConfirmPassword" />
                <p v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1">{{ errors.confirmPassword }}</p>
            </div>

            <button type="submit"
                class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors">
                Register
            </button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                username: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
            },
            errors: {
                username: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
            }
        }
    },
    methods: {
        validateUsername() {
            const regex = /^[a-zA-Z0-9]{6,}$/
            if (!this.form.username) {
                this.errors.username = 'Username is required'
            } else if (!regex.test(this.form.username)) {
                this.errors.username = 'Username must be at least 6 characters with no spaces or special characters'
            } else {
                this.errors.username = ''
            }
        },
        validateEmail() {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!this.form.email) {
                this.errors.email = 'Email is required'
            } else if (!regex.test(this.form.email)) {
                this.errors.email = 'Invalid email format'
            } else {
                this.errors.email = ''
            }
        },
        validatePhone() {
            const regex = /^\d{11}$/
            if (!this.form.phone) {
                this.errors.phone = 'Phone number is required'
            } else if (!regex.test(this.form.phone)) {
                this.errors.phone = 'Phone number must contain exactly 11 digits'
            } else {
                this.errors.phone = ''
            }
        },
        validatePassword() {
            const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{6,}$/
            if (!this.form.password) {
                this.errors.password = 'Password is required'
            } else if (!regex.test(this.form.password)) {
                this.errors.password = 'Must contain at least 6 characters, 1 number, 1 capital letter, and 1 special character'
            } else {
                this.errors.password = ''
            }
        },
        validateConfirmPassword() {
            if (!this.form.confirmPassword) {
                this.errors.confirmPassword = 'Please confirm your password'
            } else if (this.form.confirmPassword !== this.form.password) {
                this.errors.confirmPassword = 'Passwords do not match'
            } else {
                this.errors.confirmPassword = ''
            }
        },
        handleSubmit() {

            this.validateUsername()
            this.validateEmail()
            this.validatePhone()
            this.validatePassword()
            this.validateConfirmPassword()


            const hasErrors = Object.values(this.errors).some(error => error !== '')

            if (!hasErrors) {
                // Ide jön majd API esetleg beláthatatlan időn belül
                this.resetForm()
                alert('Registration successful!')
            }
        },
        resetForm() {
            this.form = {
                username: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
            }
            this.errors = {
                username: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
            }
        }
    }
}
</script>