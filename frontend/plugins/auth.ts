import { useAuthStore } from '../stores/auth'

export default defineNuxtPlugin(async (nuxtApp) => {
  // Initialize auth store
  const authStore = useAuthStore()
  authStore.init()
  
  // Add navigation guards
  nuxtApp.hook('app:created', () => {
    // This hook runs once when the app is created
    const router = useRouter()
    
    // You could add global navigation guards here if needed
    // This is an alternative to the middleware approach
  })
})