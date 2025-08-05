<template>
  <div class="contract-generator">
    <!-- Header -->
    <div class="generator-header">
      <div class="header-content">
        <h3 class="heading-tertiary">Contract Generator</h3>
        <p class="text-body">AI-powered contract creation with intelligent templates and clause suggestions</p>
      </div>
      <div class="header-actions">
        <button @click="saveTemplate" class="btn btn-secondary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17,21 17,13 7,13 7,21"/>
            <polyline points="7,3 7,8 15,8"/>
          </svg>
          Save Template
        </button>
        <button @click="previewContract" class="btn btn-primary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Preview
        </button>
      </div>
    </div>

    <!-- Contract Generation Wizard -->
    <div class="generation-wizard">
      <!-- Step Indicator -->
      <div class="wizard-steps">
        <div 
          v-for="(step, index) in wizardSteps" 
          :key="index"
          :class="['wizard-step', {
            active: currentStep === index,
            completed: currentStep > index,
            pending: currentStep < index
          }]"
        >
          <div class="step-indicator">
            <span v-if="currentStep > index" class="step-check">✓</span>
            <span v-else class="step-number">{{ index + 1 }}</span>
          </div>
          <div class="step-content">
            <h4>{{ step.title }}</h4>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="wizard-content">
        <!-- Step 1: Contract Type Selection -->
        <div v-if="currentStep === 0" class="step-panel">
          <h4 class="panel-title">Select Contract Type</h4>
          <p class="panel-description">Choose the type of contract you want to generate</p>
          
          <div class="contract-types-grid">
            <div 
              v-for="contractType in contractTypes" 
              :key="contractType.id"
              @click="selectContractType(contractType)"
              :class="['contract-type-card', { selected: selectedType?.id === contractType.id }]"
            >
              <div class="type-icon">{{ contractType.icon }}</div>
              <div class="type-content">
                <h5>{{ contractType.name }}</h5>
                <p>{{ contractType.description }}</p>
                <div class="type-meta">
                  <span class="complexity">{{ contractType.complexity }}</span>
                  <span class="avg-time">{{ contractType.avgTime }}</span>
                </div>
              </div>
              <div v-if="selectedType?.id === contractType.id" class="selected-indicator">✓</div>
            </div>
          </div>

          <div v-if="selectedType" class="type-details">
            <h5>{{ selectedType.name }} Details</h5>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Typical Use:</span>
                <span class="detail-value">{{ selectedType.typicalUse }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Key Clauses:</span>
                <span class="detail-value">{{ selectedType.keyClauses.join(', ') }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Compliance:</span>
                <span class="detail-value">{{ selectedType.compliance.join(', ') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Basic Information -->
        <div v-if="currentStep === 1" class="step-panel">
          <h4 class="panel-title">Basic Contract Information</h4>
          <p class="panel-description">Provide the essential details for your contract</p>

          <div class="form-sections">
            <div class="form-section">
              <h5>Contract Parties</h5>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Company Name *</label>
                  <input v-model="contractData.companyName" type="text" class="form-input" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Counterparty Name *</label>
                  <input v-model="contractData.counterpartyName" type="text" class="form-input" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Counterparty Type</label>
                  <select v-model="contractData.counterpartyType" class="form-select">
                    <option value="">Select Type</option>
                    <option value="customer">Customer</option>
                    <option value="vendor">Vendor</option>
                    <option value="partner">Partner</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Industry</label>
                  <select v-model="contractData.industry" class="form-select">
                    <option value="">Select Industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h5>Contract Details</h5>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Contract Title *</label>
                  <input v-model="contractData.title" type="text" class="form-input" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Contract Value</label>
                  <div class="value-input-group">
                    <select v-model="contractData.currency" class="currency-select">
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                    <input v-model.number="contractData.value" type="number" class="form-input" placeholder="0.00">
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Start Date</label>
                  <input v-model="contractData.startDate" type="date" class="form-input">
                </div>
                <div class="form-group">
                  <label class="form-label">End Date</label>
                  <input v-model="contractData.endDate" type="date" class="form-input">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea v-model="contractData.description" class="form-textarea" rows="3" 
                          placeholder="Brief description of the contract purpose and scope..."></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Clause Configuration -->
        <div v-if="currentStep === 2" class="step-panel">
          <h4 class="panel-title">Configure Contract Clauses</h4>
          <p class="panel-description">Customize clauses and terms for your contract</p>

          <div class="clause-categories">
            <div v-for="category in clauseCategories" :key="category.name" class="clause-category">
              <div class="category-header" @click="toggleCategory(category.name)">
                <h5>{{ category.name }}</h5>
                <span class="category-toggle">{{ expandedCategories.includes(category.name) ? '−' : '+' }}</span>
              </div>
              
              <div v-if="expandedCategories.includes(category.name)" class="category-content">
                <div v-for="clause in category.clauses" :key="clause.id" class="clause-item">
                  <div class="clause-header">
                    <div class="clause-info">
                      <h6>{{ clause.name }}</h6>
                      <p>{{ clause.description }}</p>
                    </div>
                    <div class="clause-controls">
                      <label class="clause-toggle">
                        <input type="checkbox" v-model="clause.enabled">
                        <span class="toggle-slider"></span>
                      </label>
                      <span :class="['clause-risk', clause.riskLevel]">{{ clause.riskLevel }}</span>
                    </div>
                  </div>
                  
                  <div v-if="clause.enabled && clause.customizable" class="clause-customization">
                    <div v-for="param in clause.parameters" :key="param.name" class="param-group">
                      <label class="param-label">{{ param.label }}</label>
                      <input 
                        v-if="param.type === 'text'"
                        v-model="param.value"
                        type="text"
                        class="param-input"
                        :placeholder="param.placeholder"
                      >
                      <select 
                        v-else-if="param.type === 'select'"
                        v-model="param.value"
                        class="param-select"
                      >
                        <option v-for="option in param.options" :key="option" :value="option">
                          {{ option }}
                        </option>
                      </select>
                      <input 
                        v-else-if="param.type === 'number'"
                        v-model.number="param.value"
                        type="number"
                        class="param-input"
                        :placeholder="param.placeholder"
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI Suggestions -->
          <div class="ai-suggestions">
            <h5>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a3 3 0 0 0-3 3c0 1.5-1.5 3-3 3s-3 1.5-3 3 1.5 3 3 3c1.5 0 3 1.5 3 3a3 3 0 0 0 6 0c0-1.5 1.5-3 3-3s3-1.5 3-3-1.5-3-3-3c-1.5 0-3-1.5-3-3a3 3 0 0 0-3-3z"/>
              </svg>
              AI Recommendations
            </h5>
            <div class="suggestions-list">
              <div v-for="suggestion in aiSuggestions" :key="suggestion.id" class="suggestion-item">
                <div class="suggestion-content">
                  <h6>{{ suggestion.title }}</h6>
                  <p>{{ suggestion.description }}</p>
                  <span class="suggestion-reason">{{ suggestion.reason }}</span>
                </div>
                <div class="suggestion-actions">
                  <button @click="applySuggestion(suggestion)" class="suggestion-btn apply">Apply</button>
                  <button @click="dismissSuggestion(suggestion)" class="suggestion-btn dismiss">Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Review & Generate -->
        <div v-if="currentStep === 3" class="step-panel">
          <h4 class="panel-title">Review & Generate Contract</h4>
          <p class="panel-description">Review your contract configuration and generate the final document</p>

          <div class="review-sections">
            <div class="review-section">
              <h5>Contract Summary</h5>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="summary-label">Type:</span>
                  <span class="summary-value">{{ selectedType?.name }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Title:</span>
                  <span class="summary-value">{{ contractData.title }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Parties:</span>
                  <span class="summary-value">{{ contractData.companyName }} & {{ contractData.counterpartyName }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Value:</span>
                  <span class="summary-value">{{ contractData.currency }} {{ formatValue(contractData.value) }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Duration:</span>
                  <span class="summary-value">{{ formatDateRange(contractData.startDate, contractData.endDate) }}</span>
                </div>
              </div>
            </div>

            <div class="review-section">
              <h5>Selected Clauses</h5>
              <div class="selected-clauses">
                <div v-for="clause in selectedClauses" :key="clause.id" class="selected-clause">
                  <div class="clause-preview">
                    <h6>{{ clause.name }}</h6>
                    <p>{{ clause.preview }}</p>
                  </div>
                  <span :class="['clause-risk-indicator', clause.riskLevel]">{{ clause.riskLevel }}</span>
                </div>
              </div>
            </div>

            <div class="review-section">
              <h5>Generation Options</h5>
              <div class="generation-options">
                <div class="option-group">
                  <label class="option-label">
                    <input type="checkbox" v-model="generationOptions.includeSignatureBlocks">
                    Include signature blocks
                  </label>
                </div>
                <div class="option-group">
                  <label class="option-label">
                    <input type="checkbox" v-model="generationOptions.generateDocx">
                    Generate Word document
                  </label>
                </div>
                <div class="option-group">
                  <label class="option-label">
                    <input type="checkbox" v-model="generationOptions.generatePdf">
                    Generate PDF version
                  </label>
                </div>
                <div class="option-group">
                  <label class="option-label">
                    <input type="checkbox" v-model="generationOptions.enableTracking">
                    Enable change tracking
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Risk Assessment -->
          <div class="risk-assessment">
            <h5>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              AI Risk Assessment
            </h5>
            <div class="risk-summary">
              <div class="risk-score" :class="getRiskScoreClass(overallRiskScore)">
                <div class="score-value">{{ overallRiskScore }}</div>
                <div class="score-label">Risk Score</div>
              </div>
              <div class="risk-details">
                <div v-for="risk in riskFactors" :key="risk.factor" class="risk-factor">
                  <span class="factor-name">{{ risk.factor }}</span>
                  <span :class="['factor-level', risk.level]">{{ risk.level }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="wizard-navigation">
        <button 
          @click="previousStep" 
          :disabled="currentStep === 0"
          class="nav-btn secondary"
        >
          Previous
        </button>
        <div class="step-info">
          Step {{ currentStep + 1 }} of {{ wizardSteps.length }}
        </div>
        <button 
          v-if="currentStep < wizardSteps.length - 1"
          @click="nextStep" 
          :disabled="!canProceed"
          class="nav-btn primary"
        >
          Next
        </button>
        <button 
          v-else
          @click="generateContract" 
          :disabled="!canProceed"
          class="nav-btn primary generate"
        >
          Generate Contract
        </button>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="modal-overlay" @click="showPreview = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>Contract Preview</h3>
          <div class="preview-actions">
            <button @click="downloadPreview" class="btn btn-secondary btn-small">Download</button>
            <button @click="editContract" class="btn btn-primary btn-small">Edit</button>
            <button @click="showPreview = false" class="close-btn">✕</button>
          </div>
        </div>
        <div class="modal-body">
          <div class="contract-preview">
            <div class="contract-header">
              <h1>{{ contractData.title || 'Contract Title' }}</h1>
              <div class="contract-meta">
                <p>Between {{ contractData.companyName || '[Company Name]' }} and {{ contractData.counterpartyName || '[Counterparty Name]' }}</p>
                <p>Effective Date: {{ formatDate(contractData.startDate) || '[Start Date]' }}</p>
              </div>
            </div>
            
            <div class="contract-body">
              <div v-for="clause in selectedClauses" :key="clause.id" class="contract-clause">
                <h3>{{ clause.name }}</h3>
                <div class="clause-content" v-html="clause.generatedContent"></div>
              </div>
            </div>
            
            <div v-if="generationOptions.includeSignatureBlocks" class="signature-blocks">
              <div class="signature-block">
                <h4>{{ contractData.companyName || '[Company Name]' }}</h4>
                <div class="signature-line">
                  <span>Signature: _________________________</span>
                </div>
                <div class="signature-details">
                  <span>Name: _________________________</span>
                  <span>Title: _________________________</span>
                  <span>Date: _________________________</span>
                </div>
              </div>
              
              <div class="signature-block">
                <h4>{{ contractData.counterpartyName || '[Counterparty Name]' }}</h4>
                <div class="signature-line">
                  <span>Signature: _________________________</span>
                </div>
                <div class="signature-details">
                  <span>Name: _________________________</span>
                  <span>Title: _________________________</span>
                  <span>Date: _________________________</span>
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
const currentStep = ref(0)
const showPreview = ref(false)
const selectedType = ref(null)
const expandedCategories = ref(['Essential Terms'])

// Wizard steps
const wizardSteps = [
  { title: 'Contract Type', description: 'Select contract template' },
  { title: 'Basic Info', description: 'Enter party details' },
  { title: 'Clauses', description: 'Configure terms' },
  { title: 'Review', description: 'Generate contract' }
]

// Contract types
const contractTypes = ref([
  {
    id: 'saas',
    name: 'SaaS Agreement',
    description: 'Software as a Service subscription agreement',
    icon: '☁️',
    complexity: 'Medium',
    avgTime: '15 min',
    typicalUse: 'Software licensing and cloud services',
    keyClauses: ['Service Level', 'Data Privacy', 'Payment Terms'],
    compliance: ['GDPR', 'SOC 2', 'Privacy Shield']
  },
  {
    id: 'msa',
    name: 'Master Service Agreement',
    description: 'Comprehensive framework for ongoing services',
    icon: '🤝',
    complexity: 'High',
    avgTime: '25 min',
    typicalUse: 'Long-term service relationships',
    keyClauses: ['Scope of Work', 'Liability', 'Intellectual Property'],
    compliance: ['Industry Standards', 'Regulatory Requirements']
  },
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement',
    description: 'Confidentiality and information protection',
    icon: '🔒',
    complexity: 'Low',
    avgTime: '8 min',
    typicalUse: 'Protecting confidential information',
    keyClauses: ['Confidentiality', 'Non-Disclosure', 'Return of Information'],
    compliance: ['Trade Secret Laws', 'Privacy Regulations']
  },
  {
    id: 'employment',
    name: 'Employment Agreement',
    description: 'Employee terms and conditions',
    icon: '👤',
    complexity: 'Medium',
    avgTime: '18 min',
    typicalUse: 'Hiring new employees',
    keyClauses: ['Compensation', 'Benefits', 'Termination'],
    compliance: ['Employment Law', 'Equal Opportunity']
  }
])

// Form data
const contractData = ref({
  companyName: '',
  counterpartyName: '',
  counterpartyType: '',
  industry: '',
  title: '',
  value: null,
  currency: 'USD',
  startDate: '',
  endDate: '',
  description: ''
})

// Clause categories
const clauseCategories = ref([
  {
    name: 'Essential Terms',
    clauses: [
      {
        id: 'parties',
        name: 'Parties and Effective Date',
        description: 'Identifies contracting parties and when the agreement takes effect',
        enabled: true,
        customizable: false,
        riskLevel: 'low',
        preview: 'This Agreement is entered into between [Company] and [Counterparty]...'
      },
      {
        id: 'scope',
        name: 'Scope of Services',
        description: 'Defines the services or products to be provided',
        enabled: true,
        customizable: true,
        riskLevel: 'medium',
        parameters: [
          { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Software', 'Consulting', 'Products'], value: '' },
          { name: 'deliverables', label: 'Key Deliverables', type: 'text', placeholder: 'List main deliverables', value: '' }
        ],
        preview: 'The services to be provided include [scope details]...'
      }
    ]
  },
  {
    name: 'Financial Terms',
    clauses: [
      {
        id: 'payment',
        name: 'Payment Terms',
        description: 'Specifies payment amounts, schedule, and methods',
        enabled: true,
        customizable: true,
        riskLevel: 'medium',
        parameters: [
          { name: 'paymentSchedule', label: 'Payment Schedule', type: 'select', options: ['Monthly', 'Quarterly', 'Annually'], value: 'Monthly' },
          { name: 'paymentMethod', label: 'Payment Method', type: 'select', options: ['Wire Transfer', 'Check', 'ACH'], value: 'Wire Transfer' },
          { name: 'lateFees', label: 'Late Fee (%)', type: 'number', placeholder: '1.5', value: 1.5 }
        ],
        preview: 'Payment shall be made [payment schedule] via [payment method]...'
      }
    ]
  },
  {
    name: 'Risk & Liability',
    clauses: [
      {
        id: 'limitation',
        name: 'Limitation of Liability',
        description: 'Limits financial exposure for both parties',
        enabled: false,
        customizable: true,
        riskLevel: 'high',
        parameters: [
          { name: 'capAmount', label: 'Liability Cap', type: 'select', options: ['Contract Value', 'Annual Fees', 'Fixed Amount'], value: 'Contract Value' },
          { name: 'excludedDamages', label: 'Excluded Damages', type: 'text', placeholder: 'Consequential, indirect damages', value: '' }
        ],
        preview: 'Liability shall be limited to [cap amount] excluding [excluded damages]...'
      }
    ]
  }
])

// Generation options
const generationOptions = ref({
  includeSignatureBlocks: true,
  generateDocx: true,
  generatePdf: false,
  enableTracking: true
})

// AI suggestions
const aiSuggestions = ref([
  {
    id: 1,
    title: 'Add Data Privacy Clause',
    description: 'Recommended for SaaS agreements to ensure GDPR compliance',
    reason: 'Based on contract type and industry standards',
    type: 'add_clause'
  },
  {
    id: 2,
    title: 'Strengthen Termination Terms',
    description: 'Consider adding mutual termination rights with 30-day notice',
    reason: 'Common practice for this contract type',
    type: 'modify_clause'
  }
])

// Risk assessment
const overallRiskScore = ref(65)
const riskFactors = ref([
  { factor: 'Financial Exposure', level: 'medium' },
  { factor: 'Regulatory Compliance', level: 'low' },
  { factor: 'Intellectual Property', level: 'high' },
  { factor: 'Termination Rights', level: 'medium' }
])

// Computed
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return selectedType.value !== null
    case 1:
      return contractData.value.companyName && contractData.value.counterpartyName && contractData.value.title
    case 2:
      return true // Can always proceed from clause configuration
    case 3:
      return true // Can always proceed from review
    default:
      return false
  }
})

const selectedClauses = computed(() => {
  const clauses = []
  clauseCategories.value.forEach(category => {
    category.clauses.forEach(clause => {
      if (clause.enabled) {
        clauses.push({
          ...clause,
          generatedContent: generateClauseContent(clause)
        })
      }
    })
  })
  return clauses
})

// Methods
function selectContractType(type) {
  selectedType.value = type
  // Auto-fill contract title
  if (!contractData.value.title) {
    contractData.value.title = type.name
  }
}

function toggleCategory(categoryName) {
  const index = expandedCategories.value.indexOf(categoryName)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryName)
  }
}

function applySuggestion(suggestion) {
  console.log('Applying suggestion:', suggestion.title)
  // Remove from suggestions list
  const index = aiSuggestions.value.indexOf(suggestion)
  if (index > -1) {
    aiSuggestions.value.splice(index, 1)
  }
}

function dismissSuggestion(suggestion) {
  const index = aiSuggestions.value.indexOf(suggestion)
  if (index > -1) {
    aiSuggestions.value.splice(index, 1)
  }
}

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function nextStep() {
  if (currentStep.value < wizardSteps.length - 1 && canProceed.value) {
    currentStep.value++
  }
}

function generateContract() {
  console.log('Generating contract with data:', {
    type: selectedType.value,
    data: contractData.value,
    clauses: selectedClauses.value,
    options: generationOptions.value
  })
  
  showPreview.value = true
}

function previewContract() {
  showPreview.value = true
}

function saveTemplate() {
  console.log('Saving as template...')
}

function downloadPreview() {
  console.log('Downloading contract preview...')
}

function editContract() {
  console.log('Opening contract editor...')
  showPreview.value = false
}

function formatValue(value) {
  if (!value) return '0'
  return new Intl.NumberFormat().format(value)
}

function formatDate(date) {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))
}

function formatDateRange(startDate, endDate) {
  if (!startDate && !endDate) return 'Not specified'
  if (!endDate) return `From ${formatDate(startDate)}`
  if (!startDate) return `Until ${formatDate(endDate)}`
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

function getRiskScoreClass(score) {
  if (score >= 80) return 'high'
  if (score >= 60) return 'medium'
  return 'low'
}

function generateClauseContent(clause) {
  // Mock content generation based on clause parameters
  let content = clause.preview
  
  if (clause.parameters) {
    clause.parameters.forEach(param => {
      const placeholder = `[${param.name}]`
      content = content.replace(placeholder, param.value || `[${param.label}]`)
    })
  }
  
  return content
}

onMounted(() => {
  // Initialize expanded categories
  expandedCategories.value = ['Essential Terms']
})
</script>

<style scoped>
.contract-generator {
  /* Inherits styles from parent */
}

.generator-header {
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

.generation-wizard {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
}

.wizard-steps {
  display: flex;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem;
  gap: 1rem;
  overflow-x: auto;
}

.wizard-step {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 200px;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.wizard-step.active,
.wizard-step.completed {
  opacity: 1;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.wizard-step.active .step-indicator {
  background: var(--primary-accent);
  border-color: var(--primary-accent);
  color: white;
}

.wizard-step.completed .step-indicator {
  background: var(--health-excellent);
  border-color: var(--health-excellent);
  color: white;
}

.step-content h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.step-content p {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.wizard-content {
  padding: 2rem;
}

.step-panel {
  max-width: 800px;
  margin: 0 auto;
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.panel-description {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.contract-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.contract-type-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contract-type-card:hover {
  border-color: var(--primary-accent);
  transform: translateY(-2px);
}

.contract-type-card.selected {
  border-color: var(--primary-accent);
  background: rgba(124, 58, 237, 0.1);
}

.type-icon {
  font-size: 2rem;
  text-align: center;
}

.type-content h5 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.type-content p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.type-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
}

.complexity {
  color: var(--secondary-accent);
  font-weight: 500;
}

.avg-time {
  color: var(--text-secondary);
}

.selected-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 24px;
  height: 24px;
  background: var(--primary-accent);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.type-details {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.type-details h5 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.details-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
}

.detail-label {
  color: var(--text-secondary);
  min-width: 100px;
  font-weight: 500;
}

.detail-value {
  color: var(--text-primary);
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

.form-section h5 {
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

.value-input-group {
  display: flex;
  gap: 0.5rem;
}

.currency-select {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.75rem;
  border-radius: 8px;
  min-width: 80px;
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

.clause-categories {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.clause-category {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.category-header h5 {
  color: var(--text-primary);
  font-weight: 600;
}

.category-toggle {
  color: var(--text-secondary);
  font-size: 1.25rem;
  font-weight: 600;
}

.category-content {
  padding: 1rem 1.5rem;
}

.clause-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.clause-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  gap: 1rem;
}

.clause-info {
  flex: 1;
}

.clause-info h6 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.clause-info p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.clause-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.clause-toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.clause-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--border-color);
  border-radius: 24px;
  transition: 0.3s;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

.clause-toggle input:checked + .toggle-slider {
  background: var(--primary-accent);
}

.clause-toggle input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.clause-risk {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.clause-risk.low {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.clause-risk.medium {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.clause-risk.high {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.clause-customization {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid var(--border-color);
}

.param-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.param-label {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.875rem;
}

.param-input,
.param-select {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.ai-suggestions {
  background: rgba(124, 58, 237, 0.05);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
}

.ai-suggestions h5 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  gap: 1rem;
}

.suggestion-content {
  flex: 1;
}

.suggestion-content h6 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.suggestion-content p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.suggestion-reason {
  color: var(--secondary-accent);
  font-size: 0.75rem;
  font-style: italic;
}

.suggestion-actions {
  display: flex;
  gap: 0.5rem;
}

.suggestion-btn {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.suggestion-btn.apply {
  background: var(--primary-accent);
  color: white;
}

.suggestion-btn.dismiss {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.review-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
}

.review-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.review-section h5 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
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

.summary-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.summary-value {
  color: var(--text-primary);
  font-weight: 600;
}

.selected-clauses {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.selected-clause {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  gap: 1rem;
}

.clause-preview {
  flex: 1;
}

.clause-preview h6 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.clause-preview p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.clause-risk-indicator {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.clause-risk-indicator.low {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.clause-risk-indicator.medium {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.clause-risk-indicator.high {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.generation-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-group {
  display: flex;
  align-items: center;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
  cursor: pointer;
}

.option-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary-accent);
}

.risk-assessment {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.risk-assessment h5 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.risk-summary {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.risk-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 12px;
  min-width: 100px;
}

.risk-score.low {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.risk-score.medium {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.risk-score.high {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.score-value {
  font-size: 2rem;
  font-weight: 700;
}

.score-label {
  font-size: 0.875rem;
  font-weight: 500;
}

.risk-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.risk-factor {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.factor-name {
  color: var(--text-primary);
}

.factor-level {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.factor-level.low {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.factor-level.medium {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.factor-level.high {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.wizard-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn.primary {
  background: var(--primary-accent);
  color: white;
}

.nav-btn.primary.generate {
  background: var(--secondary-accent);
}

.nav-btn.secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.step-info {
  color: var(--text-secondary);
  font-size: 0.875rem;
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

.preview-actions {
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

.contract-preview {
  background: white;
  color: black;
  padding: 3rem;
  border-radius: 8px;
  font-family: 'Times New Roman', serif;
  line-height: 1.6;
}

.contract-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #333;
}

.contract-header h1 {
  color: #333;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.contract-meta p {
  color: #666;
  margin-bottom: 0.5rem;
}

.contract-body {
  margin-bottom: 3rem;
}

.contract-clause {
  margin-bottom: 2rem;
}

.contract-clause h3 {
  color: #333;
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.clause-content {
  color: #333;
  text-align: justify;
}

.signature-blocks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 4rem;
}

.signature-block h4 {
  color: #333;
  font-weight: bold;
  margin-bottom: 2rem;
  text-transform: uppercase;
}

.signature-line {
  margin-bottom: 1rem;
}

.signature-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 768px) {
  .generator-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .wizard-steps {
    flex-direction: column;
  }

  .wizard-step {
    min-width: auto;
  }

  .wizard-content {
    padding: 1rem;
  }

  .contract-types-grid {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .risk-summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .wizard-navigation {
    flex-direction: column;
    gap: 1rem;
  }

  .signature-blocks {
    grid-template-columns: 1fr;
  }
}
</style>