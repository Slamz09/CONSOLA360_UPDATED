<template>
  <div class="layout">
    <!-- Fixed Logo -->
    <div class="fixed-logo" @click="navigateHome">
      <span class="logo-text">CONS</span><span class="logo-o"></span><span class="logo-text">LA</span>
    </div>

    <header class="navbar">
      <div class="navbar-container">
        <nav class="nav-menu">
          <RouterLink to="/" class="nav-link" active-class="active">Risk Dashboard</RouterLink>
          <RouterLink to="/deal360" class="nav-link" active-class="active">Deal 360°</RouterLink>
          <RouterLink to="/legalhub" class="nav-link" active-class="active">Legal Hub</RouterLink>
          <RouterLink to="/accounts" class="nav-link" active-class="active">Account Intelligence</RouterLink>
          <RouterLink to="/support" class="nav-link" active-class="active">Support</RouterLink>
        </nav>
        <div class="nav-actions">
          <button class="btn btn-ghost btn-small" @click="handleSearch" aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <button class="btn btn-ghost btn-small" @click="handleNotifications" aria-label="Notifications">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <div class="user-avatar" @click="handleUserMenu">
            <div class="avatar-circle">
              <span class="avatar-text">{{ userInitials }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Computed property for user initials (you can make this dynamic later)
const userInitials = computed(() => {
  // This could come from a user store/composable
  return 'JD' // John Doe - replace with actual user data
})

// Navigation methods
const navigateHome = () => {
  router.push('/')
}

const handleSearch = () => {
  // Implement search functionality
  console.log('Search clicked')
}

const handleNotifications = () => {
  // Implement notifications functionality
  console.log('Notifications clicked')
}

const handleUserMenu = () => {
  // Implement user menu functionality
  console.log('User menu clicked')
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

/* Fixed Logo */
.fixed-logo {
  position: fixed;
  top: 1.5rem;
  left: 2rem;
  z-index: 9999;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-family: 'Inter', sans-serif;
  transition: opacity 0.2s ease;
}

.fixed-logo:hover {
  opacity: 0.8;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.fixed-logo .logo-o {
  display: inline-block;
  width: 18px;
  height: 18px;
  background: #7c3aed;
  border-radius: 50%;
  margin: 0 3px;
}

/* Navbar */
.navbar {
  padding-top: 0;
  padding-bottom: 0;
}

.navbar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 2rem;
  position: relative;
}

.nav-menu {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  padding: 0.5rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border-radius: 8px;
  position: relative;
}

.nav-link:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.nav-link.active {
  color: var(--primary-accent);
  background: rgba(124, 58, 237, 0.1);
}

/* Improved active indicator */
.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: var(--primary-accent);
  border-radius: 50%;
}

.nav-actions {
  position: fixed;
  top: 1.5rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1000;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}

.btn-ghost:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.btn-small {
  padding: 0.5rem;
  border-radius: 6px;
}

.user-avatar {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.user-avatar:hover {
  opacity: 0.8;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.75rem;
  color: white;
}

.avatar-text {
  color: white;
  font-weight: 600;
}

.main-content {
  padding-top: 1rem;
  width: 100%;
  padding-left: 2rem;
  padding-right: 2rem;
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive design */
@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-actions {
    position: relative;
    top: auto;
    right: auto;
  }
  
  .fixed-logo {
    position: relative;
    top: auto;
    left: auto;
    margin-bottom: 1rem;
  }
  
  .main-content {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 480px) {
  .nav-menu {
    gap: 0.5rem;
  }
  
  .nav-link {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }
  
  .logo-text {
    font-size: 1.25rem;
  }
  
  .fixed-logo .logo-o {
    width: 14px;
    height: 14px;
  }
}
</style>
