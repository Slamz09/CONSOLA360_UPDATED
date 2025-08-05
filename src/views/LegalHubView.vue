<template>
  <div class="legalhub-view">
    <!-- Header -->
    <div class="legalhub-header">
      <div class="header-content">
        <h1 class="heading-primary">Legal Hub</h1>
        <p class="text-body">Comprehensive legal operations management suite</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export Reports
        </button>
        <button class="btn btn-primary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
          New Matter
        </button>
      </div>
    </div>

    <!-- Legal Hub Stats -->
    <div class="legalhub-stats">
      <div class="stat-item">
        <div class="stat-number text-accent">347</div>
        <div class="stat-label">Active Contracts</div>
      </div>
      <div class="stat-item">
        <div class="stat-number risk-medium">23</div>
        <div class="stat-label">Active Matters</div>
      </div>
      <div class="stat-item">
        <div class="stat-number health-excellent">94%</div>
        <div class="stat-label">Compliance Score</div>
      </div>
      <div class="stat-item">
        <div class="stat-number text-accent">$127.8M</div>
        <div class="stat-label">Total Contract Value</div>
      </div>
    </div>

    <!-- Module Navigation -->
    <div class="module-navigation">
      <RouterLink to="/legalhub/contracts" class="module-card" active-class="active">
        <div class="module-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <div class="module-content">
          <h3>Contracts Management</h3>
          <p>All contracts, assigned contracts, contract generator, and clause repository</p>
          <div class="module-stats">
            <span class="stat-badge">347 Active</span>
            <span class="stat-badge">23 Pending</span>
          </div>
        </div>
      </RouterLink>

      <RouterLink to="/legalhub/litigation" class="module-card" active-class="active">
        <div class="module-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div class="module-content">
          <h3>Litigation & Compliance</h3>
          <p>Matter intake, active cases, legal timeline, and dispute analytics</p>
          <div class="module-stats">
            <span class="stat-badge risk-medium">23 Active</span>
            <span class="stat-badge">5 New</span>
          </div>
        </div>
      </RouterLink>

      <RouterLink to="/legalhub/intelligence" class="module-card" active-class="active">
        <div class="module-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a3 3 0 0 0-3 3c0 1.5-1.5 3-3 3s-3 1.5-3 3 1.5 3 3 3c1.5 0 3 1.5 3 3a3 3 0 0 0 6 0c0-1.5 1.5-3 3-3s3-1.5 3-3-1.5-3-3-3c-1.5 0-3-1.5-3-3a3 3 0 0 0-3-3z"/>
          </svg>
        </div>
        <div class="module-content">
          <h3>Legal Intelligence</h3>
          <p>Clause deviation, regulatory feed, and playbooks & training</p>
          <div class="module-stats">
            <span class="stat-badge health-excellent">15 Insights</span>
            <span class="stat-badge">8 Updates</span>
          </div>
        </div>
      </RouterLink>
    </div>

    <!-- Main Content Layout -->
    <div class="legalhub-layout">
      <!-- Sidebar Navigation -->
      <aside class="legalhub-sidebar">
        <div class="sidebar-header">
          <h3 class="heading-tertiary">Legal Operations</h3>
        </div>
        <nav class="sidebar-nav">
          <!-- Contracts Management -->
          <div class="nav-section">
            <div class="nav-section-title">Contracts Management</div>
            <RouterLink to="/legalhub/contracts/all" class="sidebar-link" active-class="active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
              All Contracts
            </RouterLink>
            <RouterLink to="/legalhub/contracts/assigned" class="sidebar-link" active-class="active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Assigned Contracts
            </RouterLink>
            <RouterLink to="/legalhub/contracts/generator" class="sidebar-link" active-class="active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14m-7-7h14"/>
              </svg>
              Contract Generator
            </RouterLink>
            <RouterLink to="/legalhub/contracts/repository" class="sidebar-link" active-class="active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              Clause Repository
            </RouterLink>
          </div>

          <!-- Litigation & Compliance -->
          <div class="nav-section">
            <div class="nav-section-title">Litigation & Compliance</div>
            <RouterLink to="/legalhub/litigation/intake" class="sidebar-link" active-class="active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14m-7-7h14"/>
              </svg>
              Matter Intake
            </RouterLink>
            <RouterLink to="/legalhub/litigation/active" class="sidebar-link" active-class="active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Active Cases
            </RouterLink>
            <RouterLink to="/legalhub/litigation/assigned" class="sidebar-link" active-class="active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
              Assigned Cases
            </RouterLink>
            <RouterLink to="/legalhub/litigation/timeline" class="sidebar-link" active-class="active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              Legal Timeline
            </RouterLink>
            <RouterLink to="/legalhub/litigation/analytics" class="sidebar-link" active-class="active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
              </svg>
              Dispute Analytics
            </RouterLink>
          </div>

          <!-- Legal Intelligence -->
          <div class="nav-section">
            <div class="nav-section-title">Legal Intelligence</div>
            <RouterLink to="/legalhub/intelligence/deviation" class="sidebar-link" active-class="active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
              </svg>
              Clause Deviation
            </RouterLink>
            <RouterLink to="/legalhub/intelligence/regulatory" class="sidebar-link" active-class="active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              Regulatory Feed
            </RouterLink>
            <RouterLink to="/legalhub/intelligence/playbooks" class="sidebar-link" active-class="active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              Playbooks & Training
            </RouterLink>
          </div>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="legalhub-main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
// No logic needed for layout component
</script>

<style scoped>
.legalhub-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.legalhub-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 2rem;
}

.header-content h1 {
  margin-bottom: 0.5rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.legalhub-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-item {
  text-align: center;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.module-navigation {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.module-card {
  display: flex;
  gap: 1.5rem;
  padding: 2rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.module-card:hover {
  border-color: var(--primary-accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(124, 58, 237, 0.15);
}

.module-card.active {
  border-color: var(--primary-accent);
  background: rgba(124, 58, 237, 0.05);
}

.module-icon {
  flex-shrink: 0;
  color: var(--secondary-accent);
}

.module-content h3 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.module-content p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.module-stats {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.stat-badge {
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.legalhub-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
}

.legalhub-sidebar {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.sidebar-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.nav-section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--secondary-accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.sidebar-link:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-link.active {
  color: var(--text-primary);
  background: rgba(124, 58, 237, 0.2);
  border-left: 3px solid var(--primary-accent);
}

.legalhub-main {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  min-height: 600px;
}

@media (max-width: 768px) {
  .legalhub-view {
    padding: 1rem;
  }

  .legalhub-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .legalhub-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .module-navigation {
    grid-template-columns: 1fr;
  }

  .module-card {
    flex-direction: column;
    text-align: center;
  }

  .legalhub-layout {
    grid-template-columns: 1fr;
  }

  .legalhub-sidebar {
    position: static;
  }
}
</style>