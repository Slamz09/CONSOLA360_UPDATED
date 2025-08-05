<template>
  <div class="deal360-view page-container">
    <!-- Header -->
    <div class="view-header">
      <h1 class="heading-primary">Deal 360</h1>
      <div class="header-actions">
        <button @click="showNewDeal = true" class="btn btn-primary">
          <span class="icon">+</span>
          New Deal
        </button>
        <button @click="showImportModal = true" class="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Import Deals
        </button>
      </div>
    </div>

    <!-- Module Navigation Tabs -->
    <div class="module-tabs">
      <RouterLink to="/deal360/leads" class="module-tab" active-class="active">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <line x1="20" y1="8" x2="20" y2="14"/>
          <line x1="23" y1="11" x2="17" y2="11"/>
        </svg>
        Leads
        <span class="tab-count">{{ leadsCount }}</span>
      </RouterLink>
      
      <RouterLink to="/deal360/deals" class="module-tab" active-class="active">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
        </svg>
        Deals
        <span class="tab-count">{{ dealsCount }}</span>
      </RouterLink>
      
      <RouterLink to="/deal360/contracts" class="module-tab" active-class="active">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        Contracts
        <span class="tab-count">{{ contractsCount }}</span>
      </RouterLink>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <h3 class="card-title">Total Pipeline Value</h3>
        <div class="metric-value">${{ totalPipelineValue }}M</div>
        <div class="metric-change positive">+12% this quarter</div>
      </div>
      <div class="summary-card">
        <h3 class="card-title">Active Deals</h3>
        <div class="metric-value">{{ activeDeals }}</div>
        <div class="metric-change">{{ stalledDeals }} stalled</div>
      </div>
      <div class="summary-card">
        <h3 class="card-title">Avg. Cycle Time</h3>
        <div class="metric-value">{{ avgCycleTime }} days</div>
        <div class="metric-change negative">+3 days vs last month</div>
      </div>
      <div class="summary-card">
        <h3 class="card-title">Conversion Rate</h3>
        <div class="metric-value">{{ conversionRate }}%</div>
        <div class="metric-change positive">+5% improvement</div>
      </div>
    </div>

    <!-- Domino Tracker: Deal Lifecycle Stages -->
    <div class="domino-tracker">
      <h2 class="section-title">Deal Lifecycle Stages</h2>
      <div class="domino-stages">
        <div v-for="(stage, index) in dominoStages" :key="index" 
             :class="['domino-stage', stage.status]">
          <div class="stage-icon">{{ stage.icon }}</div>
          <div class="stage-content">
            <h4>{{ stage.name }}</h4>
            <p class="stage-count">{{ stage.count }} active</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="main-content-area">
      <RouterView />
    </div>

    <!-- New Deal Modal -->
    <div v-if="showNewDeal" class="modal-overlay" @click="showNewDeal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Create New Deal</h2>
          <button @click="showNewDeal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createDeal" class="new-deal-form">
            <div class="form-group">
              <label class="form-label">Company Name</label>
              <input v-model="newDealForm.companyName" type="text" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Deal Value ($K)</label>
              <input v-model.number="newDealForm.value" type="number" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Primary Contact</label>
              <input v-model="newDealForm.contact" type="text" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Industry</label>
              <select v-model="newDealForm.industry" class="form-select" required>
                <option value="">Select industry</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" @click="showNewDeal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Create Deal</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="modal-overlay" @click="showImportModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Import Deals from CSV</h2>
          <button @click="showImportModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="upload-zone" @click="triggerFileUpload" @dragover.prevent @drop.prevent="handleFileDrop">
            <div class="upload-content">
              <div class="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17,8 12,3 7,8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <h4>Upload Deals CSV</h4>
              <p>Drag & drop your CSV file here or click to browse</p>
            </div>
            <input ref="fileInput" type="file" accept=".csv" style="display: none" @change="handleFileSelect">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// State
const showNewDeal = ref(false)
const showImportModal = ref(false)
const fileInput = ref()

// Mock data
const leadsCount = ref(45)
const dealsCount = ref(23)
const contractsCount = ref(12)
const totalPipelineValue = ref(3.2)
const activeDeals = ref(23)
const stalledDeals = ref(3)
const avgCycleTime = ref(44)
const conversionRate = ref(33)

const dominoStages = ref([
  { name: 'Lead Identified', icon: '🎯', count: 45, status: 'active' },
  { name: 'Initial Contact', icon: '📞', count: 32, status: 'active' },
  { name: 'Deal Qualified', icon: '✅', count: 23, status: 'current' },
  { name: 'Proposal Sent', icon: '📄', count: 18, status: 'pending' },
  { name: 'Contract Review', icon: '🔍', count: 12, status: 'pending' },
  { name: 'Contract Executed', icon: '✍️', count: 8, status: 'complete' }
])

// Form data
const newDealForm = ref({
  companyName: '',
  value: null,
  contact: '',
  industry: ''
})

// Methods
function createDeal() {
  // Create deal logic here
  console.log('Creating deal:', newDealForm.value)
  showNewDeal.value = false
  // Reset form
  newDealForm.value = {
    companyName: '',
    value: null,
    contact: '',
    industry: ''
  }
}

function triggerFileUpload() {
  fileInput.value?.click()
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    console.log('File selected:', file.name)
    // Handle CSV processing here
  }
}

function handleFileDrop(event) {
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    console.log('File dropped:', files[0].name)
    // Handle CSV processing here
  }
}

onMounted(() => {
  // Load initial data
})
</script>

<style scoped>
.deal360-view {
  /* Inherits from page-container */
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  margin-top: 2rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.module-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: var(--bg-card);
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.module-tab {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.module-tab:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.module-tab.active {
  background: var(--primary-accent);
  color: white;
}

.tab-count {
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.summary-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.card-title {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.metric-change {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.metric-change.positive {
  color: var(--health-excellent);
}

.metric-change.negative {
  color: var(--risk-high);
}

.domino-tracker {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.domino-stages {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.domino-stage {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
}

.domino-stage.active {
  border-color: var(--secondary-accent);
  background: rgba(16, 185, 129, 0.1);
}

.domino-stage.current {
  border-color: var(--primary-accent);
  background: rgba(124, 58, 237, 0.1);
}

.domino-stage.pending {
  border-color: var(--risk-medium);
  background: rgba(245, 158, 11, 0.1);
}

.domino-stage.complete {
  border-color: var(--health-excellent);
  background: rgba(34, 197, 94, 0.1);
}

.stage-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.stage-content h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.stage-count {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.main-content-area {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  min-height: 400px;
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  font-size: 1.5rem;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
}

.close-btn:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 2rem;
}

.new-deal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
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

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  color: var(--secondary-accent);
}

.upload-content h4 {
  color: var(--text-primary);
  font-weight: 600;
}

.icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .header-actions {
    justify-content: space-between;
  }

  .module-tabs {
    flex-direction: column;
  }

  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .domino-stages {
    grid-template-columns: 1fr;
  }
}
</style>