<template>
  <div class="all-contracts">
    <!-- Clean header section -->
    <div class="contracts-header">
      <div class="header-left">
        <h2 class="section-title">All Contracts</h2>
        <p class="section-desc">Complete contract repository with advanced filtering and search</p>
      </div>
      <div class="header-actions">
        <select v-model="selectedView" class="view-selector">
          <option value="list">List View</option>
          <option value="kanban">Kanban</option>
        </select>
        <button class="btn-filters" @click="showFilters = !showFilters">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
          </svg>
          Filters
        </button>
      </div>
    </div>

    <!-- Search and filter chips -->
    <div class="search-section">
      <div class="search-bar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Search contracts by name, party, or contract ID..."/>
        <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">×</button>
      </div>
    </div>

    <!-- Filter chips -->
    <div class="filter-chips">
      <button 
        v-for="filter in filters" 
        :key="filter.key"
        :class="['filter-chip', { active: activeFilter === filter.key }]"
        @click="activeFilter = filter.key"
      >
        {{ filter.label }}
        <span class="chip-count">{{ filter.count }}</span>
      </button>
    </div>

    <!-- Clean table matching Deal 360° style -->
    <div class="table-container">
      <div class="table-header">
        <div class="bulk-select">
          <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
        </div>
        <div class="col-header">Contract Name</div>
        <div class="col-header">Counterparty</div>
        <div class="col-header">Type</div>
        <div class="col-header">Value</div>
        <div class="col-header">Status</div>
        <div class="col-header">Deal ID</div>
        <div class="col-header">Execution Date</div>
        <div class="col-header">Expiry</div>
        <div class="col-header">Actions</div>
      </div>

      <div class="table-body">
        <div 
          v-for="contract in filteredContracts" 
          :key="contract.id"
          class="table-row"
        >
          <div class="bulk-select">
            <input type="checkbox" :value="contract.id" v-model="selectedContracts">
          </div>
          <div class="col-data contract-name">
            <div class="name-primary">{{ contract.name }}</div>
            <div class="name-secondary">ID: {{ contract.id }}</div>
          </div>
          <div class="col-data">
            <div class="counterparty">{{ contract.counterparty }}</div>
          </div>
          <div class="col-data">
            <span class="contract-type" :class="getTypeClass(contract.type)">{{ contract.type }}</span>
          </div>
          <div class="col-data value">{{ formatCurrency(contract.value) }}</div>
          <div class="col-data">
            <span class="status-badge" :class="getStatusClass(contract.status)">{{ contract.status }}</span>
          </div>
          <div class="col-data">
            <button 
              v-if="contract.deal_id" 
              @click="viewDeal(contract.deal_id)" 
              class="deal-link-btn"
              :title="'View deal ' + contract.deal_id"
            >
              {{ contract.deal_id }}
            </button>
            <span v-else class="no-deal">—</span>
          </div>
          <div class="col-data date">{{ formatDate(contract.executionDate) }}</div>
          <div class="col-data date">{{ formatDate(contract.expiryDate) }}</div>
          <div class="col-data actions">
            <button class="action-btn" @click="viewContract(contract.id)">View</button>
            <button class="action-btn secondary" @click="editContract(contract.id)">Edit</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <div class="pagination-info">
        Showing {{ ((currentPage - 1) * pageSize) + 1 }}-{{ Math.min(currentPage * pageSize, totalContracts) }} of {{ totalContracts }} contracts
      </div>
      <div class="pagination-controls">
        <button :disabled="currentPage === 1" @click="currentPage--" class="page-btn">Previous</button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="currentPage++" class="page-btn">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Sample data - replace with your actual data source
const contracts = ref([
  {
    id: 'CTR-2024-001',
    name: 'Non-Disclosure Agreement',
    counterparty: 'Innovation Labs Inc',
    type: 'NDA',
    value: 0,
    status: 'Executed',
    executionDate: '2024-03-15',
    expiryDate: '2025-03-15',
    deal_id: 'DEAL-001'  // Links back to Deal 360°
  },
  {
    id: 'CTR-2024-002',
    name: 'Software License Agreement',
    counterparty: 'TechCorp Solutions',
    type: 'License',
    value: 250000,
    status: 'Pending Review',
    executionDate: '2024-03-10',
    expiryDate: '2025-03-10',
    deal_id: 'DEAL-002'  // Links back to Deal 360°
  },
  {
    id: 'CTR-2024-003',
    name: 'Service Level Agreement',
    counterparty: 'Global Healthcare Inc',
    type: 'SLA',
    value: 480000,
    status: 'Under Review',
    executionDate: '2024-02-20',
    expiryDate: '2025-02-20',
    deal_id: 'DEAL-003'  // Links back to Deal 360°
  }
])

// State
const searchQuery = ref('')
const activeFilter = ref('all')
const selectedView = ref('list')
const showFilters = ref(false)
const selectAll = ref(false)
const selectedContracts = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

// Filter configuration
const filters = ref([
  { key: 'all', label: 'All Contracts', count: 347 },
  { key: 'pending', label: 'Pending Review', count: 23 },
  { key: 'expiring', label: 'Expiring Soon', count: 18 },
  { key: 'high-value', label: 'High Value', count: 45 },
  { key: 'recent', label: 'Recently Added', count: 12 }
])

// Computed
const filteredContracts = computed(() => {
  let filtered = contracts.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(contract => 
      contract.name.toLowerCase().includes(query) ||
      contract.counterparty.toLowerCase().includes(query) ||
      contract.id.toLowerCase().includes(query)
    )
  }
  
  // Apply active filter logic here
  
  return filtered
})

const totalContracts = computed(() => filteredContracts.value.length)
const totalPages = computed(() => Math.ceil(totalContracts.value / pageSize.value))

// Methods
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedContracts.value = filteredContracts.value.map(c => c.id)
  } else {
    selectedContracts.value = []
  }
}

const getTypeClass = (type) => {
  const typeMap = {
    'NDA': 'type-nda',
    'License': 'type-license',
    'SLA': 'type-sla'
  }
  return typeMap[type] || 'type-default'
}

const getStatusClass = (status) => {
  const statusMap = {
    'Executed': 'status-executed',
    'Pending Review': 'status-pending',
    'Under Review': 'status-review'
  }
  return statusMap[status] || 'status-default'
}

const formatCurrency = (value) => {
  if (value === 0) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const viewContract = (id) => {
  console.log('Viewing contract:', id)
}

const editContract = (id) => {
  console.log('Editing contract:', id)
}

// Navigation function to Deal 360°
const viewDeal = (dealId) => {
  // Navigate to Deal 360° with the specific deal ID
  router.push(`/deal360/deals?dealId=${dealId}`)
}
</script>

<style scoped>
.all-contracts {
  padding: 0;
}

/* Header */
.contracts-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.section-desc {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.view-selector {
  background: var(--bg-default);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.btn-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-filters:hover {
  background: rgba(255,255,255,0.05);
}

/* Search */
.search-section {
  margin-bottom: 1rem;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-default);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  max-width: 480px;
}

.search-bar svg {
  color: var(--text-secondary);
  opacity: 0.7;
}

.search-bar input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.clear-search {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
}

/* Filter chips */
.filter-chips {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 0.5rem 0.875rem;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.875rem;
}

.filter-chip.active {
  background: rgba(255,255,255,0.05);
  color: var(--text-primary);
}

.chip-count {
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 0.125rem 0.375rem;
  font-size: 0.75rem;
}

/* Table */
.table-container {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.table-header {
  display: grid;
  grid-template-columns: 40px 2fr 1.5fr 1fr 1fr 1fr 1fr 1fr 120px;
  background: rgba(255,255,255,0.02);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 1.5rem;
  gap: 1rem;
}

.col-header {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
}

.table-body {
  max-height: 600px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 40px 2fr 1.5fr 1fr 1fr 1fr 1fr 1fr 120px;
  padding: 1rem 1.5rem;
  gap: 1rem;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: rgba(255,255,255,0.02);
}

.bulk-select input {
  accent-color: var(--primary-accent);
}

.col-data {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.contract-name .name-primary {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.contract-name .name-secondary {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.counterparty {
  color: var(--text-primary);
}

.contract-type {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.type-nda { background: rgba(99, 102, 241, 0.1); color: rgb(129, 140, 248); }
.type-license { background: rgba(16, 185, 129, 0.1); color: rgb(52, 211, 153); }
.type-sla { background: rgba(245, 158, 11, 0.1); color: rgb(251, 191, 36); }

.value {
  font-weight: 500;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-executed { background: rgba(16, 185, 129, 0.1); color: rgb(52, 211, 153); }
.status-pending { background: rgba(245, 158, 11, 0.1); color: rgb(251, 191, 36); }
.status-review { background: rgba(239, 68, 68, 0.1); color: rgb(248, 113, 113); }

.date {
  color: var(--text-secondary);
  font-size: 0.8125rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.375rem 0.75rem;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
}

.action-btn:hover {
  background: rgba(255,255,255,0.05);
}

.action-btn.secondary {
  color: var(--text-secondary);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.pagination-info {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.5rem 0.875rem;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 0.875rem;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  background: rgba(255,255,255,0.05);
}

.page-info {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 1200px) {
  .table-header,
  .table-row {
    grid-template-columns: 40px 2fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 120px;
  }
  
  .col-header:nth-child(n+8),
  .col-data:nth-child(n+8) {
    display: none;
  }
}

/* Deal Link Button */
.deal-link-btn {
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

.deal-link-btn:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.no-deal {
  color: var(--text-secondary);
  font-style: italic;
}
</style>
