<template>
  <div class="assigned-contracts">
    <!-- Header -->
    <div class="assigned-header">
      <div class="header-content">
        <h3 class="heading-tertiary">My Assigned Contracts</h3>
        <p class="text-body">Contracts requiring your review, approval, or action</p>
      </div>
      <div class="header-actions">
        <select v-model="workloadView" class="view-selector">
          <option value="my_tasks">My Tasks</option>
          <option value="team_workload">Team Workload</option>
          <option value="overdue">Overdue Items</option>
        </select>
        <button @click="markAllReviewed" class="btn btn-secondary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
          Mark All Reviewed
        </button>
      </div>
    </div>

    <!-- Workload Summary -->
    <div class="workload-summary">
      <div class="summary-card urgent">
        <div class="summary-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
          </svg>
        </div>
        <div class="summary-content">
          <div class="summary-number">{{ workloadStats.urgent }}</div>
          <div class="summary-label">Urgent Actions</div>
          <div class="summary-detail">Due in < 24h</div>
        </div>
      </div>

      <div class="summary-card pending">
        <div class="summary-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        </div>
        <div class="summary-content">
          <div class="summary-number">{{ workloadStats.pendingReview }}</div>
          <div class="summary-label">Pending Review</div>
          <div class="summary-detail">Awaiting your input</div>
        </div>
      </div>

      <div class="summary-card negotiation">
        <div class="summary-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="summary-content">
          <div class="summary-number">{{ workloadStats.inNegotiation }}</div>
          <div class="summary-label">In Negotiation</div>
          <div class="summary-detail">Active discussions</div>
        </div>
      </div>

      <div class="summary-card completed">
        <div class="summary-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
        </div>
        <div class="summary-content">
          <div class="summary-number">{{ workloadStats.completedThisWeek }}</div>
          <div class="summary-label">Completed This Week</div>
          <div class="summary-detail">{{ workloadStats.weeklyAverage }} avg/week</div>
        </div>
      </div>
    </div>

    <!-- Priority Queue -->
    <div class="priority-queue">
      <h4 class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
        </svg>
        Priority Actions Required
      </h4>
      <div class="priority-items">
        <div 
          v-for="item in priorityItems" 
          :key="item.id"
          :class="['priority-item', item.urgency]"
        >
          <div class="priority-indicator">
            <span v-if="item.urgency === 'critical'">🔴</span>
            <span v-else-if="item.urgency === 'high'">🟠</span>
            <span v-else-if="item.urgency === 'medium'">🟡</span>
            <span v-else>🟢</span>
          </div>
          <div class="priority-content">
            <div class="priority-header">
              <h5>{{ item.title }}</h5>
              <span class="priority-type">{{ item.actionType }}</span>
            </div>
            <p class="priority-description">{{ item.description }}</p>
            <div class="priority-meta">
              <span class="contract-ref">{{ item.contractRef }}</span>
              <span class="due-date" :class="{ overdue: isOverdue(item.dueDate) }">
                Due: {{ formatRelativeTime(item.dueDate) }}
              </span>
            </div>
          </div>
          <div class="priority-actions">
            <button @click="takeAction(item)" class="priority-btn primary">
              {{ item.actionLabel }}
            </button>
            <button @click="viewDetails(item)" class="priority-btn secondary">
              View
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Assigned Contracts List -->
    <div class="assigned-contracts-list">
      <div class="list-header">
        <h4 class="section-title">My Contracts</h4>
        <div class="list-controls">
          <div class="filter-tabs">
            <button 
              v-for="filter in contractFilters" 
              :key="filter.key"
              @click="activeFilter = filter.key"
              :class="['filter-tab', { active: activeFilter === filter.key }]"
            >
              {{ filter.label }}
              <span class="filter-count">{{ filter.count }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="contracts-grid">
        <div 
          v-for="contract in filteredAssignedContracts" 
          :key="contract.id"
          class="assigned-contract-card"
        >
          <div class="card-header">
            <div class="contract-info">
              <h5 class="contract-title">{{ contract.name }}</h5>
              <p class="contract-party">{{ contract.counterparty }}</p>
            </div>
            <div class="contract-badges">
              <span :class="['status-badge', 'status-' + contract.status.toLowerCase().replace(' ', '-')]">
                {{ contract.status }}
              </span>
              <span v-if="contract.isUrgent" class="urgent-badge">Urgent</span>
            </div>
          </div>

          <div class="card-content">
            <div class="assignment-details">
              <div class="assignment-item">
                <span class="assignment-label">Your Role:</span>
                <span class="assignment-value">{{ contract.myRole }}</span>
              </div>
              <div class="assignment-item">
                <span class="assignment-label">Action Required:</span>
                <span class="assignment-value">{{ contract.actionRequired }}</span>
              </div>
              <div class="assignment-item">
                <span class="assignment-label">Due Date:</span>
                <span class="assignment-value" :class="{ overdue: isOverdue(contract.dueDate) }">
                  {{ formatDate(contract.dueDate) }}
                </span>
              </div>
              <div class="assignment-item">
                <span class="assignment-label">Progress:</span>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: contract.progress + '%' }"
                  ></div>
                  <span class="progress-text">{{ contract.progress }}%</span>
                </div>
              </div>
            </div>

            <div v-if="contract.recentActivity" class="recent-activity">
              <h6>Recent Activity</h6>
              <div class="activity-item">
                <span class="activity-user">{{ contract.recentActivity.user }}</span>
                <span class="activity-action">{{ contract.recentActivity.action }}</span>
                <span class="activity-time">{{ formatRelativeTime(contract.recentActivity.timestamp) }}</span>
              </div>
            </div>
          </div>

          <div class="card-actions">
            <button @click="reviewContract(contract)" class="card-action-btn primary">
              {{ contract.actionLabel }}
            </button>
            <button @click="viewContract(contract)" class="card-action-btn secondary">
              View Contract
            </button>
            <div class="action-dropdown">
              <button class="card-action-btn dropdown-trigger">⋮</button>
              <div class="dropdown-menu">
                <button @click="addComment(contract)">Add Comment</button>
                <button @click="requestExtension(contract)">Request Extension</button>
                <button @click="reassignContract(contract)">Reassign</button>
                <hr>
                <button @click="markComplete(contract)">Mark Complete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Team Workload View -->
    <div v-if="workloadView === 'team_workload'" class="team-workload">
      <h4 class="section-title">Team Workload Distribution</h4>
      <div class="team-members">
        <div v-for="member in teamMembers" :key="member.id" class="team-member-card">
          <div class="member-header">
            <div class="member-info">
              <h5>{{ member.name }}</h5>
              <p>{{ member.title }}</p>
            </div>
            <div class="member-workload" :class="getWorkloadClass(member.workloadPercent)">
              {{ member.workloadPercent }}%
            </div>
          </div>
          <div class="member-stats">
            <div class="stat-item">
              <span class="stat-label">Active:</span>
              <span class="stat-value">{{ member.activeContracts }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Overdue:</span>
              <span class="stat-value overdue">{{ member.overdueContracts }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Avg. Days:</span>
              <span class="stat-value">{{ member.avgCompletionDays }}</span>
            </div>
          </div>
          <div class="workload-actions">
            <button @click="rebalanceWorkload(member)" class="workload-btn">
              Rebalance
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Modal -->
    <div v-if="showActionModal" class="modal-overlay" @click="showActionModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedAction?.title }}</h3>
          <button @click="showActionModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedAction?.actionType === 'Review'" class="review-form">
            <div class="contract-summary">
              <h4>Contract Summary</h4>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="label">Contract:</span>
                  <span class="value">{{ selectedAction?.contractRef }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">Counterparty:</span>
                  <span class="value">{{ selectedAction?.counterparty }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">Value:</span>
                  <span class="value">${{ selectedAction?.value }}</span>
                </div>
              </div>
            </div>

            <div class="review-checklist">
              <h4>Review Checklist</h4>
              <div class="checklist-items">
                <label v-for="item in reviewChecklist" :key="item.id" class="checklist-item">
                  <input type="checkbox" v-model="item.checked">
                  <span>{{ item.label }}</span>
                </label>
              </div>
            </div>

            <div class="review-comments">
              <label class="form-label">Comments & Notes</label>
              <textarea v-model="reviewComments" class="review-textarea" rows="4" 
                        placeholder="Add your review comments..."></textarea>
            </div>

            <div class="review-decision">
              <h4>Decision</h4>
              <div class="decision-options">
                <label class="decision-option">
                  <input type="radio" v-model="reviewDecision" value="approve">
                  <span class="decision-label approve">✓ Approve</span>
                </label>
                <label class="decision-option">
                  <input type="radio" v-model="reviewDecision" value="request_changes">
                  <span class="decision-label request-changes">⚠ Request Changes</span>
                </label>
                <label class="decision-option">
                  <input type="radio" v-model="reviewDecision" value="reject">
                  <span class="decision-label reject">✗ Reject</span>
                </label>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button @click="showActionModal = false" class="btn btn-secondary">Cancel</button>
            <button @click="submitAction" class="btn btn-primary">Submit Review</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// State
const workloadView = ref('my_tasks')
const activeFilter = ref('all')
const showActionModal = ref(false)
const selectedAction = ref(null)
const reviewComments = ref('')
const reviewDecision = ref('')

// Mock data
const workloadStats = ref({
  urgent: 3,
  pendingReview: 8,
  inNegotiation: 5,
  completedThisWeek: 12,
  weeklyAverage: 10
})

const priorityItems = ref([
  {
    id: 1,
    urgency: 'critical',
    title: 'TechCorp MSA Amendment Review',
    description: 'Critical liability clause changes require immediate legal review',
    actionType: 'Review',
    actionLabel: 'Review Now',
    contractRef: 'CNT-2024-001',
    counterparty: 'TechCorp Industries',
    value: '250K',
    dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hours from now
  },
  {
    id: 2,
    urgency: 'high',
    title: 'Healthcare Solutions Contract Approval',
    description: 'Final contract approval needed before execution',
    actionType: 'Approval',
    actionLabel: 'Approve',
    contractRef: 'CNT-2024-002',
    counterparty: 'Global Healthcare Solutions',
    value: '480K',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
  },
  {
    id: 3,
    urgency: 'medium',
    title: 'NDA Template Update',
    description: 'Update standard NDA template with new privacy clauses',
    actionType: 'Template Update',
    actionLabel: 'Update',
    contractRef: 'TMPL-NDA-001',
    counterparty: 'Multiple',
    value: 'N/A',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
  }
])

const contractFilters = [
  { key: 'all', label: 'All', count: 12 },
  { key: 'review', label: 'Pending Review', count: 8 },
  { key: 'approval', label: 'Awaiting Approval', count: 3 },
  { key: 'negotiation', label: 'In Negotiation', count: 5 },
  { key: 'overdue', label: 'Overdue', count: 2 }
]

const assignedContracts = ref([
  {
    id: 'CNT-2024-001',
    name: 'Enterprise Software License Agreement',
    counterparty: 'TechCorp Industries',
    status: 'Pending Review',
    myRole: 'Lead Reviewer',
    actionRequired: 'Legal Review',
    actionLabel: 'Review Contract',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    progress: 75,
    isUrgent: true,
    recentActivity: {
      user: 'Sarah Johnson',
      action: 'added comments on liability clause',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  },
  {
    id: 'CNT-2024-002',
    name: 'Master Service Agreement',
    counterparty: 'Global Healthcare Solutions',
    status: 'In Negotiation',
    myRole: 'Negotiation Lead',
    actionRequired: 'Address Counterparty Comments',
    actionLabel: 'Review Comments',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    progress: 50,
    isUrgent: false,
    recentActivity: {
      user: 'Michael Chen',
      action: 'received counterparty redlines',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  }
])

const teamMembers = ref([
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Senior Legal Counsel',
    workloadPercent: 85,
    activeContracts: 15,
    overdueContracts: 2,
    avgCompletionDays: 7
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'Legal Counsel',
    workloadPercent: 92,
    activeContracts: 18,
    overdueContracts: 3,
    avgCompletionDays: 9
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    title: 'Contract Specialist',
    workloadPercent: 68,
    activeContracts: 10,
    overdueContracts: 0,
    avgCompletionDays: 5
  }
])

const reviewChecklist = ref([
  { id: 1, label: 'Contract terms align with business requirements', checked: false },
  { id: 2, label: 'Liability and indemnification clauses reviewed', checked: false },
  { id: 3, label: 'Payment terms and conditions acceptable', checked: false },
  { id: 4, label: 'Termination clauses properly defined', checked: false },
  { id: 5, label: 'Compliance with regulatory requirements', checked: false }
])

// Computed
const filteredAssignedContracts = computed(() => {
  if (activeFilter.value === 'all') return assignedContracts.value
  
  return assignedContracts.value.filter(contract => {
    switch (activeFilter.value) {
      case 'review':
        return contract.status === 'Pending Review'
      case 'approval':
        return contract.actionRequired === 'Final Approval'
      case 'negotiation':
        return contract.status === 'In Negotiation'
      case 'overdue':
        return isOverdue(contract.dueDate)
      default:
        return true
    }
  })
})

// Methods
function formatDate(date) {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

function formatRelativeTime(date) {
  if (!date) return 'N/A'
  
  const now = new Date()
  const diffMs = date - now
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays)
    return `${overdueDays} day${overdueDays !== 1 ? 's' : ''} overdue`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`
  }
}

function isOverdue(date) {
  return date && date < new Date()
}

function getWorkloadClass(percent) {
  if (percent >= 90) return 'critical'
  if (percent >= 75) return 'high'
  if (percent >= 50) return 'medium'
  return 'low'
}

function takeAction(item) {
  selectedAction.value = item
  showActionModal.value = true
}

function viewDetails(item) {
  console.log('Viewing details for:', item.title)
}

function reviewContract(contract) {
  console.log('Reviewing contract:', contract.id)
}

function viewContract(contract) {
  console.log('Viewing contract:', contract.id)
}

function addComment(contract) {
  console.log('Adding comment to:', contract.id)
}

function requestExtension(contract) {
  console.log('Requesting extension for:', contract.id)
}

function reassignContract(contract) {
  console.log('Reassigning contract:', contract.id)
}

function markComplete(contract) {
  console.log('Marking complete:', contract.id)
}

function markAllReviewed() {
  console.log('Marking all contracts as reviewed')
}

function rebalanceWorkload(member) {
  console.log('Rebalancing workload for:', member.name)
}

function submitAction() {
  console.log('Submitting action:', {
    action: selectedAction.value,
    decision: reviewDecision.value,
    comments: reviewComments.value,
    checklist: reviewChecklist.value
  })
  
  showActionModal.value = false
  // Reset form
  reviewComments.value = ''
  reviewDecision.value = ''
  reviewChecklist.value.forEach(item => item.checked = false)
}

onMounted(() => {
  // Load assigned contracts data
})
</script>

<style scoped>
.assigned-contracts {
  /* Inherits styles from parent */
}

.assigned-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.header-content h3 {
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

.workload-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  border-left: 4px solid;
}

.summary-card.urgent {
  border-left-color: var(--risk-high);
}

.summary-card.pending {
  border-left-color: var(--risk-medium);
}

.summary-card.negotiation {
  border-left-color: var(--secondary-accent);
}

.summary-card.completed {
  border-left-color: var(--health-excellent);
}

.summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
}

.summary-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.summary-label {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.summary-detail {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.priority-queue {
  margin-bottom: 3rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.priority-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.priority-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  border-left: 4px solid;
}

.priority-item.critical {
  border-left-color: var(--risk-high);
  background: rgba(239, 68, 68, 0.05);
}

.priority-item.high {
  border-left-color: var(--risk-medium);
  background: rgba(245, 158, 11, 0.05);
}

.priority-item.medium {
  border-left-color: var(--secondary-accent);
}

.priority-indicator {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.priority-content {
  flex: 1;
}

.priority-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.priority-header h5 {
  color: var(--text-primary);
  font-weight: 600;
}

.priority-type {
  padding: 0.25rem 0.75rem;
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.priority-description {
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.priority-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
}

.contract-ref {
  color: var(--secondary-accent);
  font-family: 'Space Grotesk', monospace;
  font-weight: 500;
}

.due-date {
  color: var(--text-secondary);
}

.due-date.overdue {
  color: var(--risk-high);
  font-weight: 600;
}

.priority-actions {
  display: flex;
  gap: 0.75rem;
}

.priority-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.priority-btn.primary {
  background: var(--primary-accent);
  color: white;
}

.priority-btn.secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.assigned-contracts-list {
  margin-bottom: 3rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.filter-tab:hover {
  color: var(--text-primary);
  border-color: var(--primary-accent);
}

.filter-tab.active {
  background: var(--primary-accent);
  color: white;
  border-color: var(--primary-accent);
}

.filter-count {
  padding: 0.125rem 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.contracts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.assigned-contract-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.assigned-contract-card:hover {
  border-color: var(--primary-accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(124, 58, 237, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.contract-title {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.contract-party {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.contract-badges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-pending-review {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-in-negotiation {
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
}

.urgent-badge {
  padding: 0.25rem 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.assignment-details {
  margin-bottom: 1rem;
}

.assignment-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.assignment-label {
  color: var(--text-secondary);
}

.assignment-value {
  color: var(--text-primary);
  font-weight: 500;
}

.assignment-value.overdue {
  color: var(--risk-high);
  font-weight: 600;
}

.progress-bar {
  position: relative;
  width: 120px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-accent);
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
}

.recent-activity {
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
  margin-bottom: 1rem;
}

.recent-activity h6 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.activity-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.75rem;
}

.activity-user {
  color: var(--secondary-accent);
  font-weight: 500;
}

.activity-action {
  color: var(--text-secondary);
}

.activity-time {
  color: var(--text-secondary);
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.card-action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.card-action-btn.primary {
  background: var(--primary-accent);
  color: white;
  flex: 1;
}

.card-action-btn.secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.action-dropdown {
  position: relative;
}

.dropdown-trigger {
  background: transparent;
  color: var(--text-secondary);
  padding: 0.5rem;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  display: none;
  z-index: 10;
  min-width: 150px;
}

.action-dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu button {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
}

.dropdown-menu button:hover {
  background: rgba(255, 255, 255, 0.05);
}

.dropdown-menu hr {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 0.5rem 0;
}

/* Team Workload */
.team-workload {
  margin-bottom: 3rem;
}

.team-members {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.team-member-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.member-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.member-info h5 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.member-info p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.member-workload {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
}

.member-workload.critical {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.member-workload.high {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.member-workload.medium {
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
}

.member-workload.low {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.member-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.stat-label {
  color: var(--text-secondary);
}

.stat-value {
  color: var(--text-primary);
  font-weight: 500;
}

.stat-value.overdue {
  color: var(--risk-high);
}

.workload-btn {
  width: 100%;
  padding: 0.5rem;
  background: var(--secondary-accent);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
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
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
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
}

.modal-body {
  padding: 2rem;
}

.contract-summary {
  margin-bottom: 2rem;
}

.contract-summary h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.summary-item .label {
  color: var(--text-secondary);
}

.summary-item .value {
  color: var(--text-primary);
  font-weight: 500;
}

.review-checklist {
  margin-bottom: 2rem;
}

.review-checklist h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.checklist-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
  cursor: pointer;
}

.checklist-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary-accent);
}

.review-comments {
  margin-bottom: 2rem;
}

.review-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: inherit;
  resize: vertical;
}

.review-decision h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.decision-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.decision-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.decision-option input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary-accent);
}

.decision-label {
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.decision-label.approve {
  color: var(--health-excellent);
  background: rgba(34, 197, 94, 0.1);
}

.decision-label.request-changes {
  color: var(--risk-medium);
  background: rgba(245, 158, 11, 0.1);
}

.decision-label.reject {
  color: var(--risk-high);
  background: rgba(239, 68, 68, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .assigned-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .workload-summary {
    grid-template-columns: repeat(2, 1fr);
  }

  .priority-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .priority-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .list-header {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-tabs {
    width: 100%;
    flex-wrap: wrap;
  }

  .contracts-grid {
    grid-template-columns: 1fr;
  }

  .team-members {
    grid-template-columns: 1fr;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>