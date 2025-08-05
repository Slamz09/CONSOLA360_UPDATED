<template>
  <div class="matter-intake">
    <!-- Header -->
    <div class="intake-header">
      <div class="header-content">
        <h3 class="heading-tertiary">Matter Intake Dashboard</h3>
        <p class="text-body">Streamlined legal matter intake with intelligent triage and risk assessment</p>
      </div>
      <div class="header-actions">
        <button @click="showBulkTriage = true" class="btn btn-secondary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,11 12,14 22,4"/>
            <path d="M21,12v7a2,2 0 0,1 -2,2H5a2,2 0 0,1 -2,-2V5a2,2 0 0,1 2,-2h11"/>
          </svg>
          Bulk Triage
        </button>
        <button @click="showNewMatterModal = true" class="btn btn-primary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
          New Matter
        </button>
      </div>
    </div>

    <!-- Intake Statistics -->
    <div class="intake-stats">
      <div class="stat-card urgent">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.urgentMatters }}</div>
          <div class="stat-label">Urgent Matters</div>
          <div class="stat-detail">Require immediate attention</div>
        </div>
      </div>

      <div class="stat-card pending">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.pendingIntake }}</div>
          <div class="stat-label">Pending Intake</div>
          <div class="stat-detail">{{ stats.newToday }} received today</div>
        </div>
      </div>

      <div class="stat-card processing">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.inTriage }}</div>
          <div class="stat-label">In Triage</div>
          <div class="stat-detail">Being evaluated</div>
        </div>
      </div>

      <div class="stat-card completed">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.processedThisWeek }}</div>
          <div class="stat-label">Processed This Week</div>
          <div class="stat-detail">{{ stats.avgProcessingTime }}h avg time</div>
        </div>
      </div>
    </div>

    <!-- AI Triage Assistant -->
    <div class="ai-triage-section">
      <h4 class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2a3 3 0 0 0-3 3c0 1.5-1.5 3-3 3s-3 1.5-3 3 1.5 3 3 3c1.5 0 3 1.5 3 3a3 3 0 0 0 6 0c0-1.5 1.5-3 3-3s3-1.5 3-3-1.5-3-3-3c-1.5 0-3-1.5-3-3a3 3 0 0 0-3-3z"/>
        </svg>
        AI Triage Recommendations
      </h4>
      <div class="triage-recommendations">
        <div v-for="recommendation in triageRecommendations" :key="recommendation.id" class="recommendation-card">
          <div class="recommendation-header">
            <div class="recommendation-priority" :class="recommendation.priority">
              {{ recommendation.priority.toUpperCase() }}
            </div>
            <div class="recommendation-confidence">
              {{ recommendation.confidence }}% confidence
            </div>
          </div>
          <div class="recommendation-content">
            <h5>{{ recommendation.matterTitle }}</h5>
            <p class="recommendation-summary">{{ recommendation.summary }}</p>
            <div class="recommendation-details">
              <div class="detail-item">
                <span class="label">Suggested Action:</span>
                <span class="value">{{ recommendation.suggestedAction }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Estimated Value:</span>
                <span class="value">${{ recommendation.estimatedValue.toLocaleString() }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Risk Level:</span>
                <span :class="['risk-badge', recommendation.riskLevel]">{{ recommendation.riskLevel }}</span>
              </div>
            </div>
          </div>
          <div class="recommendation-actions">
            <button @click="acceptRecommendation(recommendation)" class="recommendation-btn accept">
              Accept
            </button>
            <button @click="reviewMatter(recommendation.matterId)" class="recommendation-btn review">
              Review
            </button>
            <button @click="dismissRecommendation(recommendation)" class="recommendation-btn dismiss">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Matter Intake Queue -->
    <div class="intake-queue">
      <div class="queue-header">
        <h4 class="section-title">Matter Intake Queue</h4>
        <div class="queue-filters">
          <select v-model="priorityFilter" class="filter-select">
            <option value="">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select v-model="statusFilter" class="filter-select">
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="in_review">In Review</option>
            <option value="pending_assignment">Pending Assignment</option>
            <option value="assigned">Assigned</option>
          </select>
          <select v-model="typeFilter" class="filter-select">
            <option value="">All Types</option>
            <option value="contract_dispute">Contract Dispute</option>
            <option value="employment">Employment</option>
            <option value="intellectual_property">IP</option>
            <option value="regulatory">Regulatory</option>
            <option value="litigation">Litigation</option>
          </select>
        </div>
      </div>

      <div class="matters-list">
        <div v-for="matter in filteredMatters" :key="matter.id" class="matter-card">
          <div class="matter-header">
            <div class="matter-info">
              <h5 class="matter-title">{{ matter.title }}</h5>
              <p class="matter-description">{{ matter.description }}</p>
              <div class="matter-meta">
                <span class="matter-id">{{ matter.id }}</span>
                <span class="submission-date">Submitted {{ formatRelativeTime(matter.submittedAt) }}</span>
                <span class="submitter">by {{ matter.submittedBy }}</span>
              </div>
            </div>
            <div class="matter-badges">
              <span :class="['priority-badge', matter.priority]">{{ matter.priority }}</span>
              <span :class="['status-badge', 'status-' + matter.status.replace(' ', '-').toLowerCase()]">
                {{ matter.status }}
              </span>
            </div>
          </div>

          <div class="matter-details">
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Type:</span>
                <span class="detail-value">{{ matter.type }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Department:</span>
                <span class="detail-value">{{ matter.department }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Estimated Value:</span>
                <span class="detail-value">${{ matter.estimatedValue.toLocaleString() }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Deadline:</span>
                <span class="detail-value" :class="{ 'deadline-urgent': isDeadlineUrgent(matter.deadline) }">
                  {{ formatDate(matter.deadline) }}
                </span>
              </div>
            </div>

            <div v-if="matter.aiAnalysis" class="ai-analysis">
              <h6>AI Analysis</h6>
              <div class="analysis-grid">
                <div class="analysis-item">
                  <span class="analysis-label">Risk Score:</span>
                  <span :class="['risk-score', getRiskClass(matter.aiAnalysis.riskScore)]">
                    {{ matter.aiAnalysis.riskScore }}/100
                  </span>
                </div>
                <div class="analysis-item">
                  <span class="analysis-label">Complexity:</span>
                  <span class="complexity-level">{{ matter.aiAnalysis.complexity }}</span>
                </div>
                <div class="analysis-item">
                  <span class="analysis-label">Similar Cases:</span>
                  <span class="similar-cases">{{ matter.aiAnalysis.similarCases }} found</span>
                </div>
              </div>
              <div class="ai-recommendations">
                <p><strong>Recommendation:</strong> {{ matter.aiAnalysis.recommendation }}</p>
                <div class="suggested-resources">
                  <span class="resource-label">Suggested Attorney:</span>
                  <span class="suggested-attorney">{{ matter.aiAnalysis.suggestedAttorney }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="matter-actions">
            <button @click="assignMatter(matter)" class="action-btn assign">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Assign
            </button>
            <button @click="reviewMatter(matter.id)" class="action-btn review">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Review
            </button>
            <button @click="createCase(matter)" class="action-btn create">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14m-7-7h14"/>
              </svg>
              Create Case
            </button>
            <div class="action-dropdown">
              <button class="action-btn more">⋮</button>
              <div class="dropdown-menu">
                <button @click="escalateMatter(matter)">Escalate</button>
                <button @click="requestMoreInfo(matter)">Request Info</button>
                <button @click="closeMatter(matter)">Close/Reject</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Matter Modal -->
    <div v-if="showNewMatterModal" class="modal-overlay" @click="showNewMatterModal = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>Submit New Legal Matter</h3>
          <button @click="showNewMatterModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitMatter" class="matter-form">
            <div class="form-sections">
              <div class="form-section">
                <h4>Matter Information</h4>
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
                      <option value="employment">Employment Matter</option>
                      <option value="intellectual_property">Intellectual Property</option>
                      <option value="regulatory">Regulatory/Compliance</option>
                      <option value="litigation">Litigation</option>
                      <option value="corporate">Corporate</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Priority Level</label>
                    <select v-model="newMatter.priority" class="form-select">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Department</label>
                    <select v-model="newMatter.department" class="form-select">
                      <option value="">Select Department</option>
                      <option value="sales">Sales</option>
                      <option value="hr">Human Resources</option>
                      <option value="finance">Finance</option>
                      <option value="operations">Operations</option>
                      <option value="technology">Technology</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Description *</label>
                  <textarea v-model="newMatter.description" class="form-textarea" rows="4" required
                            placeholder="Provide a detailed description of the legal matter..."></textarea>
                </div>
              </div>

              <div class="form-section">
                <h4>Additional Details</h4>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Estimated Value</label>
                    <input v-model.number="newMatter.estimatedValue" type="number" class="form-input" placeholder="0">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Deadline</label>
                    <input v-model="newMatter.deadline" type="date" class="form-input">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Opposing Party</label>
                    <input v-model="newMatter.opposingParty" type="text" class="form-input">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Jurisdiction</label>
                    <select v-model="newMatter.jurisdiction" class="form-select">
                      <option value="">Select Jurisdiction</option>
                      <option value="federal">Federal</option>
                      <option value="state">State</option>
                      <option value="local">Local</option>
                      <option value="international">International</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="form-section">
                <h4>Supporting Documents</h4>
                <div class="file-upload-area">
                  <div class="upload-zone" @click="triggerFileUpload">
                    <div class="upload-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17,8 12,3 7,8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <h4>Upload Supporting Documents</h4>
                    <p>Drag & drop files here or click to browse</p>
                    <p class="file-types">Supported: PDF, DOC, DOCX, TXT, EMAIL</p>
                  </div>
                  <input ref="fileInput" type="file" multiple accept=".pdf,.doc,.docx,.txt,.eml" 
                         style="display: none" @change="handleFileUpload">
                  
                  <div v-if="uploadedFiles.length > 0" class="uploaded-files">
                    <div v-for="file in uploadedFiles" :key="file.name" class="uploaded-file">
                      <span class="file-name">{{ file.name }}</span>
                      <button @click="removeFile(file)" class="remove-file">✕</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="showNewMatterModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Submit Matter</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Bulk Triage Modal -->
    <div v-if="showBulkTriage" class="modal-overlay" @click="showBulkTriage = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Bulk Triage Actions</h3>
          <button @click="showBulkTriage = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="bulk-triage-options">
            <div class="triage-option" @click="bulkAssignByType">
              <h4>Auto-Assign by Type</h4>
              <p>Automatically assign matters based on practice area expertise</p>
            </div>
            <div class="triage-option" @click="bulkPrioritizeByDeadline">
              <h4>Prioritize by Deadline</h4>
              <p>Automatically adjust priorities based on upcoming deadlines</p>
            </div>
            <div class="triage-option" @click="bulkCategorizeByAI">
              <h4>AI-Powered Categorization</h4>
              <p>Let AI analyze and categorize all pending matters</p>
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
const showNewMatterModal = ref(false)
const showBulkTriage = ref(false)
const priorityFilter = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const fileInput = ref()
const uploadedFiles = ref([])

// Mock data
const stats = ref({
  urgentMatters: 5,
  pendingIntake: 23,
  newToday: 7,
  inTriage: 12,
  processedThisWeek: 34,
  avgProcessingTime: 18
})

const triageRecommendations = ref([
  {
    id: 1,
    matterId: 'MTR-2024-001',
    matterTitle: 'Employee Discrimination Complaint',
    priority: 'critical',
    confidence: 92,
    summary: 'High-risk employment matter requiring immediate legal attention',
    suggestedAction: 'Assign to Employment Law specialist immediately',
    estimatedValue: 250000,
    riskLevel: 'high'
  },
  {
    id: 2,
    matterId: 'MTR-2024-002',
    matterTitle: 'Vendor Contract Dispute',
    priority: 'medium',
    confidence: 78,
    summary: 'Standard contract dispute over payment terms',
    suggestedAction: 'Route to Commercial Litigation team',
    estimatedValue: 45000,
    riskLevel: 'medium'
  }
])

const matters = ref([
  {
    id: 'MTR-2024-001',
    title: 'Employee Discrimination Complaint',
    description: 'Former employee filed discrimination complaint with EEOC citing workplace harassment and wrongful termination',
    type: 'Employment',
    department: 'Human Resources',
    priority: 'critical',
    status: 'New',
    estimatedValue: 250000,
    deadline: new Date('2024-12-15'),
    submittedAt: new Date('2024-12-01T09:30:00'),
    submittedBy: 'Sarah Johnson (HR)',
    aiAnalysis: {
      riskScore: 85,
      complexity: 'High',
      similarCases: 12,
      recommendation: 'Immediate assignment to employment specialist. High risk of escalation.',
      suggestedAttorney: 'Michael Chen (Employment Law)'
    }
  },
  {
    id: 'MTR-2024-002',
    title: 'Vendor Contract Breach',
    description: 'Major vendor failed to deliver services per SLA, seeking damages and contract termination',
    type: 'Contract Dispute',
    department: 'Procurement',
    priority: 'high',
    status: 'In Review',
    estimatedValue: 75000,
    deadline: new Date('2024-12-20'),
    submittedAt: new Date('2024-11-28T14:15:00'),
    submittedBy: 'David Kim (Procurement)',
    aiAnalysis: {
      riskScore: 45,
      complexity: 'Medium',
      similarCases: 8,
      recommendation: 'Standard commercial dispute. Can be handled by general counsel.',
      suggestedAttorney: 'Emily Rodriguez (Commercial)'
    }
  },
  {
    id: 'MTR-2024-003',
    title: 'IP Infringement Claim',
    description: 'Competitor alleging patent infringement on our new product line',
    type: 'Intellectual Property',
    department: 'Technology',
    priority: 'high',
    status: 'Pending Assignment',
    estimatedValue: 500000,
    deadline: new Date('2024-12-10'),
    submittedAt: new Date('2024-11-30T11:45:00'),
    submittedBy: 'Lisa Park (CTO)',
    aiAnalysis: {
      riskScore: 72,
      complexity: 'High',
      similarCases: 3,
      recommendation: 'Requires IP specialist. Consider external counsel for patent expertise.',
      suggestedAttorney: 'Robert Kim (IP Law)'
    }
  }
])

const newMatter = ref({
  title: '',
  type: '',
  priority: 'medium',
  department: '',
  description: '',
  estimatedValue: null,
  deadline: '',
  opposingParty: '',
  jurisdiction: ''
})

// Computed
const filteredMatters = computed(() => {
  let filtered = matters.value

  if (priorityFilter.value) {
    filtered = filtered.filter(m => m.priority === priorityFilter.value)
  }
  if (statusFilter.value) {
    filtered = filtered.filter(m => m.status.toLowerCase().replace(' ', '_') === statusFilter.value)
  }
  if (typeFilter.value) {
    filtered = filtered.filter(m => m.type.toLowerCase().replace(' ', '_') === typeFilter.value)
  }

  return filtered
})

// Methods
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

function formatDate(date) {
  if (!date) return 'No deadline'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

function isDeadlineUrgent(deadline) {
  if (!deadline) return false
  const now = new Date()
  const diffDays = Math.floor((deadline - now) / (1000 * 60 * 60 * 24))
  return diffDays <= 7
}

function getRiskClass(score) {
  if (score >= 70) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

function acceptRecommendation(recommendation) {
  console.log('Accepting recommendation:', recommendation.matterTitle)
  // Remove from recommendations
  const index = triageRecommendations.value.findIndex(r => r.id === recommendation.id)
  if (index > -1) {
    triageRecommendations.value.splice(index, 1)
  }
}

function dismissRecommendation(recommendation) {
  const index = triageRecommendations.value.findIndex(r => r.id === recommendation.id)
  if (index > -1) {
    triageRecommendations.value.splice(index, 1)
  }
}

function reviewMatter(matterId) {
  console.log('Reviewing matter:', matterId)
}

function assignMatter(matter) {
  console.log('Assigning matter:', matter.title)
}

function createCase(matter) {
  console.log('Creating case from matter:', matter.title)
}

function escalateMatter(matter) {
  console.log('Escalating matter:', matter.title)
}

function requestMoreInfo(matter) {
  console.log('Requesting more info for:', matter.title)
}

function closeMatter(matter) {
  console.log('Closing matter:', matter.title)
}

function triggerFileUpload() {
  fileInput.value?.click()
}

function handleFileUpload(event) {
  const files = Array.from(event.target.files)
  uploadedFiles.value.push(...files)
}

function removeFile(file) {
  const index = uploadedFiles.value.indexOf(file)
  if (index > -1) {
    uploadedFiles.value.splice(index, 1)
  }
}

function submitMatter() {
  const matter = {
    id: `MTR-2024-${String(matters.value.length + 1).padStart(3, '0')}`,
    ...newMatter.value,
    status: 'New',
    submittedAt: new Date(),
    submittedBy: 'Current User',
    aiAnalysis: null // Will be generated by AI
  }
  
  matters.value.push(matter)
  showNewMatterModal.value = false
  
  // Reset form
  newMatter.value = {
    title: '',
    type: '',
    priority: 'medium',
    department: '',
    description: '',
    estimatedValue: null,
    deadline: '',
    opposingParty: '',
    jurisdiction: ''
  }
  uploadedFiles.value = []
}

function bulkAssignByType() {
  console.log('Bulk assigning by type...')
  showBulkTriage.value = false
}

function bulkPrioritizeByDeadline() {
  console.log('Bulk prioritizing by deadline...')
  showBulkTriage.value = false
}

function bulkCategorizeByAI() {
  console.log('Bulk categorizing by AI...')
  showBulkTriage.value = false
}

onMounted(() => {
  // Load matters data
})
</script>

<style scoped>
.matter-intake {
  /* Inherits styles from parent */
}

.intake-header {
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

.intake-stats {
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

.stat-card.urgent {
  border-left-color: var(--risk-high);
}

.stat-card.pending {
  border-left-color: var(--risk-medium);
}

.stat-card.processing {
  border-left-color: var(--secondary-accent);
}

.stat-card.completed {
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

.ai-triage-section {
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

.triage-recommendations {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.recommendation-card {
  background: rgba(124, 58, 237, 0.05);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.recommendation-priority {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.recommendation-priority.critical {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.recommendation-priority.high {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.recommendation-priority.medium {
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
}

.recommendation-confidence {
  color: var(--secondary-accent);
  font-size: 0.875rem;
  font-weight: 500;
}

.recommendation-content h5 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.recommendation-summary {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.recommendation-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.detail-item .label {
  color: var(--text-secondary);
  font-weight: 500;
}

.detail-item .value {
  color: var(--text-primary);
  font-weight: 600;
}

.risk-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.risk-badge.low {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.risk-badge.medium {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.risk-badge.high {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.recommendation-actions {
  display: flex;
  gap: 0.75rem;
}

.recommendation-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.recommendation-btn.accept {
  background: var(--health-excellent);
  color: white;
}

.recommendation-btn.review {
  background: var(--primary-accent);
  color: white;
}

.recommendation-btn.dismiss {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.intake-queue {
  margin-bottom: 3rem;
}

.queue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.queue-filters {
  display: flex;
  gap: 1rem;
}

.filter-select {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.matters-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.matter-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.matter-card:hover {
  border-color: var(--primary-accent);
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.1);
}

.matter-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.matter-title {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.matter-description {
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.matter-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.matter-id {
  color: var(--secondary-accent);
  font-family: 'Space Grotesk', monospace;
  font-weight: 500;
}

.matter-badges {
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

.status-new {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-in-review {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-pending-assignment {
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
}

.status-assigned {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.matter-details {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
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

.ai-analysis {
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.ai-analysis h6 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.analysis-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
}

.analysis-label {
  color: var(--text-secondary);
}

.risk-score.high {
  color: var(--risk-high);
  font-weight: 600;
}

.risk-score.medium {
  color: var(--risk-medium);
  font-weight: 600;
}

.risk-score.low {
  color: var(--health-excellent);
  font-weight: 600;
}

.complexity-level,
.similar-cases {
  color: var(--text-primary);
  font-weight: 500;
}

.ai-recommendations {
  font-size: 0.875rem;
}

.ai-recommendations p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.suggested-resources {
  display: flex;
  gap: 1rem;
}

.resource-label {
  color: var(--text-secondary);
}

.suggested-attorney {
  color: var(--secondary-accent);
  font-weight: 500;
}

.matter-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
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

.action-btn.assign {
  background: var(--secondary-accent);
  color: white;
}

.action-btn.review {
  background: var(--primary-accent);
  color: white;
}

.action-btn.create {
  background: var(--health-excellent);
  color: white;
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
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
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

.file-upload-area {
  margin-top: 1rem;
}

.upload-zone {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.upload-zone:hover {
  border-color: var(--primary-accent);
  background: rgba(124, 58, 237, 0.05);
}

.upload-icon {
  color: var(--secondary-accent);
  margin-bottom: 1rem;
}

.upload-zone h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.upload-zone p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.file-types {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.uploaded-files {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.uploaded-file {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.file-name {
  color: var(--text-primary);
  font-size: 0.875rem;
}

.remove-file {
  background: none;
  border: none;
  color: var(--risk-high);
  cursor: pointer;
  padding: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.bulk-triage-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.triage-option {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.triage-option:hover {
  border-color: var(--primary-accent);
  background: rgba(124, 58, 237, 0.05);
}

.triage-option h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.triage-option p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .intake-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .intake-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .recommendation-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .recommendation-details {
    grid-template-columns: 1fr;
  }

  .queue-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .queue-filters {
    width: 100%;
    flex-direction: column;
  }

  .matter-header {
    flex-direction: column;
    gap: 1rem;
  }

  .matter-badges {
    flex-direction: row;
    align-items: center;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .analysis-grid {
    grid-template-columns: 1fr;
  }

  .matter-actions {
    flex-wrap: wrap;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>