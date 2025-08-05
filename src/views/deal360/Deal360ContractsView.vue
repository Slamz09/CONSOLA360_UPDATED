<template>
  <div class="deal360-contracts-view">
    <!-- Header -->
    <div class="contracts-header">
      <div class="header-content">
        <h2 class="heading-secondary">Deal Contracts</h2>
        <p class="text-body">Contract generation and lifecycle management from deals</p>
      </div>
      <div class="header-actions">
        <button @click="showTemplateSelector = true" class="btn btn-primary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
          Generate Contract
        </button>
      </div>
    </div>

    <!-- Contract Generation Workflow -->
    <div class="workflow-section">
      <h3 class="section-title">Contract Generation Workflow</h3>
      <div class="workflow-steps">
        <div class="workflow-step completed">
          <div class="step-indicator">
            <span class="step-number">1</span>
          </div>
          <div class="step-content">
            <h4>Deal Won</h4>
            <p>Sales rep marks deal as "Won"</p>
          </div>
        </div>
        
        <div class="workflow-step current">
          <div class="step-indicator">
            <span class="step-number">2</span>
          </div>
          <div class="step-content">
            <h4>Contract Type Selection</h4>
            <p>System prompts for contract type</p>
          </div>
        </div>
        
        <div class="workflow-step pending">
          <div class="step-indicator">
            <span class="step-number">3</span>
          </div>
          <div class="step-content">
            <h4>Template Auto-Generation</h4>
            <p>AI fills dynamic fields from deal data</p>
          </div>
        </div>
        
        <div class="workflow-step pending">
          <div class="step-indicator">
            <span class="step-number">4</span>
          </div>
          <div class="step-content">
            <h4>Customer Portal Invite</h4>
            <p>Magic link sent to customer email</p>
          </div>
        </div>
        
        <div class="workflow-step pending">
          <div class="step-indicator">
            <span class="step-number">5</span>
          </div>
          <div class="step-content">
            <h4>AI Legal Review</h4>
            <p>Automated clause analysis and compliance check</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Ready to Generate Contracts -->
    <div class="ready-contracts-section">
      <h3 class="section-title">Deals Ready for Contract Generation</h3>
      <div class="ready-deals-list">
        <div v-for="deal in readyDeals" :key="deal.id" class="ready-deal-card">
          <div class="deal-info">
            <h4>{{ deal.companyName }}</h4>
            <p class="deal-value">${{ deal.value }}K</p>
            <p class="deal-owner">Owner: {{ deal.owner }}</p>
            <span class="deal-stage">{{ deal.stage }}</span>
          </div>
          <div class="deal-actions">
            <button @click="selectContractType(deal)" class="btn btn-primary btn-small">
              Select Contract Type
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Contracts -->
    <div class="active-contracts-section">
      <h3 class="section-title">Active Deal Contracts</h3>
      <div class="contracts-table-container">
        <table class="contracts-table">
          <thead>
            <tr>
              <th>Contract ID</th>
              <th>Deal</th>
              <th>Type</th>
              <th>Status</th>
              <th>Customer Response</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="contract in activeContracts" :key="contract.id" class="contract-row">
              <td>
                <span class="contract-id">{{ contract.id }}</span>
              </td>
              <td>
                <div class="deal-info">
                  <div class="deal-name">{{ contract.dealName }}</div>
                  <div class="deal-value">${{ contract.dealValue }}K</div>
                </div>
              </td>
              <td>
                <span class="contract-type">{{ contract.type }}</span>
              </td>
              <td>
                <span :class="['status-badge', 'status-' + contract.status.toLowerCase().replace(' ', '-')]">
                  {{ contract.status }}
                </span>
              </td>
              <td>
                <span :class="['response-badge', getResponseClass(contract.customerResponse)]">
                  {{ contract.customerResponse }}
                </span>
              </td>
              <td>
                <span class="date-text">{{ formatDate(contract.createdDate) }}</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="viewContract(contract)" class="action-btn view">View</button>
                  <button @click="trackProgress(contract)" class="action-btn track">Track</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Contract Type Selection Modal -->
    <div v-if="showTemplateSelector" class="modal-overlay" @click="showTemplateSelector = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Select Contract Type</h3>
          <button @click="showTemplateSelector = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <p class="modal-description">What type of contract is needed for this deal?</p>
          <div class="contract-types-grid">
            <div
              v-for="contractType in contractTypes"
              :key="contractType.value"
              @click="selectType(contractType)"
              class="contract-type-card"
            >
              <div class="type-icon">{{ contractType.icon }}</div>
              <div class="type-content">
                <h4>{{ contractType.label }}</h4>
                <p>{{ contractType.description }}</p>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="selectType({ value: 'not_sure', label: 'Not Sure' })" class="btn btn-secondary">
              Not Sure - Route to Legal
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dynamic Form Modal -->
    <div v-if="showDynamicForm" class="modal-overlay" @click="showDynamicForm = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>Complete Contract Details</h3>
          <p class="modal-subtitle">{{ selectedContractType.label }} - {{ selectedDeal?.companyName }}</p>
          <button @click="showDynamicForm = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <p class="form-description">
            Please fill in the required fields to generate your {{ selectedContractType.label }}.
            Fields marked with * are required.
          </p>
          
          <form @submit.prevent="generateContract" class="dynamic-contract-form">
            <div class="form-sections">
              <div v-for="section in dynamicFields" :key="section.title" class="form-section">
                <h4 class="section-title">{{ section.title }}</h4>
                <div class="form-grid">
                  <div
                    v-for="field in section.fields"
                    :key="field.name"
                    class="form-group"
                    :class="{ 'form-group-full': field.fullWidth }"
                  >
                    <label class="form-label">
                      {{ field.label }}
                      <span v-if="field.required" class="required">*</span>
                    </label>
                    
                    <input
                      v-if="['text', 'email', 'date', 'number'].includes(field.type)"
                      v-model="contractForm[field.name]"
                      :type="field.type"
                      :required="field.required"
                      :placeholder="field.placeholder"
                      class="form-input"
                    />
                    
                    <textarea
                      v-else-if="field.type === 'textarea'"
                      v-model="contractForm[field.name]"
                      :required="field.required"
                      :placeholder="field.placeholder"
                      class="form-textarea"
                      rows="3"
                    ></textarea>
                    
                    <select
                      v-else-if="field.type === 'select'"
                      v-model="contractForm[field.name]"
                      :required="field.required"
                      class="form-select"
                    >
                      <option value="">Select {{ field.label }}</option>
                      <option
                        v-for="option in field.options"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" @click="showDynamicForm = false" class="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                Generate Contract & Send to Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// State
const showTemplateSelector = ref(false)
const showDynamicForm = ref(false)
const selectedDeal = ref(null)
const selectedContractType = ref(null)
const contractForm = ref({})

// Mock data
const readyDeals = ref([
  {
    id: 1,
    companyName: 'TechCorp Industries',
    value: 250,
    owner: 'Sarah Johnson',
    stage: 'Deal Approved'
  },
  {
    id: 2,
    companyName: 'Global Healthcare Solutions',
    value: 480,
    owner: 'Michael Chen',
    stage: 'Deal Approved'
  }
])

const activeContracts = ref([
  {
    id: 'CNT-2024-001',
    dealName: 'Enterprise Software License',
    dealValue: 250,
    type: 'SaaS Agreement',
    status: 'Pending Customer',
    customerResponse: 'Awaiting Response',
    createdDate: new Date('2024-11-28')
  },
  {
    id: 'CNT-2024-002',
    dealName: 'Managed Services Contract',
    dealValue: 480,
    type: 'MSA',
    status: 'Under Review',
    customerResponse: 'Edits Requested',
    createdDate: new Date('2024-11-25')
  }
])

const contractTypes = [
  {
    value: 'saas',
    label: 'SaaS Agreement',
    icon: '☁️',
    description: 'Software as a Service subscription agreement'
  },
  {
    value: 'msa',
    label: 'Master Service Agreement',
    icon: '🤝',
    description: 'Comprehensive service framework agreement'
  },
  {
    value: 'nda',
    label: 'Non-Disclosure Agreement',
    icon: '🔒',
    description: 'Confidentiality and non-disclosure agreement'
  },
  {
    value: 'influencer',
    label: 'Influencer Agreement',
    icon: '📱',
    description: 'Social media influencer partnership agreement'
  },
  {
    value: 'vendor',
    label: 'Vendor Agreement',
    icon: '🏢',
    description: 'Vendor service or supply agreement'
  },
  {
    value: 'license',
    label: 'License Agreement',
    icon: '📄',
    description: 'Software or IP licensing agreement'
  }
]

// Dynamic form fields based on contract type
const dynamicFields = computed(() => {
  if (!selectedContractType.value) return []
  
  const commonFields = [
    {
      title: 'Contract Parties',
      fields: [
        {
          name: 'customer_name',
          label: 'Customer Company Name',
          type: 'text',
          required: true,
          placeholder: selectedDeal.value?.companyName || ''
        },
        {
          name: 'customer_address',
          label: 'Customer Address',
          type: 'textarea',
          required: true,
          fullWidth: true
        },
        {
          name: 'contact_name',
          label: 'Primary Contact Name',
          type: 'text',
          required: true
        },
        {
          name: 'contact_email',
          label: 'Contact Email',
          type: 'email',
          required: true
        }
      ]
    }
  ]

  switch (selectedContractType.value.value) {
    case 'saas':
      return [
        ...commonFields,
        {
          title: 'Service Details',
          fields: [
            {
              name: 'service_description',
              label: 'Service Description',
              type: 'textarea',
              required: true,
              fullWidth: true
            },
            {
              name: 'subscription_fee',
              label: 'Monthly Subscription Fee',
              type: 'number',
              required: true,
              placeholder: '0.00'
            },
            {
              name: 'contract_term',
              label: 'Contract Term (months)',
              type: 'number',
              required: true,
              placeholder: '12'
            },
            {
              name: 'user_limit',
              label: 'User Limit',
              type: 'number',
              required: false
            }
          ]
        }
      ]
    
    case 'influencer':
      return [
        ...commonFields,
        {
          title: 'Campaign Details',
          fields: [
            {
              name: 'campaign_name',
              label: 'Campaign Name',
              type: 'text',
              required: true
            },
            {
              name: 'deliverables',
              label: 'Content Deliverables',
              type: 'textarea',
              required: true,
              fullWidth: true,
              placeholder: 'e.g., 3 Instagram posts, 1 story per day'
            },
            {
              name: 'compensation',
              label: 'Total Compensation',
              type: 'number',
              required: true
            },
            {
              name: 'campaign_duration',
              label: 'Campaign Duration (days)',
              type: 'number',
              required: true
            }
          ]
        }
      ]
    
    default:
      return commonFields
  }
})

// Methods
function selectContractType(deal) {
  selectedDeal.value = deal
  showTemplateSelector.value = true
}

function selectType(contractType) {
  if (contractType.value === 'not_sure') {
    // Route to legal team
    alert('Routing to legal team for contract type determination...')
    showTemplateSelector.value = false
    return
  }
  
  selectedContractType.value = contractType
  showTemplateSelector.value = false
  
  // Initialize form with deal data
  contractForm.value = {
    customer_name: selectedDeal.value?.companyName || '',
    contact_email: selectedDeal.value?.email || '',
    // Add other pre-filled fields from deal data
  }
  
  showDynamicForm.value = true
}

function generateContract() {
  // Generate contract logic
  console.log('Generating contract:', {
    deal: selectedDeal.value,
    type: selectedContractType.value,
    form: contractForm.value
  })
  
  // Create new contract record
  const newContract = {
    id: `CNT-2024-${String(activeContracts.value.length + 1).padStart(3, '0')}`,
    dealName: selectedDeal.value.companyName,
    dealValue: selectedDeal.value.value,
    type: selectedContractType.value.label,
    status: 'Generated',
    customerResponse: 'Pending',
    createdDate: new Date()
  }
  
  activeContracts.value.unshift(newContract)
  
  // Send magic link to customer
  alert(`Contract generated! Magic link sent to ${contractForm.value.contact_email}`)
  
  // Reset state
  showDynamicForm.value = false
  selectedDeal.value = null
  selectedContractType.value = null
  contractForm.value = {}
}

function getResponseClass(response) {
  switch (response) {
    case 'Accepted': return 'accepted'
    case 'Edits Requested': return 'edits'
    case 'Rejected': return 'rejected'
    default: return 'pending'
  }
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

function viewContract(contract) {
  console.log('Viewing contract:', contract.id)
}

function trackProgress(contract) {
  console.log('Tracking progress for:', contract.id)
}
</script>

<style scoped>
.deal360-contracts-view {
  /* Inherits styles from parent */
}

.contracts-header {
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

.workflow-section {
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

.workflow-steps {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.workflow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 180px;
  text-align: center;
  position: relative;
}

.step-indicator {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
}

.workflow-step.completed .step-indicator {
  background: var(--secondary-accent);
  color: white;
}

.workflow-step.current .step-indicator {
  background: var(--primary-accent);
  color: white;
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.2);
}

.workflow-step.pending .step-indicator {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  color: var(--text-secondary);
}

.step-number {
  font-weight: 600;
}

.step-content h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.step-content p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.ready-contracts-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.ready-deals-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.ready-deal-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.ready-deal-card .deal-info h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.ready-deal-card .deal-value {
  color: var(--primary-accent);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.ready-deal-card .deal-owner {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.ready-deal-card .deal-stage {
  padding: 0.25rem 0.75rem;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.active-contracts-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
}

.contracts-table-container {
  overflow-x: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.contracts-table {
  width: 100%;
  border-collapse: collapse;
}

.contracts-table th {
  padding: 1rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  font-weight: 600;
  text-align: left;
}

.contracts-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.contract-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.contract-id {
  font-family: 'Space Grotesk', monospace;
  color: var(--secondary-accent);
  font-weight: 600;
}

.deal-info .deal-name {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.deal-info .deal-value {
  color: var(--primary-accent);
  font-size: 0.875rem;
}

.contract-type {
  padding: 0.25rem 0.75rem;
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-generated {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-pending-customer {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-under-review {
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
}

.response-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.response-badge.accepted {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.response-badge.edits {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.response-badge.rejected {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.response-badge.pending {
  background: rgba(156, 163, 175, 0.1);
  color: #9ca3af;
}

.date-text {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.action-buttons {
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

.action-btn.view {
  background: var(--primary-accent);
  color: white;
}

.action-btn.view:hover {
  background: #6d28d9;
}

.action-btn.track {
  background: var(--secondary-accent);
  color: white;
}

.action-btn.track:hover {
  background: #059669;
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
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.modal-subtitle {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
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

.modal-description {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.contract-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.contract-type-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contract-type-card:hover {
  border-color: var(--primary-accent);
  background: rgba(124, 58, 237, 0.05);
}

.type-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.type-content h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.type-content p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.dynamic-contract-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-description {
  color: var(--text-secondary);
  margin-bottom: 2rem;
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

.form-section .section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
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

.form-textarea {
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .contracts-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .workflow-steps {
    flex-direction: column;
    align-items: center;
  }

  .workflow-step {
    min-width: auto;
    width: 100%;
  }

  .ready-deals-list {
    grid-template-columns: 1fr;
  }

  .ready-deal-card {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .contracts-table-container {
    overflow-x: scroll;
  }

  .contract-types-grid {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }
}
</style>