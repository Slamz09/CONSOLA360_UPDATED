<template>
  <div class="clause-repository">
    <!-- Header -->
    <div class="repository-header">
      <div class="header-content">
        <h3 class="heading-tertiary">Clause Repository</h3>
        <p class="text-body">Centralized library of legal clauses with AI-powered search and recommendations</p>
      </div>
      <div class="header-actions">
        <button @click="showImportModal = true" class="btn btn-secondary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Import Clauses
        </button>
        <button @click="showNewClauseModal = true" class="btn btn-primary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
          Add Clause
        </button>
      </div>
    </div>

    <!-- Repository Stats -->
    <div class="repository-stats">
      <div class="stat-card">
        <div class="stat-icon total">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalClauses }}</div>
          <div class="stat-label">Total Clauses</div>
          <div class="stat-detail">{{ stats.categoriesCount }} categories</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon approved">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.approvedClauses }}</div>
          <div class="stat-label">Approved Clauses</div>
          <div class="stat-detail">{{ stats.pendingApproval }} pending</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon usage">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.monthlyUsage }}</div>
          <div class="stat-label">Monthly Usage</div>
          <div class="stat-detail">+{{ stats.usageGrowth }}% vs last month</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon ai">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a3 3 0 0 0-3 3c0 1.5-1.5 3-3 3s-3 1.5-3 3 1.5 3 3 3c1.5 0 3 1.5 3 3a3 3 0 0 0 6 0c0-1.5 1.5-3 3-3s3-1.5 3-3-1.5-3-3-3c-1.5 0-3-1.5-3-3a3 3 0 0 0-3-3z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.aiSuggestions }}</div>
          <div class="stat-label">AI Suggestions</div>
          <div class="stat-detail">{{ stats.suggestionAccuracy }}% accuracy</div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="search-section">
      <div class="search-bar">
        <div class="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search clauses by content, category, or keywords..." 
            class="search-input"
            @input="performSearch"
          />
        </div>
        <button @click="showAdvancedSearch = !showAdvancedSearch" class="search-filter-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
          </svg>
          Advanced
        </button>
      </div>

      <!-- Advanced Search Panel -->
      <div v-if="showAdvancedSearch" class="advanced-search">
        <div class="search-filters">
          <div class="filter-group">
            <label class="filter-label">Category</label>
            <select v-model="filters.category" class="filter-select">
              <option value="">All Categories</option>
              <option v-for="category in clauseCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Risk Level</label>
            <select v-model="filters.riskLevel" class="filter-select">
              <option value="">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Contract Type</label>
            <select v-model="filters.contractType" class="filter-select">
              <option value="">All Contract Types</option>
              <option value="saas">SaaS Agreement</option>
              <option value="msa">Master Service Agreement</option>
              <option value="nda">Non-Disclosure Agreement</option>
              <option value="employment">Employment Agreement</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Jurisdiction</label>
            <select v-model="filters.jurisdiction" class="filter-select">
              <option value="">All Jurisdictions</option>
              <option value="us">United States</option>
              <option value="eu">European Union</option>
              <option value="uk">United Kingdom</option>
              <option value="ca">Canada</option>
            </select>
          </div>
        </div>
        
        <div class="search-actions">
          <button @click="clearFilters" class="btn btn-secondary btn-small">Clear Filters</button>
          <button @click="saveSearchQuery" class="btn btn-primary btn-small">Save Search</button>
        </div>
      </div>

      <!-- AI Search Suggestions -->
      <div v-if="aiSearchSuggestions.length > 0" class="ai-suggestions">
        <h5>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a3 3 0 0 0-3 3c0 1.5-1.5 3-3 3s-3 1.5-3 3 1.5 3 3 3c1.5 0 3 1.5 3 3a3 3 0 0 0 6 0c0-1.5 1.5-3 3-3s3-1.5 3-3-1.5-3-3-3c-1.5 0-3-1.5-3-3a3 3 0 0 0-3-3z"/>
          </svg>
          AI Suggestions
        </h5>
        <div class="suggestion-chips">
          <button 
            v-for="suggestion in aiSearchSuggestions" 
            :key="suggestion.id"
            @click="applySuggestion(suggestion)"
            class="suggestion-chip"
          >
            {{ suggestion.text }}
          </button>
        </div>
      </div>
    </div>

    <!-- Clause Categories -->
    <div class="categories-section">
      <div class="section-header">
        <h4 class="section-title">Browse by Category</h4>
        <div class="view-toggle">
          <button 
            @click="viewMode = 'grid'"
            :class="['view-btn', { active: viewMode === 'grid' }]"
          >
            Grid
          </button>
          <button 
            @click="viewMode = 'list'"
            :class="['view-btn', { active: viewMode === 'list' }]"
          >
            List
          </button>
        </div>
      </div>

      <div v-if="viewMode === 'grid'" class="categories-grid">
        <div 
          v-for="category in categoryStats" 
          :key="category.name"
          @click="filterByCategory(category.name)"
          class="category-card"
        >
          <div class="category-icon">{{ category.icon }}</div>
          <div class="category-content">
            <h5>{{ category.name }}</h5>
            <p>{{ category.description }}</p>
            <div class="category-stats">
              <span class="clause-count">{{ category.clauseCount }} clauses</span>
              <span class="usage-count">{{ category.monthlyUsage }} uses</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="categories-list">
        <div 
          v-for="category in categoryStats" 
          :key="category.name"
          class="category-row"
          @click="filterByCategory(category.name)"
        >
          <div class="category-info">
            <div class="category-name">
              <span class="category-icon">{{ category.icon }}</span>
              <span class="name">{{ category.name }}</span>
            </div>
            <p class="category-description">{{ category.description }}</p>
          </div>
          <div class="category-metrics">
            <div class="metric">
              <span class="metric-value">{{ category.clauseCount }}</span>
              <span class="metric-label">Clauses</span>
            </div>
            <div class="metric">
              <span class="metric-value">{{ category.monthlyUsage }}</span>
              <span class="metric-label">Monthly Uses</span>
            </div>
            <div class="metric">
              <span class="metric-value">{{ category.avgRating }}</span>
              <span class="metric-label">Avg Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Clause Results -->
    <div class="clauses-section">
      <div class="section-header">
        <h4 class="section-title">
          {{ activeCategory ? `${activeCategory} Clauses` : 'All Clauses' }}
          <span class="results-count">({{ filteredClauses.length }} results)</span>
        </h4>
        <div class="sort-controls">
          <select v-model="sortBy" class="sort-select">
            <option value="relevance">Sort by Relevance</option>
            <option value="popularity">Sort by Popularity</option>
            <option value="rating">Sort by Rating</option>
            <option value="recent">Sort by Recently Added</option>
            <option value="alphabetical">Sort Alphabetically</option>
          </select>
        </div>
      </div>

      <div class="clauses-list">
        <div v-for="clause in paginatedClauses" :key="clause.id" class="clause-card">
          <div class="clause-header">
            <div class="clause-info">
              <h5 class="clause-title">{{ clause.title }}</h5>
              <div class="clause-meta">
                <span class="clause-category">{{ clause.category }}</span>
                <span :class="['clause-risk', clause.riskLevel]">{{ clause.riskLevel }} risk</span>
                <span class="clause-rating">
                  ⭐ {{ clause.rating }} ({{ clause.ratingCount }} reviews)
                </span>
              </div>
            </div>
            <div class="clause-actions">
              <button @click="previewClause(clause)" class="action-btn preview">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                Preview
              </button>
              <button @click="useClause(clause)" class="action-btn use">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14m-7-7h14"/>
                </svg>
                Use
              </button>
            </div>
          </div>

          <div class="clause-content">
            <p class="clause-description">{{ clause.description }}</p>
            <div class="clause-preview-text" v-html="truncateText(clause.content, 200)"></div>
          </div>

          <div class="clause-footer">
            <div class="clause-tags">
              <span v-for="tag in clause.tags" :key="tag" class="clause-tag">{{ tag }}</span>
            </div>
            <div class="clause-usage">
              <span class="usage-stats">Used {{ clause.usageCount }} times</span>
              <span class="last-updated">Updated {{ formatRelativeTime(clause.lastUpdated) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          Previous
        </button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Clause Preview Modal -->
    <div v-if="showPreviewModal" class="modal-overlay" @click="showPreviewModal = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <div class="preview-header">
            <h3>{{ selectedClause?.title }}</h3>
            <div class="clause-metadata">
              <span class="category">{{ selectedClause?.category }}</span>
              <span :class="['risk-level', selectedClause?.riskLevel]">{{ selectedClause?.riskLevel }} risk</span>
            </div>
          </div>
          <div class="preview-actions">
            <button @click="copyClause(selectedClause)" class="btn btn-secondary btn-small">Copy</button>
            <button @click="downloadClause(selectedClause)" class="btn btn-secondary btn-small">Download</button>
            <button @click="useClause(selectedClause)" class="btn btn-primary btn-small">Use in Contract</button>
            <button @click="showPreviewModal = false" class="close-btn">✕</button>
          </div>
        </div>
        <div class="modal-body">
          <div class="clause-preview-content">
            <div class="clause-full-text" v-html="selectedClause?.content"></div>
            
            <div class="clause-details">
              <div class="detail-section">
                <h4>Usage Guidelines</h4>
                <ul>
                  <li v-for="guideline in selectedClause?.guidelines" :key="guideline">{{ guideline }}</li>
                </ul>
              </div>
              
              <div class="detail-section">
                <h4>Applicable Jurisdictions</h4>
                <div class="jurisdiction-tags">
                  <span v-for="jurisdiction in selectedClause?.jurisdictions" :key="jurisdiction" class="jurisdiction-tag">
                    {{ jurisdiction }}
                  </span>
                </div>
              </div>
              
              <div class="detail-section">
                <h4>Alternative Versions</h4>
                <div class="alternative-clauses">
                  <div v-for="alt in selectedClause?.alternatives" :key="alt.id" class="alternative-item">
                    <h5>{{ alt.title }}</h5>
                    <p>{{ alt.description }}</p>
                    <button @click="selectAlternative(alt)" class="btn btn-small btn-secondary">Use This Version</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Clause Modal -->
    <div v-if="showNewClauseModal" class="modal-overlay" @click="showNewClauseModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Add New Clause</h3>
          <button @click="showNewClauseModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createClause" class="new-clause-form">
            <div class="form-group">
              <label class="form-label">Clause Title *</label>
              <input v-model="newClause.title" type="text" class="form-input" required>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Category *</label>
                <select v-model="newClause.category" class="form-select" required>
                  <option value="">Select Category</option>
                  <option v-for="category in clauseCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Risk Level</label>
                <select v-model="newClause.riskLevel" class="form-select">
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea v-model="newClause.description" class="form-textarea" rows="3"></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Clause Content *</label>
              <textarea v-model="newClause.content" class="form-textarea" rows="8" required></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Tags (comma-separated)</label>
              <input v-model="newClause.tags" type="text" class="form-input" 
                     placeholder="e.g., liability, indemnification, termination">
            </div>
            
            <div class="form-actions">
              <button type="button" @click="showNewClauseModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Add Clause</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="modal-overlay" @click="showImportModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Import Clauses</h3>
          <button @click="showImportModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="import-options">
            <div class="import-method" @click="selectImportMethod('file')">
              <div class="method-icon">📄</div>
              <h4>Upload Document</h4>
              <p>Extract clauses from existing contracts or documents</p>
            </div>
            
            <div class="import-method" @click="selectImportMethod('library')">
              <div class="method-icon">📚</div>
              <h4>Standard Library</h4>
              <p>Import from our curated library of standard clauses</p>
            </div>
            
            <div class="import-method" @click="selectImportMethod('ai')">
              <div class="method-icon">🤖</div>
              <h4>AI Generation</h4>
              <p>Generate clauses using AI based on your requirements</p>
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
const searchQuery = ref('')
const showAdvancedSearch = ref(false)
const viewMode = ref('grid')
const activeCategory = ref('')
const sortBy = ref('relevance')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showPreviewModal = ref(false)
const showNewClauseModal = ref(false)
const showImportModal = ref(false)
const selectedClause = ref(null)

// Filters
const filters = ref({
  category: '',
  riskLevel: '',
  contractType: '',
  jurisdiction: ''
})

// Mock data
const stats = ref({
  totalClauses: 847,
  categoriesCount: 12,
  approvedClauses: 792,
  pendingApproval: 23,
  monthlyUsage: 1247,
  usageGrowth: 18,
  aiSuggestions: 156,
  suggestionAccuracy: 94
})

const clauseCategories = [
  'Payment Terms',
  'Liability & Indemnification',
  'Termination Clauses',
  'Intellectual Property',
  'Confidentiality',
  'Service Level Agreements',
  'Data Privacy',
  'Compliance & Regulatory',
  'Dispute Resolution',
  'Force Majeure',
  'Governing Law',
  'Warranties & Representations'
]

const categoryStats = ref([
  {
    name: 'Payment Terms',
    description: 'Clauses related to payment schedules, methods, and conditions',
    icon: '💰',
    clauseCount: 156,
    monthlyUsage: 324,
    avgRating: 4.6
  },
  {
    name: 'Liability & Indemnification',
    description: 'Risk allocation and liability limitation clauses',
    icon: '⚖️',
    clauseCount: 98,
    monthlyUsage: 187,
    avgRating: 4.3
  },
  {
    name: 'Intellectual Property',
    description: 'IP ownership, licensing, and protection clauses',
    icon: '🧠',
    clauseCount: 124,
    monthlyUsage: 156,
    avgRating: 4.5
  },
  {
    name: 'Confidentiality',
    description: 'Non-disclosure and confidentiality protection clauses',
    icon: '🔒',
    clauseCount: 89,
    monthlyUsage: 298,
    avgRating: 4.7
  },
  {
    name: 'Termination Clauses',
    description: 'Contract termination conditions and procedures',
    icon: '🚪',
    clauseCount: 67,
    monthlyUsage: 145,
    avgRating: 4.2
  },
  {
    name: 'Data Privacy',
    description: 'GDPR, CCPA, and other data protection clauses',
    icon: '🔐',
    clauseCount: 78,
    monthlyUsage: 203,
    avgRating: 4.8
  }
])

const clauses = ref([
  {
    id: 1,
    title: 'Standard Payment Terms - Net 30',
    category: 'Payment Terms',
    description: 'Standard payment terms with 30-day payment period and late fee provisions',
    content: 'Payment for all invoices shall be due within thirty (30) days of the invoice date. Late payments shall incur a fee of 1.5% per month...',
    riskLevel: 'low',
    rating: 4.6,
    ratingCount: 48,
    usageCount: 324,
    lastUpdated: new Date('2024-11-15'),
    tags: ['payment', 'net-30', 'late-fees'],
    jurisdictions: ['US', 'CA'],
    guidelines: [
      'Suitable for most commercial transactions',
      'Consider shorter payment terms for high-risk counterparties',
      'Late fee percentage may vary by jurisdiction'
    ],
    alternatives: [
      {
        id: 'alt-1',
        title: 'Net 15 Payment Terms',
        description: 'Accelerated payment terms for faster cash flow'
      }
    ]
  },
  {
    id: 2,
    title: 'Mutual Indemnification Clause',
    category: 'Liability & Indemnification',
    description: 'Balanced indemnification clause providing mutual protection',
    content: 'Each party shall indemnify, defend, and hold harmless the other party from and against any and all claims, damages, losses...',
    riskLevel: 'medium',
    rating: 4.3,
    ratingCount: 32,
    usageCount: 187,
    lastUpdated: new Date('2024-11-20'),
    tags: ['indemnification', 'mutual', 'liability'],
    jurisdictions: ['US', 'UK'],
    guidelines: [
      'Provides balanced risk allocation',
      'May need modification for high-risk industries',
      'Consider caps on indemnification amounts'
    ],
    alternatives: [
      {
        id: 'alt-2',
        title: 'Limited Indemnification',
        description: 'Indemnification with liability caps and exclusions'
      }
    ]
  }
])

const aiSearchSuggestions = ref([
  { id: 1, text: 'Liability limitation clauses' },
  { id: 2, text: 'GDPR compliance clauses' },
  { id: 3, text: 'Force majeure provisions' },
  { id: 4, text: 'Intellectual property licensing' }
])

const newClause = ref({
  title: '',
  category: '',
  description: '',
  content: '',
  riskLevel: 'medium',
  tags: ''
})

// Computed
const filteredClauses = computed(() => {
  let filtered = clauses.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(clause =>
      clause.title.toLowerCase().includes(query) ||
      clause.description.toLowerCase().includes(query) ||
      clause.content.toLowerCase().includes(query) ||
      clause.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Apply category filter
  if (activeCategory.value) {
    filtered = filtered.filter(clause => clause.category === activeCategory.value)
  }

  // Apply advanced filters
  if (filters.value.category) {
    filtered = filtered.filter(clause => clause.category === filters.value.category)
  }
  if (filters.value.riskLevel) {
    filtered = filtered.filter(clause => clause.riskLevel === filters.value.riskLevel)
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'popularity':
      filtered.sort((a, b) => b.usageCount - a.usageCount)
      break
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case 'recent':
      filtered.sort((a, b) => b.lastUpdated - a.lastUpdated)
      break
    case 'alphabetical':
      filtered.sort((a, b) => a.title.localeCompare(b.title))
      break
    default: // relevance
      // Keep original order for relevance
      break
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredClauses.value.length / itemsPerPage.value))

const paginatedClauses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredClauses.value.slice(start, end)
})

// Methods
function performSearch() {
  currentPage.value = 1
  // In a real app, this would trigger AI-powered search
}

function clearFilters() {
  filters.value = {
    category: '',
    riskLevel: '',
    contractType: '',
    jurisdiction: ''
  }
  activeCategory.value = ''
  searchQuery.value = ''
}

function saveSearchQuery() {
  console.log('Saving search query:', searchQuery.value)
}

function applySuggestion(suggestion) {
  searchQuery.value = suggestion.text
  performSearch()
}

function filterByCategory(categoryName) {
  activeCategory.value = activeCategory.value === categoryName ? '' : categoryName
  currentPage.value = 1
}

function previewClause(clause) {
  selectedClause.value = clause
  showPreviewModal.value = true
}

function useClause(clause) {
  console.log('Using clause:', clause.title)
  // In a real app, this would add the clause to a contract or template
}

function copyClause(clause) {
  navigator.clipboard.writeText(clause.content)
  console.log('Clause copied to clipboard')
}

function downloadClause(clause) {
  console.log('Downloading clause:', clause.title)
}

function selectAlternative(alternative) {
  console.log('Selected alternative:', alternative.title)
}

function createClause() {
  const newClauseData = {
    id: clauses.value.length + 1,
    ...newClause.value,
    tags: newClause.value.tags.split(',').map(tag => tag.trim()),
    rating: 0,
    ratingCount: 0,
    usageCount: 0,
    lastUpdated: new Date(),
    jurisdictions: ['US'],
    guidelines: [],
    alternatives: []
  }
  
  clauses.value.push(newClauseData)
  showNewClauseModal.value = false
  
  // Reset form
  newClause.value = {
    title: '',
    category: '',
    description: '',
    content: '',
    riskLevel: 'medium',
    tags: ''
  }
}

function selectImportMethod(method) {
  console.log('Selected import method:', method)
  showImportModal.value = false
  // Handle different import methods
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

function formatRelativeTime(date) {
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

onMounted(() => {
  // Load clauses data
})
</script>

<style scoped>
.clause-repository {
  /* Inherits styles from parent */
}

.repository-header {
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

.repository-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
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

.stat-icon.total {
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
}

.stat-icon.approved {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.stat-icon.usage {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-icon.ai {
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.stat-detail {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.search-section {
  margin-bottom: 3rem;
}

.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  max-width: 600px;
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

.search-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-filter-btn:hover {
  border-color: var(--primary-accent);
}

.advanced-search {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.search-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
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
  border-radius: 6px;
}

.search-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.ai-suggestions {
  background: rgba(124, 58, 237, 0.05);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 12px;
  padding: 1rem;
}

.ai-suggestions h5 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.suggestion-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.suggestion-chip {
  padding: 0.5rem 1rem;
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
  border: none;
  border-radius: 9999px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-chip:hover {
  background: rgba(124, 58, 237, 0.2);
}

.categories-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.results-count {
  color: var(--text-secondary);
  font-weight: 400;
  font-size: 0.875rem;
}

.view-toggle {
  display: flex;
  gap: 0.25rem;
  background: var(--bg-secondary);
  padding: 0.25rem;
  border-radius: 6px;
}

.view-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.view-btn.active {
  background: var(--primary-accent);
  color: white;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-select {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.category-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  border-color: var(--primary-accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(124, 58, 237, 0.15);
}

.category-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.category-content h5 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.category-content p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.category-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
}

.clause-count {
  color: var(--secondary-accent);
  font-weight: 500;
}

.usage-count {
  color: var(--text-secondary);
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-row:hover {
  border-color: var(--primary-accent);
  background: rgba(124, 58, 237, 0.05);
}

.category-info {
  flex: 1;
}

.category-name {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.category-name .name {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1rem;
}

.category-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.category-metrics {
  display: flex;
  gap: 2rem;
}

.metric {
  text-align: center;
}

.metric-value {
  display: block;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.125rem;
}

.metric-label {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.clauses-section {
  margin-bottom: 3rem;
}

.clauses-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.clause-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.clause-card:hover {
  border-color: var(--primary-accent);
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.1);
}

.clause-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.clause-title {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.clause-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.clause-category {
  color: var(--secondary-accent);
  font-size: 0.75rem;
  font-weight: 500;
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

.clause-rating {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.clause-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-btn.preview {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.action-btn.preview:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.action-btn.use {
  background: var(--primary-accent);
  color: white;
}

.action-btn.use:hover {
  background: #6d28d9;
}

.clause-content {
  margin-bottom: 1rem;
}

.clause-description {
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.clause-preview-text {
  color: var(--text-primary);
  font-size: 0.875rem;
  line-height: 1.6;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border-left: 3px solid var(--primary-accent);
}

.clause-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.clause-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.clause-tag {
  padding: 0.25rem 0.75rem;
  background: rgba(156, 163, 175, 0.1);
  color: #9ca3af;
  border-radius: 9999px;
  font-size: 0.75rem;
}

.clause-usage {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  font-size: 0.75rem;
}

.usage-stats {
  color: var(--secondary-accent);
  font-weight: 500;
}

.last-updated {
  color: var(--text-secondary);
}

.pagination {
  display: flex;
  justify-content: center;
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

.preview-header {
  flex: 1;
}

.preview-header h3 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.clause-metadata {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.category {
  color: var(--secondary-accent);
  font-size: 0.875rem;
  font-weight: 500;
}

.risk-level {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.risk-level.low {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.risk-level.medium {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.risk-level.high {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
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

.clause-preview-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.clause-full-text {
  color: var(--text-primary);
  line-height: 1.8;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-family: 'Times New Roman', serif;
}

.clause-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-section h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.detail-section ul {
  color: var(--text-secondary);
  padding-left: 1.5rem;
}

.detail-section li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.jurisdiction-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.jurisdiction-tag {
  padding: 0.5rem 1rem;
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.alternative-clauses {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alternative-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.alternative-item h5 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.alternative-item p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.new-clause-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
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
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.import-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.import-method {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.import-method:hover {
  border-color: var(--primary-accent);
  transform: translateY(-2px);
}

.method-icon {
  font-size: 2rem;
}

.import-method h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.import-method p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .repository-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .repository-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .search-bar {
    flex-direction: column;
  }

  .search-filters {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .category-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .category-metrics {
    align-self: stretch;
    justify-content: space-around;
  }

  .clause-header {
    flex-direction: column;
    gap: 1rem;
  }

  .clause-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .clause-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .import-options {
    grid-template-columns: 1fr;
  }
}
</style>