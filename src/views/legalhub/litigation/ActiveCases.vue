<template>
  <div class="active-cases">
    <!-- Header -->
    <div class="cases-header">
      <div class="header-content">
        <h3 class="heading-tertiary">Active Cases</h3>
        <p class="text-body">Monitor and manage all active legal cases with real-time updates and AI insights</p>
      </div>
      <div class="header-actions">
        <button @click="showReportsModal = true" class="btn btn-secondary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
          </svg>
          Generate Report
        </button>
        <button @click="showNewCaseModal = true" class="btn btn-primary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
          New Case
        </button>
      </div>
    </div>

    <!-- Cases Overview -->
    <div class="cases-overview">
      <div class="overview-card critical">
        <div class="overview-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
          </svg>
        </div>
        <div class="overview-content">
          <div class="overview-number">{{ overview.criticalCases }}</div>
          <div class="overview-label">Critical Cases</div>
          <div class="overview-detail">Require immediate attention</div>
        </div>
      </div>

      <div class="overview-card trial">
        <div class="overview-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div class="overview-content">
          <div class="overview-number">{{ overview.trialCases }}</div>
          <div class="overview-label">Trial Cases</div>
          <div class="overview-detail">{{ overview.upcomingTrials }} upcoming</div>
        </div>
      </div>

      <div class="overview-card settlement">
        <div class="overview-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="overview-content">
          <div class="overview-number">{{ overview.settlementCases }}</div>
          <div class="overview-label">In Settlement</div>
          <div class="overview-detail">{{ overview.settlementValue }}M total value</div>
        </div>
      </div>

      <div class="overview-card budget">
        <div class="overview-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div class="overview-content">
          <div class="overview-number">${{ overview.totalBudget }}M</div>
          <div class="overview-label">Total Budget</div>
          <div class="overview-detail">${{ overview.spentBudget }}M spent ({{ Math.round((overview.spentBudget / overview.totalBudget) * 100) }}%)</div>
        </div>
      </div>
    </div>

    <!-- Priority Alerts -->
    <div v-if="priorityAlerts.length > 0" class="priority-alerts">
      <h4 class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
        </svg>
        Priority Alerts
      </h4>
      <div class="alerts-list">
        <div v-for="alert in priorityAlerts" :key="alert.id" :class="['alert-item', alert.severity]">
          <div class="alert-icon">
            <span v-if="alert.severity === 'critical'">🚨</span>
            <span v-else-if="alert.severity === 'warning'">⚠️</span>
            <span v-else>ℹ️</span>
          </div>
          <div class="alert-content">
            <h5>{{ alert.title }}</h5>
            <p>{{ alert.message }}</p>
            <div class="alert-meta">
              <span class="case-link" @click="viewCase(alert.caseId)">{{ alert.caseNumber }}</span>
              <span class="alert-time">{{ formatRelativeTime(alert.timestamp) }}</span>
            </div>
          </div>
          <div class="alert-actions">
            <button @click="handleAlert(alert)" class="alert-btn primary">{{ alert.actionLabel }}</button>
            <button @click="dismissAlert(alert)" class="alert-btn dismiss">Dismiss</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Case Filters and Search -->
    <div class="cases-controls">
      <div class="search-section">
        <div class="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search cases by name, number, or party..." 
            class="search-input"
          />
        </div>
      </div>
      
      <div class="filter-controls">
        <select v-model="statusFilter" class="filter-select">
          <option value="">All Statuses</option>
          <option value="discovery">Discovery</option>
          <option value="pre_trial">Pre-Trial</option>
          <option value="trial">Trial</option>
          <option value="settlement">Settlement</option>
          <option value="appeal">Appeal</option>
        </select>
        
        <select v-model="typeFilter" class="filter-select">
          <option value="">All Types</option>
          <option value="contract_dispute">Contract Dispute</option>
          <option value="employment">Employment</option>
          <option value="intellectual_property">IP</option>
          <option value="regulatory">Regulatory</option>
          <option value="commercial">Commercial</option>
        </select>
        
        <select v-model="priorityFilter" class="filter-select">
          <option value="">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>

    <!-- Cases List -->
    <div class="cases-list">
      <div v-for="case_ in filteredCases" :key="case_.id" class="case-card">
        <div class="case-header">
          <div class="case-info">
            <h5 class="case-title">{{ case_.title }}</h5>
            <div class="case-meta">
              <span class="case-number">{{ case_.caseNumber }}</span>
              <span class="case-court">{{ case_.court }}</span>
              <span class="opposing-party">vs. {{ case_.opposingParty }}</span>
            </div>
          </div>
          <div class="case-badges">
            <span :class="['priority-badge', case_.priority]">{{ case_.priority }}</span>
            <span :class="['status-badge', 'status-' + case_.status.replace(' ', '-').toLowerCase()]">
              {{ case_.status }}
            </span>
          </div>
        </div>

        <div class="case-progress">
          <div class="progress-header">
            <span class="progress-label">Case Progress</span>
            <span class="progress-percentage">{{ case_.progressPercentage }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: case_.progressPercentage + '%' }"></div>
          </div>
          <div class="progress-milestones">
            <div 
              v-for="(milestone, index) in case_.milestones" 
              :key="index"
              :class="['milestone', {
                completed: milestone.completed,
                current: milestone.current,
                upcoming: !milestone.completed && !milestone.current
              }]"
            >
              <div class="milestone-marker"></div>
              <div class="milestone-label">{{ milestone.name }}</div>
              <div v-if="milestone.date" class="milestone-date">{{ formatDate(milestone.date) }}</div>
            </div>
          </div>
        </div>

        <div class="case-details">
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Attorney:</span>
              <span class="detail-value">{{ case_.assignedAttorney }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Filed:</span>
              <span class="detail-value">{{ formatDate(case_.filedDate) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Next Deadline:</span>
              <span class="detail-value" :class="{ 'deadline-urgent': isDeadlineUrgent(case_.nextDeadline) }">
                {{ formatDate(case_.nextDeadline) }}
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Budget Used:</span>
              <span class="detail-value">
                ${{ case_.budgetUsed.toLocaleString() }} / ${{ case_.totalBudget.toLocaleString() }}
                ({{ Math.round((case_.budgetUsed / case_.totalBudget) * 100) }}%)
              </span>
            </div>
          </div>

          <div v-if="case_.recentActivity" class="recent-activity">
            <h6>Recent Activity</h6>
            <div class="activity-timeline">
              <div v-for="activity in case_.recentActivity.slice(0, 3)" :key="activity.id" class="activity-item">
                <div class="activity-marker"></div>
                <div class="activity-content">
                  <p>{{ activity.description }}</p>
                  <div class="activity-meta">
                    <span class="activity-user">{{ activity.user }}</span>
                    <span class="activity-time">{{ formatRelativeTime(activity.timestamp) }}</span>
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
            View Details
          </button>
          <button @click="updateCase(case_)" class="action-btn secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Update
          </button>
          <button @click="viewDocuments(case_)" class="action-btn secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
            Documents
          </button>
          <div class="action-dropdown">
            <button class="action-btn more">⋮</button>
            <div class="dropdown-menu">
              <button @click="assignCase(case_)">Reassign</button>
              <button @click="scheduleDeposition(case_)">Schedule Deposition</button>
              <button @click="requestExtension(case_)">Request Extension</button>
              <hr>
              <button @click="closeCase(case_)">Close Case</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Case Details Modal -->
    <div v-if="showCaseDetailsModal" class="modal-overlay" @click="showCaseDetailsModal = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <div class="case-header-info">
            <h3>{{ selectedCase?.title }}</h3>
            <div class="case-metadata">
              <span class="case-number">{{ selectedCase?.caseNumber }}</span>
              <span :class="['priority-badge', selectedCase?.priority]">{{ selectedCase?.priority }}</span>
              <span :class="['status-badge', 'status-' + selectedCase?.status.replace(' ', '-').toLowerCase()]">
                {{ selectedCase?.status }}
              </span>
            </div>
          </div>
          <button @click="showCaseDetailsModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="case-details-content">
            <div class="details-tabs">
              <button 
                v-for="tab in detailTabs" 
                :key="tab.key"
                @click="activeTab = tab.key"
                :class="['tab-btn', { active: activeTab === tab.key }]"
              >
                {{ tab.label }}
              </button>
            </div>

            <div class="tab-content">
              <div v-if="activeTab === 'overview'" class="tab-panel">
                <div class="overview-grid">
                  <div class="overview-section">
                    <h4>Case Information</h4>
                    <div class="info-grid">
                      <div class="info-item">
                        <span class="info-label">Court:</span>
                        <span class="info-value">{{ selectedCase?.court }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Judge:</span>
                        <span class="info-value">{{ selectedCase?.judge }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Opposing Counsel:</span>
                        <span class="info-value">{{ selectedCase?.opposingCounsel }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Case Type:</span>
                        <span class="info-value">{{ selectedCase?.type }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="overview-section">
                    <h4>Financial Summary</h4>
                    <div class="financial-stats">
                      <div class="financial-item">
                        <span class="financial-label">Total Budget:</span>
                        <span class="financial-value">${{ selectedCase?.totalBudget.toLocaleString() }}</span>
                      </div>
                      <div class="financial-item">
                        <span class="financial-label">Spent to Date:</span>
                        <span class="financial-value">${{ selectedCase?.budgetUsed.toLocaleString() }}</span>
                      </div>
                      <div class="financial-item">
                        <span class="financial-label">Remaining:</span>
                        <span class="financial-value">
                          ${{ (selectedCase?.totalBudget - selectedCase?.budgetUsed).toLocaleString() }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="activeTab === 'timeline'" class="tab-panel">
                <div class="case-timeline">
                  <div v-for="event in selectedCase?.timeline" :key="event.id" class="timeline-event">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                      <h5>{{ event.title }}</h5>
                      <p>{{ event.description }}</p>
                      <div class="timeline-meta">
                        <span class="timeline-date">{{ formatDate(event.date) }}</span>
                        <span class="timeline-user">{{ event.user }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="activeTab === 'documents'" class="tab-panel">
                <div class="documents-list">
                  <div v-for="doc in selectedCase?.documents" :key="doc.id" class="document-item">
                    <div class="document-icon">📄</div>
                    <div class="document-info">
                      <h5>{{ doc.name }}</h5>
                      <p>{{ doc.type }} • {{ doc.size }} • Modified {{ formatRelativeTime(doc.modified) }}</p>
                    </div>
                    <div class="document-actions">
                      <button class="doc-btn">View</button>
                      <button class="doc-btn">Download</button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="activeTab === 'notes'" class="tab-panel">
                <div class="notes-section">
                  <div class="notes-list">
                    <div v-for="note in selectedCase?.notes" :key="note.id" class="note-item">
                      <div class="note-header">
                        <span class="note-author">{{ note.author }}</span>
                        <span class="note-date">{{ formatRelativeTime(note.created) }}</span>
                      </div>
                      <p class="note-content">{{ note.content }}</p>
                    </div>
                  </div>
                  <div class="add-note">
                    <textarea v-model="newNote" placeholder="Add a note..." class="note-input"></textarea>
                    <button @click="addNote" class="btn btn-primary btn-small">Add Note</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Case Modal -->
    <div v-if="showNewCaseModal" class="modal-overlay" @click="showNewCaseModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Create New Case</h3>
          <button @click="showNewCaseModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createCase" class="new-case-form">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Case Title *</label>
                <input v-model="newCase.title" type="text" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Case Number</label>
                <input v-model="newCase.caseNumber" type="text" class="form-input">
              </div>
              <div class="form-group">
                <label class="form-label">Case Type *</label>
                <select v-model="newCase.type" class="form-select" required>
                  <option value="">Select Type</option>
                  <option value="contract_dispute">Contract Dispute</option>
                  <option value="employment">Employment</option>
                  <option value="intellectual_property">Intellectual Property</option>
                  <option value="regulatory">Regulatory</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Priority</label>
                <select v-model="newCase.priority" class="form-select">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Opposing Party *</label>
                <input v-model="newCase.opposingParty" type="text" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Court</label>
                <input v-model="newCase.court" type="text" class="form-input">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea v-model="newCase.description" class="form-textarea" rows="3"></textarea>
            </div>
            <div class="form-actions">
              <button type="button" @click="showNewCaseModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Create Case</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// State
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const priorityFilter = ref('')
const showCaseDetailsModal = ref(false)
const showNewCaseModal = ref(false)
const showReportsModal = ref(false)
const selectedCase = ref(null)
const activeTab = ref('overview')
const newNote = ref('')

// Mock data
const overview = ref({
  criticalCases: 5,
  trialCases: 8,
  upcomingTrials: 3,
  settlementCases: 12,
  settlementValue: 2.4,
  totalBudget: 5.2,
  spentBudget: 3.1
})

const priorityAlerts = ref([
  {
    id: 1,
    severity: 'critical',
    title: 'Discovery Deadline Tomorrow',
    message: 'Document production deadline for TechCorp case is tomorrow',
    caseId: 'CASE-2024-001',
    caseNumber: 'CV-2024-001',
    actionLabel: 'Review Documents',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 2,
    severity: 'warning',
    title: 'Budget Threshold Exceeded',
    message: 'Employment case has exceeded 80% of allocated budget',
    caseId: 'CASE-2024-002',
    caseNumber: 'EEOC-2024-002',
    actionLabel: 'Review Budget',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
  }
])

const cases = ref([
  {
    id: 'CASE-2024-001',
    title: 'TechCorp Contract Dispute',
    caseNumber: 'CV-2024-001',
    court: 'Superior Court of California',
    judge: 'Hon. Sarah Johnson',
    opposingParty: 'TechCorp Industries',
    opposingCounsel: 'Smith & Associates',
    type: 'Contract Dispute',
    priority: 'high',
    status: 'Discovery',
    assignedAttorney: 'Michael Chen',
    filedDate: new Date('2024-09-15'),
    nextDeadline: new Date('2024-12-15'),
    progressPercentage: 45,
    totalBudget: 150000,
    budgetUsed: 68000,
    milestones: [
      { name: 'Case Filed', completed: true, date: new Date('2024-09-15') },
      { name: 'Discovery', current: true, date: new Date('2024-10-01') },
      { name: 'Expert Reports', completed: false },
      { name: 'Mediation', completed: false },
      { name: 'Trial', completed: false }
    ],
    recentActivity: [
      {
        id: 1,
        description: 'Received discovery response from opposing counsel',
        user: 'Michael Chen',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: 2,
        description: 'Filed motion to compel discovery',
        user: 'Sarah Rodriguez',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ],
    timeline: [
      {
        id: 1,
        title: 'Case Filed',
        description: 'Complaint filed against TechCorp for breach of contract',
        date: new Date('2024-09-15'),
        user: 'Michael Chen'
      },
      {
        id: 2,
        title: 'Answer Filed',
        description: 'Defendant filed answer and counterclaim',
        date: new Date('2024-10-01'),
        user: 'Opposing Counsel'
      }
    ],
    documents: [
      {
        id: 1,
        name: 'Complaint.pdf',
        type: 'Legal Document',
        size: '2.4 MB',
        modified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        name: 'Discovery_Response.pdf',
        type: 'Discovery',
        size: '8.7 MB',
        modified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ],
    notes: [
      {
        id: 1,
        author: 'Michael Chen',
        content: 'Client is very concerned about timeline. Need to push for expedited discovery.',
        created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 'CASE-2024-002',
    title: 'Employment Discrimination Case',
    caseNumber: 'EEOC-2024-002',
    court: 'Federal District Court',
    judge: 'Hon. Robert Kim',
    opposingParty: 'Former Employee',
    opposingCounsel: 'Workers Rights Law',
    type: 'Employment',
    priority: 'critical',
    status: 'Settlement',
    assignedAttorney: 'Emily Rodriguez',
    filedDate: new Date('2024-08-20'),
    nextDeadline: new Date('2024-12-20'),
    progressPercentage: 75,
    totalBudget: 200000,
    budgetUsed: 165000,
    milestones: [
      { name: 'EEOC Filing', completed: true, date: new Date('2024-08-20') },
      { name: 'Investigation', completed: true, date: new Date('2024-09-15') },
      { name: 'Mediation', completed: true, date: new Date('2024-11-01') },
      { name: 'Settlement Negotiation', current: true },
      { name: 'Resolution', completed: false }
    ],
    recentActivity: [
      {
        id: 1,
        description: 'Settlement offer submitted to opposing counsel',
        user: 'Emily Rodriguez',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ],
    timeline: [],
    documents: [],
    notes: []
  }
])

const newCase = ref({
  title: '',
  caseNumber: '',
  type: '',
  priority: 'medium',
  opposingParty: '',
  court: '',
  description: ''
})

const detailTabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'documents', label: 'Documents' },
  { key: 'notes', label: 'Notes' }
]

// Computed
const filteredCases = computed(() => {
  let filtered = cases.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(case_ =>
      case_.title.toLowerCase().includes(query) ||
      case_.caseNumber.toLowerCase().includes(query) ||
      case_.opposingParty.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(case_ => case_.status.toLowerCase().replace(' ', '_') === statusFilter.value)
  }

  if (typeFilter.value) {
    filtered = filtered.filter(case_ => case_.type.toLowerCase().replace(' ', '_') === typeFilter.value)
  }

  if (priorityFilter.value) {
    filtered = filtered.filter(case_ => case_.priority === priorityFilter.value)
  }

  return filtered
})

// Methods
function formatDate(date) {
  if (!date) return 'No date set'
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
  const case_ = cases.value.find(c => c.id === caseId)
  if (case_) {
    selectedCase.value = case_
    showCaseDetailsModal.value = true
  }
}

function handleAlert(alert) {
  console.log('Handling alert:', alert.title)
}

function dismissAlert(alert) {
  const index = priorityAlerts.value.findIndex(a => a.id === alert.id)
  if (index > -1) {
    priorityAlerts.value.splice(index, 1)
  }
}

function viewCaseDetails(case_) {
  selectedCase.value = case_
  activeTab.value = 'overview'
  showCaseDetailsModal.value = true
}

function updateCase(case_) {
  console.log('Updating case:', case_.title)
}

function viewDocuments(case_) {
  selectedCase.value = case_
  activeTab.value = 'documents'
  showCaseDetailsModal.value = true
}

function assignCase(case_) {
  console.log('Assigning case:', case_.title)
}

function scheduleDeposition(case_) {
  console.log('Scheduling deposition for:', case_.title)
}

function requestExtension(case_) {
  console.log('Requesting extension for:', case_.title)
}

function closeCase(case_) {
  console.log('Closing case:', case_.title)
}

function addNote() {
  if (newNote.value.trim() && selectedCase.value) {
    const note = {
      id: Date.now(),
      author: 'Current User',
      content: newNote.value.trim(),
      created: new Date()
    }
    selectedCase.value.notes.push(note)
    newNote.value = ''
  }
}

function createCase() {
  const case_ = {
    id: `CASE-2024-${String(cases.value.length + 1).padStart(3, '0')}`,
    ...newCase.value,
    status: 'Discovery',
    assignedAttorney: 'Current User',
    filedDate: new Date(),
    progressPercentage: 0,
    totalBudget: 100000,
    budgetUsed: 0,
    milestones: [],
    recentActivity: [],
    timeline: [],
    documents: [],
    notes: []
  }
  
  cases.value.push(case_)
  showNewCaseModal.value = false
  
  // Reset form
  newCase.value = {
    title: '',
    caseNumber: '',
    type: '',
    priority: 'medium',
    opposingParty: '',
    court: '',
    description: ''
  }
}

onMounted(() => {
  // Load cases data
})
</script>

<style scoped>
.active-cases {
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

.cases-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.overview-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  border-left: 4px solid;
}

.overview-card.critical {
  border-left-color: var(--risk-high);
}

.overview-card.trial {
  border-left-color: var(--secondary-accent);
}

.overview-card.settlement {
  border-left-color: var(--risk-medium);
}

.overview-card.budget {
  border-left-color: var(--primary-accent);
}

.overview-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
}

.overview-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.overview-label {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.overview-detail {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.priority-alerts {
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
  border-left-color: #ef4444;
}

.alert-item.warning {
  background: rgba(245, 158, 11, 0.1);
  border-left-color: #f59e0b;
}

.alert-item.info {
  background: rgba(59, 130, 246, 0.1);
  border-left-color: #3b82f6;
}

.alert-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-content h5 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.alert-content p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.alert-meta {
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

.alert-time {
  color: var(--text-secondary);
}

.alert-actions {
  display: flex;
  gap: 0.75rem;
}

.alert-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.alert-btn.primary {
  background: var(--primary-accent);
  color: white;
}

.alert-btn.dismiss {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.cases-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
}

.search-section {
  flex: 1;
  max-width: 400px;
}

.search-input-wrapper {
  position: relative;
}

.search-input-wrapper svg {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-select {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.cases-list {
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

.status-pre-trial {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-trial {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.status-settlement {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-appeal {
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
}

.case-progress {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.progress-header {
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
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: var(--primary-accent);
  transition: width 0.3s ease;
}

.progress-milestones {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.milestone {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  text-align: center;
}

.milestone-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--border-color);
  margin-bottom: 0.5rem;
}

.milestone.completed .milestone-marker {
  background: var(--health-excellent);
}

.milestone.current .milestone-marker {
  background: var(--primary-accent);
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.2);
}

.milestone-label {
  color: var(--text-secondary);
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.milestone.completed .milestone-label,
.milestone.current .milestone-label {
  color: var(--text-primary);
  font-weight: 500;
}

.milestone-date {
  color: var(--text-secondary);
  font-size: 0.7rem;
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

.recent-activity {
  min-width: 300px;
}

.recent-activity h6 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.activity-timeline {
  position: relative;
  padding-left: 1.5rem;
}

.activity-timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border-color);
}

.activity-item {
  position: relative;
  margin-bottom: 1rem;
}

.activity-marker {
  position: absolute;
  left: -20px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--primary-accent);
  border: 2px solid var(--primary-accent);
}

.activity-content p {
  color: var(--text-primary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.activity-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
}

.activity-user {
  color: var(--secondary-accent);
  font-weight: 500;
}

.activity-time {
  color: var(--text-secondary);
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
  max-width: 1200px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.case-header-info {
  flex: 1;
}

.case-header-info h3 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.case-metadata {
  display: flex;
  gap: 1rem;
  align-items: center;
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

.details-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: var(--bg-primary);
  padding: 0.5rem;
  border-radius: 8px;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.tab-btn.active {
  background: var(--primary-accent);
  color: white;
}

.tab-content {
  min-height: 400px;
}

.overview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.overview-section h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.info-label {
  color: var(--text-secondary);
}

.info-value {
  color: var(--text-primary);
  font-weight: 500;
}

.financial-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.financial-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.financial-label {
  color: var(--text-secondary);
}

.financial-value {
  color: var(--text-primary);
  font-weight: 600;
}

.case-timeline {
  position: relative;
  padding-left: 2rem;
}

.case-timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border-color);
}

.timeline-event {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-marker {
  position: absolute;
  left: -24px;
  top: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary-accent);
  border: 2px solid var(--primary-accent);
}

.timeline-content h5 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.timeline-content p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.timeline-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
}

.timeline-date {
  color: var(--secondary-accent);
  font-weight: 500;
}

.timeline-user {
  color: var(--text-secondary);
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.document-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.document-info {
  flex: 1;
}

.document-info h5 {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.document-info p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.document-actions {
  display: flex;
  gap: 0.5rem;
}

.doc-btn {
  padding: 0.375rem 0.75rem;
  background: var(--primary-accent);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
}

.notes-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.note-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.note-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.note-author {
  color: var(--secondary-accent);
  font-weight: 500;
}

.note-date {
  color: var(--text-secondary);
}

.note-content {
  color: var(--text-primary);
  line-height: 1.5;
}

.add-note {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.note-input {
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

.new-case-form {
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
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

  .cases-overview {
    grid-template-columns: repeat(2, 1fr);
  }

  .cases-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-controls {
    width: 100%;
    flex-direction: column;
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

  .recent-activity {
    min-width: auto;
  }

  .case-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .overview-grid {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>