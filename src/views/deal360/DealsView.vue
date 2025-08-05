<template>
  <div class="deals-view">
    <!-- Header -->
    <div class="deals-header">
      <div class="header-content">
        <h2 class="heading-secondary">Deals Pipeline</h2>
        <p class="text-body">Active deals and pipeline management with AI-powered insights</p>
      </div>
      <div class="header-actions">
        <select v-model="selectedView" class="view-selector">
          <option value="all">All Deals</option>
          <option value="active">Active</option>
          <option value="stalled">Stalled</option>
          <option value="completed">Completed</option>
        </select>
        <button @click="showNewDeal = true" class="btn btn-primary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
          New Deal
        </button>
      </div>
    </div>

    <!-- Role-based View Tabs -->
    <div class="role-tabs">
      <button
        v-for="role in availableRoles"
        :key="role.value"
        @click="activeRole = role.value"
        :class="['role-tab', { active: activeRole === role.value }]"
      >
        {{ role.label }}
      </button>
    </div>

    <!-- Domino Tracker: Deal Lifecycle Stages -->
    <div class="domino-tracker">
      <h3 class="section-title">Deal Lifecycle Progress</h3>
      <div class="domino-stages">
        <div v-for="(stage, index) in stages" :key="index" 
             :class="['domino-stage', getStageStatus(stage, index)]"
             @click="filterByStage(index)">
          <div class="stage-indicator">
            <div class="stage-number">{{ index + 1 }}</div>
            <div class="stage-icon">{{ stage.icon }}</div>
          </div>
          <div class="stage-content">
            <h4>{{ stage.name }}</h4>
            <p class="stage-count">{{ getStageCount(index) }} deals</p>
            <p class="stage-duration">{{ getAvgStageDuration(index) }} avg days</p>
          </div>
          <div v-if="index < stages.length - 1" class="stage-connector"></div>
        </div>
      </div>
    </div>

    <!-- Deal Pipeline -->
    <div class="pipeline-section">
      <h3 class="section-title">
        Deal Pipeline 
        <span class="pipeline-count">({{ filteredDeals.length }} deals)</span>
      </h3>
      
      <!-- Deal List -->
      <div class="deals-list">
        <div
          v-for="deal in filteredDeals"
          :key="deal.id"
          class="deal-card"
          @click="selectedDeal = deal"
        >
          <div class="deal-header">
            <div class="deal-info">
              <h4 class="deal-name">{{ deal.companyName }}</h4>
              <p class="deal-value">${{ deal.value }}K</p>
              <p class="deal-owner">{{ deal.owner }}</p>
            </div>
            <div class="deal-meta">
              <span class="deal-stage-badge" :class="getStageClass(deal.currentStage)">
                {{ stages[deal.currentStage].name }}
              </span>
              <div class="deal-flags">
                <span v-if="deal.isStalled" class="flag-badge stalled">Stalled</span>
                <span v-if="deal.riskScore > 70" class="flag-badge risk">High Risk</span>
              </div>
            </div>
          </div>

          <!-- Timeline Progress -->
          <div class="timeline-progress">
            <div class="timeline-track">
              <div
                class="timeline-fill"
                :style="{ width: `${(deal.currentStage / (stages.length - 1)) * 100}%` }"
              ></div>
              <div
                v-for="(stage, index) in stages"
                :key="index"
                class="timeline-node"
                :class="{
                  'completed': index < deal.currentStage,
                  'current': index === deal.currentStage,
                  'stalled': index === deal.currentStage && deal.isStalled,
                  'pending': index > deal.currentStage
                }"
                :style="{ left: `${(index / (stages.length - 1)) * 100}%` }"
              >
                <div class="node-tooltip">
                  {{ stage.name }}
                  <span v-if="deal.stageDurations[index]" class="duration">
                    {{ deal.stageDurations[index] }} days
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Deal Actions -->
          <div class="deal-actions">
            <button @click.stop="advanceStage(deal)" class="action-btn advance">
              Advance Stage
            </button>
            <button @click.stop="generateContract(deal)" class="action-btn contract">
              Generate Contract
            </button>
            <button @click.stop="markStalled(deal)" class="action-btn stall">
              {{ deal.isStalled ? 'Unstall' : 'Mark Stalled' }}
            </button>
          </div>

          <!-- Alerts -->
          <div v-if="deal.alerts.length" class="deal-alerts">
            <div v-for="alert in deal.alerts" :key="alert.id" class="alert-item" :class="alert.severity">
              <span class="alert-icon">⚠️</span>
              {{ alert.message }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Deal Detail Modal -->
    <div v-if="selectedDeal" class="modal-overlay" @click="selectedDeal = null">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedDeal.companyName }} - Deal Details</h2>
          <button @click="selectedDeal = null" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <!-- Deal Information Grid -->
          <div class="deal-details-grid">
            <div class="detail-section">
              <h4>Deal Information</h4>
              <div class="detail-item">
                <span class="label">Value:</span>
                <span class="value">${{ selectedDeal.value }}K</span>
              </div>
              <div class="detail-item">
                <span class="label">Owner:</span>
                <span class="value">{{ selectedDeal.owner }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Created:</span>
                <span class="value">{{ formatDate(selectedDeal.createdAt) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Expected Close:</span>
                <span class="value">{{ formatDate(selectedDeal.expectedClose) }}</span>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>Risk Assessment</h4>
              <div class="detail-item">
                <span class="label">Risk Score:</span>
                <span class="value risk-score" :class="getRiskClass(selectedDeal.riskScore)">
                  {{ selectedDeal.riskScore }}
                </span>
              </div>
              <div class="detail-item">
                <span class="label">Compliance:</span>
                <span class="value">{{ selectedDeal.complianceStatus }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Legal Review:</span>
                <span class="value">{{ selectedDeal.legalReviewRequired ? 'Required' : 'Not Required' }}</span>
              </div>
            </div>
          </div>

          <!-- Stage History -->
          <div class="stage-history">
            <h4>Stage History</h4>
            <div class="history-timeline">
              <div
                v-for="(stage, index) in stages.slice(0, selectedDeal.currentStage + 1)"
                :key="index"
                class="history-item"
              >
                <div class="history-marker"></div>
                <div class="history-content">
                  <h5>{{ stage.name }}</h5>
                  <p v-if="selectedDeal.stageTimestamps[index]">
                    {{ formatDate(selectedDeal.stageTimestamps[index]) }}
                  </p>
                  <p v-if="selectedDeal.stageDurations[index]" class="duration-text">
                    Duration: {{ selectedDeal.stageDurations[index] }} days
                    <span v-if="selectedDeal.stageDurations[index] > stage.threshold" class="overdue">
                      ({{ selectedDeal.stageDurations[index] - stage.threshold }} days over limit)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="modal-actions">
            <button @click="generateContract(selectedDeal)" class="btn btn-primary">Generate Contract</button>
            <button @click="advanceStage(selectedDeal)" class="btn btn-secondary">Advance Stage</button>
            <button @click="selectedDeal = null" class="btn btn-ghost">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- New Deal Form Modal -->
    <div v-if="showNewDeal" class="modal-overlay" @click="showNewDeal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Create New Deal</h2>
          <button @click="showNewDeal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createDeal" class="new-deal-form">
            <div class="form-group">
              <label class="form-label">Company Name</label>
              <input v-model="newDealForm.companyName" type="text" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Deal Value ($K)</label>
              <input v-model.number="newDealForm.value" type="number" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Primary Contact</label>
              <input v-model="newDealForm.contact" type="text" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Expected Close Date</label>
              <input v-model="newDealForm.expectedClose" type="date" class="form-input">
            </div>
            <div class="form-actions">
              <button type="button" @click="showNewDeal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Create Deal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Data
const stages = [
  { name: 'Lead Identified', threshold: 3, icon: '🎯' },
  { name: 'Initial Contact', threshold: 5, icon: '📞' },
  { name: 'Deal Qualified', threshold: 7, icon: '✅' },
  { name: 'Proposal Sent', threshold: 10, icon: '📄' },
  { name: 'Deal Approved', threshold: 15, icon: '👍' },
  { name: 'Contract Drafted', threshold: 7, icon: '📝' },
  { name: 'Contract Review', threshold: 5, icon: '🔍' },
  { name: 'Negotiation', threshold: 14, icon: '🤝' },
  { name: 'Contract Executed', threshold: 3, icon: '✍️' },
  { name: 'Renewal/Monitoring', threshold: 365, icon: '🔄' }
]

// State
const selectedView = ref('all')
const activeRole = ref('all')
const selectedDeal = ref(null)
const showNewDeal = ref(false)
const stageFilter = ref(null)
const deals = ref([])

// Role-based views
const availableRoles = [
  { value: 'all', label: 'All Teams' },
  { value: 'sales', label: 'Sales View' },
  { value: 'legal', label: 'Legal View' },
  { value: 'executive', label: 'Executive View' }
]

// New deal form
const newDealForm = ref({
  companyName: '',
  value: null,
  contact: '',
  expectedClose: ''
})

// Mock data
const mockDeals = [
  {
    id: 1,
    companyName: 'TechCorp Industries',
    value: 250,
    owner: 'Sarah Johnson',
    currentStage: 5,
    createdAt: new Date('2024-11-15'),
    expectedClose: new Date('2025-01-15'),
    riskScore: 35,
    complianceStatus: 'Verified',
    legalReviewRequired: false,
    isStalled: false,
    stageDurations: [2, 3, 5, 8, 12, 5, 0, 0, 0, 0],
    stageTimestamps: [
      new Date('2024-11-15'),
      new Date('2024-11-17'),
      new Date('2024-11-20'),
      new Date('2024-11-25'),
      new Date('2024-12-03'),
      new Date('2024-12-15')
    ],
    alerts: []
  },
  {
    id: 2,
    companyName: 'Global Healthcare Solutions',
    value: 480,
    owner: 'Michael Chen',
    currentStage: 3,
    createdAt: new Date('2024-12-01'),
    expectedClose: new Date('2025-02-01'),
    riskScore: 72,
    complianceStatus: 'Pending Review',
    legalReviewRequired: true,
    isStalled: true,
    stageDurations: [3, 5, 18, 0, 0, 0, 0, 0, 0, 0],
    stageTimestamps: [
      new Date('2024-12-01'),
      new Date('2024-12-04'),
      new Date('2024-12-09')
    ],
    alerts: [
      { id: 1, message: 'Stage exceeded 7-day threshold', severity: 'warning' }
    ]
  },
  {
    id: 3,
    companyName: 'Retail Dynamics Inc',
    value: 120,
    owner: 'Emily Rodriguez',
    currentStage: 8,
    createdAt: new Date('2024-10-20'),
    expectedClose: new Date('2024-12-20'),
    riskScore: 25,
    complianceStatus: 'Approved',
    legalReviewRequired: false,
    isStalled: false,
    stageDurations: [2, 3, 4, 6, 8, 5, 4, 10, 2, 0],
    stageTimestamps: [
      new Date('2024-10-20'),
      new Date('2024-10-22'),
      new Date('2024-10-25'),
      new Date('2024-10-29'),
      new Date('2024-11-04'),
      new Date('2024-11-12'),
      new Date('2024-11-17'),
      new Date('2024-11-21'),
      new Date('2024-12-01')
    ],
    alerts: []
  }
]

// Computed
const filteredDeals = computed(() => {
  let filtered = deals.value

  if (selectedView.value === 'active') {
    filtered = filtered.filter(d => d.currentStage < 9 && !d.isStalled)
  } else if (selectedView.value === 'stalled') {
    filtered = filtered.filter(d => d.isStalled)
  } else if (selectedView.value === 'completed') {
    filtered = filtered.filter(d => d.currentStage >= 8)
  }

  // Role-based filtering
  if (activeRole.value === 'sales') {
    filtered = filtered.filter(d => d.currentStage <= 4)
  } else if (activeRole.value === 'legal') {
    filtered = filtered.filter(d => d.currentStage >= 5 && d.currentStage <= 8)
  }

  // Stage filter
  if (stageFilter.value !== null) {
    filtered = filtered.filter(d => d.currentStage === stageFilter.value)
  }

  return filtered
})

// Methods
const getStageClass = (stage) => {
  if (stage <= 2) return 'early'
  if (stage <= 5) return 'mid'
  if (stage <= 8) return 'late'
  return 'complete'
}

const getRiskClass = (score) => {
  if (score <= 33) return 'low'
  if (score <= 66) return 'medium'
  return 'high'
}

const formatDate = (date) => {
  if (!date) return 'Pending'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

const getStageStatus = (stage, index) => {
  const dealsInStage = deals.value.filter(d => d.currentStage === index)
  if (dealsInStage.length === 0) return 'empty'
  if (dealsInStage.some(d => d.isStalled)) return 'stalled'
  return 'active'
}

const getStageCount = (stageIndex) => {
  return deals.value.filter(d => d.currentStage === stageIndex).length
}

const getAvgStageDuration = (stageIndex) => {
  const dealsWithDuration = deals.value.filter(d => d.stageDurations[stageIndex] > 0)
  if (dealsWithDuration.length === 0) return 0
  const total = dealsWithDuration.reduce((sum, d) => sum + d.stageDurations[stageIndex], 0)
  return Math.round(total / dealsWithDuration.length)
}

const filterByStage = (stageIndex) => {
  stageFilter.value = stageFilter.value === stageIndex ? null : stageIndex
}

const advanceStage = (deal) => {
  if (deal.currentStage < stages.length - 1) {
    deal.currentStage++
    deal.stageTimestamps[deal.currentStage] = new Date()
    console.log(`Advanced ${deal.companyName} to stage ${deal.currentStage}`)
  }
}

const generateContract = (deal) => {
  console.log('Generating contract for:', deal.companyName)
  // Navigate to contracts view or trigger contract generation
  // This would open the Contract Generator with deal data pre-filled
}

const markStalled = (deal) => {
  deal.isStalled = !deal.isStalled
  console.log(`${deal.isStalled ? 'Marked' : 'Unmarked'} ${deal.companyName} as stalled`)
}

const createDeal = () => {
  const newDeal = {
    id: deals.value.length + 1,
    companyName: newDealForm.value.companyName,
    value: newDealForm.value.value,
    owner: 'Current User', // Would come from auth
    currentStage: 0,
    createdAt: new Date(),
    expectedClose: new Date(newDealForm.value.expectedClose),
    riskScore: Math.floor(Math.random() * 100),
    complianceStatus: 'Pending',
    legalReviewRequired: false,
    isStalled: false,
    stageDurations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    stageTimestamps: [new Date()],
    alerts: []
  }
  
  deals.value.push(newDeal)
  showNewDeal.value = false
  
  // Reset form
  newDealForm.value = {
    companyName: '',
    value: null,
    contact: '',
    expectedClose: ''
  }
}

// Lifecycle
onMounted(() => {
  deals.value = mockDeals
})
</script>

<style scoped>
.deals-view {
  /* Inherits styles from parent */
}

.deals-header {
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
  align-items: center;
}

.view-selector {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

/* Role Tabs */
.role-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: var(--bg-card);
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.role-tab {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-tab:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.role-tab.active {
  background: var(--primary-accent);
  color: white;
}

/* Domino Tracker */
.domino-tracker {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.pipeline-count {
  color: var(--text-secondary);
  font-weight: 400;
  font-size: 1rem;
}

.domino-stages {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.domino-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid var(--border-color);
  background: rgba(255, 255, 255, 0.02);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.domino-stage:hover {
  border-color: var(--secondary-accent);
  transform: translateY(-2px);
}

.domino-stage.active {
  border-color: var(--secondary-accent);
  background: rgba(16, 185, 129, 0.1);
}

.domino-stage.stalled {
  border-color: var(--risk-high);
  background: rgba(239, 68, 68, 0.1);
}

.domino-stage.empty {
  opacity: 0.5;
}

.stage-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
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

.stage-duration {
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

/* Pipeline Section */
.pipeline-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
}

/* Deal Cards */
.deals-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.deal-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.deal-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--primary-accent);
  transform: translateY(-2px);
}

.deal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.deal-info h4 {
  font-size: 1.125rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.deal-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-accent);
  margin-bottom: 0.25rem;
}

.deal-owner {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.deal-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.deal-stage-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.deal-stage-badge.early {
  background: rgba(59, 130, 246, 0.2);
  color: #93bbfc;
}

.deal-stage-badge.mid {
  background: rgba(124, 58, 237, 0.2);
  color: #a78bfa;
}

.deal-stage-badge.late {
  background: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
}

.deal-stage-badge.complete {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
}

.deal-flags {
  display: flex;
  gap: 0.5rem;
}

.flag-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.flag-badge.stalled {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.flag-badge.risk {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

/* Timeline Progress */
.timeline-progress {
  position: relative;
  height: 40px;
  margin-bottom: 1rem;
}

.timeline-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--border-color);
  transform: translateY(-50%);
}

.timeline-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--primary-accent);
  transition: width 0.3s ease;
}

.timeline-node {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.timeline-node.completed {
  background: var(--primary-accent);
  border-color: var(--primary-accent);
}

.timeline-node.current {
  width: 16px;
  height: 16px;
  background: white;
  border-color: var(--primary-accent);
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.2);
}

.timeline-node.stalled {
  background: var(--risk-high);
  border-color: var(--risk-high);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2); }
  50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0.1); }
}

.timeline-node.pending {
  background: transparent;
}

.node-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  margin-bottom: 0.5rem;
}

.timeline-node:hover .node-tooltip {
  opacity: 1;
}

.duration {
  display: block;
  color: var(--text-secondary);
  font-size: 0.7rem;
  margin-top: 0.25rem;
}

/* Deal Actions */
.deal-actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-btn.advance {
  background: var(--secondary-accent);
  color: white;
}

.action-btn.advance:hover {
  background: #059669;
}

.action-btn.contract {
  background: var(--primary-accent);
  color: white;
}

.action-btn.contract:hover {
  background: #6d28d9;
}

.action-btn.stall {
  background: var(--risk-medium);
  color: white;
}

.action-btn.stall:hover {
  background: #d97706;
}

/* Deal Alerts */
.deal-alerts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.alert-item.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #fcd34d;
  border: 1px solid rgba(245, 158, 11, 0.3);
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

.modal-header h2 {
  font-size: 1.5rem;
  color: var(--text-primary);
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

.deal-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.detail-section h4 {
  font-size: 1.125rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.detail-item .label {
  color: var(--text-secondary);
}

.detail-item .value {
  color: var(--text-primary);
  font-weight: 500;
}

.risk-score.low {
  color: var(--health-excellent);
}

.risk-score.medium {
  color: var(--risk-medium);
}

.risk-score.high {
  color: var(--risk-high);
}

.stage-history {
  margin-bottom: 2rem;
}

.stage-history h4 {
  font-size: 1.125rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.history-timeline {
  position: relative;
  padding-left: 2rem;
}

.history-timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border-color);
}

.history-item {
  position: relative;
  margin-bottom: 1.5rem;
}

.history-marker {
  position: absolute;
  left: -24px;
  top: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary-accent);
  border: 2px solid var(--primary-accent);
}

.history-content h5 {
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.history-content p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.duration-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.overdue {
  color: var(--risk-high);
  font-weight: 500;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.new-deal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .deals-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .role-tabs {
    flex-direction: column;
  }

  .domino-stages {
    flex-direction: column;
  }

  .domino-stage {
    flex-direction: row;
    min-width: auto;
  }

  .deal-header {
    flex-direction: column;
    gap: 1rem;
  }

  .deal-meta {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .deal-actions {
    flex-direction: column;
  }

  .modal-content {
    margin: 1rem;
  }

  .deal-details-grid {
    grid-template-columns: 1fr;
  }
}
</style>