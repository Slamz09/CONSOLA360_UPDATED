<template>
  <div class="new-ticket-form">
    <!-- Header -->
    <div class="form-header">
      <h2 class="heading-secondary">Create New Support Ticket</h2>
      <p class="text-body">Create a ticket on behalf of a customer or for internal tracking</p>
      <button @click="$emit('close')" class="close-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Form Content -->
    <div class="form-content">
      <form @submit.prevent="createTicket" class="ticket-creation-form">
        <!-- Customer/Account Selection -->
        <div class="form-section">
          <h3 class="section-title">Customer Information</h3>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">
                Customer Account <span class="required">*</span>
              </label>
              <div class="account-search">
                <input 
                  v-model="accountSearch"
                  @input="searchAccounts"
                  type="text" 
                  class="form-input"
                  placeholder="Search by company name or account ID..."
                  required
                />
                <div v-if="showAccountResults" class="search-results">
                  <div 
                    v-for="account in filteredAccounts" 
                    :key="account.id"
                    @click="selectAccount(account)"
                    class="search-result-item"
                  >
                    <div class="result-main">
                      <span class="account-name">{{ account.name }}</span>
                      <span class="account-id">{{ account.id }}</span>
                    </div>
                    <div class="result-meta">
                      <span class="account-type">{{ account.type }}</span>
                      <span class="account-plan">{{ account.supportPlan }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                Primary Contact <span class="required">*</span>
              </label>
              <select v-model="form.contactId" required class="form-select">
                <option value="">Select Contact</option>
                <option 
                  v-for="contact in selectedAccount?.contacts || []" 
                  :key="contact.id" 
                  :value="contact.id"
                >
                  {{ contact.name }} ({{ contact.email }})
                </option>
              </select>
            </div>

            <div v-if="!selectedAccount" class="form-group">
              <label class="form-label">Customer Email (if no account)</label>
              <input 
                v-model="form.customerEmail"
                type="email" 
                class="form-input"
                placeholder="customer@company.com"
              />
            </div>

            <div v-if="!selectedAccount" class="form-group">
              <label class="form-label">Customer Name (if no account)</label>
              <input 
                v-model="form.customerName"
                type="text" 
                class="form-input"
                placeholder="Customer Name"
              />
            </div>
          </div>
        </div>

        <!-- Ticket Details -->
        <div class="form-section">
          <h3 class="section-title">Ticket Details</h3>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">
                Ticket Type <span class="required">*</span>
              </label>
              <select v-model="form.type" required class="form-select">
                <option value="">Select Type</option>
                <option value="Service Request">Service Request</option>
                <option value="Complaint">Complaint</option>
                <option value="Technical Issue">Technical Issue</option>
                <option value="Billing Question">Billing Question</option>
                <option value="Account Management">Account Management</option>
                <option value="Training Request">Training Request</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">
                Priority <span class="required">*</span>
              </label>
              <select v-model="form.priority" required class="form-select">
                <option value="">Select Priority</option>
                <option value="Low">Low - General inquiry (48h SLA)</option>
                <option value="Medium">Medium - Important but not urgent (24h SLA)</option>
                <option value="High">High - Urgent business impact (8h SLA)</option>
                <option value="Urgent">Urgent - Critical/system down (2h SLA)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Assign To</label>
              <select v-model="form.assignedAgent" class="form-select">
                <option value="">Auto-assign based on type</option>
                <option value="Mike Chen">Mike Chen (Account Management)</option>
                <option value="Lisa Wang">Lisa Wang (Technical Support)</option>
                <option value="Sarah Rodriguez">Sarah Rodriguez (Billing)</option>
                <option value="David Kim">David Kim (General Support)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Product/Service</label>
              <select v-model="form.product" class="form-select">
                <option value="">Select Product/Service</option>
                <option value="Contract Management">Contract Management</option>
                <option value="Risk Analytics">Risk Analytics</option>
                <option value="AI Tools">AI Tools</option>
                <option value="Account Management">Account Management</option>
                <option value="Billing">Billing</option>
                <option value="Training">Training</option>
                <option value="General Platform">General Platform</option>
              </select>
            </div>

            <div class="form-group form-group-full">
              <label class="form-label">
                Subject <span class="required">*</span>
              </label>
              <input 
                v-model="form.subject"
                type="text" 
                required 
                class="form-input"
                placeholder="Brief description of the issue or request"
              />
            </div>

            <div class="form-group form-group-full">
              <label class="form-label">
                Description <span class="required">*</span>
              </label>
              <textarea 
                v-model="form.description"
                required 
                class="form-textarea"
                rows="6"
                placeholder="Detailed description of the customer's issue or request. Include any relevant context, error messages, or steps already tried."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="form-section">
          <h3 class="section-title">Additional Information</h3>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Source</label>
              <select v-model="form.source" class="form-select">
                <option value="Phone">Phone Call</option>
                <option value="Email">Email</option>
                <option value="Portal">Customer Portal</option>
                <option value="In-Person">In-Person</option>
                <option value="Chat">Live Chat</option>
                <option value="Internal">Internal</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Customer Timezone</label>
              <select v-model="form.timezone" class="form-select">
                <option value="">Select Timezone</option>
                <option value="EST">Eastern Time (EST)</option>
                <option value="CST">Central Time (CST)</option>
                <option value="MST">Mountain Time (MST)</option>
                <option value="PST">Pacific Time (PST)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Preferred Contact Method</label>
              <select v-model="form.contactMethod" class="form-select">
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="portal">Portal Only</option>
                <option value="any">Any Method</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Business Impact</label>
              <select v-model="form.businessImpact" class="form-select">
                <option value="">Select Impact Level</option>
                <option value="None">No Business Impact</option>
                <option value="Low">Low - Minor inconvenience</option>
                <option value="Medium">Medium - Some business disruption</option>
                <option value="High">High - Significant business impact</option>
                <option value="Critical">Critical - Business stopped</option>
              </select>
            </div>

            <div class="form-group form-group-full">
              <label class="form-label">Tags</label>
              <div class="tags-input">
                <div class="tag-list">
                  <span v-for="tag in tags" :key="tag" class="tag">
                    {{ tag }}
                    <button type="button" @click="removeTag(tag)" class="tag-remove">×</button>
                  </span>
                </div>
                <input 
                  v-model="newTag"
                  @keydown.enter.prevent="addTag"
                  @keydown.comma.prevent="addTag"
                  type="text" 
                  class="tag-input"
                  placeholder="Add tags (press Enter or comma to add)"
                />
              </div>
            </div>

            <div class="form-group form-group-full">
              <label class="form-label">Internal Notes</label>
              <textarea 
                v-model="form.internalNotes"
                class="form-textarea"
                rows="3"
                placeholder="Internal notes (not visible to customer)"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- AI Suggestions Panel -->
        <div v-if="form.type && form.description" class="ai-suggestions">
          <h3 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a3 3 0 0 0-3 3c0 1.5-1.5 3-3 3s-3 1.5-3 3 1.5 3 3 3c1.5 0 3 1.5 3 3a3 3 0 0 0 6 0c0-1.5 1.5-3 3-3s3-1.5 3-3-1.5-3-3-3c-1.5 0-3-1.5-3-3a3 3 0 0 0-3-3z"/>
            </svg>
            AI Suggestions
          </h3>
          <div class="suggestion-cards">
            <div class="suggestion-card">
              <h4>Recommended Priority</h4>
              <p>Based on keywords and account type, suggested priority: <strong class="text-accent">{{ suggestedPriority }}</strong></p>
            </div>
            <div class="suggestion-card">
              <h4>Similar Tickets</h4>
              <p>Found 3 similar tickets in the past 30 days. Average resolution time: <strong class="health-excellent">4.2 hours</strong></p>
            </div>
            <div class="suggestion-card">
              <h4>Knowledge Base Articles</h4>
              <p>2 relevant articles found that might help resolve this issue quickly.</p>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn btn-secondary">
            Cancel
          </button>
          <button type="button" @click="saveDraft" class="btn btn-ghost">
            Save Draft
          </button>
          <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
            Create Ticket
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Emits
defineEmits(['close', 'created'])

// Types
interface Account {
  id: string
  name: string
  type: string
  supportPlan: string
  contacts: Contact[]
}

interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  role: string
}

// State
const accountSearch = ref('')
const showAccountResults = ref(false)
const selectedAccount = ref<Account | null>(null)
const tags = ref<string[]>([])
const newTag = ref('')

// Form data
const form = ref({
  accountId: '',
  contactId: '',
  customerEmail: '',
  customerName: '',
  type: '',
  priority: '',
  assignedAgent: '',
  product: '',
  subject: '',
  description: '',
  source: 'Phone',
  timezone: '',
  contactMethod: 'email',
  businessImpact: '',
  internalNotes: ''
})

// Mock accounts data
const mockAccounts: Account[] = [
  {
    id: 'ACC-001',
    name: 'Acme Corporation',
    type: 'Enterprise',
    supportPlan: 'Premium',
    contacts: [
      {
        id: 'CON-001',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@acmecorp.com',
        phone: '+1 (555) 123-4567',
        role: 'Legal Director'
      },
      {
        id: 'CON-002',
        name: 'Mike Smith',
        email: 'mike.smith@acmecorp.com',
        role: 'IT Manager'
      }
    ]
  },
  {
    id: 'ACC-002',
    name: 'Global Logistics Inc',
    type: 'Enterprise',
    supportPlan: 'Standard',
    contacts: [
      {
        id: 'CON-003',
        name: 'David Kim',
        email: 'david.kim@globallogistics.com',
        phone: '+1 (555) 987-6543',
        role: 'Operations Director'
      }
    ]
  },
  {
    id: 'ACC-003',
    name: 'TechStart Solutions',
    type: 'SMB',
    supportPlan: 'Basic',
    contacts: [
      {
        id: 'CON-004',
        name: 'Jennifer Martinez',
        email: 'j.martinez@techstart.com',
        role: 'CEO'
      }
    ]
  }
]

const filteredAccounts = ref<Account[]>([])

// Computed
const isFormValid = computed(() => {
  if (selectedAccount.value) {
    return form.value.contactId && form.value.type && form.value.priority && form.value.subject.trim() && form.value.description.trim()
  } else {
    return form.value.customerEmail && form.value.customerName && form.value.type && form.value.priority && form.value.subject.trim() && form.value.description.trim()
  }
})

const suggestedPriority = computed(() => {
  const description = form.value.description.toLowerCase()
  if (description.includes('urgent') || description.includes('critical') || description.includes('down') || description.includes('broken')) {
    return 'Urgent'
  } else if (description.includes('important') || description.includes('asap') || description.includes('soon')) {
    return 'High'
  } else if (description.includes('question') || description.includes('help') || description.includes('how to')) {
    return 'Medium'
  }
  return 'Low'
})

// Watchers
watch(() => form.value.priority, (newPriority) => {
  // Auto-suggest agent based on priority and type
  if (newPriority === 'Urgent' && form.value.type === 'Technical Issue') {
    form.value.assignedAgent = 'Lisa Wang'
  } else if (form.value.type === 'Billing Question') {
    form.value.assignedAgent = 'Sarah Rodriguez'
  }
})

// Methods
function searchAccounts() {
  if (accountSearch.value.length >= 2) {
    filteredAccounts.value = mockAccounts.filter(account =>
      account.name.toLowerCase().includes(accountSearch.value.toLowerCase()) ||
      account.id.toLowerCase().includes(accountSearch.value.toLowerCase())
    )
    showAccountResults.value = true
  } else {
    showAccountResults.value = false
  }
}

function selectAccount(account: Account) {
  selectedAccount.value = account
  accountSearch.value = `${account.name} (${account.id})`
  form.value.accountId = account.id
  showAccountResults.value = false
  
  // Clear contact selection to force re-selection
  form.value.contactId = ''
}

function addTag() {
  const tag = newTag.value.trim()
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag)
    newTag.value = ''
  }
}

function removeTag(tagToRemove: string) {
  const index = tags.value.indexOf(tagToRemove)
  if (index > -1) {
    tags.value.splice(index, 1)
  }
}

function saveDraft() {
  // Save form data to local storage or send to API
  alert('Draft saved successfully!')
}

function createTicket() {
  if (!isFormValid.value) return

  // Generate ticket ID
  const ticketId = `TK-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
  
  // Create ticket object
  const newTicket = {
    id: ticketId,
    subject: form.value.subject,
    type: form.value.type,
    priority: form.value.priority,
    status: 'New',
    customerName: selectedAccount.value ? 
      selectedAccount.value.contacts.find(c => c.id === form.value.contactId)?.name || 'Unknown' :
      form.value.customerName,
    customerEmail: selectedAccount.value ? 
      selectedAccount.value.contacts.find(c => c.id === form.value.contactId)?.email || '' :
      form.value.customerEmail,
    accountName: selectedAccount.value?.name || 'No Account',
    accountType: selectedAccount.value?.type || 'Individual',
    contractValue: selectedAccount.value ? '$18.5M' : 'N/A', // Mock value
    supportPlan: selectedAccount.value?.supportPlan || 'Basic',
    createdTime: 'Just now',
    assignedAgent: form.value.assignedAgent,
    messages: [
      {
        id: 'msg-' + Date.now(),
        sender: 'customer',
        senderName: selectedAccount.value ? 
          selectedAccount.value.contacts.find(c => c.id === form.value.contactId)?.name || 'Unknown' :
          form.value.customerName,
        content: form.value.description,
        timestamp: 'Just now',
        attachments: []
      }
    ]
  }

  // Emit the created ticket
  this.$emit('created', newTicket)
  
  // Show success message
  alert(`Ticket ${ticketId} created successfully!`)
}
</script>

<style scoped>
.new-ticket-form {
  width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.form-header {
  position: relative;
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.form-header h2 {
  margin-bottom: 0.5rem;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
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

.form-content {
  padding: 2rem;
}

.ticket-creation-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group-full {
  grid-column: 1 / -1;
}

.required {
  color: #ef4444;
}

.account-search {
  position: relative;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.search-result-item {
  padding: 1rem;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.search-result-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.search-result-item:last-child {
  border-bottom: none;
}

.result-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.account-name {
  color: var(--text-primary);
  font-weight: 600;
}

.account-id {
  color: var(--secondary-accent);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.875rem;
}

.result-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
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
  min-height: 100px;
}

.tags-input {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem;
  background: var(--bg-secondary);
  min-height: 60px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(124, 58, 237, 0.2);
  color: var(--secondary-accent);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.tag-remove {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
}

.tag-input {
  width: 100%;
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 0.875rem;
  padding: 0.25rem;
}

.tag-input::placeholder {
  color: var(--text-secondary);
}

.ai-suggestions {
  background: rgba(124, 58, 237, 0.05);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
}

.suggestion-cards {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.suggestion-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
}

.suggestion-card h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.suggestion-card p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .new-ticket-form {
    width: 95vw;
    margin: 1rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .suggestion-cards {
    grid-template-columns: 1fr;
  }
}
</style>