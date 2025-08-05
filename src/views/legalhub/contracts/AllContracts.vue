<template>
  <div class="all-contracts">
    <!-- Header -->
    <div class="contracts-header">
      <div class="header-content">
        <h3 class="heading-tertiary">All Contracts</h3>
        <p class="text-body">Complete contract repository with advanced filtering and search</p>
      </div>
      <div class="header-actions">
        <select v-model="viewMode" class="view-selector">
          <option value="list">List View</option>
          <option value="grid">Grid View</option>
          <option value="timeline">Timeline View</option>
        </select>
        <button @click="showFilterPanel = !showFilterPanel" class="btn btn-secondary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
          </svg>
          Filters
        </button>
      </div>
    </div>

    <!-- Search and Filter Bar -->
    <div class="search-filter-bar">
      <div class="search-section">
        <div class="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search contracts by name, party, or contract ID..." 
            class="search-input"
          />
        </div>
      </div>
      
      <div class="quick-filters">
        <button 
          v-for="filter in quickFilters" 
          :key="filter.key"
          @click="applyQuickFilter(filter)"
          :class="['quick-filter-btn', { active: activeQuickFilter === filter.key }]"
        >
          {{ filter.label }}
          <span class="filter-count">{{ filter.count }}</span>
        </button>
      </div>
    </div>

    <!-- Advanced Filter Panel -->
    <div v-if="showFilterPanel" class="filter-panel">
      <div class="filter-panel-header">
        <h4>Advanced Filters</h4>
        <button @click="clearAllFilters" class="clear-filters-btn">Clear All</button>
      </div>
      <div class="filter-grid">
        <div class="filter-group">
          <label class="filter-label">Contract Type</label>
          <select v-model="filters.contractType" class="filter-select">
            <option value="">All Types</option>
            <option value="saas">SaaS Agreement</option>
            <option value="msa">Master Service Agreement</option>
            <option value="nda">Non-Disclosure Agreement</option>
            <option value="employment">Employment Agreement</option>
            <option value="vendor">Vendor Agreement</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">Status</label>
          <select v-model="filters.status" class="filter-select">
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="pending_review">Pending Review</option>
            <option value="under_negotiation">Under Negotiation</option>
            <option value="executed">Executed</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">Value Range</label>
          <div class="value-range">
            <input v-model.number="filters.minValue" type="number" placeholder="Min" class="range-input">
            <span>to</span>
            <input v-model.number="filters.maxValue" type="number" placeholder="Max" class="range-input">
          </div>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">Date Range</label>
          <div class="date-range">
            <input v-model="filters.startDate" type="date" class="date-input">
            <span>to</span>
            <input v-model="filters.endDate" type="date" class="date-input">
          </div>
        </div>
      </div>
    </div>

    <!-- Contracts Display -->
    <div v-if="viewMode === 'list'" class="contracts-list-view">
      <div class="contracts-table-container">
        <table class="contracts-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" @change="toggleSelectAll" v-model="selectAll">
              </th>
              <th @click="sortBy('name')" class="sortable">
                Contract Name
                <span v-if="sortKey === 'name'">{{ sortAsc ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortBy('counterparty')" class="sortable">
                Counterparty
                <span v-if="sortKey === 'counterparty'">{{ sortAsc ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortBy('type')" class="sortable">
                Type
                <span v-if="sortKey === 'type'">{{ sortAsc ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortBy('value')" class="sortable">
                Value
                <span v-if="sortKey === 'value'">{{ sortAsc ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortBy('status')" class="sortable">
                Status
                <span v-if="sortKey === 'status'">{{ sortAsc ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortBy('executionDate')" class="sortable">
                Execution Date
                <span v-if="sortKey === 'executionDate'">{{ sortAsc ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortBy('expiryDate')" class="sortable">
                Expiry Date
                <span v-if="sortKey === 'expiryDate'">{{ sortAsc ? '▲' : '▼' }}</span>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="contract in filteredContracts" 
              :key="contract.id" 
              class="contract-row"
              :class="{ selected: selectedContracts.includes(contract.id) }"
            >
              <td>
                <input 
                  type="checkbox" 
                  :checked="selectedContracts.includes(contract.id)"
                  @change="toggleContractSelection(contract.id)"
                >
              </td>
              <td>
                <div class="contract-name-cell">
                  <div class="contract-name">{{ contract.name }}</div>
                  <div class="contract-id">{{ contract.id }}</div>
                </div>
              </td>
              <td>
                <div class="counterparty-info">
                  <div class="party-name">{{ contract.counterparty }}</div>
                  <div class="party-type">{{ contract.counterpartyType }}</div>
                </div>
              </td>
              <td>
                <span class="contract-type-badge" :class="getTypeClass(contract.type)">
                  {{ contract.type }}
                </span>
              </td>
              <td>
                <div class="value-cell">
                  <span class="contract-value">${{ formatValue(contract.value) }}</span>
                  <span class="value-currency">{{ contract.currency }}</span>
                </div>
              </td>
              <td>
                <span :class="['status-badge', 'status-' + contract.status.toLowerCase().replace(' ', '-')]">
                  {{ contract.status }}
                </span>
              </td>
              <td>
                <span class="date-text">{{ formatDate(contract.executionDate) }}</span>
              </td>
              <td>
                <span class="date-text" :class="{ 'expiring-soon': isExpiringSoon(contract.expiryDate) }">
                  {{ formatDate(contract.expiryDate) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="viewContract(contract)" class="action-btn view">View</button>
                  <button @click="editContract(contract)" class="action-btn edit">Edit</button>
                  <div class="action-dropdown">
                    <button class="action-btn more">⋮</button>
                    <div class="dropdown-menu">
                      <button @click="downloadContract(contract)">Download</button>
                      <button @click="duplicateContract(contract)">Duplicate</button>
                      <button @click="archiveContract(contract)">Archive</button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="contracts-grid-view">
      <div class="contracts-grid">
        <div 
          v-for="contract in filteredContracts" 
          :key="contract.id" 
          class="contract-card"
          @click="viewContract(contract)"
        >
          <div class="card-header">
            <div class="contract-info">
              <h4 class="contract-title">{{ contract.name }}</h4>
              <p class="contract-counterparty">{{ contract.counterparty }}</p>
            </div>
            <span :class="['status-badge', 'status-' + contract.status.toLowerCase().replace(' ', '-')]">
              {{ contract.status }}
            </span>
          </div>
          
          <div class="card-content">
            <div class="contract-meta">
              <div class="meta-item">
                <span class="meta-label">Type:</span>
                <span class="meta-value">{{ contract.type }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Value:</span>
                <span class="meta-value">${{ formatValue(contract.value) }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Executed:</span>
                <span class="meta-value">{{ formatDate(contract.executionDate) }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Expires:</span>
                <span class="meta-value" :class="{ 'expiring-soon': isExpiringSoon(contract.expiryDate) }">
                  {{ formatDate(contract.expiryDate) }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="card-actions">
            <button @click.stop="viewContract(contract)" class="card-action-btn primary">View</button>
            <button @click.stop="editContract(contract)" class="card-action-btn">Edit</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline View -->
    <div v-else-if="viewMode === 'timeline'" class="contracts-timeline-view">
      <div class="timeline-container">
        <div class="timeline-header">
          <h4>Contract Timeline</h4>
          <div class="timeline-controls">
            <select v-model="timelineScope" class="timeline-scope">
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        
        <div class="timeline-track">
          <div v-for="month in timelineMonths" :key="month.name" class="timeline-month">
            <div class="month-header">
              <h5>{{ month.name }}</h5>
              <span class="month-count">{{ month.contracts.length }} contracts</span>
            </div>
            <div class="month-contracts">
              <div 
                v-for="contract in month.contracts" 
                :key="contract.id"
                class="timeline-contract"
                @click="viewContract(contract)"
              >
                <div class="timeline-marker" :class="getStatusClass(contract.status)"></div>
                <div class="timeline-content">
                  <h6>{{ contract.name }}</h6>
                  <p>{{ contract.counterparty }}</p>
                  <span class="timeline-date">{{ formatDate(contract.executionDate) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-section">
      <div class="pagination-info">
        Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ totalContracts }} contracts
      </div>
      <div class="pagination-controls">
        <button @click="previousPage" :disabled="currentPage === 1" class="pagination-btn">Previous</button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">Next</button>
      </div>
    </div>

    <!-- Bulk Actions Bar -->
    <div v-if="selectedContracts.length > 0" class="bulk-actions-bar">
      <div class="selected-count">{{ selectedContracts.length }} contracts selected</div>
      <div class="bulk-actions">
        <button @click="bulkDownload" class="bulk-action-btn">Download All</button>
        <button @click="bulkAssign" class="bulk-action-btn">Assign</button>
        <button @click="bulkArchive" class="bulk-action-btn danger">Archive</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// State
const viewMode = ref('list')
const searchQuery = ref('')
const showFilterPanel = ref(false)
const sortKey = ref('executionDate')
const sortAsc = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(25)
const selectAll = ref(false)
const selectedContracts = ref([])
const activeQuickFilter = ref('')
const timelineScope = ref('quarter')

// Filters
const filters = ref({
  contractType: '',
  status: '',
  minValue: null,
  maxValue: null,
  startDate: '',
  endDate: ''
})

// Quick filters
const quickFilters = [
  { key: 'all', label: 'All Contracts', count: 347 },
  { key: 'pending', label: 'Pending Review', count: 23 },
  { key: 'expiring', label: 'Expiring Soon', count: 18 },
  { key: 'high_value', label: 'High Value', count: 45 },
  { key: 'recently_added', label: 'Recently Added', count: 12 }
]

// Mock contracts data
const contracts = ref([
  {
    id: 'CNT-2024-001',
    name: 'Enterprise Software License Agreement',
    counterparty: 'TechCorp Industries',
    counterpartyType: 'Customer',
    type: 'SaaS Agreement',
    value: 250000,
    currency: 'USD',
    status: 'Executed',
    executionDate: new Date('2024-01-15'),
    expiryDate: new Date('2025-01-15'),
    assignedTo: 'Sarah Johnson'
  },
  {
    id: 'CNT-2024-002',
    name: 'Master Service Agreement',
    counterparty: 'Global Healthcare Solutions',
    counterpartyType: 'Vendor',
    type: 'MSA',
    value: 480000,
    currency: 'USD',
    status: 'Under Negotiation',
    executionDate: null,
    expiryDate: new Date('2025-06-30'),
    assignedTo: 'Michael Chen'
  },
  {
    id: 'CNT-2024-003',
    name: 'Non-Disclosure Agreement',
    counterparty: 'Innovation Labs Inc',
    counterpartyType: 'Partner',
    type: 'NDA',
    value: 0,
    currency: 'USD',
    status: 'Executed',
    executionDate: new Date('2024-03-10'),
    expiryDate: new Date('2025-03-10'),
    assignedTo: 'Emily Rodriguez'
  }
])

// Computed
const filteredContracts = computed(() => {
  let filtered = contracts.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(contract =>
      contract.name.toLowerCase().includes(query) ||
      contract.counterparty.toLowerCase().includes(query) ||
      contract.id.toLowerCase().includes(query)
    )
  }

  // Apply quick filters
  if (activeQuickFilter.value) {
    switch (activeQuickFilter.value) {
      case 'pending':
        filtered = filtered.filter(c => c.status === 'Pending Review')
        break
      case 'expiring':
        filtered = filtered.filter(c => isExpiringSoon(c.expiryDate))
        break
      case 'high_value':
        filtered = filtered.filter(c => c.value > 100000)
        break
      case 'recently_added':
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        filtered = filtered.filter(c => c.executionDate && c.executionDate > thirtyDaysAgo)
        break
    }
  }

  // Apply advanced filters
  if (filters.value.contractType) {
    filtered = filtered.filter(c => c.type.toLowerCase().includes(filters.value.contractType))
  }
  if (filters.value.status) {
    filtered = filtered.filter(c => c.status.toLowerCase().replace(' ', '_') === filters.value.status)
  }
  if (filters.value.minValue) {
    filtered = filtered.filter(c => c.value >= filters.value.minValue)
  }
  if (filters.value.maxValue) {
    filtered = filtered.filter(c => c.value <= filters.value.maxValue)
  }

  // Apply sorting
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

const totalContracts = computed(() => filteredContracts.value.length)
const totalPages = computed(() => Math.ceil(totalContracts.value / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalContracts.value))

const timelineMonths = computed(() => {
  // Group contracts by month for timeline view
  const months = {}
  filteredContracts.value.forEach(contract => {
    if (contract.executionDate) {
      const month = contract.executionDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      if (!months[month]) {
        months[month] = { name: month, contracts: [] }
      }
      months[month].contracts.push(contract)
    }
  })
  return Object.values(months)
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

function applyQuickFilter(filter) {
  activeQuickFilter.value = activeQuickFilter.value === filter.key ? '' : filter.key
}

function clearAllFilters() {
  filters.value = {
    contractType: '',
    status: '',
    minValue: null,
    maxValue: null,
    startDate: '',
    endDate: ''
  }
  activeQuickFilter.value = ''
  searchQuery.value = ''
}

function toggleSelectAll() {
  if (selectAll.value) {
    selectedContracts.value = filteredContracts.value.map(c => c.id)
  } else {
    selectedContracts.value = []
  }
}

function toggleContractSelection(contractId) {
  const index = selectedContracts.value.indexOf(contractId)
  if (index > -1) {
    selectedContracts.value.splice(index, 1)
  } else {
    selectedContracts.value.push(contractId)
  }
  selectAll.value = selectedContracts.value.length === filteredContracts.value.length
}

function formatValue(value) {
  if (value === 0) return '0'
  return (value / 1000).toFixed(0) + 'K'
}

function formatDate(date) {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

function isExpiringSoon(date) {
  if (!date) return false
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
  return date <= thirtyDaysFromNow
}

function getTypeClass(type) {
  return type.toLowerCase().replace(' ', '-')
}

function getStatusClass(status) {
  return status.toLowerCase().replace(' ', '-')
}

function viewContract(contract) {
  console.log('Viewing contract:', contract.id)
}

function editContract(contract) {
  console.log('Editing contract:', contract.id)
}

function downloadContract(contract) {
  console.log('Downloading contract:', contract.id)
}

function duplicateContract(contract) {
  console.log('Duplicating contract:', contract.id)
}

function archiveContract(contract) {
  console.log('Archiving contract:', contract.id)
}

function bulkDownload() {
  console.log('Bulk downloading contracts:', selectedContracts.value)
}

function bulkAssign() {
  console.log('Bulk assigning contracts:', selectedContracts.value)
}

function bulkArchive() {
  console.log('Bulk archiving contracts:', selectedContracts.value)
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

onMounted(() => {
  // Load contracts data
})
</script>

<style scoped>
.all-contracts {
  /* Inherits styles from parent */
}

.contracts-header {
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
  align-items: center;
}

.view-selector {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.search-filter-bar {
  margin-bottom: 2rem;
}

.search-section {
  margin-bottom: 1rem;
}

.search-input-wrapper {
  position: relative;
  max-width: 500px;
}

.search-input-wrapper svg {
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
  font-size: 0.875rem;
}

.quick-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.quick-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.quick-filter-btn:hover {
  color: var(--text-primary);
  border-color: var(--primary-accent);
}

.quick-filter-btn.active {
  background: var(--primary-accent);
  color: white;
  border-color: var(--primary-accent);
}

.filter-count {
  padding: 0.125rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.filter-panel {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.filter-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-panel-header h4 {
  color: var(--text-primary);
  font-weight: 600;
}

.clear-filters-btn {
  background: none;
  border: none;
  color: var(--primary-accent);
  cursor: pointer;
  font-size: 0.875rem;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.875rem;
}

.filter-select {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.75rem;
  border-radius: 8px;
}

.value-range, .date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.range-input, .date-input {
  flex: 1;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.75rem;
  border-radius: 8px;
}

.contracts-table-container {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;
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

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background: rgba(255, 255, 255, 0.05);
}

.contracts-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.contract-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.contract-row.selected {
  background: rgba(124, 58, 237, 0.1);
}

.contract-name-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contract-name {
  color: var(--text-primary);
  font-weight: 500;
}

.contract-id {
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-family: 'Space Grotesk', monospace;
}

.counterparty-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.party-name {
  color: var(--text-primary);
  font-weight: 500;
}

.party-type {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.contract-type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.contract-type-badge.saas-agreement {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.contract-type-badge.msa {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.contract-type-badge.nda {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.value-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contract-value {
  color: var(--text-primary);
  font-weight: 600;
}

.value-currency {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-executed {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-under-negotiation {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-pending-review {
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
}

.status-draft {
  background: rgba(156, 163, 175, 0.1);
  color: #9ca3af;
}

.date-text {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.date-text.expiring-soon {
  color: var(--risk-high);
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
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

.action-btn.edit {
  background: var(--secondary-accent);
  color: white;
}

.action-btn.more {
  background: transparent;
  color: var(--text-secondary);
  padding: 0.375rem;
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

/* Grid View */
.contracts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.contract-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contract-card:hover {
  border-color: var(--primary-accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(124, 58, 237, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.contract-title {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.contract-counterparty {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.contract-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.meta-label {
  color: var(--text-secondary);
}

.meta-value {
  color: var(--text-primary);
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
}

.card-action-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.card-action-btn.primary {
  background: var(--primary-accent);
  color: white;
}

.card-action-btn:not(.primary) {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

/* Timeline View */
.timeline-container {
  margin-bottom: 2rem;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.timeline-header h4 {
  color: var(--text-primary);
  font-weight: 600;
}

.timeline-scope {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.timeline-track {
  position: relative;
  padding-left: 2rem;
}

.timeline-track::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border-color);
}

.timeline-month {
  margin-bottom: 2rem;
}

.month-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.month-header h5 {
  color: var(--text-primary);
  font-weight: 600;
}

.month-count {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.timeline-contract {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.timeline-contract:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--primary-accent);
}

.timeline-marker {
  position: absolute;
  left: -32px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  background: var(--bg-primary);
}

.timeline-marker.executed {
  background: var(--health-excellent);
  border-color: var(--health-excellent);
}

.timeline-marker.under-negotiation {
  background: var(--risk-medium);
  border-color: var(--risk-medium);
}

.timeline-content h6 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.timeline-content p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.timeline-date {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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

.pagination-btn {
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* Bulk Actions Bar */
.bulk-actions-bar {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 2rem;
  z-index: 100;
}

.selected-count {
  color: var(--text-primary);
  font-weight: 600;
}

.bulk-actions {
  display: flex;
  gap: 1rem;
}

.bulk-action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.bulk-action-btn:not(.danger) {
  background: var(--primary-accent);
  color: white;
}

.bulk-action-btn.danger {
  background: var(--risk-high);
  color: white;
}

@media (max-width: 768px) {
  .contracts-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .quick-filters {
    flex-direction: column;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .contracts-table-container {
    overflow-x: auto;
  }

  .contracts-grid {
    grid-template-columns: 1fr;
  }

  .pagination-section {
    flex-direction: column;
    gap: 1rem;
  }

  .bulk-actions-bar {
    left: 1rem;
    right: 1rem;
    transform: none;
    flex-direction: column;
    gap: 1rem;
  }

  .bulk-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>