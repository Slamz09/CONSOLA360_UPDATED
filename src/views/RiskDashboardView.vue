<template>
  <div class="risk-dashboard page-container">
    <!-- Header -->
    <div class="dashboard-header">
      <h1 class="heading-primary">Risk 360°</h1>
          </div>

    <!-- Risk Overview Cards -->
    <div class="risk-overview">
      <div class="risk-card overall-risk">
        <h3 class="card-title">Contracts Executed on Company Template</h3>
       <div class="metric-value">88%</div>
        <div class="metric-change positive">+9% improvement</div>
      </div>

      <div class="risk-card">
        <h3 class="card-title">Active Lawsuits</h3>
        <div class="metric-value">20</div>
        <div class="metric-change positive">-5 this month</div>
      </div>

      <div class="risk-card">
        <h3 class="card-title">Pending Deals</h3>
        <div class="metric-value">50</div>
      </div>

      <div class="risk-card">
        <h3 class="card-title">Contracts in Legal Review</h3>
        <div class="metric-value">200</div>
      </div>
    </div>

    <!-- Main Dashboard Grid -->
    <div class="dashboard-grid">
      <!-- Risk by Location -->
      <section class="dashboard-section risk-by-location">
        <h2 class="section-title">Corporate Risk by Location</h2>
        <div class="location-cards">
          <div class="location-card">
            <div class="location-header">
              <h3>California Operations</h3>
              <span class="risk-badge high">Risk: 78</span>
            </div>
            <div class="location-metrics">
              <div class="metric">
                <span class="label">Active Cases:</span>
                <span class="value">34</span>
              </div>
              <div class="metric">
                <span class="label">Employees:</span>
                <span class="value">2,847</span>
              </div>
              <div class="metric">
                <span class="label">Revenue:</span>
                <span class="value">$127M</span>
              </div>
            </div>
            <div class="risk-categories">
              <span class="category-tag environmental">Environmental</span>
              <span class="category-tag privacy">Privacy</span>
            </div>
          </div>

          <div class="location-card">
            <div class="location-header">
              <h3>Texas Operations</h3>
              <span class="risk-badge medium">Risk: 45</span>
            </div>
            <div class="location-metrics">
              <div class="metric">
                <span class="label">Active Cases:</span>
                <span class="value">12</span>
              </div>
              <div class="metric">
                <span class="label">Employees:</span>
                <span class="value">1,203</span>
              </div>
              <div class="metric">
                <span class="label">Revenue:</span>
                <span class="value">$89M</span>
              </div>
            </div>
            <div class="risk-categories">
              <span class="category-tag contract">Contract Disputes</span>
              <span class="category-tag energy">Energy Compliance</span>
            </div>
          </div>

          <div class="location-card">
            <div class="location-header">
              <h3>New York Operations</h3>
              <span class="risk-badge medium">Risk: 52</span>
            </div>
            <div class="location-metrics">
              <div class="metric">
                <span class="label">Active Cases:</span>
                <span class="value">18</span>
              </div>
              <div class="metric">
                <span class="label">Employees:</span>
                <span class="value">3,421</span>
              </div>
              <div class="metric">
                <span class="label">Revenue:</span>
                <span class="value">$198M</span>
              </div>
            </div>
            <div class="risk-categories">
              <span class="category-tag ip">IP Litigation</span>
              <span class="category-tag financial">Financial Reg</span>
              <span class="category-tag real-estate">Real Estate</span>
            </div>
          </div>
        </div>
      </section>
      <!-- Regulatory Alerts -->
      <section class="dashboard-section regulatory-alerts">
        <h2 class="section-title">Regulatory Intelligence Alerts</h2>
        <div class="alerts-list">
          <div class="alert-item high-priority">
            <div class="alert-icon"></div>
            <div class="alert-content">
              <h4>New Employment Law - California</h4>
              <p>SB-1001 requires updated harassment training by Q1 2025</p>
              <div class="alert-meta">
                <span>Affects: 12 locations</span>
                <span>Deadline: Jan 31, 2025</span>
              </div>
            </div>
          </div>

          <div class="alert-item medium-priority">
            <div class="alert-icon"></div>
            <div class="alert-content">
              <h4>Data Privacy Update - New York</h4>
              <p>SHIELD Act compliance review required for all vendors</p>
              <div class="alert-meta">
                <span>Affects: 47 vendors</span>
                <span>Due: Feb 15, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Mock data - replace with API calls
const overallRisk = ref(72)
const activeCases = ref(20)
const complianceScore = ref(85)
const financialExposure = ref(3.2)

onMounted(() => {
  // Load dashboard data
  console.log('Loading risk dashboard data...')
})
</script>

<style scoped>
.risk-dashboard {
  /* Using the page-container class from theme.css */
}

.dashboard-header {
  text-align: left;
  margin-bottom: 3rem;
  margin-top: 2rem;
  font-size: 1px;
}

.heading-primary {
  color: #fff;
}

/* Risk Overview Cards */
.risk-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.risk-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.risk-card:hover {
  border-color: var(--primary-accent);
  transform: translateY(-2px);
}

.card-title {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.risk-score-large {
  font-size: 3rem;
  font-weight: 700;
  color: var(--risk-high);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.risk-indicator {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.risk-indicator.high {
  color: var(--risk-high);
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.metric-change {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.metric-change.positive {
  color: var(--health-excellent);
}

.metric-change.negative {
  color: var(--risk-high);
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.dashboard-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

/* Location Cards */
.location-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.location-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.location-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--primary-accent);
}

.location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.location-header h3 {
  font-size: 1.125rem;
  color: var(--text-primary);
  margin: 0;
}

.risk-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.risk-badge.high {
  background: rgba(239, 68, 68, 0.2);
  color: var(--risk-high);
}

.risk-badge.medium {
  background: rgba(245, 158, 11, 0.2);
  color: var(--risk-medium);
}

.location-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.metric {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.metric .label {
  color: var(--text-secondary);
}

.metric .value {
  font-weight: 600;
  color: var(--text-primary);
}

.risk-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.category-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.category-tag.employment {
  background: rgba(124, 58, 237, 0.2);
  color: #a78bfa;
}

.category-tag.environmental {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
}

.category-tag.privacy {
  background: rgba(59, 130, 246, 0.2);
  color: #93bbfc;
}

.category-tag.contract {
  background: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
}

.category-tag.energy {
  background: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
}

.category-tag.ip {
  background: rgba(236, 72, 153, 0.2);
  color: #f9a8d4;
}

.category-tag.financial {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}

.category-tag.real-estate {
  background: rgba(168, 85, 247, 0.2);
  color: #c4b5fd;
}

/* Litigation List */
.litigation-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.litigation-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.litigation-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--primary-accent);
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.case-number {
  font-size: 0.875rem;
  color: var(--primary-accent);
  font-weight: 500;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.active {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.case-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.case-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.case-risk {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
}

.risk-label {
  color: var(--risk-high);
  font-weight: 550;
}

.risk-label.medium {
  color: var(--risk-medium);
}

.exposure,
.court {
  color: var(--text-secondary);
}

/* Regulatory Alerts */
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.alert-item.high-priority {
  border-left: 3px solid var(--risk-high);
}

.alert-item.medium-priority {
  border-left: 3px solid var(--risk-medium);
}

.alert-icon {
  font-size: 1.5rem;
}

.alert-content h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.alert-content p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.alert-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Responsive Design */
@media (max-width: 1400px) {
  .risk-overview {
    padding: 1rem;
    grid-template-columns: repeat(2, 1fr);
  }
  
  .location-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 800px) {
  .risk-overview {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header {
    text-align: left;
  }
  
  .case-risk {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
