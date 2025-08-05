<template>
  <div class="contracts-management">
    <!-- Header -->
    <div class="contracts-header">
      <div class="header-content">
        <h2 class="heading-secondary">Contracts Management</h2>
        <p class="text-body">Comprehensive contract lifecycle management and automation</p>
      </div>
      <div class="header-actions">
        <button @click="showBulkActions = !showBulkActions" class="btn btn-secondary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,11 12,14 22,4"/>
            <path d="M21,12v7a2,2 0 0,1 -2,2H5a2,2 0 0,1 -2,-2V5a2,2 0 0,1 2,-2h11"/>
          </svg>
          Bulk Actions
        </button>
        <button @click="exportContracts" class="btn btn-secondary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export
        </button>
      </div>
    </div>

    <!-- Contracts Overview Stats -->
    <div class="contracts-stats">
      <div class="stat-item">
        <div class="stat-icon active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.activeContracts }}</div>
          <div class="stat-label">Active Contracts</div>
          <div class="stat-change positive">+12 this month</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon pending">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.pendingReview }}</div>
          <div class="stat-label">Pending Review</div>
          <div class="stat-change">{{ stats.overduePending }} overdue</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon expiring">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.expiringContracts }}</div>
          <div class="stat-label">Expiring Soon</div>
          <div class="stat-change negative">Next 30 days</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon value">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">${{ stats.totalValue }}M</div>
          <div class="stat-label">Total Contract Value</div>
          <div class="stat-change positive">+8% YoY</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3 class="section-title">Quick Actions</h3>
      <div class="actions-grid">
        <RouterLink to="/legalhub/contracts/generator" class="action-card">
          <div class="action-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14m-7-7h14"/>
            </svg>
          </div>
          <div class="action-content">
            <h4>Generate New Contract</h4>
            <p>Create contracts from templates</p>
          </div>
        </RouterLink>

        <button @click="showTemplateUpload = true" class="action-card">
          <div class="action-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17,8 12,3 7,8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div class="action-content">
            <h4>Upload Contract</h4>
            <p>Import existing contract</p>
          </div>
        </button>

<RouterLink to="/legalhub/contracts/repository" class="action-card">
  <div class="action-icon">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  </div>
  <div class="action-content">
    <h4>Browse Clauses</h4>
    <p>Access clause repository</p>
  </div>
</RouterLink>

        <button @click="runComplianceCheck" class="action-card">
          <div class="action-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div class="action-content">
            <h4>Compliance Scan</h4>
            <p>Run automated compliance check</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Contract Workflow Tabs -->
    <div class="workflow-tabs">
      <RouterLink 
        to="/legalhub/contracts/all" 
        class="workflow-tab" 
        active-class="active"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
        </svg>
        All Contracts
        <span class="tab-count">{{ stats.activeContracts }}</span>
      </RouterLink>

      <RouterLink 
        to="/legalhub/contracts/assigned" 
        class="workflow-tab" 
        active-class="active"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
        </svg>
        My Assignments
        <span class="tab-count">{{ stats.myAssignments }}</span>
      </RouterLink>

      <RouterLink 
        to="/legalhub/contracts/generator" 
        class="workflow-tab" 
        active-class="active"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14m-7-7h14"/>
        </svg>
        Contract Generator
      </RouterLink>

      <RouterLink 
        to="/legalhub/contracts/repository" 
        class="workflow-tab" 
        active-class="active"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        Clause Repository
      </RouterLink>
    </div>

    <!-- Main Content Area -->
    <div class="main-content-area">
      <RouterView />
    </div>

    <!-- Bulk Actions Panel -->
    <div v-if="showBulkActions" class="bulk-actions-panel">
      <div class="panel-header">
        <h4>Bulk Actions</h4>
        <button @click="showBulkActions = false" class="close-btn">✕</button>
      </div>
      <div class="panel-content">
        <div class="bulk-action-item">
          <button @click="bulkAssign" class="bulk-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            Assign Selected
          </button>
        </div>
        <div class="bulk-action-item">
          <button @click="bulkExport" class="bulk-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
            </svg>
            Export Selected
          </button>
        </div>
        <div class="bulk-action-item">
          <button @click="bulkArchive" class="bulk-btn danger">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6"/>
            </svg>
            Archive Selected
          </button>
        </div>
      </div>
    </div>

    <!-- Template Upload Modal -->
    <div v-if="showTemplateUpload" class="modal-overlay" @click="showTemplateUpload = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Upload Contract Template</h3>
          <button @click="showTemplateUpload = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="upload-zone" @click="triggerFileUpload">
            <div class="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17,8 12,3 7,8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <h4>Upload Contract or Template</h4>
            <p>Drag & drop your document here or click to browse</p>
            <p class="file-types">Supported: PDF, DOC, DOCX</p>
          </div>
          <input ref="fileInput" type="file" accept=".pdf,.doc,.docx" style="display: none" @change="handleFileUpload">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// State
const showBulkActions = ref(false)
const showTemplateUpload = ref(false)
const fileInput = ref()

// Mock data
const stats = ref({
  activeContracts: 347,
  pendingReview: 23,
  overduePending: 5,
  expiringContracts: 18,
  totalValue: 127.8,
  myAssignments: 12
})

// Methods
function exportContracts() {
  console.log('Exporting contracts...')
}

function runComplianceCheck() {
  console.log('Running compliance check...')
}

function bulkAssign() {
  console.log('Bulk assigning contracts...')
  showBulkActions.value = false
}

function bulkExport() {
  console.log('Bulk exporting contracts...')
  showBulkActions.value = false
}

function bulkArchive() {
  console.log('Bulk archiving contracts...')
  showBulkActions.value = false
}

function triggerFileUpload() {
  fileInput.value?.click()
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    console.log('Uploading file:', file.name)
    // Handle file upload logic
    showTemplateUpload.value = false
  }
}

onMounted(() => {
  // Load contracts data
})
</script>

<style scoped>
.contracts-management {
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

.contracts-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-item {
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

.stat-icon.active {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.stat-icon.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-icon.expiring {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.stat-icon.value {
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.stat-change.positive {
  color: var(--health-excellent);
}

.stat-change.negative {
  color: var(--risk-high);
}

.quick-actions {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-card:hover {
  border-color: var(--primary-accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(124, 58, 237, 0.15);
}

.action-icon {
  color: var(--secondary-accent);
}

.action-content {
  text-align: center;
}

.action-content h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.action-content p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.workflow-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.02);
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.workflow-tab {
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

.workflow-tab:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.workflow-tab.active {
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

.main-content-area {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  min-height: 400px;
}

.bulk-actions-panel {
  position: fixed;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  z-index: 100;
  min-width: 200px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.panel-header h4 {
  color: var(--text-primary);
  font-weight: 600;
}

.panel-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bulk-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.bulk-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.bulk-btn.danger {
  color: var(--risk-high);
}

.bulk-btn.danger:hover {
  background: rgba(239, 68, 68, 0.1);
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

.modal-header h3 {
  color: var(--text-primary);
  font-weight: 600;
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

.upload-icon {
  color: var(--secondary-accent);
  margin-bottom: 1rem;
}

.upload-zone h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.upload-zone p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.file-types {
  font-size: 0.75rem;
  color: var(--text-secondary);
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

  .contracts-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .workflow-tabs {
    flex-direction: column;
  }

  .bulk-actions-panel {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    top: auto;
    transform: none;
  }
}
</style>