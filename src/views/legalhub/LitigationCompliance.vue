<template>
  <div class="litigation-compliance">
    <!-- Header -->
    <div class="litigation-header">
      <div class="header-content">
        <h2 class="heading-secondary">Litigation & Compliance</h2>
        <p class="text-body">Case management, matter intake, and compliance monitoring</p>
      </div>
      <div class="header-actions">
        <button @click="generateReport" class="btn btn-secondary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
          </svg>
          Analytics Report
        </button>
        <button @click="showNewMatter = true" class="btn btn-primary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
          New Matter
        </button>
      </div>
    </div>

    <!-- Litigation Dashboard Stats -->
    <div class="litigation-stats">
      <div class="stat-item">
        <div class="stat-icon active-cases">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.activeCases }}</div>
          <div class="stat-label">Active Cases</div>
          <div class="stat-change">{{ stats.newCases }} new this month</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon pending-intake">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.pendingIntake }}</div>
          <div class="stat-label">Pending Intake</div>
          <div class="stat-change urgent">{{ stats.urgentIntake }} urgent</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon upcoming-deadlines">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.upcomingDeadlines }}</div>
          <div class="stat-label">Upcoming Deadlines</div>
          <div class="stat-change negative">Next 7 days</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon compliance-score">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.complianceScore }}%</div>
          <div class="stat-label">Compliance Score</div>
          <div class="stat-change positive">+2% this quarter</div>
        </div>
      </div>
    </div>

    <!-- Priority Alerts -->
    <div v-if="priorityAlerts.length" class="priority-alerts">
      <h3 class="section-title">Priority Alerts</h3>
      <div class="alerts-list">
        <div 
          v-for="alert in priorityAlerts" 
          :key="alert.id" 
          :class="['alert-item', alert.severity]"
        >
          <div class="alert-icon">
            <span v-if="alert.severity === 'critical'">🚨</span>
            <span v-else-if="alert.severity === 'warning'">⚠️</span>
            <span v-else>ℹ️</span>
          </div>
          <div class="alert-content">
            <h4>{{ alert.title }}</h4>
            <p>{{ alert.message }}</p>
            <span class="alert-time">{{ formatRelativeTime(alert.timestamp) }}</span>
          </div>
          <div class="alert-actions">
            <button @click="viewAlert(alert)" class="alert-btn">View</button>
            <button @click="dismissAlert(alert)" class="alert-btn dismiss">Dismiss</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Matter Lifecycle Tracker -->
    <div class="matter-lifecycle">
      <h3 class="section-title">Matter Lifecycle Overview</h3>
      <div class="lifecycle-stages">
        <div 
          v-for="(stage, index) in matterStages" 
          :key="index"
          :class="['lifecycle-stage', getStageStatus(stage)]"
          @click="filterByStage(index)"
        >
          <div class="stage-indicator">
            <div class="stage-number">{{ index + 1 }}</div>
            <div class="stage-icon">{{ stage.icon }}</div>
          </div>
          <div class="stage-content">
            <h4>{{ stage.name }}</h4>
            <p class="stage-count">{{ stage.count }} matters</p>
            <p class="stage-avg-time">{{ stage.avgTime }} avg days</p>
          </div>
          <div v-if="index < matterStages.length - 1" class="stage-connector"></div>
        </div>
      </div>
    </div>

    <!-- Workflow Navigation -->
    <div class="workflow-tabs">
      <RouterLink 
        to="/legalhub/litigation/intake" 
        class="workflow-tab" 
        active-class="active"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,15 17,10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Matter Intake
        <span class="tab-count">{{ stats.pendingIntake }}</span>
      </RouterLink>

      <RouterLink 
        to="/legalhub/litigation/active" 
        class="workflow-tab" 
        active-class="active"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        Active Cases
        <span class="tab-count">{{ stats.activeCases }}</span>
      </RouterLink>

      <RouterLink 
        to="/legalhub/litigation/assigned" 
        class="workflow-tab" 
        active-class="active"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
        </svg>
        My Cases
        <span class="tab-count">{{ stats.myCases }}</span>
      </RouterLink>

      <RouterLink 
        to="/legalhub/litigation/timeline" 
        class="workflow-tab" 
        active-class="active"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
        Legal Timeline
      </RouterLink>

      <RouterLink 
        to="/legalhub/litigation/analytics" 
        class="workflow-tab" 
        active-class="active"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
        </svg>
        Analytics
      </RouterLink>
    </div>

    <!-- Main Content Area -->
    <div class="main-content-area">
      <RouterView />
    </div>

    <!-- New Matter Modal -->
    <div v-if="showNewMatter" class="modal-overlay" @click="showNewMatter = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>Create New Matter</h3>
          <button @click="showNewMatter = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createMatter" class="matter-form">
            <div class="form-sections">
              <div class="form-section">
                <h4>Matter Details</h4>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Matter Title *</label>
                    <input v-model="newMatter.title" type="text" class="form-input" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Matter Type *</label>
                    <select v-model="newMatter.type" class="form-select" required>
                      <option value="">Select Type</option>
                      <option value="contract_dispute">Contract Dispute</option>
                      <option value="employment">Employment</option>
                      <option value="intellectual_property">Intellectual Property</option>
                      <option value="regulatory">Regulatory</option>
                      <option value="corporate">Corporate</option>
                      <option value="litigation">Litigation</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Priority</label>
                    <select v-model="newMatter.priority" class="form-select">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Estimated Value</label>
                    <input v-model.number="newMatter.estimatedValue" type="number" class="form-input" placeholder="0">
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Description</label>
                  <textarea v-model="newMatter.description" class="form-textarea" rows="3"></textarea>
                </div>
              </div>

              <div class="form-section">
                <h4>Parties & Assignment</h4>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Opposing Party</label>
                    <input v-model="newMatter.opposingParty" type="text" class="form-input">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Assigned Attorney</label>
                    <select v-model="newMatter.assignedAttorney" class="form-select">
                      <option value="">Select Attorney</option>
                      <option value="sarah_johnson">Sarah Johnson</option>
                      <option value="michael_chen">Michael Chen</option>
                      <option value="emily_rodriguez">Emily Rodriguez</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">External Counsel</label>
                    <input v-model="newMatter.externalCounsel" type="text" class="form-input">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Client Department</label>
                    <select v-model="newMatter.clientDepartment" class="form-select">
                      <option value="">Select Department</option>
                      <option value="sales">Sales</option>
                      <option value="hr">Human Resources</option>
                      <option value="finance">Finance</option>
                      <option value="operations">Operations</option>
                      <option value="technology">Technology</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="showNewMatter = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Create Matter</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// State
const showNewMatter = ref(false)
const stageFilter = ref(null)

// Mock data
const stats = ref({
  activeCases: 23,
  newCases: 5,
  pendingIntake: 8,
  urgentIntake: 2,
  upcomingDeadlines: 12,
  complianceScore: 94,
  myCases: 7
})

const priorityAlerts = ref([
  {
    id: 1,
    severity: 'critical',
    title: 'Contract Dispute Deadline',
    message: 'Response due for TechCorp litigation by December 15th',
    timestamp: new Date('2024-12-10T10:30:00')
  },
  {
    id: 2,
    severity: 'warning',
    title: 'Missing Documentation',
    message: 'Employment case requires additional discovery documents',
    timestamp: new Date('2024-12-09T14:20:00')
  }
])

const matterStages = ref([
  { name: 'Intake', count: 8, avgTime: 2, icon: '📥', status: 'active' },
  { name: 'Investigation', count: 5, avgTime: 14, icon: '🔍', status: 'active' },
  { name: 'Strategy', count: 7, avgTime: 7, icon: '🎯', status: 'current' },
  { name: 'Action', count: 12, avgTime: 45, icon: '⚖️', status: 'active' },
  { name: 'Resolution', count: 3, avgTime: 21, icon: '✅', status: 'pending' },
  { name: 'Closed', count: 18, avgTime: 2, icon: '📋', status: 'complete' }
])

const newMatter = ref({
  title: '',
  type: '',
  priority: 'medium',
  estimatedValue: null,
  description: '',
  opposingParty: '',
  assignedAttorney: '',
  externalCounsel: '',
  clientDepartment: ''
})

// Methods
function generateReport() {
  console.log('Generating analytics report...')
}

function formatRelativeTime(timestamp) {
  const now = new Date()
  const diff = now - timestamp
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) {
    return 'Just now'
  } else if (hours < 24) {
    return `${hours}h ago`
  } else {
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }
}

function viewAlert(alert) {
  console.log('Viewing alert:', alert.title)
}

function dismissAlert(alert) {
  const index = priorityAlerts.value.findIndex(a => a.id === alert.id)
  if (index > -1) {
    priorityAlerts.value.splice(index, 1)
  }
}

function getStageStatus(stage) {
  return stage.status || 'pending'
}

function filterByStage(stageIndex) {
  stageFilter.value = stageFilter.value === stageIndex ? null : stageIndex
  console.log('Filtering by stage:', stageIndex)
}

function createMatter() {
  console.log('Creating new matter:', newMatter.value)
  
  // Reset form and close modal
  showNewMatter.value = false
  newMatter.value = {
    title: '',
    type: '',
    priority: 'medium',
    estimatedValue: null,
    description: '',
    opposingParty: '',
    assignedAttorney: '',
    externalCounsel: '',
    clientDepartment: ''
  }
}

onMounted(() => {
  // Load litigation data
})
</script>

<style scoped>
.litigation-compliance {
  /* Inherits styles from parent */
}

.litigation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.header-content h2 {
  margin-bottom: 0.5rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.litigation-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
}

.stat-icon.active-cases {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.stat-icon.pending-intake {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-icon.upcoming-deadlines {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.stat-icon.compliance-score {
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.stat-change.positive {
  color: var(--health-excellent);
}

.stat-change.negative {
  color: var(--risk-high);
}

.stat-change.urgent {
  color: var(--risk-high);
  font-weight: 600;
}

.priority-alerts {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-item.critical {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

.alert-item.warning {
  background: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
}

.alert-item.info {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

.alert-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-content h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.alert-content p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.alert-time {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.alert-actions {
  display: flex;
  gap: 0.5rem;
}

.alert-btn {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.alert-btn:not(.dismiss) {
  background: var(--primary-accent);
  color: white;
}

.alert-btn:not(.dismiss):hover {
  background: #6d28d9;
}

.alert-btn.dismiss {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.alert-btn.dismiss:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.matter-lifecycle {
  margin-bottom: 3rem;
}

.lifecycle-stages {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.lifecycle-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 140px;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid var(--border-color);
  background: rgba(255, 255, 255, 0.02);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.lifecycle-stage:hover {
  border-color: var(--secondary-accent);
  transform: translateY(-2px);
}

.lifecycle-stage.active {
  border-color: var(--secondary-accent);
  background: rgba(16, 185, 129, 0.1);
}

.lifecycle-stage.current {
  border-color: var(--primary-accent);
  background: rgba(124, 58, 237, 0.1);
}

.lifecycle-stage.pending {
  border-color: var(--risk-medium);
  background: rgba(245, 158, 11, 0.1);
}

.lifecycle-stage.complete {
  border-color: var(--health-excellent);
  background: rgba(34, 197, 94, 0.1);
}

.stage-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stage-number {
  width: 24px;
  height: 24px;
  background: var(--primary-accent);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.stage-icon {
  font-size: 1.5rem;
}

.stage-content {
  text-align: center;
}

.stage-content h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.stage-count {
  color: var(--text-secondary);
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.stage-avg-time {
  color: var(--secondary-accent);
  font-size: 0.75rem;
  font-weight: 500;
}

.stage-connector {
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 2px;
  background: var(--border-color);
  z-index: 1;
}

.workflow-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.02);
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.workflow-tab {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.workflow-tab:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.workflow-tab.active {
  background: var(--primary-accent);
  color: white;
}

.tab-count {
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.main-content-area {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  min-height: 400px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.large {
  max-width: 900px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  color: var(--text-primary);
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
}

.close-btn:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 2rem;
}

.matter-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.form-section h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .litigation-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .litigation-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .alerts-list {
    gap: 0.75rem;
  }

  .alert-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .alert-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .lifecycle-stages {
    flex-direction: column;
    align-items: center;
  }

  .lifecycle-stage {
    min-width: auto;
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
  }

  .stage-connector {
    display: none;
  }

  .workflow-tabs {
    flex-direction: column;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }
}
</style>