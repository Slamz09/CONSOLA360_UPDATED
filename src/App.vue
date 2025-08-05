<template>
  <div class="app">
    <!-- Animated Background -->
    <div class="bg-gradient-orb orb-1"></div>
    <div class="bg-gradient-orb orb-2"></div>
    
    <!-- Cache AccountsView so its state (your sheet & filter) is preserved -->
    <keep-alive include="AccountsView">
      <SidebarLayout />
    </keep-alive>
  </div>
</template>

<script setup>
import SidebarLayout from './components/SidebarLayout.vue'
</script>

<style>
/* Import global theme */
@import '@/assets/theme.css';

/* Additional app-specific styles */
.app {
  min-height: 100vh;
  position: relative;
}

#app {
  margin: 0;
  background: var(--bg-primary);
  font-family: 'Inter', sans-serif;
}
</style>
