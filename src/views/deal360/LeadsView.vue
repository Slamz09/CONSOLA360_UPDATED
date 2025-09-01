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
          <div class="stat-value">3</div>
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
          <div class="stat-value">2</div>
          <div class="stat-label">Qualified Leads</div>
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
          <div class="stat-label">Qualification Rate</div>
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
        <select v-model="typeFilter" class="filter-select">
          <option value="all">All Types</option>
          <option value="hot">Hot</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
        </select>
      </div>
    </div>

    <!-- Leads Table -->
    <div class="leads-table-container">
      <table class="leads-table">
        <thead>
          <tr>
            <th @click="sortBy('created_on')" class="sortable">
              Created On
              <span v-if="sortKey === 'created_on'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('lead_type')" class="sortable">
              Lead Type
              <span v-if="sortKey === 'lead_type'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('assigned_to')" class="sortable">
              Assigned To
              <span v-if="sortKey === 'assigned_to'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('status')" class="sortable">
              Status
              <span v-if="sortKey === 'status'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('contact_name')" class="sortable">
              Contact Name
              <span v-if="sortKey === 'contact_name'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('phone')" class="sortable">
              Phone
              <span v-if="sortKey === 'phone'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('email')" class="sortable">
              Email
              <span v-if="sortKey === 'email'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('source')" class="sortable">
              Source
              <span v-if="sortKey === 'source'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('est_value')" class="sortable">
              Est. Value
              <span v-if="sortKey === 'est_value'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('initial_contact_on')" class="sortable">
              Initial Contact 
              <span v-if="sortKey === 'initial_contact_on'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('last_contacted_on')" class="sortable">
              Last Contact
              <span v-if="sortKey === 'last_contacted_on'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('qualified_on')" class="sortable">
              Qualified On
              <span v-if="sortKey === 'qualified_on'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lead in filteredLeads" :key="lead.id" class="lead-row">
            <!-- Created On Column -->
            <td>
              <span class="date-text">{{ formatDate(lead.created_on) }}</span>
            </td>
            <!-- Lead Type Column -->
            <td>
              <span :class="['type-badge', 'type-' + lead.lead_type.toLowerCase()]">
                {{ lead.lead_type }}
              </span>
            </td>
            <!-- Assigned To Column -->
            <td>
              <div class="assigned-info">
                <span class="assigned-name">{{ lead.assigned_to || 'Unassigned' }}</span>
              </div>
            </td>
            <!-- Status Column -->
            <td>
              <span :class="['status-badge', 'status-' + lead.status.toLowerCase()]">
                {{ lead.status }}
              </span>
            </td>
            <!-- Contact Name Column -->
            <td>
              <div class="contact-info">
                <div class="contact-name">{{ lead.contact_name }}</div>
                <div class="contact-company">{{ lead.company }}</div>
              </div>
            </td>
            <!-- Phone Column -->
            <td>
              <span class="phone-text">{{ lead.phone || '-' }}</span>
            </td>
            <!-- Email Column -->
            <td>
              <span class="email-text">{{ lead.email }}</span>
            </td>
            <!-- Source Column -->
            <td>
              <span :class="['source-badge', 'source-' + lead.source.toLowerCase().replace(' ', '-')]">
                {{ lead.source }}
              </span>
            </td>
            <!-- Est. Value Column -->
            <td>
              <span class="value-text">${{ formatCurrency(lead.est_value) }}</span>
            </td>
            <!-- Initial Contact Column -->
            <td>
              <span class="date-text">{{ lead.initial_contact_on ? formatDate(lead.initial_contact_on) : '-' }}</span>
            </td>
            <!-- Last Contact Column -->
            <td>
              <span class="date-text">{{ lead.last_contacted_on ? formatDate(lead.last_contacted_on) : '-' }}</span>
            </td>
            <!-- Qualified On Column -->
            <td>
              <span class="date-text">{{ lead.qualified_on ? formatDate(lead.qualified_on) : '-' }}</span>
            </td>
            <!-- Actions Column -->
            <td>
              <div class="actions-cell">
                <button 
                  @click="qualifyLead(lead)" 
                  class="action-btn qualify"
                  :disabled="lead.status === 'qualified'"
                >
                  Qualify
                </button>
                <button @click="viewLead(lead)" 
				class="action-btn view">
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
          <div @click.prevent="createLead" class="lead-form">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Company Name *</label>
                <input v-model="newLead.company" type="text" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Contact Name *</label>
                <input v-model="newLead.contact_name" type="text" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email *</label>
                <input v-model="newLead.email" type="email" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Phone</label>
                <input v-model="newLead.phone" type="tel" class="form-input">
              </div>
              <div class="form-group">
                <label class="form-label">Lead Type</label>
                <select v-model="newLead.lead_type" class="form-select">
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
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
              <div class="form-group">
                <label class="form-label">Estimated Value</label>
                <input v-model="newLead.est_value" type="number" class="form-input" placeholder="0">
              </div>
              <div class="form-group">
                <label class="form-label">Assigned To</label>
                <select v-model="newLead.assigned_to" class="form-select">
                  <option value="">Select User</option>
                  <option value="Sallie Deeker">John Doe</option>
                  <option value="Jane Conroy">Jane Smith</option>
                  <option value="Mike Johnson">Mike Johnson</option>
                  <option value="Sarah Thomas">Sarah Wilson</option>
                </select>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" @click="showNewLeadModal = false" class="btn btn-secondary">Cancel</button>
              <button type="button" @click="createLead" class="btn btn-primary">Create Lead</button>
            </div>
          </div>
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
            <h4>Upload CSV File</h4>
            <p>Drag & drop or click to browse</p>
            <p class="upload-hint">Expected columns: Lead Type, Contact Name, Phone, Email, Source, Est. Value, Assigned To, Initial Contact</p>
          </div>
          <input ref="fileInput" type="file" accept=".csv" style="display: none" @change="handleFileImport">
        </div>
      </div>
    </div>

    <!-- Email Modal -->
    <div v-if="showEmailModal" class="modal-overlay" @click="showEmailModal = false">
      <div class="email-modal-content" @click.stop>
        <div class="email-modal-header">
          <div class="email-header-info">
            <h3>Send Email</h3>
            <div class="recipient-info">
              <span class="recipient-name">{{ selectedLead?.contact_name }}</span>
              <span class="recipient-company">{{ selectedLead?.company }}</span>
            </div>
          </div>
          <button @click="showEmailModal = false" class="close-btn">✕</button>
        </div>
        
        <div class="email-modal-body">
          <div class="email-form">
            <!-- Email Header Fields -->
            <div class="email-field-group">
              <div class="email-field">
                <label class="email-label">To:</label>
                <input 
                  v-model="emailData.to" 
                  type="email" 
                  class="email-input" 
                  :placeholder="selectedLead?.email"
                  readonly
                >
              </div>
              
              <div class="email-field">
                <label class="email-label">From:</label>
                <select v-model="emailData.from" class="email-select">
                  <option value="sales@company.com">sales@company.com</option>
                  <option value="support@company.com">support@company.com</option>
                  <option value="info@company.com">info@company.com</option>
                </select>
              </div>
              
              <div class="email-field">
                <label class="email-label">Subject:</label>
                <input 
                  v-model="emailData.subject" 
                  type="text" 
                  class="email-input" 
                  placeholder="Enter email subject"
                >
              </div>
            </div>

            <!-- Email Templates -->
            <div class="email-templates">
              <label class="email-label">Quick Templates:</label>
              <div class="template-buttons">
                <button @click="applyTemplate('introduction')" class="template-btn">
                  Introduction
                </button>
                <button @click="applyTemplate('followup')" class="template-btn">
                  Follow Up
                </button>
                <button @click="applyTemplate('thank_you')" class="template-btn">
                  Thank You
                </button>
              </div>
            </div>

            <!-- Email Body -->
            <div class="email-body-section">
              <label class="email-label">Message:</label>
              <textarea 
                v-model="emailData.body" 
                class="email-textarea" 
                placeholder="Type your message here..."
                rows="12"
              ></textarea>
            </div>

            <!-- Email Actions -->
            <div class="email-actions">
              <div class="email-options">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="emailData.trackOpens">
                  Track opens
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="emailData.trackClicks">
                  Track clicks
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="emailData.scheduleFollowup">
                  Schedule follow-up
                </label>
              </div>
              
              <div class="email-action-buttons">
                <button @click="saveDraft" class="btn btn-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17,21 17,13 7,13 7,21"/>
                    <polyline points="7,3 7,8 15,8"/>
                  </svg>
                  Save Draft
                </button>
                <button @click="sendEmail" class="btn btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                  </svg>
                  Send Email
                </button>
              </div>
            </div>
          </div>
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
const typeFilter = ref('all')
const sortKey = ref('')
const sortAsc = ref(true)
const showNewLeadModal = ref(false)
const showImportModal = ref(false)
const showEmailModal = ref(false)
const selectedLead = ref(null)
const fileInput = ref()

// Email data
const emailData = ref({
  to: '',
  from: 'sales@company.com',
  subject: '',
  body: '',
  trackOpens: true,
  trackClicks: true,
  scheduleFollowup: false
})

// Mock leads data with corrected structure
const leads = ref([
  {
    id: 1,
    lead_type: 'Hot',
    assigned_to: 'John Doe',
    status: 'qualified',
    contact_name: 'John Smith',
    company: 'TechCorp Solutions',
    phone: '555-0123',
    email: 'john.smith@techcorp.com',
    source: 'Website',
    created_on: new Date('2024-11-15'),
    est_value: 50000,
    initial_contact_on: new Date('2024-11-16'),
    last_contacted_on: new Date('2024-11-20'),
    qualified_on: new Date('2024-11-22')
  },
  {
    id: 2,
    lead_type: 'Warm',
    assigned_to: 'Jane Smith',
    status: 'new',
    contact_name: 'Sarah Johnson',
    company: 'Global Healthcare Inc',
    phone: '555-0456',
    email: 'sarah.j@globalhealthcare.com',
    source: 'Referral',
    created_on: new Date('2024-11-18'),
    est_value: 75000,
    initial_contact_on: new Date('2024-11-19'),
    last_contacted_on: new Date('2024-11-19'),
    qualified_on: null
  },
  {
    id: 3,
    created_on: new Date('2024-11-10'),
    lead_type: 'Cold',
    assigned_to: 'Mike Johnson',
    status: 'new',
    contact_name: 'Michael Chen',
    company: 'Financial Partners LLC',
    phone: '333-215-8457',
    email: 'mchen@finpartners.com',
    source: 'Cold Outreach',
    est_value: 100000,
    initial_contact_on: null,
    last_contacted_on: null,
    qualified_on: null
  },
  {
    id: 4,
    lead_type: 'Warm',
    assigned_to: 'Sarah Wilson',
    status: 'qualified',
    contact_name: 'Emily Rodriguez',
    company: 'Creative Agency Pro',
    phone: '444-567-8901',
    email: 'emily.r@creativeagency.com',
    source: 'Marketing',
    created_on: new Date('2024-11-10'),
    est_value: 35000,
    initial_contact_on: new Date('2024-11-12'),
    last_contacted_on: new Date('2024-11-21'),
    qualified_on: new Date('2024-11-23')
  },
  {
    id: 5,
    lead_type: 'Hot',
    assigned_to: null,
    status: 'new',
    contact_name: 'David Park',
    company: 'StartupCo',
    phone: '222-333-4444',
    email: 'david.park@startupco.com',
    source: 'Website',
    created_on: new Date('2024-11-25'),
    est_value: 85000,
    initial_contact_on: null,
    last_contacted_on: null,
    qualified_on: null
  }
])

const newLead = ref({
  company: '',
  contact_name: '',
  email: '',
  phone: '',
  lead_type: 'Warm',
  source: '',
  est_value: 0,
  assigned_to: ''
})

// Email templates
const emailTemplates = {
  introduction: {
    subject: 'Introduction from [Your Company]',
    body: `Hi ${selectedLead.value?.contact_name || '[Name]'},

I hope this email finds you well. My name is [Your Name] and I'm reaching out from [Your Company].

We specialize in [your service/product] and I noticed that [personalized reason based on their company/industry].

I'd love to schedule a brief call to discuss how we might be able to help [company name] with [specific benefit/solution].

Would you be available for a 15-minute conversation this week?

Best regards,
[Your Name]`
  },
  followup: {
    subject: 'Following up on our conversation',
    body: `Hi ${selectedLead.value?.contact_name || '[Name]'},

I wanted to follow up on our previous conversation about [topic discussed].

As promised, I've attached [relevant materials/information] that should help address the questions you had about [specific topic].

I'm happy to schedule another call to discuss next steps or answer any additional questions you might have.

Looking forward to hearing from you.

Best regards,
[Your Name]`
  },
  thank_you: {
    subject: 'Thank you for your time',
    body: `Hi ${selectedLead.value?.contact_name || '[Name]'},

Thank you for taking the time to meet with me today. I really enjoyed our conversation about [topics discussed] and learning more about [company name]'s goals and challenges.

As we discussed, I'll [action item from meeting] and get that back to you by [timeline].

If you have any questions in the meantime, please don't hesitate to reach out.

Looking forward to continuing our conversation.

Best regards,
[Your Name]`
  }
}

// Computed
const filteredLeads = computed(() => {
  let filtered = leads.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(lead => 
      lead.company.toLowerCase().includes(query) ||
      lead.contact_name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      (lead.assigned_to && lead.assigned_to.toLowerCase().includes(query))
    )
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(lead => lead.status === statusFilter.value)
  }

  if (sourceFilter.value !== 'all') {
    filtered = filtered.filter(lead => lead.source.toLowerCase().replace(' ', '_') === sourceFilter.value)
  }

  if (typeFilter.value !== 'all') {
    filtered = filtered.filter(lead => lead.lead_type.toLowerCase() === typeFilter.value)
  }

  if (sortKey.value) {
    filtered.sort((a, b) => {
      const aVal = a[sortKey.value]
      const bVal = b[sortKey.value]
      
      // Handle null values
      if (aVal === null && bVal === null) return 0
      if (aVal === null) return sortAsc.value ? 1 : -1
      if (bVal === null) return sortAsc.value ? -1 : 1
      
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

function formatDate(date) {
  if (!date) return '-'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

function formatCurrency(value) {
  if (!value) return '0'
  return new Intl.NumberFormat('en-US').format(value)
}

function qualifyLead(lead) {
  lead.status = 'qualified'
  lead.qualified_on = new Date()
  console.log('Qualifying lead:', lead.company)
}

function viewLead(lead) {
  selectedLead.value = lead
  emailData.value.to = lead.email
  emailData.value.subject = `Following up - ${lead.company}`
  emailData.value.body = `Hi ${lead.contact_name},

I hope this email finds you well. I wanted to reach out regarding your interest in our services.

Best regards,
[Your Name]`
  showEmailModal.value = true
}

function createLead() {
  const lead = {
    id: leads.value.length + 1,
    ...newLead.value,
    status: 'new',
    created_on: new Date(),
    initial_contact_on: null,
    last_contacted_on: null,
    qualified_on: null
  }
  leads.value.push(lead)
  showNewLeadModal.value = false
  newLead.value = {
    company: '',
    contact_name: '',
    email: '',
    phone: '',
    lead_type: 'Warm',
    source: '',
    est_value: 0,
    assigned_to: ''
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

function applyTemplate(templateName) {
  const template = emailTemplates[templateName]
  if (template) {
    emailData.value.subject = template.subject.replace('[Your Company]', 'Your Company Name')
    emailData.value.body = template.body.replace(/\[Your Name\]/g, 'Your Name')
                                      .replace(/\[company name\]/g, selectedLead.value?.company || '[Company]')
                                      .replace(/\[Project Name\]/g, `Project for ${selectedLead.value?.company}`)
  }
}

function sendEmail() {
  // Simulate sending email
  console.log('Sending email to:', emailData.value.to)
  console.log('Subject:', emailData.value.subject)
  console.log('Body:', emailData.value.body)
  
  // Update lead's last contacted date
  if (selectedLead.value) {
    selectedLead.value.last_contacted_on = new Date()
  }
  
  // Close modal and reset form
  showEmailModal.value = false
  resetEmailForm()
  
  // Show success message (you could add a toast notification here)
  alert('Email sent successfully!')
}

function saveDraft() {
  console.log('Saving draft for:', selectedLead.value?.contact_name)
  alert('Draft saved successfully!')
}

function resetEmailForm() {
  emailData.value = {
    to: '',
    from: 'sales@company.com',
    subject: '',
    body: '',
    trackOpens: true,
    trackClicks: true,
    scheduleFollowup: false
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
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  max-width: 300px;
  min-width: 200px;
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
  overflow-x: auto;
}

.leads-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1600px;
}

.leads-table th {
  padding: 1rem 0.75rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
  font-size: 0.875rem;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background: rgba(255, 255, 255, 0.05);
}

.leads-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.875rem;
}

.lead-row:hover {
  background: rgba(255, 255, 255, 0.02);
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

.contact-company {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.assigned-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.assigned-name {
  color: var(--text-primary);
  font-weight: 500;
}

.phone-text, .email-text {
  color: var(--text-primary);
  word-break: break-all;
}

.value-text {
  color: var(--text-primary);
  font-weight: 500;
}

.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.type-hot {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.type-warm {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.type-cold {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
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
  white-space: nowrap;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  white-space: nowrap;
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

.action-btn.convert {
  background: var(--secondary-accent);
  color: white;
}

.action-btn.convert:hover {
  background: #059669;
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.875rem;
}

.form-input, .form-select {
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: var(--primary-accent);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--primary-accent);
  color: white;
}

.btn-primary:hover {
  background: #6d28d9;
}

.btn-secondary {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
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

.upload-zone h4 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.upload-zone p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.upload-hint {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-style: italic;
}

/* Email Modal Styles */
.email-modal-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.email-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.email-header-info h3 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.recipient-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.recipient-name {
  color: var(--text-primary);
  font-weight: 500;
}

.recipient-company {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.email-modal-body {
  padding: 2rem;
}

.email-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.email-field-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.email-field {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.email-label {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.875rem;
  min-width: 60px;
}

.email-input, .email-select {
  flex: 1;
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.email-input:focus, .email-select:focus {
  outline: none;
  border-color: var(--primary-accent);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.email-input[readonly] {
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.email-templates {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.template-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.template-btn {
  padding: 0.5rem 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.template-btn:hover {
  background: rgba(124, 58, 237, 0.1);
  border-color: var(--primary-accent);
}

.email-body-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.email-textarea {
  width: 100%;
  padding: 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  min-height: 200px;
}

.email-textarea:focus {
  outline: none;
  border-color: var(--primary-accent);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.email-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.email-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--primary-accent);
}

.email-action-buttons {
  display: flex;
  gap: 1rem;
}

/* CSS Variables (you would typically define these in your main CSS file) */
:root {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2a2a2a;
  --border-color: #404040;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --primary-accent: #7c3aed;
  --secondary-accent: #10b981;
}

@media (max-width: 1200px) {
  .leads-table {
    min-width: 1400px;
  }
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
    min-width: auto;
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

  .form-grid {
    grid-template-columns: 1fr;
  }

  .email-modal-content {
    max-width: 95vw;
    margin: 1rem;
  }

  .email-field {
    flex-direction: column;
    align-items: stretch;
  }

  .email-label {
    min-width: auto;
  }

  .email-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .email-action-buttons {
    justify-content: stretch;
  }

  .email-action-buttons .btn {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .lead-stats {
    grid-template-columns: 1fr;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions button {
    flex: 1;
  }

  .template-buttons {
    flex-direction: column;
  }

  .template-btn {
    width: 100%;
  }
}
</style>
