<template>
  <div class="leads-view">
    <!-- Header -->
    <div class="leads-header">
      <div class="header-content">
        <h2 class="heading-secondary">Leads Management</h2>
        <p class="text-body">Lead qualification and AI-powered risk screening</p>
      </div>
      <div class="header-actions">
        <button @click="showImportModal = true" class="btn btn-secondary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Import Leads
        </button>
        <button @click="showNewLeadModal = true" class="btn btn-primary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
          Add Lead
        </button>
      </div>
    </div>

    <!-- Lead Stats -->
    <div class="lead-stats">
      <div class="stat-card">
        <div class="stat-icon pending">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">45</div>
          <div class="stat-label">New Leads</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon qualified">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">32</div>
          <div class="stat-label">Qualified</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon risk">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">8</div>
          <div class="stat-label">Risk Flags</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon converted">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">73%</div>
          <div class="stat-label">Conversion Rate</div>
        </div>
      </div>
    </div>

    <!-- Filter Controls -->
    <div class="filter-section">
      <div class="filter-controls">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search leads..." 
          class="search-input"
        />
        <select v-model="statusFilter" class="filter-select">
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="qualified">Qualified</option>
          <option value="rejected">Rejected</option>
          <option value="converted">Converted</option>
        </select>
        <select v-model="sourceFilter" class="filter-select">
          <option value="all">All Sources</option>
          <option value="website">Website</option>
          <option value="referral">Referral</option>
          <option value="cold_outreach">Cold Outreach</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>
    </div>

    <!-- Leads Table -->
    <div class="leads-table-container">
      <table class="leads-table">
        <thead>
          <tr>
            <th @click="sortBy('company')" class="sortable">
              Company
              <span v-if="sortKey === 'company'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('contact')" class="sortable">
              Contact
              <span v-if="sortKey === 'contact'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('industry')" class="sortable">
              Industry
              <span v-if="sortKey === 'industry'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('source')" class="sortable">
              Source
              <span v-if="sortKey === 'source'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('risk_score')" class="sortable">
              Risk Score
              <span v-if="sortKey === 'risk_score'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('status')" class="sortable">
              Status
              <span v-if="sortKey === 'status'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('created_date')" class="sortable">
              Created
              <span v-if="sortKey === 'created_date'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lead in filteredLeads" :key="lead.id" class="lead-row">
            <td>
              <div class="company-info">
                <div class="company-name">{{ lead.company }}</div>
                <div class="company-meta">{{ lead.email }}</div>
              </div>
            </td>
            <td>
              <div class="contact-info">
                <div class="contact-name">{{ lead.contact }}</div>
                <div class="contact-title">{{ lead.title }}</div>
              </div>
            </td>
            <td>
              <span class="industry-tag">{{ lead.industry }}</span>
            </td>
            <td>
              <span :class="['source-badge', 'source-' + lead.source.toLowerCase().replace(' ', '-')]">
                {{ lead.source }}
              </span>
            </td>
            <td>
              <div class="risk-score">
                <div :class="['risk-indicator', getRiskClass(lead.risk_score)]">
                  {{ lead.risk_score }}
                </div>
              </div>
            </td>
            <td>
              <span :class="['status-badge', 'status-' + lead.status.toLowerCase()]">
                {{ lead.status }}
              </span>
            </td>
            <td>
              <span class="date-text">{{ formatDate(lead.created_date) }}</span>
            </td>
            <td>
              <div class="actions-cell">
                <button 
                  @click="qualifyLead(lead)" 
                  class="action-btn qualify"
                  :disabled="lead.status === 'qualified'"
                >
                  Qualify
                </button>
                <button @click="viewLead(lead)" class="action-btn view">
                  View
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modals -->
    <!-- New Lead Modal -->
    <div v-if="showNewLeadModal" class="modal-overlay" @click="showNewLeadModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Add New Lead</h3>
          <button @click="showNewLeadModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createLead" class="lead-form">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Company Name *</label>
                <input v-model="newLead.company" type="text" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Contact Name *</label>
                <input v-model="newLead.contact" type="text" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Contact Title</label>
                <input v-model="newLead.title" type="text" class="form-input">
              </div>
              <div class="form-group">
                <label class="form-label">Email *</label>
                <input v-model="newLead.email" type="email" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Industry</label>
                <select v-model="newLead.industry" class="form-select">
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Lead Source</label>
                <select v-model="newLead.source" class="form-select">
                  <option value="">Select Source</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Outreach">Cold Outreach</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" @click="showNewLeadModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Create Lead</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="modal-overlay" @click="showImportModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Import Leads from CSV</h3>
          <button @click="showImportModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="upload-zone" @click="triggerFileUpload">
            <div class="upload-icon">📄</div>
            <h4>Upload CSV File</h4>
            <p>Drag & drop or click to browse</p>
          </div>
          <input ref="fileInput" type="file" accept=".csv" style="display: none" @change="handleFileImport">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// State
const searchQuery = ref('')
const statusFilter = ref('all')
const sourceFilter = ref('all')
const sortKey = ref('')
const sortAsc = ref(true)
const showNewLeadModal = ref(false)
const showImportModal = ref(false)
const fileInput = ref()

// Mock leads data
const leads = ref([
  {
    id: 1,
    company: 'TechCorp Solutions',
    contact: 'John Smith',
    title: 'CTO',
    email: 'john.smith@techcorp.com',
    industry: 'Technology',
    source: 'Website',
    risk_score: 25,
    status: 'qualified',
    created_date: new Date('2024-12-01')
  },
  {
    id: 2,
    company: 'Global Healthcare Inc',
    contact: 'Sarah Johnson',
    title: 'Legal Director',
    email: 'sarah.j@globalhealthcare.com',
    industry: 'Healthcare',
    source: 'Referral',
    risk_score: 45,
    status: 'new',
    created_date: new Date('2024-11-28')
  },
  {
    id: 3,
    company: 'Financial Partners LLC',
    contact: 'Michael Chen',
    title: 'VP Legal',
    email: 'mchen@finpartners.com',
    industry: 'Finance',
    source: 'Cold Outreach',
    risk_score: 78,
    status: 'new',
    created_date: new Date('2024-11-25')
  }
])

const newLead = ref({
  company: '',
  contact: '',
  title: '',
  email: '',
  industry: '',
  source: ''
})

// Computed
const filteredLeads = computed(() => {
  let filtered = leads.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(lead => 
      lead.company.toLowerCase().includes(query) ||
      lead.contact.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(lead => lead.status === statusFilter.value)
  }

  if (sourceFilter.value !== 'all') {
    filtered = filtered.filter(lead => lead.source.toLowerCase().replace(' ', '_') === sourceFilter.value)
  }

  if (sortKey.value) {
    filtered.sort((a, b) => {
      const aVal = a[sortKey.value]
      const bVal = b[sortKey.value]
      if (aVal < bVal) return sortAsc.value ? -1 : 1
      if (aVal > bVal) return sortAsc.value ? 1 : -1
      return 0
    })
  }

  return filtered
})

// Methods
function sortBy(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function getRiskClass(score) {
  if (score <= 33) return 'low'
  if (score <= 66) return 'medium'
  return 'high'
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

function qualifyLead(lead) {
  lead.status = 'qualified'
  // Here you would trigger the AI risk screening and create deal record
  console.log('Qualifying lead:', lead.company)
}

function viewLead(lead) {
  console.log('Viewing lead:', lead)
}

function createLead() {
  const lead = {
    id: leads.value.length + 1,
    ...newLead.value,
    risk_score: Math.floor(Math.random() * 100),
    status: 'new',
    created_date: new Date()
  }
  leads.value.push(lead)
  showNewLeadModal.value = false
  newLead.value = {
    company: '',
    contact: '',
    title: '',
    email: '',
    industry: '',
    source: ''
  }
}

function triggerFileUpload() {
  fileInput.value?.click()
}

function handleFileImport(event) {
  const file = event.target.files[0]
  if (file) {
    console.log('Importing file:', file.name)
    // Handle CSV import logic here
  }
}
</script>

<style scoped>
.leads-view {
  /* Inherits styles from parent */
}

.leads-header {
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

.lead-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
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

.stat-icon.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-icon.qualified {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.stat-icon.risk {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.stat-icon.converted {
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  flex: 1;
  max-width: 300px;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
}

.filter-select {
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  min-width: 150px;
}

.leads-table-container {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.leads-table {
  width: 100%;
  border-collapse: collapse;
}

.leads-table th {
  padding: 1rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  font-weight: 600;
  text-align: left;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background: rgba(255, 255, 255, 0.05);
}

.leads-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.lead-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.company-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.company-name {
  color: var(--text-primary);
  font-weight: 500;
}

.company-meta {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contact-name {
  color: var(--text-primary);
  font-weight: 500;
}

.contact-title {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.industry-tag {
  padding: 0.25rem 0.75rem;
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.source-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.source-website {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.source-referral {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.source-cold-outreach {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.source-marketing {
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

.risk-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 24px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.risk-indicator.low {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.risk-indicator.medium {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.risk-indicator.high {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
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

.status-qualified {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-rejected {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.status-converted {
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
}

.date-text {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-btn.qualify {
  background: var(--secondary-accent);
  color: white;
}

.action-btn.qualify:hover {
  background: #059669;
}

.action-btn.qualify:disabled {
  background: var(--text-secondary);
  cursor: not-allowed;
}

.action-btn.view {
  background: var(--primary-accent);
  color: white;
}

.action-btn.view:hover {
  background: #6d28d9;
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

.close-btn:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 2rem;
}

.lead-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.upload-zone {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-zone:hover {
  border-color: var(--primary-accent);
  background: rgba(124, 58, 237, 0.05);
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .leads-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    max-width: none;
  }

  .lead-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .leads-table-container {
    overflow-x: auto;
  }

  .actions-cell {
    flex-direction: column;
  }
}
</style>