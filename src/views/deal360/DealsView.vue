<template>
  <div class="deals-view">
    <!-- Header -->
    <div class="deals-header">
      <div class="header-content">
        <h2 class="heading-secondary">Deal Pipeline</h2>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary">+ New Deal</button>
        <button class="btn btn-secondary">Import Deals</button>
      </div>
    </div>

    <!-- Top Stats (only this block) -->
    <div class="top-stats">
      <div class="stat-card">
        <div class="stat-icon pipeline"></div>
        <div class="stat-content">
          <div class="stat-value">${{ formatCurrency(totalPipelineValue) }}K</div>
          <div class="stat-label">Total Pipeline Value</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon active-deals"></div>
        <div class="stat-content">
          <div class="stat-value">{{ activeCount }}</div>
          <div class="stat-label">Active Deals</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon conversion"></div>
        <div class="stat-content">
          <div class="stat-value">33%</div>
          <div class="stat-label">Conversion Rate</div>
        </div>
      </div>
    </div>

    <!-- Pipeline Table -->
    <div class="pipeline-section">
      <h3 class="section-title">Deals Pipeline</h3>
      <div class="header-filters">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search deals..."
          class="search-input"
        />
        <select v-model="statusFilter" class="filter-select">
          <option value="all">All Status</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
        <select v-model="assignedFilter" class="filter-select">
          <option value="all">All Assigned To</option>
          <option value="Sarah Johnson">Sarah Johnson</option>
          <option value="John Smith">John Smith</option>
        </select>
        <select v-model="typeFilter" class="filter-select">
          <option value="all">All Types</option>
          <option value="vendor">Vendor Facing</option>
          <option value="customer">Customer Facing</option>
        </select>
      </div>

      <div class="deals-table-container">
        <table class="deals-table">
          <colgroup>
            <col style="width: 120px" /> <!-- Deal ID -->
            <col style="width: 140px" /> <!-- Initial Contact -->
            <col style="width: 140px" /> <!-- Deal Type -->
            <col style="width: 140px" /> <!-- Scope -->
            <col style="width: 150px" /> <!-- Contact Name -->
            <col style="width: 150px" /> <!-- Company -->
            <col style="width: 150px" /> <!-- Assigned To -->
            <col style="width: 120px" /> <!-- Phone -->
            <col style="width: 200px" /> <!-- Email -->
            <col style="width: 120px" /> <!-- Source -->
            <col style="width: 100px" /> <!-- Est. Value -->
            <col style="width: 140px" /> <!-- Proposal Sent -->
            <col style="width: 120px" /> <!-- Contract ID -->
            <col style="width: 100px" /> <!-- Status -->
            <col style="width: 80px" />  <!-- Actions -->
          </colgroup>
          <thead>
            <tr>
              <th @click="sortBy('deal_id')" class="sortable">
                Deal ID <span v-if="sortKey==='deal_id'">{{ sortAsc?'▲':'▼' }}</span>
              </th>
              <th @click="sortBy('initial_contact_on')" class="sortable">
                Initial Contact <span v-if="sortKey==='initial_contact_on'">{{ sortAsc?'▲':'▼' }}</span>
              </th>
              <th @click="sortBy('deal_type')" class="sortable">
                Deal Type <span v-if="sortKey==='deal_type'">{{ sortAsc?'▲':'▼' }}</span>
              </th>
              <th @click="sortBy('scope')" class="sortable">
                Scope <span v-if="sortKey==='scope'">{{ sortAsc?'▲':'▼' }}</span>
              </th>
              <th @click="sortBy('contact_name')" class="sortable">
                Contact Name <span v-if="sortKey==='contact_name'">{{ sortAsc?'▲':'▼' }}</span>
              </th>
              <th @click="sortBy('company')" class="sortable">
                Company <span v-if="sortKey==='company'">{{ sortAsc?'▲':'▼' }}</span>
              </th>
              <th @click="sortBy('assigned_to')" class="sortable">
                Assigned To <span v-if="sortKey==='assigned_to'">{{ sortAsc?'▲':'▼' }}</span>
              </th>
              <th @click="sortBy('phone')" class="sortable">
                Phone <span v-if="sortKey==='phone'">{{ sortAsc?'▲':'▼' }}</span>
              </th>
              <th @click="sortBy('email')" class="sortable">
                Email <span v-if="sortKey==='email'">{{ sortAsc?'▲':'▼' }}</span>
              </th>
              <th @click="sortBy('source')" class="sortable">
                Source <span v-if="sortKey==='source'">{{ sortAsc?'▲':'▼' }}</span>
              </th>
              <th @click="sortBy('est_value')" class="sortable">
                Est. Value <span v-if="sortKey==='est_value'">{{ sortAsc?'▲':'▼' }}</span>
              </th>
              <th @click="sortBy('proposal_sent_on')" class="sortable">
                Proposal Sent <span v-if="sortKey==='proposal_sent_on'">{{ sortAsc?'▲':'▼' }}</span>
              </th>
              <th @click="sortBy('contract_id')" class="sortable">
                Contract ID <span v-if="sortKey==='contract_id'">{{ sortAsc?'▲':'▼' }}</span>
              </th>
              <th @click="sortBy('status')" class="sortable">
                Status <span v-if="sortKey==='status'">{{ sortAsc?'▲':'▼' }}</span>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="deal in filteredDeals" :key="deal.id" class="deal-row">
              <td>
                <button 
                  @click="openDealModal(deal)" 
                  class="deal-id-btn"
                  :title="'View deal ' + deal.deal_id"
                >
                  {{ deal.deal_id }}
                </button>
              </td>
              <td><span class="date-text">{{ formatDate(deal.initial_contact_on) }}</span></td>
              <td>
                <span :class="['type-badge','type-'+deal.deal_type]">
                  {{ deal.deal_type==='vendor'?'Vendor':'Customer' }}
                </span>
              </td>
              <td><span class="scope-badge">{{ deal.scope }}</span></td>
              <td><span class="contact-name">{{ deal.contact_name }}</span></td>
              <td><span class="company-name">{{ deal.company }}</span></td>
              <td><span class="assigned-name">{{ deal.assigned_to }}</span></td>
              <td><span class="phone-text">{{ deal.phone }}</span></td>
              <td><span class="email-text">{{ deal.email }}</span></td>
              <td>
                <span :class="['source-badge','source-'+deal.source.toLowerCase().replace(/ /g,'-')]">
                  {{ deal.source }}
                </span>
              </td>
              <td><span class="value-text">${{ formatCurrency(deal.est_value) }}K</span></td>
              <td><span class="date-text">{{ formatDate(deal.proposal_sent_on) }}</span></td>
              <td>
                <button 
                  v-if="deal.contract_id" 
                  @click="viewContract(deal.contract_id)" 
                  class="contract-link-btn"
                  :title="'View contract ' + deal.contract_id"
                >
                  {{ deal.contract_id }}
                </button>
                <span v-else class="no-contract">—</span>
              </td>
              <td>
                <span :class="['status-badge', deal.status==='won'?'status-qualified':'status-rejected']">
                  {{ deal.status.toUpperCase() }}
                </span>
              </td>
              <td>
                <button @click="openDealModal(deal)" class="action-btn view">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Deal Detail Modal -->
    <div v-if="showDealModal" class="modal-overlay" @click="closeDealModal">
      <div class="modal-content deal-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">
            <div class="deal-info">
              <span class="deal-id">{{ selectedDeal.deal_id }}</span>
              <span class="deal-company">{{ selectedDeal.company }}</span>
            </div>
            <div class="last-update">Last Update: a while ago</div>
          </div>
          <!-- Win/Loss buttons at top -->
          <div class="deal-status-controls">
            <button 
              @click="updateDealStatus('won')"
              :class="['status-btn', 'won-btn', { active: selectedDeal.status === 'won' }]"
            >
              Mark as Won
            </button>
            <button 
              @click="updateDealStatus('lost')"
              :class="['status-btn', 'lost-btn', { active: selectedDeal.status === 'lost' }]"
            >
              Mark as Lost
            </button>
          </div>
          <button @click="closeDealModal" class="close-btn">×</button>
        </div>

        <div class="modal-tabs">
          <button 
            :class="['tab-btn', { active: activeTab === 'overview' }]" 
            @click="activeTab = 'overview'"
          >
            Overview
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'timeline' }]" 
            @click="activeTab = 'timeline'"
          >
            Timeline
          </button>
        </div>

        <div class="modal-body">
          <div v-if="activeTab === 'overview'" class="overview-content">
            <div class="deal-progress">
              <div class="progress-header">
                <div class="stage-info">
                  <span class="current-stage">{{ getDealStage(selectedDeal) }}</span>
                </div>
                <div class="dates">
                  <div class="start-date">
                    <span class="label">START</span>
                    <span class="date">{{ formatDate(selectedDeal.initial_contact_on) }}</span>
                  </div>
                  <div class="closing-date">
                    <span class="label">CLOSING</span>
                    <span class="date">{{ getClosingDate(selectedDeal) }}</span>
                  </div>
                </div>
              </div>

              <div class="progress-stages">
                <div class="stage active">1. Lead Generation</div>
                <div class="stage active">2. Lead Qualification</div>
                <div class="stage active">3. Deal Negotiation</div>
                <div class="stage current">4. Contract Generation</div>
                <div class="stage">5. Contract Review</div>
                <div class="stage">6. Contract Execution</div>
              </div>
            </div>

            <div class="deal-details-grid">
              <div class="detail-section">
                <h4>Deal Information</h4>
                <div class="detail-item">
                  <span class="label">Deal Owner</span>
                  <span class="value">{{ selectedDeal.assigned_to }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Deal Type</span>
                  <span class="value">{{ selectedDeal.deal_type === 'vendor' ? 'Vendor Facing' : 'Customer Facing' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Scope</span>
                  <span class="value">{{ selectedDeal.scope }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Source</span>
                  <span class="value">{{ selectedDeal.source }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Expected Revenue</span>
                  <span class="value">${{ formatCurrency(selectedDeal.est_value * 1000) }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Status</span>
                  <span class="value">{{ selectedDeal.status.toUpperCase() }}</span>
                </div>
              </div>

              <div class="detail-section">
                <h4>Contact Information</h4>
                <div class="contact-card">
                  <div class="contact-avatar">
                    {{ selectedDeal.contact_name.split(' ').map(n => n[0]).join('') }}
                  </div>
                  <div class="contact-details">
                    <div class="contact-name">{{ selectedDeal.contact_name }}</div>
                    <div class="contact-company">at {{ selectedDeal.company }}</div>
                    <div class="contact-email">{{ selectedDeal.email }}</div>
                    <div class="contact-phone">{{ selectedDeal.phone }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="contract-section" v-if="selectedDeal.contract_id">
              <h4>Related Contract</h4>
              <button 
                @click="viewContract(selectedDeal.contract_id)" 
                class="contract-link"
              >
                {{ selectedDeal.contract_id }} - View Contract Details
              </button>
            </div>
          </div>

          <div v-if="activeTab === 'timeline'" class="timeline-content">
            <div class="timeline-item">
              <div class="timeline-date">{{ formatDate(selectedDeal.initial_contact_on) }}</div>
              <div class="timeline-event">Initial contact made</div>
            </div>
            <div class="timeline-item" v-if="selectedDeal.proposal_sent_on">
              <div class="timeline-date">{{ formatDate(selectedDeal.proposal_sent_on) }}</div>
              <div class="timeline-event">Proposal sent</div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-secondary" @click="closeDealModal">Close</button>
          <button class="btn-secondary" @click="editDeal">Edit Deal</button>
          <button class="btn-primary generate-contract" @click="generateContract">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            Generate Contract
          </button>
        </div>
      </div>
    </div>

    <!-- Contract Generator Modal -->
    <div v-if="showContractGenerator" class="modal-overlay" @click="closeContractGenerator">
      <div class="modal-content large contract-generator-modal" @click.stop>
        <div class="modal-header">
          <h3>Contract Generator</h3>
          <button @click="closeContractGenerator" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <!-- Contract Generator Component would be imported and used here -->
          <div class="contract-generator-placeholder">
            <div class="generator-header">
              <div class="header-content">
                <h3 class="heading-tertiary">Contract Generator</h3>
                <p class="text-body">AI-powered contract creation with intelligent templates and clause suggestions</p>
              </div>
            </div>
            
            <!-- Pre-filled information from deal -->
            <div class="deal-prefill-info">
              <h4>Deal Information (Pre-filled)</h4>
              <div class="prefill-grid">
                <div class="prefill-item">
                  <span class="label">Deal ID:</span>
                  <span class="value">{{ selectedDeal?.deal_id }}</span>
                </div>
                <div class="prefill-item">
                  <span class="label">Company:</span>
                  <span class="value">{{ selectedDeal?.company }}</span>
                </div>
                <div class="prefill-item">
                  <span class="label">Contact:</span>
                  <span class="value">{{ selectedDeal?.contact_name }}</span>
                </div>
                <div class="prefill-item">
                  <span class="label">Deal Value:</span>
                  <span class="value">${{ formatCurrency(selectedDeal?.est_value * 1000) }}</span>
                </div>
              </div>
            </div>
            
            <div class="generator-actions">
              <button class="btn btn-secondary" @click="closeContractGenerator">Cancel</button>
              <button class="btn btn-primary" @click="openFullContractGenerator">
                Open Full Contract Generator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const deals = ref([
  {
    id: 1,
    deal_id: 'DEAL-001',
    contact_name: 'John Smith',
    company: 'TechCorp Solutions',
    assigned_to: 'Sarah Johnson',
    phone: '555-0123',
    email: 'john.smith@techcorp.com',
    source: 'Website',
    est_value: 250,
    initial_contact_on: new Date('2024-11-15'),
    proposal_sent_on: new Date('2024-11-20'),
    deal_type: 'vendor',
    scope: 'Field Services',
    status: 'won',
    contract_id: 'CTR-2024-002'
  },
  {
    id: 2,
    deal_id: 'DEAL-002',
    contact_name: 'Sarah Johnson',
    company: 'Global Healthcare Inc',
    assigned_to: 'John Smith',
    phone: '555-0456',
    email: 'sarah.j@globalhealthcare.com',
    source: 'Referral',
    est_value: 480,
    initial_contact_on: new Date('2024-11-18'),
    proposal_sent_on: new Date('2024-11-25'),
    deal_type: 'customer',
    scope: 'Product Supply',
    status: '',
    contract_id: 'CTR-2024-003'
  }
])

// Modal state
const showDealModal = ref(false)
const showContractGenerator = ref(false)
const selectedDeal = ref(null)
const activeTab = ref('overview')

// filters & sort
const searchQuery = ref('')
const statusFilter  = ref('all')
const assignedFilter = ref('all')
const typeFilter = ref('all')
const sortKey   = ref('')
const sortAsc   = ref(true)

function sortBy(key) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else { sortKey.value = key; sortAsc.value = true }
}

const filteredDeals = computed(() =>
  deals.value
    .filter(d => statusFilter.value === 'all' || d.status === statusFilter.value)
    .filter(d => assignedFilter.value === 'all' || d.assigned_to === assignedFilter.value)
    .filter(d => typeFilter.value === 'all'     || d.deal_type === typeFilter.value)
    .filter(d => {
      const q = searchQuery.value.toLowerCase()
      if (!q) return true
      return ['contact_name','company','email','phone','contract_id','deal_id']
        .some(f => String(d[f]).toLowerCase().includes(q))
    })
    .sort((a, b) => {
      if (!sortKey.value) return 0
      const A = a[sortKey.value], B = b[sortKey.value]
      if (A == null) return 1
      if (B == null) return -1
      return A < B ? (sortAsc.value ? -1 : 1) : A > B ? (sortAsc.value ? 1 : -1) : 0
    })
)

const totalPipelineValue = computed(() =>
  deals.value
    .filter(d => d.status !== 'lost')
    .reduce((sum, d) => sum + d.est_value, 0)
)

const activeCount = computed(() =>
  deals.value.filter(d => d.status === 'won').length
)

function formatDate(d) {
  return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(d)
}
function formatCurrency(v) {
  return new Intl.NumberFormat('en-US').format(v)
}

// Modal functions
function openDealModal(deal) {
  selectedDeal.value = deal
  showDealModal.value = true
  activeTab.value = 'overview'
}

function closeDealModal() {
  showDealModal.value = false
  selectedDeal.value = null
}

function getDealStage(deal) {
  if (deal.status === 'won') return '6. Contract Execution'
  if (deal.status === 'lost') return 'Deal Lost'
  if (deal.contract_id) return '5. Contract Review'
  return '4. Contract Generation'
}

function getDealProbability(deal) {
  if (deal.status === 'won') return 100
  if (deal.status === 'lost') return 0
  return 75
}

function getClosingDate(deal) {
  const date = new Date()
  date.setDate(date.getDate() + 30)
  return formatDate(date)
}

// Deal status update function
function updateDealStatus(status) {
  if (selectedDeal.value) {
    const dealIndex = deals.value.findIndex(d => d.id === selectedDeal.value.id)
    if (dealIndex !== -1) {
      deals.value[dealIndex].status = status
      selectedDeal.value.status = status
      console.log(`Deal ${selectedDeal.value.deal_id} status updated to: ${status}`)
    }
  }
}

// Contract Generator functions
function generateContract() {
  showContractGenerator.value = true
}

function closeContractGenerator() {
  showContractGenerator.value = false
}

function openFullContractGenerator() {
  // Close modals and navigate to contract generator with deal data
  closeContractGenerator()
  closeDealModal()
  
  // Navigate to contract generator with pre-filled deal data
  router.push({
    path: '/legal-hub/contract-generator',
    query: {
      dealId: selectedDeal.value?.deal_id,
      company: selectedDeal.value?.company,
      contact: selectedDeal.value?.contact_name,
      email: selectedDeal.value?.email,
      value: selectedDeal.value?.est_value * 1000
    }
  })
}

function editDeal() {
  console.log('Edit deal functionality would go here')
}

// Navigation function to Legal Hub - Contracts Management
function viewContract(contractId) {
  router.push(`/legal-hub/contracts?contractId=${contractId}`)
  console.log('Navigating to contract:', contractId)
}

// Function to handle incoming deal ID from URL params
function openDealFromId(dealId) {
  const deal = deals.value.find(d => d.deal_id === dealId)
  if (deal) {
    openDealModal(deal)
  }
}

// Check for dealId in URL params on component mount
import { onMounted } from 'vue'
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const dealId = urlParams.get('dealId')
  if (dealId) {
    openDealFromId(dealId)
  }
})
</script>

<style scoped>
/* Existing styles... */
.deals-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.header-actions .btn {
  margin-left: 1rem;
}

.top-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px,1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
}
.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Filters */
.header-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
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
  min-width: 140px;
}

/* Table */
.deals-table-container {
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow-x: auto;
}
.deals-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  min-width: 1520px; /* Increased to accommodate Deal ID column */
}
.deals-table th,
.deals-table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.deals-table th {
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-weight: 600;
  text-align: left;
}
.sortable { cursor: pointer; }
.sortable:hover { background: rgba(255,255,255,0.05); }
.deal-row:hover { background: rgba(255,255,255,0.02); }

.contact-name,
.company-name,
.assigned-name {
  color: var(--text-primary);
  font-weight: 500;
}
.phone-text,
.email-text,
.date-text {
  color: var(--text-primary);
}
.date-text { color: var(--text-secondary); }

.source-badge,
.scope-badge,
.type-badge,
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}
.source-badge { background: rgba(59,130,246,0.1); color: #3b82f6; }
.scope-badge  { background: rgba(156,163,175,0.1); color: #9ca3af; }
.type-vendor { background: rgba(59,130,246,0.1); color: #3b82f6; }
.type-customer { background: rgba(34,197,94,0.1); color: #22c55e; }
.status-qualified { background: rgba(34,197,94,0.1); color: #22c55e; }
.status-rejected { background: rgba(239,68,68,0.1); color: #ef4444; }

/* Deal ID Button */
.deal-id-btn {
  background: var(--secondary-accent, #10b981);
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Space Grotesk', monospace;
  transition: all 0.2s ease;
}

.deal-id-btn:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

/* Contract Link Button */
.contract-link-btn {
  background: var(--primary-accent, #7c3aed);
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Space Grotesk', monospace;
  transition: all 0.2s ease;
}

.contract-link-btn:hover {
  background: #6d28d9;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
}

.no-contract {
  color: var(--text-secondary);
  font-style: italic;
}

.action-btn.view {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  background: var(--primary-accent);
  color: white;
  font-size: 0.75rem;
  cursor: pointer;
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
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  width: 90vw;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-content.large {
  max-width: 1000px;
  max-height: 95vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  flex: 1;
}

.deal-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.deal-id {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.deal-company {
  font-size: 1rem;
  color: var(--text-secondary);
}

.last-update {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Deal Status Controls */
.deal-status-controls {
  display: flex;
  gap: 0.75rem;
  margin: 0 1rem;
}

.status-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.status-btn.won-btn {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: 1px solid #22c55e;
}

.status-btn.lost-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid #ef4444;
}

.status-btn:hover {
  opacity: 1;
  transform: translateY(-1px);
}

.status-btn.active {
  opacity: 1;
  background: rgba(34, 197, 94, 0.2);
}

.status-btn.lost-btn.active {
  background: rgba(239, 68, 68, 0.2);
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.tab-btn {
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  border-bottom: 2px solid transparent;
}

.tab-btn.active {
  color: var(--text-primary);
  border-bottom-color: var(--primary-accent);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.deal-progress {
  margin-bottom: 2rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.stage-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.current-stage {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.probability {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.dates {
  display: flex;
  gap: 2rem;
}

.start-date,
.closing-date {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.dates .label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dates .date {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.progress-stages {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.stage {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  background: rgba(255,255,255,0.05);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  min-width: max-content;
}

.stage.active {
  background: rgba(34,197,94,0.1);
  color: #22c55e;
  border-color: #22c55e;
}

.stage.current {
  background: rgba(59,130,246,0.1);
  color: #3b82f6;
  border-color: #3b82f6;
}

.deal-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.detail-section {
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.detail-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item .label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.detail-item .value {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.contact-card {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.contact-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.contact-details {
  flex: 1;
}

.contact-name {
  font-size:  0.875rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.contact-company {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.contact-email,
.contact-phone {
  font-size: 0.875rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.contract-section {
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.contract-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.contract-link {
  background: var(--primary-accent);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.contract-link:hover {
  background: #6d28d9;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.timeline-date {
  font-size: 0.875rem;
  color: var(--text-secondary);
  min-width: 120px;
}

.timeline-event {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary-accent);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background: #6d28d9;
}

.btn-primary.generate-contract {
  background: var(--secondary-accent, #10b981);
}

.btn-primary.generate-contract:hover {
  background: #059669;
}

.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: rgba(255,255,255,0.05);
  color: var(--text-primary);
}

/* Contract Generator Modal Styles */
.contract-generator-modal {
  max-width: 900px;
}

.contract-generator-placeholder {
  padding: 2rem;
}

.generator-header {
  text-align: center;
  margin-bottom: 2rem;
}

.heading-tertiary {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.text-body {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.deal-prefill-info {
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.deal-prefill-info h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.prefill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.prefill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255,255,255,0.05);
  border-radius: 6px;
}

.prefill-item .label {
  color: var(--text-secondary);
  font-weight: 500;
}

.prefill-item .value {
  color: var(--text-primary);
  font-weight: 600;
}

.generator-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

/* Global variables */
:root {
  --bg-default: #1a1a1a;
  --bg-secondary: #2a2a2a;
  --bg-card: #2a2a2a;
  --border-color: #404040;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --primary-accent: #7c3aed;
  --secondary-accent: #10b981;
}

@media (max-width: 768px) {
  .deal-details-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .modal-content {
    width: 95vw;
    max-height: 95vh;
  }
  
  .progress-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .dates {
    gap: 1rem;
  }

  .deal-status-controls {
    flex-direction: column;
    gap: 0.5rem;
    margin: 0;
    margin-top: 1rem;
  }

  .prefill-grid {
    grid-template-columns: 1fr;
  }

  .progress-stages {
    flex-direction: column;
    gap: 0.25rem;
  }

  .stage {
    text-align: center;
  }
}
</style>
