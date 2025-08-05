<template>
  <div class="legal-intelligence">
    <!-- Header -->
    <div class="intelligence-header">
      <div class="header-content">
        <h2 class="heading-secondary">Legal Intelligence</h2>
        <p class="text-body">AI-powered legal insights, regulatory monitoring, and knowledge management</p>
      </div>
      <div class="header-actions">
        <button @click="refreshIntelligence" class="btn btn-secondary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c5 0 9 4 9 9z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
          Refresh Feed
        </button>
        <button @click="showCustomAlert = true" class="btn btn-primary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
          Custom Alert
        </button>
      </div>
    </div>

    <!-- Intelligence Overview Stats -->
    <div class="intelligence-stats">
      <div class="stat-item">
        <div class="stat-icon clause-deviations">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.clauseDeviations }}</div>
          <div class="stat-label">Clause Deviations</div>
          <div class="stat-change">{{ stats.newDeviations }} new this week</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon regulatory-updates">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.regulatoryUpdates }}</div>
          <div class="stat-label">Regulatory Updates</div>
          <div class="stat-change positive">{{ stats.criticalUpdates }} critical</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon playbooks">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.availablePlaybooks }}</div>
          <div class="stat-label">Available Playbooks</div>
          <div class="stat-change">{{ stats.recentlyUpdated }} updated</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon ai-insights">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a3 3 0 0 0-3 3c0 1.5-1.5 3-3 3s-3 1.5-3 3 1.5 3 3 3c1.5 0 3 1.5 3 3a3 3 0 0 0 6 0c0-1.5 1.5-3 3-3s3-1.5 3-3-1.5-3-3-3c-1.5 0-3-1.5-3-3a3 3 0 0 0-3-3z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.aiInsights }}</div>
          <div class="stat-label">AI Insights</div>
          <div class="stat-change positive">{{ stats.actionableInsights }} actionable</div>
        </div>
      </div>
    </div>

    <!-- AI Intelligence Summary -->
    <div class="ai-summary">
      <h3 class="section-title">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2a3 3 0 0 0-3 3c0 1.5-1.5 3-3 3s-3 1.5-3 3 1.5 3 3 3c1.5 0 3 1.5 3 3a3 3 0 0 0 6 0c0-1.5 1.5-3 3-3s3-1.5 3-3-1.5-3-3-3c-1.5 0-3-1.5-3-3a3 3 0 0 0-3-3z"/>
        </svg>
        AI Intelligence Summary
      </h3>
      <div class="summary-cards">
        <div v-for="insight in aiInsights" :key="insight.id" :class="['insight-card', insight.priority]">
          <div class="insight-header">
            <div class="insight-icon">{{ insight.icon }}</div>
            <div class="insight-meta">
              <h4>{{ insight.title }}</h4>
              <span class="insight-type">{{ insight.type }}</span>
            </div>
            <span :class="['priority-badge', insight.priority]">{{ insight.priority }}</span>
          </div>
          <p class="insight-content">{{ insight.content }}</p>
          <div class="insight-actions">
            <button @click="viewInsight(insight)" class="insight-btn">View Details</button>
            <button @click="acknowledgeInsight(insight)" class="insight-btn secondary">Acknowledge</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Intelligence Tools -->
    <div class="intelligence-tools">
      <h3 class="section-title">Intelligence Tools</h3>
      <div class="tools-grid">
        <RouterLink to="/legalhub/intelligence/deviation" class="tool-card">
          <div class="tool-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
            </svg>
          </div>
          <div class="tool-content">
            <h4>Clause Deviation Analysis</h4>
            <p>AI-powered contract clause risk assessment</p>
            <span class="tool-status active">{{ stats.clauseDeviations }} deviations found</span>
          </div>
        </RouterLink>

        <RouterLink to="/legalhub/intelligence/regulatory" class="tool-card">
          <div class="tool-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          </div>
          <div class="tool-content">
            <h4>Regulatory Feed Monitor</h4>
            <p>Real-time regulatory changes and compliance alerts</p>
            <span class="tool-status warning">{{ stats.criticalUpdates }} critical updates</span>
          </div>
        </RouterLink>

        <RouterLink to="/legalhub/intelligence/playbooks" class="tool-card">
          <div class="tool-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div class="tool-content">
            <h4>Legal Playbooks</h4>
            <p>Standardized processes and training materials</p>
            <span class="tool-status info">{{ stats.availablePlaybooks }} playbooks available</span>
          </div>
        </RouterLink>

        <button @click="showAnalysisModal = true" class="tool-card">
          <div class="tool-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17,8 12,3 7,8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div class="tool-content">
            <h4>Document Analysis</h4>
            <p>AI-powered contract and document review</p>
            <span class="tool-status">Upload for analysis</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Intelligence Navigation -->
    <div class="intelligence-tabs">
      <RouterLink 
        to="/legalhub/intelligence/deviation" 
        class="intelligence-tab" 
        active-class="active"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
        </svg>
        Clause Deviation
        <span class="tab-count">{{ stats.clauseDeviations }}</span>
      </RouterLink>

      <RouterLink 
        to="/legalhub/intelligence/regulatory" 
        class="intelligence-tab" 
        active-class="active"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
        Regulatory Feed
        <span class="tab-count">{{ stats.regulatoryUpdates }}</span>
      </RouterLink>

      <RouterLink 
        to="/legalhub/intelligence/playbooks" 
        class="intelligence-tab" 
        active-class="active"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        Playbooks & Training
        <span class="tab-count">{{ stats.availablePlaybooks }}</span>
      </RouterLink>
    </div>

    <!-- Main Content Area -->
    <div class="main-content-area">
      <RouterView />
    </div>

    <!-- Custom Alert Modal -->
    <div v-if="showCustomAlert" class="modal-overlay" @click="showCustomAlert = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Create Custom Intelligence Alert</h3>
          <button @click="showCustomAlert = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createCustomAlert" class="alert-form">
            <div class="form-group">
              <label class="form-label">Alert Type</label>
              <select v-model="customAlert.type" class="form-select" required>
                <option value="">Select Type</option>
                <option value="regulatory">Regulatory Changes</option>
                <option value="clause_deviation">Clause Deviations</option>
                <option value="compliance">Compliance Updates</option>
                <option value="litigation">Litigation Trends</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Keywords (comma-separated)</label>
              <input v-model="customAlert.keywords" type="text" class="form-input" 
                     placeholder="e.g., data privacy, GDPR, intellectual property">
            </div>
            
            <div class="form-group">
              <label class="form-label">Jurisdictions</label>
              <input v-model="customAlert.jurisdictions" type="text" class="form-input" 
                     placeholder="e.g., United States, European Union, California">
            </div>
            
            <div class="form-group">
              <label class="form-label">Alert Frequency</label>
              <select v-model="customAlert.frequency" class="form-select">
                <option value="immediate">Immediate</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea v-model="customAlert.description" class="form-textarea" rows="3"
                        placeholder="Describe what you want to monitor..."></textarea>
            </div>
            
            <div class="form-actions">
              <button type="button" @click="showCustomAlert = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Create Alert</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Document Analysis Modal -->
    <div v-if="showAnalysisModal" class="modal-overlay" @click="showAnalysisModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>AI Document Analysis</h3>
          <button @click="showAnalysisModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="upload-zone" @click="triggerFileUpload">
            <div class="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a3 3 0 0 0-3 3c0 1.5-1.5 3-3 3s-3 1.5-3 3 1.5 3 3 3c1.5 0 3 1.5 3 3a3 3 0 0 0 6 0c0-1.5 1.5-3 3-3s3-1.5 3-3-1.5-3-3-3c-1.5 0-3-1.5-3-3a3 3 0 0 0-3-3z"/>
              </svg>
            </div>
            <h4>Upload Document for AI Analysis</h4>
            <p>Get instant insights on contracts, legal documents, and clauses</p>
            <p class="file-types">Supported: PDF, DOC, DOCX</p>
          </div>
          <input ref="fileInput" type="file" accept=".pdf,.doc,.docx" style="display: none" @change="handleDocumentUpload">
          
          <div class="analysis-options">
            <h4>Analysis Type</h4>
            <div class="options-grid">
              <label class="option-item">
                <input type="checkbox" v-model="analysisOptions.riskAssessment">
                <span>Risk Assessment</span>
              </label>
              <label class="option-item">
                <input type="checkbox" v-model="analysisOptions.clauseDeviation">
                <span>Clause Deviation</span>
              </label>
              <label class="option-item">
                <input type="checkbox" v-model="analysisOptions.complianceCheck">
                <span>Compliance Check</span>
              </label>
              <label class="option-item">
                <input type="checkbox" v-model="analysisOptions.termExtraction">
                <span>Key Terms Extraction</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// State
const showCustomAlert = ref(false)
const showAnalysisModal = ref(false)
const fileInput = ref()

// Mock data
const stats = ref({
  clauseDeviations: 15,
  newDeviations: 3,
  regulatoryUpdates: 8,
  criticalUpdates: 2,
  availablePlaybooks: 24,
  recentlyUpdated: 5,
  aiInsights: 12,
  actionableInsights: 8
})

const aiInsights = ref([
  {
    id: 1,
    priority: 'high',
    type: 'Risk Analysis',
    title: 'Unusual Liability Clause Detected',
    content: 'AI detected a liability clause in the TechCorp contract that significantly deviates from your standard template, potentially exposing the company to increased risk.',
    icon: '⚠️'
  },
  {
    id: 2,
    priority: 'medium',
    type: 'Compliance Alert',
    title: 'New GDPR Requirements',
    content: 'Recent EU regulatory updates may impact your data processing clauses. 3 active contracts require review for compliance.',
    icon: '🔒'
  },
  {
    id: 3,
    priority: 'low',
    type: 'Optimization',
    title: 'Contract Term Standardization',
    content: 'Analysis shows 12 contracts use varying payment terms. Standardizing could reduce negotiation time by 15%.',
    icon: '📊'
  }
])

const customAlert = ref({
  type: '',
  keywords: '',
  jurisdictions: '',
  frequency: 'weekly',
  description: ''
})

const analysisOptions = ref({
  riskAssessment: true,
  clauseDeviation: true,
  complianceCheck: false,
  termExtraction: false
})

// Methods
function refreshIntelligence() {
  console.log('Refreshing intelligence feed...')
}

function viewInsight(insight) {
  console.log('Viewing insight:', insight.title)
}

function acknowledgeInsight(insight) {
  const index = aiInsights.value.findIndex(i => i.id === insight.id)
  if (index > -1) {
    aiInsights.value.splice(index, 1)
  }
}

function createCustomAlert() {
  console.log('Creating custom alert:', customAlert.value)
  showCustomAlert.value = false
  // Reset form
  customAlert.value = {
    type: '',
    keywords: '',
    jurisdictions: '',
    frequency: 'weekly',
    description: ''
  }
}

function triggerFileUpload() {
  fileInput.value?.click()
}

function handleDocumentUpload(event) {
  const file = event.target.files[0]
  if (file) {
    console.log('Analyzing document:', file.name)
    console.log('Analysis options:', analysisOptions.value)
    showAnalysisModal.value = false
  }
}

onMounted(() => {
  // Load intelligence data
})
</script>

<style scoped>
.legal-intelligence {
  /* Inherits styles from parent */
}

.intelligence-header {
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

.intelligence-stats {
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

.stat-icon.clause-deviations {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-icon.regulatory-updates {
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
}

.stat-icon.playbooks {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.stat-icon.ai-insights {
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

.ai-summary {
  margin-bottom: 3rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.summary-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.insight-card {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  border-left: 4px solid;
}

.insight-card.high {
  border-left-color: var(--risk-high);
}

.insight-card.medium {
  border-left-color: var(--risk-medium);
}

.insight-card.low {
  border-left-color: var(--secondary-accent);
}

.insight-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.insight-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.insight-meta {
  flex: 1;
}

.insight-meta h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.insight-type {
  color: var(--text-secondary);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.priority-badge.high {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.priority-badge.medium {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.priority-badge.low {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.insight-content {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.insight-actions {
  display: flex;
  gap: 0.75rem;
}

.insight-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.insight-btn:not(.secondary) {
  background: var(--primary-accent);
  color: white;
}

.insight-btn:not(.secondary):hover {
  background: #6d28d9;
}

.insight-btn.secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.insight-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.intelligence-tools {
  margin-bottom: 3rem;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.tool-card {
  display: flex;
  flex-direction: column;
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

.tool-card:hover {
  border-color: var(--primary-accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(124, 58, 237, 0.15);
}

.tool-icon {
  color: var(--secondary-accent);
  align-self: flex-start;
}

.tool-content h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.tool-content p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.tool-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  align-self: flex-start;
}

.tool-status.active {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.tool-status.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.tool-status.info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.tool-status:not(.active):not(.warning):not(.info) {
  background: rgba(156, 163, 175, 0.1);
  color: #9ca3af;
}

.intelligence-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.02);
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.intelligence-tab {
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

.intelligence-tab:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.intelligence-tab.active {
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

.alert-form {
  display: flex;
  flex-direction: column;
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
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.upload-zone {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
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

.analysis-options h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.option-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary-accent);
}

.option-item span {
  color: var(--text-primary);
  font-weight: 500;
}

@media (max-width: 768px) {
  .intelligence-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .intelligence-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .summary-cards {
    gap: 0.75rem;
  }

  .insight-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .insight-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }

  .intelligence-tabs {
    flex-direction: column;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }
}
</style>