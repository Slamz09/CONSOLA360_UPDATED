<template>
  <div class="assigned-cases">
    <!-- Header -->
    <div class="cases-header">
      <div class="header-content">
        <h3 class="heading-tertiary">My Assigned Cases</h3>
        <p class="text-body">Legal cases assigned to you requiring action and oversight</p>
      </div>
      <div class="header-actions">
        <button @click="showWorkloadModal = true" class="btn btn-secondary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
          </svg>
          Workload View
        </button>
        <button @click="showTimeLogModal = true" class="btn btn-primary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
          Log Time
        </button>
      </div>
    </div>

    <!-- Personal Stats -->
    <div class="personal-stats">
      <div class="stat-card active">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ personalStats.activeCases }}</div>
          <div class="stat-label">Active Cases</div>
          <div class="stat-detail">{{ personalStats.criticalCases }} critical</div>
        </div>
      </div>

      <div class="stat-card workload">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ personalStats.hoursThisWeek }}h</div>
          <div class="stat-label">This Week</div>
          <div class="stat-detail">{{ personalStats.avgHoursPerCase }}h avg/case</div>
        </div>
      </div>

      <div class="stat-card deadlines">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ personalStats.upcomingDeadlines }}</div>
          <div class="stat-label">Upcoming Deadlines</div>
          <div class="stat-detail">{{ personalStats.pastDue }} past due</div>
        </div>
      </div>

      <div class="stat-card budget">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">${{ personalStats.budgetUtilization }}%</div>
          <div class="stat-label">Budget Utilization</div>
          <div class="stat-detail">${{ personalStats.totalBudget }}M allocated</div>
        </div>
      </div>
    </div>

    <!-- Priority Actions -->
    <div v-if="priorityActions.length > 0" class="priority-actions">
      <h4 class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
        </svg>
        Priority Actions Required
      </h4>
      <div class="actions-list">
        <div v-for="action in priorityActions" :key="action.id" :class="['action-item', action.urgency]">
          <div class="action-info">
            <h5>{{ action.title }}</h5>
            <p>{{ action.description }}</p>
            <div class="action-meta">
              <span class="case-link" @click="viewCase(action.caseId)">{{ action.caseNumber }}</span>
              <span class="deadline">Due {{ formatDate(action.deadline) }}</span>
            </div>
          </div>
          <div class="action-controls">
            <button @click="completeAction(action)" class="action-btn complete">Mark Complete</button>
            <button @click="requestExtension(action)" class="action-btn extend">Request Extension</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cases Filter -->
    <div class="cases-filter">
      <div class="filter-tabs">
        <button 
          v-for="filter in caseFilters" 
          :key="filter.key"
          @click="activeFilter = filter.key"
          :class="['filter-tab', { active: activeFilter === filter.key }]"
        >
          {{ filter.label }}
          <span class="filter-count">{{ filter.count }}</span>
        </button>
      </div>
      
      <div class="filter-controls">
        <select v-model="sortBy" class="sort-select">
          <option value="deadline">Sort by Deadline</option>
          <option value="priority">Sort by Priority</option>
          <option value="status">Sort by Status</option>
          <option value="budget">Sort by Budget</option>
        </select>
      </div>
    </div>

    <!-- Assigned Cases List -->
    <div class="assigned-cases-list">
      <div v-for="case_ in filteredCases" :key="case_.id" class="case-card">
        <div class="case-header">
          <div class="case-info">
            <h5 class="case-title">{{ case_.title }}</h5>
            <div class="case-meta">
              <span class="case-number">{{ case_.caseNumber }}</span>
              <span class="case-role">{{ case_.myRole }}</span>
              <span class="assignment-date">Assigned {{ formatRelativeTime(case_.assignedAt) }}</span>
            </div>
          </div>
          <div class="case-badges">
            <span :class="['priority-badge', case_.priority]">{{ case_.priority }}</span>
            <span :class="['status-badge', 'status-' + case_.status.replace(' ', '-').toLowerCase()]">
              {{ case_.status }}
            </span>
          </div>
        </div>

        <div class="case-progress-section">
          <div class="progress-info">
            <span class="progress-label">My Tasks Progress</span>
            <span class="progress-percentage">{{ case_.myTasksProgress }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: case_.myTasksProgress + '%' }"></div>
          </div>
          <div class="task-summary">
            <span class="completed-tasks">{{ case_.completedTasks }} completed</span>
            <span class="pending-tasks">{{ case_.pendingTasks }} pending</span>
            <span class="overdue-tasks" v-if="case_.overdueTasks > 0">{{ case_.overdueTasks }} overdue</span>
          </div>
        </div>

        <div class="case-details">
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Next Deadline:</span>
              <span class="detail-value" :class="{ 'deadline-urgent': isDeadlineUrgent(case_.nextDeadline) }">
                {{ formatDate(case_.nextDeadline) }}
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Time Logged:</span>
              <span class="detail-value">{{ case_.timeLogged }}h total</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Budget Used:</span>
              <span class="detail-value">
                ${{ case_.budgetUsed.toLocaleString() }} / ${{ case_.myBudget.toLocaleString() }}
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Last Activity:</span>
              <span class="detail-value">{{ formatRelativeTime(case_.lastActivity) }}</span>
            </div>
          </div>

          <div v-if="case_.nextActions" class="next-actions">
            <h6>My Next Actions</h6>
            <div class="actions-timeline">
              <div v-for="action in case_.nextActions.slice(0, 3)" :key="action.id" class="timeline-action">
                <div class="action-marker" :class="action.urgency"></div>
                <div class="action-content">
                  <p>{{ action.description }}</p>
                  <div class="action-meta">
                    <span class="action-deadline">Due {{ formatDate(action.deadline) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="case-actions">
          <button @click="viewCaseDetails(case_)" class="action-btn primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            View Case
          </button>
          <button @click="logTime(case_)" class="action-btn secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            Log Time
          </button>
          <button @click="updateStatus(case_)" class="action-btn secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Update
          </button>
          <div class="action-dropdown">
            <button class="action-btn more">⋮</button>
            <div class="dropdown-menu">
              <button @click="requestReassignment(case_)">Request Reassignment</button>
              <button @click="requestSupport(case_)">Request Support</button>
              <button @click="scheduleConference(case_)">Schedule Conference</button>
              <hr>
              <button @click="escalateCase(case_)">Escalate</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Time Log Modal -->
    <div v-if="showTimeLogModal" class="modal-overlay" @click="showTimeLogModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Log Time</h3>
          <button @click="showTimeLogModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitTimeLog" class="time-log-form">
            <div class="form-group">
              <label class="form-label">Case *</label>
              <select v-model="timeLog.caseId" class="form-select" required>
                <option value="">Select Case</option>
                <option v-for="case_ in assignedCases" :key="case_.id" :value="case_.id">
                  {{ case_.caseNumber }} - {{ case_.title }}
                </option>
              </select>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Date *</label>
                <input v-model="timeLog.date" type="date" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Hours *</label>
                <input v-model.number="timeLog.hours" type="number" step="0.25" min="0.25" max="24" class="form-input" required>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Activity Type *</label>
              <select v-model="timeLog.activityType" class="form-select" required>
                <option value="">Select Activity</option>
                <option value="research">Legal Research</option>
                <option value="drafting">Document Drafting</option>
                <option value="review">Document Review</option>
                <option value="client_communication">Client Communication</option>
                <option value="court_appearance">Court Appearance</option>
                <option value="deposition">Deposition</option>
                <option value="negotiation">Negotiation</option>
                <option value="case_management">Case Management</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Description *</label>
              <textarea v-model="timeLog.description" class="form-textarea" rows="3" required
                        placeholder="Describe the work performed..."></textarea>
            </div>
            
            <div class="form-group">
              <div class="checkbox-group">
                <input v-model="timeLog.billable" type="checkbox" id="billable" class="form-checkbox">
                <label for="billable" class="checkbox-label">Billable Time</label>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" @click="showTimeLogModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Log Time</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Workload View Modal -->
    <div v-if="showWorkloadModal" class="modal-overlay" @click="showWorkloadModal = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>My Workload Analysis</h3>
          <button @click="showWorkloadModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="workload-analysis">
            <div class="workload-summary">
              <div class="summary-card">
                <h4>Current Capacity</h4>
                <div class="capacity-meter">
                  <div class="capacity-fill" :style="{ width: workloadData.capacityUsed + '%' }"></div>
                </div>
                <p>{{ workloadData.capacityUsed }}% of {{ workloadData.totalCapacity }}h/week</p>
              </div>
              
              <div class="summary-card">
                <h4>Case Distribution</h4>
                <div class="case-types">
                  <div v-for="type in workloadData.caseTypes" :key="type.name" class="case-type">
                    <span class="type-name">{{ type.name }}</span>
                    <span class="type-percentage">{{ type.percentage }}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="weekly-schedule">
              <h4>This Week's Schedule</h4>
              <div class="schedule-grid">
                <div v-for="day in workloadData.weeklySchedule" :key="day.day" class="day-schedule">
                  <div class="day-header">{{ day.day }}</div>
                  <div class="day-hours">{{ day.hours }}h</div>
                  <div class="day-tasks">
                    <div v-for="task in day.tasks" :key="task.id" class="task-item">
                      <span class="task-case">{{ task.caseNumber }}</span>
                      <span class="task-desc">{{ task.description }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// State
const showTimeLogModal = ref(false)
const showWorkloadModal = ref(false)
const activeFilter = ref('all')
const sortBy = ref('deadline')

// Mock data
const personalStats = ref({
  activeCases: 12,
  criticalCases: 3,
  hoursThisWeek: 42,
  avgHoursPerCase: 3.5,
  upcomingDeadlines: 8,
  pastDue: 2,
  budgetUtilization: 78,
  totalBudget: 2.4
})

const priorityActions = ref([
  {
    id: 1,
    title: 'File Motion to Compel',
    description: 'Discovery responses overdue from opposing counsel',
    caseId: 'CASE-2024-001',
    caseNumber: 'CV-2024-001',
    deadline: new Date('2024-12-10'),
    urgency: 'critical'
  },
  {
    id: 2,
    title: 'Expert Witness Deposition Prep',
    description: 'Prepare questions and review expert report',
    caseId: 'CASE-2024-003',
    caseNumber: 'IP-2024-003',
    deadline: new Date('2024-12-12'),
    urgency: 'high'
  }
])

const assignedCases = ref([
  {
    id: 'CASE-2024-001',
    title: 'TechCorp Contract Dispute',
    caseNumber: 'CV-2024-001',
    myRole: 'Lead Attorney',
    priority: 'high',
    status: 'Discovery',
    assignedAt: new Date('2024-09-15'),
    nextDeadline: new Date('2024-12-10'),
    myTasksProgress: 65,
    completedTasks: 13,
    pendingTasks: 7,
    overdueTasks: 2,
    timeLogged: 45.5,
    budgetUsed: 28000,
    myBudget: 75000,
    lastActivity: new Date('2024-12-01T16:30:00'),
    nextActions: [
      {
        id: 1,
        description: 'File motion to compel discovery',
        deadline: new Date('2024-12-10'),
        urgency: 'critical'
      },
      {
        id: 2,
        description: 'Review expert witness report',
        deadline: new Date('2024-12-12'),
        urgency: 'high'
      }
    ]
  },
  {
    id: 'CASE-2024-002',
    title: 'Employment Discrimination Case',
    caseNumber: 'EEOC-2024-002',
    myRole: 'Supporting Attorney',
    priority: 'critical',
    status: 'Settlement',
    assignedAt: new Date('2024-08-20'),
    nextDeadline: new Date('2024-12-20'),
    myTasksProgress: 85,
    completedTasks: 17,
    pendingTasks: 3,
    overdueTasks: 0,
    timeLogged: 72.25,
    budgetUsed: 45000,
    myBudget: 60000,
    lastActivity: new Date('2024-12-02T09:15:00'),
    nextActions: [
      {
        id: 1,
        description: 'Draft settlement agreement',
        deadline: new Date('2024-12-15'),
        urgency: 'medium'
      }
    ]
  }
])

const timeLog = ref({
  caseId: '',
  date: new Date().toISOString().split('T')[0],
  hours: null,
  activityType: '',
  description: '',
  billable: true
})

const workloadData = ref({
  capacityUsed: 78,
  totalCapacity: 50,
  caseTypes: [
    { name: 'Contract Disputes', percentage: 45 },
    { name: 'Employment', percentage: 30 },
    { name: 'IP Litigation', percentage: 25 }
  ],
  weeklySchedule: [
    {
      day: 'Mon',
      hours: 8.5,
      tasks: [
        { id: 1, caseNumber: 'CV-2024-001', description: 'Discovery review' },
        { id: 2, caseNumber: 'EEOC-2024-002', description: 'Settlement negotiations' }
      ]
    },
    {
      day: 'Tue',
      hours: 7.0,
      tasks: [
        { id: 3, caseNumber: 'CV-2024-001', description: 'Motion drafting' }
      ]
    }
    // Add more days...
  ]
})

const caseFilters = ref([
  { key: 'all', label: 'All Cases', count: 12 },
  { key: 'critical', label: 'Critical', count: 3 },
  { key: 'discovery', label: 'Discovery', count: 5 },
  { key: 'trial', label: 'Trial Prep', count: 2 },
  { key: 'settlement', label: 'Settlement', count: 2 }
])

// Computed
const filteredCases = computed(() => {
  let filtered = assignedCases.value

  if (activeFilter.value !== 'all') {
    if (activeFilter.value === 'critical') {
      filtered = filtered.filter(c => c.priority === 'critical')
    } else {
      filtered = filtered.filter(c => c.status.toLowerCase() === activeFilter.value)
    }
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'deadline':
        return new Date(a.nextDeadline) - new Date(b.nextDeadline)
      case 'priority':
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      case 'status':
        return a.status.localeCompare(b.status)
      case 'budget':
        return (b.budgetUsed / b.myBudget) - (a.budgetUsed / a.myBudget)
      default:
        return 0
    }
  })

  return filtered
})

// Methods
function formatDate(date) {
  if (!date) return 'No deadline'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

function formatRelativeTime(date) {
  const now = new Date()
  const diffMs = now - date
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays} days ago`
}

function isDeadlineUrgent(deadline) {
  if (!deadline) return false
  const now = new Date()
  const diffDays = Math.floor((deadline - now) / (1000 * 60 * 60 * 24))
  return diffDays <= 7
}

function viewCase(caseId) {
  console.log('Viewing case:', caseId)
}

function completeAction(action) {
  console.log('Completing action:', action.title)
  const index = priorityActions.value.findIndex(a => a.id === action.id)
  if (index > -1) {
    priorityActions.value.splice(index, 1)
  }
}

function requestExtension(action) {
  console.log('Requesting extension for:', action.title)
}

function viewCaseDetails(case_) {
  console.log('Viewing case details:', case_.title)
}

function logTime(case_) {
  timeLog.value.caseId = case_.id
  showTimeLogModal.value = true
}

function updateStatus(case_) {
  console.log('Updating status for:', case_.title)
}

function requestReassignment(case_) {
  console.log('Requesting reassignment for:', case_.title)
}

function requestSupport(case_) {
  console.log('Requesting support for:', case_.title)
}

function scheduleConference(case_) {
  console.log('Scheduling conference for:', case_.title)
}

function escalateCase(case_) {
  console.log('Escalating case:', case_.title)
}

function submitTimeLog() {
  console.log('Submitting time log:', timeLog.value)
  
  // Update case time logged
  const case_ = assignedCases.value.find(c => c.id === timeLog.value.caseId)
  if (case_) {
    case_.timeLogged += timeLog.value.hours
  }
  
  showTimeLogModal.value = false
  
  // Reset form
  timeLog.value = {
    caseId: '',
    date: new Date().toISOString().split('T')[0],
    hours: null,
    activityType: '',
    description: '',
    billable: true
  }
}

onMounted(() => {
  // Load assigned cases data
})
</script>

<style scoped>
.assigned-cases {
  /* Inherits styles from parent */
}

.cases-header {
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
}

.personal-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  border-left: 4px solid;
}

.stat-card.active {
  border-left-color: var(--primary-accent);
}

.stat-card.workload {
  border-left-color: var(--secondary-accent);
}

.stat-card.deadlines {
  border-left-color: var(--risk-high);
}

.stat-card.budget {
  border-left-color: var(--health-excellent);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.stat-detail {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.priority-actions {
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

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.action-item.critical {
  background: rgba(239, 68, 68, 0.1);
  border-left-color: #ef4444;
}

.action-item.high {
  background: rgba(245, 158, 11, 0.1);
  border-left-color: #f59e0b;
}

.action-item.medium {
  background: rgba(124, 58, 237, 0.1);
  border-left-color: var(--secondary-accent);
}

.action-info h5 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.action-info p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.action-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
}

.case-link {
  color: var(--secondary-accent);
  cursor: pointer;
  font-weight: 500;
}

.case-link:hover {
  text-decoration: underline;
}

.deadline {
  color: var(--text-secondary);
}

.action-controls {
  display: flex;
  gap: 0.75rem;
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

.action-btn.complete {
  background: var(--health-excellent);
  color: white;
}

.action-btn.extend {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.cases-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  background: var(--bg-primary);
  padding: 0.5rem;
  border-radius: 8px;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.filter-tab.active {
  background: var(--primary-accent);
  color: white;
}

.filter-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}

.filter-tab.active .filter-count {
  background: rgba(255, 255, 255, 0.3);
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.sort-select {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.assigned-cases-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.case-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.case-card:hover {
  border-color: var(--primary-accent);
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.1);
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.case-title {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
}

.case-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.case-number {
  color: var(--secondary-accent);
  font-family: 'Space Grotesk', monospace;
  font-weight: 500;
}

.case-role {
  color: var(--text-primary);
  font-weight: 500;
}

.case-badges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-badge.critical {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.priority-badge.high {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.priority-badge.medium {
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
}

.priority-badge.low {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-discovery {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-settlement {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.case-progress-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.progress-label {
  color: var(--text-primary);
  font-weight: 500;
}

.progress-percentage {
  color: var(--secondary-accent);
  font-weight: 600;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-fill {
  height: 100%;
  background: var(--primary-accent);
  transition: width 0.3s ease;
}

.task-summary {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
}

.completed-tasks {
  color: var(--health-excellent);
}

.pending-tasks {
  color: var(--text-secondary);
}

.overdue-tasks {
  color: var(--risk-high);
  font-weight: 500;
}

.case-details {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.detail-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.detail-value {
  color: var(--text-primary);
  font-weight: 600;
}

.detail-value.deadline-urgent {
  color: var(--risk-high);
}

.next-actions {
  min-width: 300px;
}

.next-actions h6 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.actions-timeline {
  position: relative;
  padding-left: 1.5rem;
}

.actions-timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border-color);
}

.timeline-action {
  position: relative;
  margin-bottom: 1rem;
}

.action-marker {
  position: absolute;
  left: -20px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--primary-accent);
}

.action-marker.critical {
  background: var(--risk-high);
}

.action-marker.high {
  background: var(--risk-medium);
}

.action-marker.medium {
  background: var(--secondary-accent);
}

.action-content p {
  color: var(--text-primary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.action-deadline {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.case-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: var(--primary-accent);
  color: white;
}

.action-btn.secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.action-btn.more {
  background: transparent;
  color: var(--text-secondary);
  padding: 0.5rem;
}

.action-dropdown {
  position: relative;
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
  min-width: 180px;
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
  max-width: 1000px;
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

.time-log-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-checkbox {
  width: 16px;
  height: 16px;
}

.checkbox-label {
  color: var(--text-primary);
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.workload-analysis {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.workload-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.summary-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.summary-card h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.capacity-meter {
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.capacity-fill {
  height: 100%;
  background: var(--primary-accent);
  transition: width 0.3s ease;
}

.case-types {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.case-type {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.type-name {
  color: var(--text-primary);
}

.type-percentage {
  color: var(--secondary-accent);
  font-weight: 500;
}

.weekly-schedule h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.day-schedule {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
}

.day-header {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.day-hours {
  color: var(--secondary-accent);
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.day-tasks {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.task-case {
  color: var(--secondary-accent);
  font-size: 0.75rem;
  font-weight: 500;
}

.task-desc {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .cases-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .personal-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .cases-filter {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-tabs {
    width: 100%;
    overflow-x: auto;
  }

  .case-header {
    flex-direction: column;
    gap: 1rem;
  }

  .case-badges {
    flex-direction: row;
    align-items: center;
  }

  .case-details {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .next-actions {
    min-width: auto;
  }

  .case-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .workload-summary {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>