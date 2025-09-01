<template>
  <div class="legal-hub-layout">
    <!-- Left Sidebar Navigation -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title">Legal Hub</h2>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <h3 class="nav-section-title">Contracts</h3>
          <ul class="nav-list">
            <li>
              <RouterLink 
                to="/legalhub/contracts" 
                :class="['nav-item', { active: $route.path.startsWith('/legalhub/contracts') }]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
                <span>Contracts</span>
                <span class="nav-count">347</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink 
                to="/legalhub/litigation" 
                :class="['nav-item', { active: $route.path.startsWith('/legalhub/litigation') }]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3v5h6v-5"/>
                  <path d="M21 3v5h-6v-5"/>
                  <path d="M9 9h6"/>
                  <path d="M12 15v6"/>
                  <path d="M9 21h6"/>
                </svg>
                <span>Litigation & Compliance</span>
                <span class="nav-count">28</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="nav-section">
          <h3 class="nav-section-title">Quick Actions</h3>
          <ul class="nav-list">
            <li>
              <button class="nav-item nav-action" @click="newContract">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span>New Contract</span>
              </button>
            </li>
            <li>
              <button class="nav-item nav-action" @click="newMatter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="12" y1="11" x2="12" y2="17"/>
                  <line x1="9" y1="14" x2="15" y2="14"/>
                </svg>
                <span>New Matter</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <button class="footer-btn" @click="exportReports">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export Reports
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()

// Quick action methods
const newContract = () => {
  router.push('/legalhub/contracts/generator')
}

const newMatter = () => {
  router.push('/legalhub/litigation/intake')
}

const exportReports = () => {
  console.log('Exporting reports...')
}
</script>

<style scoped>
.legal-hub-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-default);
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: var(--bg-card);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 100;
}

.sidebar-header {
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.sidebar-subtitle {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 2rem;
  padding: 0 1.5rem;
}

.nav-section:last-child {
  margin-bottom: 0;
}

.nav-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.75rem 0;
  padding: 0 0.25rem;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-list li {
  margin-bottom: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.nav-item:hover {
  background: rgba(255,255,255,0.05);
  color: var(--text-primary);
}

.nav-item.active {
  background: rgba(137, 88, 255, 0.15);
  color: var(--primary-accent);
  border: 1px solid rgba(137, 88, 255, 0.3);
}

.nav-item svg {
  flex-shrink: 0;
  opacity: 0.8;
}

.nav-item.active svg {
  opacity: 1;
}

.nav-item span:first-of-type {
  flex: 1;
}

.nav-count {
  font-size: 0.75rem;
  background: rgba(255,255,255,0.1);
  color: var(--text-secondary);
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  font-weight: 600;
}

.nav-item.active .nav-count {
  background: rgba(137, 88, 255, 0.2);
  color: var(--primary-accent);
}

.nav-action:hover {
  background: rgba(137, 88, 255, 0.1);
  color: var(--primary-accent);
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
}

.footer-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.footer-btn:hover {
  background: rgba(255,255,255,0.05);
  border-color: var(--primary-accent);
  color: var(--text-primary);
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 0;
  min-height: 100vh;
  background: var(--bg-default);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    width: 260px;
  }
  
  .main-content {
    margin-left: 260px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    position: relative;
    height: auto;
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .sidebar-header {
    padding: 1.5rem 1rem 1rem;
  }
  
  .nav-section {
    padding: 0 1rem;
  }
  
  .sidebar-footer {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .sidebar-title {
    font-size: 1.25rem;
  }
  
  .sidebar-subtitle {
    font-size: 0.8rem;
  }
  
  .nav-item {
    padding: 0.625rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .nav-item svg {
    width: 16px;
    height: 16px;
  }
}
</style>
