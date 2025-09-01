<template>
  <div class="deal360-view page-container">
    <!-- Header -->
    <div class="view-header">
      <h1 class="heading-primary">Deal 360°</h1>
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

    <!-- Module Navigation Tabs (Contracts tab removed) -->
    <div class="module-tabs">
      <RouterLink to="/deal360/leads" class="module-tab" active-class="active">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <line x1="20" y1="8" x2="20" y2="14"/>
          <line x1="23" y1="11" x2="17" y2="11"/>
        </svg>
        Leads <span class="tab-count">{{ leadsCount }}</span>
      </RouterLink>

      <RouterLink to="/deal360/deals" class="module-tab" active-class="active">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
        </svg>
        Deals <span class="tab-count">{{ dealsCount }}</span>
      </RouterLink>
    </div>

    <!-- Summary Cards (single top-level stats row) -->
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

    <!-- Main Content Area -->
    <div class="main-content-area">
      <RouterView />
    </div>

    <!-- New Deal Modal -->
    <div v-if="showNewDeal" class="modal-overlay" @click="showNewDeal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Create New Deal</h2>
          <button @click="showNewDeal = false" class="close-btn">×</button>
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
            <div class="form-actions">
              <button type="button" @click="showNewDeal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Create Deal</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Import Deals Modal -->
    <div v-if="showImportModal" class="modal-overlay" @click="showImportModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Import Deals from CSV</h2>
          <button @click="showImportModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="upload-zone" @click="triggerFileUpload" @dragover.prevent @drop.prevent="handleFileDrop">
            <div class="upload-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17,8 12,3 7,8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <h4>Upload Deals CSV</h4>
              <p>Drag & drop or click to browse</p>
            </div>
            <input ref="fileInput" type="file" accept=".csv" style="display:none" @change="handleFileSelect">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showNewDeal     = ref(false)
const showImportModal = ref(false)
const fileInput       = ref()

// mock counts & metrics (removed contractsCount)
const leadsCount        = ref(45)
const dealsCount        = ref(23)
const totalPipelineValue= ref(3.2)
const activeDeals       = ref(23)
const stalledDeals      = ref(3)
const avgCycleTime      = ref(44)
const conversionRate    = ref(33)

// new deal form
const newDealForm = ref({
  companyName: '',
  value: null,
  contact: ''
})

function createDeal() {
  console.log('Creating deal', newDealForm.value)
  showNewDeal.value = false
  newDealForm.value = { companyName:'', value:null, contact:'' }
}

function triggerFileUpload() {
  fileInput.value?.click()
}
function handleFileSelect(e) {
  console.log('File selected', e.target.files[0]?.name)
}
function handleFileDrop(e) {
  console.log('File dropped', e.dataTransfer.files[0]?.name)
}

onMounted(() => {
  // load real data here
})
</script>

<style scoped>
/* CSS Variables for consistency */
:root {
  --bg-primary: #1a1a1a;
  --bg-card: #2a2a2a;
  --bg-secondary: #2a2a2a;
  --border-color: #404040;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --primary-accent: #7c3aed;
  --health-excellent: #22c55e;
  --risk-high: #ef4444;
}

.deal360-view {
  padding: 1rem;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.page-container {
  /* Additional container styles can go here */
}

/* Header Styles */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  margin-top: 1rem;
}

.heading-primary {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background: var(--primary-accent);
  color: white;
}

.btn-primary:hover {
  background: #6d28d9;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-card);
}

.icon {
  font-size: 1.2rem;
  line-height: 1;
}

/* Module Navigation */
.module-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.module-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
}

.module-tab:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.module-tab.active {
  background: var(--primary-accent);
  color: white;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);
}

.tab-count {
  background: rgba(255,255,255,0.2);
  border-radius: 9999px;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px,1fr));
  gap: 1rem;
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
  color: var(--text-secondary); 
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.metric-value { 
  font-size: 2rem; 
  font-weight: 700; 
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.metric-change { 
  font-size: 0.75rem;
  font-weight: 500;
}

.metric-change.positive { color: var(--health-excellent); }
.metric-change.negative { color: var(--risk-high); }

/* Main Content */
.main-content-area {
  min-height: 400px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 1000;
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
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  color: var(--text-primary);
}

.modal-body { 
  padding: 2rem; 
}

.close-btn { 
  background: none; 
  border: none; 
  font-size: 1.5rem; 
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0.25rem;
}

.close-btn:hover {
  color: var(--text-primary);
}

/* Form Styles */
.new-deal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: var(--text-primary);
}

.form-input {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-accent);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

/* Upload Zone */
.upload-zone {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.upload-zone:hover {
  border-color: var(--primary-accent);
}

.upload-content svg {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.upload-content h4 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.upload-content p {
  color: var(--text-secondary);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .view-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .module-tabs {
    flex-direction: column;
    gap: 0.25rem;
  }

  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .main-content-area {
    padding: 1rem;
  }
}
</style>
