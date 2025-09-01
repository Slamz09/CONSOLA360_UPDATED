<template>
  <div class="matter-intake">
    <!-- Header -->
    <div class="intake-header">
      <div class="header-content">
        <h3 class="heading-tertiary">Matter Dashboard</h3>
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

    <!-- Stats: Active Cases and New This Month -->
    <div class="intake-stats">
      <div class="stat-card active">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12l2 2 4-4"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ activeCases }}</div>
          <div class="stat-label">Active Cases</div>
          <div class="stat-detail">Open statuses</div>
        </div>
      </div>

      <div class="stat-card new-month">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ newThisMonth }}</div>
          <div class="stat-label">New This Month</div>
          <div class="stat-detail">{{ currentMonthName }}</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
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
          <option value="pending_assignment">Pending Assignment</option>
          <option value="assigned">Assigned</option>
          <option value="closed">Closed</option>
          <option value="rejected">Rejected</option>
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

    <!-- Table only (cards removed) -->
    <div class="table-container">
      <div class="table-scroll">
        <div class="table-header">
          <div class="cell cell-checkbox">
            <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
          </div>
          <div class="cell">Case No</div>
          <div class="cell">Case Type</div>
          <div class="cell">Case Name</div>
          <div class="cell">Plaintiff</div>
          <div class="cell">Defendant</div>
          <div class="cell">Court</div>
        </div>

        <div
          v-for="matter in filteredMatters"
          :key="'row-' + matter.id"
          class="table-row"
        >
          <div class="cell cell-checkbox">
            <input
              type="checkbox"
              :checked="isSelected(matter.id)"
              @change="toggleRow(matter.id)"
            >
          </div>
          <div class="cell mono">{{ matter.id }}</div>
          <div class="cell">{{ matter.caseType || matter.type }}</div>
          <div class="cell strong">{{ matter.title }}</div>
          <div class="cell">{{ matter.plaintiff || 'N/A' }}</div>
          <div class="cell">{{ matter.defendant || matter.opposingParty || 'N/A' }}</div>
          <div class="cell">{{ matter.court || 'N/A' }}</div>
        </div>

        <div v-if="filteredMatters.length === 0" class="table-empty">
          No matters match your filters.
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
import { ref, computed } from 'vue'

/* State */
const showNewMatterModal = ref(false)
const showBulkTriage = ref(false)
const priorityFilter = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const fileInput = ref()
const uploadedFiles = ref([])

/* Selection for table */
const selectAll = ref(false)
const selectedRows = ref([])

/* Matters data (cards removed, fields you asked to delete removed) */
const matters = ref([
  {
    id: 'MTR-2024-001',
    title: 'Employee Discrimination Complaint',
    description: 'Former employee filed discrimination complaint with EEOC citing workplace harassment and wrongful termination',
    type: 'Employment',
    caseType: 'Employment',
    priority: 'critical',
    status: 'New',
    createdAt: new Date('2024-12-01T09:30:00'),
    plaintiff: 'Former Employee',
    defendant: 'Acme Corp',
    court: 'EEOC'
  },
  {
    id: 'MTR-2024-002',
    title: 'Vendor Contract Breach',
    description: 'Major vendor failed to deliver services per SLA, seeking damages and contract termination',
    type: 'Contract Dispute',
    caseType: 'Contract',
    priority: 'high',
    status: 'New',
    createdAt: new Date('2024-11-28T14:15:00'),
    plaintiff: 'Acme Corp',
    defendant: 'VendorCo LLC',
    court: 'N/A'
  },
  {
    id: 'MTR-2024-003',
    title: 'IP Infringement Claim',
    description: 'Competitor alleging patent infringement on our new product line',
    type: 'Intellectual Property',
    caseType: 'IP Litigation',
    priority: 'high',
    status: 'Pending Assignment',
    createdAt: new Date('2024-11-30T11:45:00'),
    plaintiff: 'Competitor Inc.',
    defendant: 'Acme Corp',
    court: 'US District Court'
  }
])

/* New matter model (trimmed) */
const newMatter = ref({
  title: '',
  type: '',
  priority: 'medium',
  description: '',
  opposingParty: '',
  jurisdiction: ''
})

/* Filtering */
const filteredMatters = computed(() => {
  let filtered = matters.value
  if (priorityFilter.value) {
    filtered = filtered.filter(m => (m.priority || '').toLowerCase() === priorityFilter.value)
  }
  if (statusFilter.value) {
    filtered = filtered.filter(m => (m.status || '').toLowerCase().replace(' ', '_') === statusFilter.value)
  }
  if (typeFilter.value) {
    filtered = filtered.filter(m => (m.type || '').toLowerCase().replace(' ', '_') === typeFilter.value)
  }
  return filtered
})

/* Stats */
const now = new Date()
const thisYear = now.getFullYear()
const thisMonth = now.getMonth()

const activeCases = computed(() => {
  return matters.value.filter(m => {
    const s = (m.status || '').toLowerCase()
    return s !== 'closed' && s !== 'rejected'
  }).length
})

const newThisMonth = computed(() =>
  matters.value.filter(m => {
    const d = m.createdAt instanceof Date ? m.createdAt : new Date(m.createdAt)
    return d.getFullYear() === thisYear && d.getMonth() === thisMonth
  }).length
)
const currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now)

/* Table selection */
function toggleSelectAll() {
  if (selectAll.value) {
    selectedRows.value = filteredMatters.value.map(m => m.id)
  } else {
    selectedRows.value = []
  }
}
function toggleRow(id) {
  if (selectedRows.value.includes(id)) {
    selectedRows.value = selectedRows.value.filter(x => x !== id)
  } else {
    selectedRows.value.push(id)
  }
  selectAll.value =
    filteredMatters.value.length > 0 &&
    selectedRows.value.length === filteredMatters.value.length
}
function isSelected(id) {
  return selectedRows.value.includes(id)
}

/* File upload */
function triggerFileUpload() { fileInput.value?.click() }
function handleFileUpload(event) {
  const files = Array.from(event.target.files)
  uploadedFiles.value.push(...files)
}
function removeFile(file) {
  const i = uploadedFiles.value.indexOf(file)
  if (i > -1) uploadedFiles.value.splice(i, 1)
}

/* Actions */
function reviewMatter(matterId) { console.log('Reviewing matter:', matterId) }
function assignMatter(matter) { console.log('Assigning matter:', matter.title) }
function createCase(matter) { console.log('Creating case from matter:', matter.title) }
function escalateMatter(matter) { console.log('Escalating matter:', matter.title) }
function requestMoreInfo(matter) { console.log('Requesting more info for:', matter.title) }
function closeMatter(matter) { console.log('Closing matter:', matter.title) }

/* Submit new matter */
function submitMatter() {
  const matter = {
    id: `MTR-2024-${String(matters.value.length + 1).padStart(3, '0')}`,
    ...newMatter.value,
    caseType: newMatter.value.type || '',
    status: 'New',
    createdAt: new Date(),
    plaintiff: '',
    defendant: newMatter.value.opposingParty || '',
    court: ''
  }
  matters.value.push(matter)
  showNewMatterModal.value = false
  newMatter.value = { title: '', type: '', priority: 'medium', description: '', opposingParty: '', jurisdiction: '' }
  uploadedFiles.value = []
}

/* Bulk triage */
function bulkAssignByType() { console.log('Bulk assigning by type...'); showBulkTriage.value = false }
function bulkPrioritizeByDeadline() { console.log('Bulk prioritizing by deadline...'); showBulkTriage.value = false }
function bulkCategorizeByAI() { console.log('Bulk categorizing by AI...'); showBulkTriage.value = false }
</script>

<style scoped>
.matter-intake {}

.intake-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}
.header-actions { display: flex; gap: 1rem; }

/* Stats */
.intake-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  border-left: 4px solid;
}
.stat-card.active { border-left-color: var(--secondary-accent); }
.stat-card.new-month { border-left-color: var(--primary-accent); }
.stat-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255, 255, 255, 0.08);
}
.stat-number { font-size: 1.6rem; font-weight: 700; color: var(--text-primary); }
.stat-label { color: var(--text-primary); font-weight: 600; }
.stat-detail { color: var(--text-secondary); font-size: 0.8rem; }

/* Filters */
.queue-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem;
}
.section-title { color: var(--text-primary); font-weight: 700; }
.queue-filters { display: flex; gap: 1rem; }
.filter-select {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

/* Table */
.table-container {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  overflow: hidden;
}
.table-scroll { overflow-x: auto; }
.table-header,
.table-row {
  display: grid;
  grid-template-columns:
    48px    /* checkbox */
    140px   /* Case No */
    160px   /* Case Type */
    260px   /* Case Name */
    200px   /* Plaintiff */
    200px   /* Defendant */
    180px;  /* Court */
  align-items: center;
  min-width: 1188px;
}
.table-header {
  position: sticky; top: 0;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  z-index: 1; font-weight: 700; color: var(--text-primary);
}
.table-row { border-top: 1px solid var(--border-color); }
.cell { padding: 0.7rem 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-primary); }
.cell.strong { font-weight: 700; }
.cell.mono { font-family: 'Space Grotesk', monospace; }
.cell-checkbox { display: flex; align-items: center; justify-content: center; }
.table-empty { padding: 1rem; color: var(--text-secondary); }

/* Buttons */
.btn { display: inline-flex; align-items: center; gap: 0.4rem; border: 1px solid var(--border-color); border-radius: 6px; padding: 0.45rem 0.8rem; cursor: pointer; }
.btn-primary { background: var(--primary-accent); color: #fff; border-color: var(--primary-accent); }
.btn-secondary { background: var(--bg-primary); color: var(--text-primary); }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.8);
  display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem;
}
.modal-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  max-width: 900px; width: 100%;
  max-height: 90vh; overflow-y: auto;
}
.modal-content.large { max-width: 900px; }
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.5rem 2rem; border-bottom: 1px solid var(--border-color);
}
.modal-body { padding: 2rem; }
.close-btn { background: none; border: none; color: var(--text-secondary); font-size: 1.5rem; cursor: pointer; padding: 0.5rem; }

.matter-form { display: flex; flex-direction: column; gap: 1.5rem; }
.form-sections { display: flex; flex-direction: column; gap: 1.25rem; }
.form-section {
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px; padding: 1.25rem;
}
.form-section h4 { color: var(--text-primary); font-weight: 700; margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
.form-input, .form-select, .form-textarea {
  width: 100%; padding: 0.7rem 0.9rem; background: var(--bg-primary); border: 1px solid var(--border-color);
  border-radius: 8px; color: var(--text-primary);
}
.file-upload-area { margin-top: 0.5rem; }
.upload-zone {
  border: 2px dashed var(--border-color); border-radius: 12px; padding: 2rem; text-align: center; cursor: pointer; margin-bottom: 0.8rem;
}
.upload-zone:hover { border-color: var(--primary-accent); background: rgba(124, 58, 237, 0.05); }
.upload-icon { color: var(--secondary-accent); margin-bottom: 0.5rem; }
.file-types { font-size: 0.8rem; color: var(--text-secondary); }
.uploaded-files { display: flex; flex-direction: column; gap: 0.4rem; }
.uploaded-file {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.5rem 0.8rem; background: rgba(255,255,255,0.05); border-radius: 6px;
}
.remove-file { background: none; border: none; color: var(--risk-high); cursor: pointer; padding: 0.25rem; }
.form-actions { display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1.25rem; border-top: 1px solid var(--border-color); }

/* Bulk triage */
.bulk-triage-options { display: flex; flex-direction: column; gap: 0.8rem; }
.triage-option {
  padding: 1.25rem; background: rgba(255,255,255,0.02);
  border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer;
}
.triage-option:hover { border-color: var(--primary-accent); background: rgba(124,58,237,0.05); }

@media (max-width: 768px) {
  .intake-header { flex-direction: column; gap: 1rem; }
  .queue-header { flex-direction: column; gap: 1rem; align-items: flex-start; }
}
</style>
