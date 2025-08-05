<template>
  <div class="customer-portal">
    <!-- Portal Header -->
    <div class="portal-header">
      <div class="header-brand">
        <div class="logo">
          CONS<span class="logo-o"></span>LA
        </div>
        <div class="portal-title">
          <h2 class="heading-secondary">Customer Support Portal</h2>
          <p class="text-body">Submit and track your support requests</p>
        </div>
      </div>
      <button @click="$emit('close')" class="close-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Login/Authentication Section -->
    <div v-if="!isAuthenticated" class="auth-section">
      <div class="auth-card">
        <h3 class="heading-tertiary">Access Your Support Account</h3>
        <p class="text-body">Enter your information to access support services</p>
        
        <form @submit.prevent="authenticate" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input 
              v-model="authForm.email"
              type="email" 
              required 
              class="form-input"
              placeholder="Enter your email address"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Account Number or Company Name</label>
            <input 
              v-model="authForm.accountIdentifier"
              type="text" 
              required 
              class="form-input"
              placeholder="Enter account number or company name"
            />
          </div>
          
          <button type="submit" class="btn btn-primary" :disabled="!authForm.email || !authForm.accountIdentifier">
            Access Support Portal
          </button>
        </form>
        
        <div class="auth-help">
          <p class="text-small">
            Don't have your account information? 
            <a href="mailto:support@consola360.com" class="text-accent">Contact Support</a>
          </p>
        </div>
      </div>
    </div>

    <!-- Authenticated Portal Content -->
    <div v-else class="portal-content">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="customer-info">
          <div class="customer-avatar">
            {{ customerData.name.split(' ').map(n => n[0]).join('') }}
          </div>
          <div class="customer-details">
            <h3>Welcome, {{ customerData.name }}!</h3>
            <p>{{ customerData.company }} • {{ customerData.supportPlan }} Support</p>
          </div>
        </div>
        <div class="account-status">
          <div class="status-item">
            <span class="status-label">Open Tickets:</span>
            <span class="status-value">{{ customerTickets.filter(t => t.status !== 'Closed').length }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">Response Time:</span>
            <span class="status-value health-excellent">{{ customerData.avgResponseTime }}</span>
          </div>
        </div>
      </div>

      <!-- Portal Navigation -->
      <div class="portal-nav">
        <button 
          @click="activeSection = 'submit'"
          :class="['nav-btn', { 'active': activeSection === 'submit' }]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
          Submit New Request
        </button>
        <button 
          @click="activeSection = 'tickets'"
          :class="['nav-btn', { 'active': activeSection === 'tickets' }]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          My Tickets ({{ customerTickets.length }})
        </button>
        <button 
          @click="activeSection = 'knowledge'"
          :class="['nav-btn', { 'active': activeSection === 'knowledge' }]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Knowledge Base
        </button>
      </div>

      <!-- Submit New Request Section -->
      <div v-if="activeSection === 'submit'" class="submit-section">
        <h3 class="heading-tertiary">Submit New Support Request</h3>
        
        <form @submit.prevent="submitTicket" class="ticket-form">
          <!-- Request Type Selection -->
          <div class="form-section">
            <h4 class="section-title">What can we help you with?</h4>
            <div class="request-type-grid">
              <label 
                v-for="type in requestTypes" 
                :key="type.value"
                :class="['request-type-card', { 'selected': ticketForm.type === type.value }]"
              >
                <input 
                  type="radio" 
                  :value="type.value" 
                  v-model="ticketForm.type"
                  class="hidden-radio"
                />
                <div class="type-icon">{{ type.icon }}</div>
                <div class="type-content">
                  <h5>{{ type.label }}</h5>
                  <p>{{ type.description }}</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Priority Selection -->
          <div class="form-section">
            <h4 class="section-title">How urgent is this request?</h4>
            <div class="priority-grid">
              <label 
                v-for="priority in priorityLevels" 
                :key="priority.value"
                :class="['priority-card', priority.value.toLowerCase(), { 'selected': ticketForm.priority === priority.value }]"
              >
                <input 
                  type="radio" 
                  :value="priority.value" 
                  v-model="ticketForm.priority"
                  class="hidden-radio"
                />
                <div class="priority-content">
                  <div class="priority-level">{{ priority.label }}</div>
                  <div class="priority-description">{{ priority.description }}</div>
                  <div class="priority-sla">Response: {{ priority.sla }}</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Request Details -->
          <div class="form-section">
            <h4 class="section-title">Tell us more about your request</h4>
            <div class="form-grid">
              <div class="form-group form-group-full">
                <label class="form-label">Subject <span class="required">*</span></label>
                <input 
                  v-model="ticketForm.subject"
                  type="text" 
                  required 
                  class="form-input"
                  placeholder="Brief description of your request"
                />
              </div>
              
              <div class="form-group form-group-full">
                <label class="form-label">Description <span class="required">*</span></label>
                <textarea 
                  v-model="ticketForm.description"
                  required 
                  class="form-textarea"
                  rows="6"
                  placeholder="Please provide detailed information about your request or issue. Include any relevant context, error messages, or steps you've already tried."
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Affected Service/Product</label>
                <select v-model="ticketForm.product" class="form-select">
                  <option value="">Select Product/Service</option>
                  <option value="Contract Management">Contract Management</option>
                  <option value="Risk Analytics">Risk Analytics</option>
                  <option value="AI Tools">AI Tools</option>
                  <option value="Account Management">Account Management</option>
                  <option value="Billing">Billing</option>
                  <option value="Training">Training</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Preferred Contact Method</label>
                <select v-model="ticketForm.contactMethod" class="form-select">
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="portal">Portal Only</option>
                </select>
              </div>
            </div>
          </div>

          <!-- File Attachments -->
          <div class="form-section">
            <h4 class="section-title">Attachments (Optional)</h4>
            <div class="file-upload-area" @click="triggerFileUpload" @dragover.prevent @drop.prevent="handleFileDrop">
              <div class="upload-content">
                <div class="upload-icon">📎</div>
                <p>Click to upload files or drag and drop</p>
                <p class="text-small">Max 10MB per file. Supported: PDF, DOC, PNG, JPG</p>
              </div>
              <input 
                ref="fileInput" 
                type="file" 
                multiple 
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                style="display: none"
                @change="handleFileSelect"
              />
            </div>
            <div v-if="ticketForm.attachments.length > 0" class="attached-files">
              <div v-for="file in ticketForm.attachments" :key="file.name" class="file-item">
                <span class="file-name">{{ file.name }}</span>
                <button type="button" @click="removeFile(file)" class="remove-file">×</button>
              </div>
            </div>
          </div>

          <!-- Submit Actions -->
          <div class="form-actions">
            <button type="button" @click="resetForm" class="btn btn-secondary">
              Clear Form
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="!isFormValid"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>

      <!-- My Tickets Section -->
      <div v-else-if="activeSection === 'tickets'" class="tickets-section">
        <h3 class="heading-tertiary">My Support Tickets</h3>
        
        <div class="tickets-list">
          <div 
            v-for="ticket in customerTickets" 
            :key="ticket.id"
            class="customer-ticket-card"
          >
            <div class="ticket-card-header">
              <div class="ticket-card-left">
                <div class="ticket-card-id">{{ ticket.id }}</div>
                <h4 class="ticket-card-subject">{{ ticket.subject }}</h4>
              </div>
              <div class="ticket-card-right">
                <div :class="['ticket-card-status', 'status-' + ticket.status.toLowerCase().replace(' ', '-')]">
                  {{ ticket.status }}
                </div>
                <div :class="['ticket-card-priority', ticket.priority.toLowerCase()]">
                  {{ ticket.priority }}
                </div>
              </div>
            </div>
            
            <div class="ticket-card-meta">
              <span class="ticket-card-type">{{ ticket.type }}</span>
              <span class="separator">•</span>
              <span class="ticket-card-date">{{ ticket.createdTime }}</span>
              <span class="separator">•</span>
              <span class="ticket-card-agent">{{ ticket.assignedAgent || 'Unassigned' }}</span>
            </div>

            <div class="ticket-card-preview">
              {{ ticket.lastMessage }}
            </div>

            <div class="ticket-card-actions">
              <button class="btn btn-ghost btn-small">View Details</button>
              <button v-if="ticket.status !== 'Closed'" class="btn btn-ghost btn-small">Add Comment</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Knowledge Base Section -->
      <div v-else-if="activeSection === 'knowledge'" class="knowledge-section">
        <h3 class="heading-tertiary">Knowledge Base</h3>
        
        <div class="knowledge-search">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              v-model="knowledgeSearch"
              type="text" 
              placeholder="Search help articles..."
              class="search-input"
            />
          </div>
        </div>

        <div class="knowledge-categories">
          <div class="category-card">
            <div class="category-icon">🚀</div>
            <h4>Getting Started</h4>
            <p>Learn the basics of using Consola360</p>
            <div class="article-count">12 articles</div>
          </div>
          
          <div class="category-card">
            <div class="category-icon">📄</div>
            <h4>Contract Management</h4>
            <p>How to create, manage, and review contracts</p>
            <div class="article-count">8 articles</div>
          </div>
          
          <div class="category-card">
            <div class="category-icon">🤖</div>
            <h4>AI Features</h4>
            <p>Understanding and using AI-powered tools</p>
            <div class="article-count">15 articles</div>
          </div>
          
          <div class="category-card">
            <div class="category-icon">💳</div>
            <h4>Billing & Account</h4>
            <p>Account management and billing questions</p>
            <div class="article-count">6 articles</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="success-overlay" @click="showSuccessModal = false">
      <div class="success-modal" @click.stop>
        <div class="success-icon">✅</div>
        <h3>Request Submitted Successfully!</h3>
        <p>Your support request has been created with ID: <strong>{{ newTicketId }}</strong></p>
        <p>You'll receive an email confirmation shortly and we'll respond within {{ expectedResponseTime }}.</p>
        <div class="success-actions">
          <button @click="showSuccessModal = false" class="btn btn-secondary">Continue</button>
          <button @click="viewNewTicket" class="btn btn-primary">View Ticket</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Emits
defineEmits(['close'])

// State
const isAuthenticated = ref(false)
const activeSection = ref<'submit' | 'tickets' | 'knowledge'>('submit')
const showSuccessModal = ref(false)
const newTicketId = ref('')
const expectedResponseTime = ref('')
const knowledgeSearch = ref('')

// Auth form
const authForm = ref({
  email: '',
  accountIdentifier: ''
})

// Customer data (mock)
const customerData = ref({
  name: 'Sarah Johnson',
  email: 'sarah.johnson@acmecorp.com',
  company: 'Acme Corporation',
  accountNumber: 'ACC-001',
  supportPlan: 'Premium',
  avgResponseTime: '2.3 hours'
})

// Ticket form
const ticketForm = ref({
  type: '',
  priority: '',
  subject: '',
  description: '',
  product: '',
  contactMethod: 'email',
  attachments: [] as File[]
})

// Request types
const requestTypes = [
  {
    value: 'Service Request',
    label: 'Service Request',
    icon: '🛠️',
    description: 'General questions, feature requests, or assistance'
  },
  {
    value: 'Complaint',
    label: 'Issue/Complaint',
    icon: '⚠️',
    description: 'Problems with service, billing disputes, or concerns'
  },
  {
    value: 'Technical Issue',
    label: 'Technical Issue',
    icon: '🔧',
    description: 'System errors, bugs, or technical difficulties'
  },
  {
    value: 'Billing Question',
    label: 'Billing Question',
    icon: '💳',
    description: 'Invoice questions, payment issues, or account billing'
  }
]

// Priority levels
const priorityLevels = [
  {
    value: 'Low',
    label: 'Low',
    description: 'General question or minor issue',
    sla: '48 hours'
  },
  {
    value: 'Medium',
    label: 'Medium', 
    description: 'Important but not urgent',
    sla: '24 hours'
  },
  {
    value: 'High',
    label: 'High',
    description: 'Urgent business impact',
    sla: '8 hours'
  },
  {
    value: 'Urgent',
    label: 'Urgent',
    description: 'Critical system down or major business impact',
    sla: '2 hours'
  }
]

// Customer tickets (mock)
const customerTickets = ref([
  {
    id: 'TK-2024-001',
    subject: 'Contract renewal pricing inquiry',
    type: 'Service Request',
    priority: 'Medium',
    status: 'In Progress',
    createdTime: '2 days ago',
    assignedAgent: 'Mike Chen',
    lastMessage: 'Thanks for your inquiry. I\'m preparing the renewal options for you...'
  },
  {
    id: 'TK-2024-015',
    subject: 'Unable to access AI contract review',
    type: 'Technical Issue',
    priority: 'High',
    status: 'Resolved',
    createdTime: '1 week ago',
    assignedAgent: 'Lisa Wang',
    lastMessage: 'The issue has been resolved. You should now be able to access the AI contract review feature.'
  }
])

// File input ref
const fileInput = ref<HTMLInputElement>()

// Computed
const isFormValid = computed(() => {
  return ticketForm.value.type && 
         ticketForm.value.priority && 
         ticketForm.value.subject.trim() && 
         ticketForm.value.description.trim()
})

// Methods
function authenticate() {
  // Simulate authentication
  if (authForm.value.email && authForm.value.accountIdentifier) {
    isAuthenticated.value = true
  }
}

function triggerFileUpload() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size <= 10 * 1024 * 1024) { // 10MB limit
        ticketForm.value.attachments.push(files[i])
      }
    }
  }
}

function handleFileDrop(event: DragEvent) {
  const files = event.dataTransfer?.files
  if (files) {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size <= 10 * 1024 * 1024) { // 10MB limit
        ticketForm.value.attachments.push(files[i])
      }
    }
  }
}

function removeFile(fileToRemove: File) {
  const index = ticketForm.value.attachments.indexOf(fileToRemove)
  if (index > -1) {
    ticketForm.value.attachments.splice(index, 1)
  }
}

function resetForm() {
  ticketForm.value = {
    type: '',
    priority: '',
    subject: '',
    description: '',
    product: '',
    contactMethod: 'email',
    attachments: []
  }
}

function submitTicket() {
  if (!isFormValid.value) return

  // Generate ticket ID
  newTicketId.value = `TK-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
  
  // Set expected response time based on priority
  const priorityObj = priorityLevels.find(p => p.value === ticketForm.value.priority)
  expectedResponseTime.value = priorityObj?.sla || '24 hours'
  
  // Show success modal
  showSuccessModal.value = true
  
  // Reset form
  resetForm()
}

function viewNewTicket() {
  showSuccessModal.value = false
  activeSection.value = 'tickets'
}
</script>

<style scoped>
.customer-portal {
  width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.portal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
}

.logo-o {
  display: inline-block;
  width: 1em;
  height: 1em;
  background: var(--primary-accent);
  border-radius: 50%;
  margin: 0 2px;
}

.portal-title h2 {
  margin-bottom: 0.25rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.auth-section {
  padding: 2rem;
}

.auth-card {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

.auth-card h3 {
  margin-bottom: 0.5rem;
}

.auth-card p {
  margin-bottom: 2rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
  margin-bottom: 1.5rem;
}

.auth-help {
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.portal-content {
  padding: 2rem;
}

.welcome-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: rgba(124, 58, 237, 0.05);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 12px;
  margin-bottom: 2rem;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.customer-avatar {
  width: 48px;
  height: 48px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.customer-details h3 {
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.customer-details p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.account-status {
  display: flex;
  gap: 2rem;
}

.status-item {
  text-align: center;
}

.status-label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.status-value {
  display: block;
  color: var(--text-primary);
  font-weight: 600;
}

.portal-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.02);
}

.nav-btn.active {
  color: var(--text-primary);
  border-bottom-color: var(--primary-accent);
}

.submit-section,
.tickets-section,
.knowledge-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.ticket-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.request-type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.request-type-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.request-type-card:hover {
  border-color: var(--secondary-accent);
}

.request-type-card.selected {
  border-color: var(--primary-accent);
  background: rgba(124, 58, 237, 0.1);
}

.hidden-radio {
  display: none;
}

.type-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.type-content h5 {
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.type-content p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.priority-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.priority-card {
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.priority-card:hover {
  border-color: var(--secondary-accent);
}

.priority-card.selected {
  border-color: var(--primary-accent);
  background: rgba(124, 58, 237, 0.1);
}

.priority-card.low.selected {
  background: rgba(34, 197, 94, 0.1);
  border-color: #22c55e;
}

.priority-card.medium.selected {
  background: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
}

.priority-card.high.selected {
  background: rgba(249, 115, 22, 0.1);
  border-color: #f97316;
}

.priority-card.urgent.selected {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

.priority-level {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.priority-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.priority-sla {
  color: var(--secondary-accent);
  font-size: 0.75rem;
  font-weight: 500;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group-full {
  grid-column: 1 / -1;
}

.required {
  color: #ef4444;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
}

.file-upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-upload-area:hover {
  border-color: var(--primary-accent);
  background: rgba(124, 58, 237, 0.05);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-icon {
  font-size: 2rem;
  color: var(--secondary-accent);
}

.attached-files {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(124, 58, 237, 0.1);
  border-radius: 6px;
  font-size: 0.875rem;
}

.file-name {
  color: var(--text-primary);
}

.remove-file {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.customer-ticket-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.ticket-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.ticket-card-id {
  font-family: 'Space Grotesk', monospace;
  font-size: 0.875rem;
  color: var(--secondary-accent);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.ticket-card-subject {
  color: var(--text-primary);
  font-weight: 600;
}

.ticket-card-right {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.ticket-card-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.ticket-card-priority {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.ticket-card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.separator {
  color: var(--border-color);
}

.ticket-card-preview {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.ticket-card-actions {
  display: flex;
  gap: 1rem;
}

.knowledge-search {
  margin-bottom: 2rem;
}

.search-input-wrapper {
  position: relative;
  max-width: 400px;
}

.search-icon {
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
}

.knowledge-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  border-color: var(--secondary-accent);
  transform: translateY(-2px);
}

.category-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.category-card h4 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.category-card p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.article-count {
  color: var(--secondary-accent);
  font-size: 0.875rem;
  font-weight: 500;
}

.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.success-modal {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  text-align: center;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.success-modal h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.success-modal p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.success-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .customer-portal {
    width: 95vw;
    margin: 1rem;
  }
  
  .portal-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .welcome-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .account-status {
    width: 100%;
    justify-content: space-around;
  }
  
  .portal-nav {
    flex-direction: column;
  }
  
  .request-type-grid,
  .priority-grid {
    grid-template-columns: 1fr;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .knowledge-categories {
    grid-template-columns: 1fr;
  }
}
</style>