import { useAuthStore } from '../useAuthStore'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Initialize auth store if it hasn't been already
  if (!authStore.token) {
    authStore.init()
  }
  
  // If user is not authenticated and tries to access a protected route
  if (!authStore.isAuthenticated && to.meta.requiresAuth) {
    return navigateTo('/login')
  }
  
  // If user is authenticated but tries to access a route they shouldn't (e.g., wrong role)
  if (authStore.isAuthenticated && to.meta.requiresRole && 
      authStore.user.role !== to.meta.requiresRole) {
    return navigateTo('/')
  }
  
  // If user is already authenticated and tries to access login/register pages
  if (authStore.isAuthenticated && to.meta.guestOnly) {
    return navigateTo('/')
  }
})