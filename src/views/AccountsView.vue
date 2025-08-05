<template>
  <div class="accounts-view">
    <!-- Header -->
    <div class="view-header">
      <h1 class="heading-primary">360° Account Intelligence</h1>
      <button @click="showAddAccount = true" class="btn btn-primary">
        <span class="icon">+</span>
        Add Account
      </button>
    </div>

    <!-- Global Row Filter -->
    <div class="filter-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Filter accounts..."
        class="filter-input"
      />
      <select v-model="filterType" class="filter-select">
        <option value="all">All Accounts</option>
        <option value="customer">Customers</option>
        <option value="vendor">Vendors</option>
        <option value="partner">Partners</option>
        <option value="competitor">Competitors</option>
      </select>
    </div>

    <!-- File Upload + Preview -->
    <div class="file-upload">
      <label class="upload-label">Import Spreadsheet</label>
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        @change="onFileChange"
        class="upload-input"
      />
    </div>

    <!-- Filtered & Sorted Imported Data -->
    <div v-if="sortedPreviewData.length" class="data-preview">
      <h2 class="preview-heading">
        Imported Data ({{ sortedPreviewData.length }} rows)
      </h2>
      <table class="preview-table">
        <thead>
          <tr>
            <th
              v-for="col in previewColumns"
              :key="col"
              class="sortable"
              @click="sortBy(col)"
            >
              {{ col }}
              <span v-if="sortKey === col">
                {{ sortAsc ? "▲" : "▼" }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in sortedPreviewData"
            :key="idx"
            class="row-clickable"
            @click="openProfile(row, idx)"
          >
            <td v-for="col in previewColumns" :key="col">
              {{ row[col] }}
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="saveToStorage" class="submit-btn">
        Save In App
      </button>
    </div>

    <!-- Filtered & Sorted Saved Accounts Table -->
    <div v-if="sortedAccounts.length" class="live-table">
      <h2 class="live-heading">
        Saved Accounts ({{ sortedAccounts.length }} rows)
      </h2>
      <div class="table-container">
        <table class="preview-table">
          <thead>
            <tr>
              <th
                v-for="col in accountColumns"
                :key="col"
                class="sortable"
                @click="sortBy(col)"
              >
                {{ col }}
                <span v-if="sortKey === col">
                  {{ sortAsc ? "▲" : "▼" }}
                </span>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(acct, i) in sortedAccounts"
              :key="i"
            >
              <td v-for="col in accountColumns" :key="col">
                {{ acct[col] }}
              </td>
              <td class="actions-cell">
                <button @click="openProfile(acct, i)" class="action-btn view">
                  View
                </button>
                <button @click="editAccount(acct, i)" class="action-btn edit">
                  Edit
                </button>
                <button @click="deleteAccount(i)" class="action-btn delete">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-state-icon">📊</div>
      <h3>No Accounts Found</h3>
      <p>{{ searchQuery ? 'No accounts match your filter.' : 'Start by adding an account or importing data.' }}</p>
    </div>

    <!-- Add/Edit Account Modal -->
    <div v-if="showAddAccount" class="modal-overlay" @click="showAddAccount = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h2>{{ editingIndex !== null ? 'Edit Account' : 'Add New Account' }}</h2>
          <button @click="closeAccountForm" class="close-btn">✕</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="handleAccountSubmit" class="account-form">
            <div class="form-section">
              <h3 class="section-title">Basic Information</h3>
              
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Company Name</label>
                  <input 
                    v-model="accountForm.companyName" 
                    type="text" 
                    class="form-input" 
                    placeholder="Enter company name"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Account Type</label>
                  <select v-model="accountForm.accountType" class="form-select" required>
                    <option value="">Select account type</option>
                    <option value="customer">Customer</option>
                    <option value="vendor">Vendor</option>
                    <option value="partner">Partner</option>
                    <option value="competitor">Competitor</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Industry</label>
                  <select v-model="accountForm.industry" class="form-select" required>
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Annual Revenue</label>
                  <input 
                    v-model="accountForm.annualRevenue" 
                    type="text" 
                    class="form-input" 
                    placeholder="e.g., $10M"
                  >
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">Contact Information</h3>
              
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Primary Contact Name</label>
                  <input 
                    v-model="accountForm.primaryContact" 
                    type="text" 
                    class="form-input" 
                    placeholder="Full name"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <input 
                    v-model="accountForm.email" 
                    type="email" 
                    class="form-input" 
                    placeholder="contact@company.com"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Phone Number</label>
                  <input 
                    v-model="accountForm.phone" 
                    type="tel" 
                    class="form-input" 
                    placeholder="+1 (555) 123-4567"
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Website</label>
                  <input 
                    v-model="accountForm.website" 
                    type="url" 
                    class="form-input" 
                    placeholder="https://www.company.com"
                  >
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">Location & Risk Assessment</h3>
              
              <div class="form-grid">
                <div class="form-group full-width">
                  <label class="form-label">Headquarters Location</label>
                  <input 
                    v-model="accountForm.location" 
                    type="text" 
                    class="form-input" 
                    placeholder="City, State/Country"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Initial Risk Score (0-100)</label>
                  <input 
                    v-model.number="accountForm.riskScore" 
                    type="number" 
                    min="0" 
                    max="100" 
                    class="form-input"
                    placeholder="0-100"
                  >
                  <div class="risk-indicator" :class="getRiskClass(accountForm.riskScore)">
                    {{ getRiskLabel(accountForm.riskScore) }}
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Health Score (0-100)</label>
                  <input 
                    v-model.number="accountForm.healthScore" 
                    type="number" 
                    min="0" 
                    max="100" 
                    class="form-input"
                    placeholder="0-100"
                  >
                  <div class="health-indicator" :class="getHealthClass(accountForm.healthScore)">
                    {{ getHealthLabel(accountForm.healthScore) }}
                  </div>
                </div>

                <div class="form-group full-width">
                  <label class="form-label">Notes</label>
                  <textarea 
                    v-model="accountForm.notes" 
                    class="form-textarea" 
                    rows="4"
                    placeholder="Additional notes or context about this account..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="closeAccountForm" class="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                {{ editingIndex !== null ? 'Update Account' : 'Create Account' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: "AccountsView" })

import { ref, computed, onMounted } from "vue"
import * as XLSX from "xlsx"
import { useRouter } from "vue-router"

const router = useRouter()

// State
const searchQuery = ref("")
const filterType = ref("all")
const showAddAccount = ref(false)
const editingIndex = ref(null)

// Account form data
const defaultAccountForm = {
  companyName: '',
  accountType: '',
  industry: '',
  annualRevenue: '',
  primaryContact: '',
  email: '',
  phone: '',
  website: '',
  location: '',
  riskScore: 50,
  healthScore: 75,
  notes: ''
}

const accountForm = ref({ ...defaultAccountForm })

// Sorting state
const sortKey = ref("")
const sortAsc = ref(true)

function sortBy(col) {
  if (sortKey.value === col) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = col
    sortAsc.value = true
  }
}

// Preview from uploaded file
const previewData = ref([])
const previewColumns = computed(() =>
  previewData.value.length ? Object.keys(previewData.value[0]) : []
)

// Saved accounts
const accounts = ref([])
const accountColumns = computed(() =>
  accounts.value.length ? Object.keys(accounts.value[0]).filter(key => key !== 'id') : []
)

// Filtering
const filteredPreviewData = computed(() => {
  if (!searchQuery.value) return previewData.value
  const q = searchQuery.value.toLowerCase()
  return previewData.value.filter(row =>
    Object.values(row).some(v =>
      String(v).toLowerCase().includes(q)
    )
  )
})

const filteredAccounts = computed(() => {
  let filtered = accounts.value
  
  // Apply search filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(row =>
      Object.values(row).some(v =>
        String(v).toLowerCase().includes(q)
      )
    )
  }
  
  // Apply type filter
  if (filterType.value !== 'all') {
    filtered = filtered.filter(acc => acc.accountType === filterType.value)
  }
  
  return filtered
})

// Sorting
const sortedPreviewData = computed(() => {
  const data = filteredPreviewData.value.slice()
  if (sortKey.value) {
    data.sort((a, b) => {
      const x = String(a[sortKey.value] ?? "")
      const y = String(b[sortKey.value] ?? "")
      return x.localeCompare(y) * (sortAsc.value ? 1 : -1)
    })
  }
  return data
})

const sortedAccounts = computed(() => {
  const data = filteredAccounts.value.slice()
  if (sortKey.value) {
    data.sort((a, b) => {
      const x = String(a[sortKey.value] ?? "")
      const y = String(b[sortKey.value] ?? "")
      return x.localeCompare(y) * (sortAsc.value ? 1 : -1)
    })
  }
  return data
})

// Load saved accounts on mount
onMounted(() => {
  const saved = localStorage.getItem("accounts")
  accounts.value = saved ? JSON.parse(saved) : []
})

// Open detail view in new tab
function openProfile(row, index) {
  const url = router.resolve({
    name: "AccountProfile",
    params: { index }
  }).href
  window.open(url, "_blank")
}

// Handle file import
function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = evt => {
    const wb = XLSX.read(evt.target.result, { type: "binary" })
    const ws = wb.Sheets[wb.SheetNames[0]]
    previewData.value = XLSX.utils.sheet_to_json(ws, { defval: "" })
  }
  reader.readAsBinaryString(file)
}

// Persist to localStorage
function saveToStorage() {
  const newAccounts = previewData.value.map((data, idx) => ({
    id: Date.now() + idx,
    ...data
  }))
  accounts.value = [...accounts.value, ...newAccounts]
  localStorage.setItem("accounts", JSON.stringify(accounts.value))
  previewData.value = []
}

// Account form methods
function handleAccountSubmit() {
  if (editingIndex.value !== null) {
    // Update existing account
    accounts.value[editingIndex.value] = {
      ...accounts.value[editingIndex.value],
      ...accountForm.value
    }
  } else {
    // Add new account
    const newAccount = {
      id: Date.now(),
      ...accountForm.value
    }
    accounts.value.push(newAccount)
  }
  
  // Save to localStorage
  localStorage.setItem("accounts", JSON.stringify(accounts.value))
  
  // Close form
  closeAccountForm()
}

function editAccount(account, index) {
  accountForm.value = { ...account }
  editingIndex.value = index
  showAddAccount.value = true
}

function deleteAccount(index) {
  if (confirm('Are you sure you want to delete this account?')) {
    accounts.value.splice(index, 1)
    localStorage.setItem("accounts", JSON.stringify(accounts.value))
  }
}

function closeAccountForm() {
  showAddAccount.value = false
  editingIndex.value = null
  accountForm.value = { ...defaultAccountForm }
}

// Risk/Health helpers
const getRiskClass = (score) => {
  if (score <= 33) return 'low'
  if (score <= 66) return 'medium'
  return 'high'
}

const getRiskLabel = (score) => {
  if (score <= 33) return 'Low Risk'
  if (score <= 66) return 'Medium Risk'
  return 'High Risk'
}

const getHealthClass = (score) => {
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  if (score >= 40) return 'fair'
  return 'poor'
}

const getHealthLabel = (score) => {
  if (score >= 80) return 'Excellent Health'
  if (score >= 60) return 'Good Health'
  if (score >= 40) return 'Fair Health'
  return 'Poor Health'
}
</script>

<style scoped>
.accounts-view {
  padding: 1.5rem;
  color: #e0e0ff;
  background: #1e1e28;
}

/* Header */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.heading-primary {
  font-size: 1.75rem;
  font-weight: bold;
}

/* Filter bar */
.filter-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-input {
  flex: 1;
  max-width: 400px;
  padding: 0.5rem 1rem;
  background: #2e2e42;
  border: 1px solid #444;
  border-radius: 8px;
  color: #eee;
}

.filter-select {
  padding: 0.5rem 1rem;
  background: #2e2e42;
  border: 1px solid #444;
  border-radius: 8px;
  color: #eee;
  min-width: 150px;
}

/* File upload */
.file-upload {
  margin-bottom: 2rem;
}

.upload-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #ccc;
}

.upload-input {
  padding: 0.5rem;
  background: #2e2e42;
  border: 1px solid #444;
  border-radius: 4px;
  color: #eee;
}

/* Tables */
.data-preview,
.live-table {
  margin-top: 2rem;
}

.preview-heading,
.live-heading {
  margin-bottom: 0.75rem;
  color: #ddd;
}

.table-container {
  overflow-x: auto;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  background: #1e1e28;
  color: #e0e0ff;
}

.preview-table th,
.preview-table td {
  padding: 0.75rem 1rem;
  border: 1px solid #333;
  text-align: left;
}

.preview-table th {
  background: #2e2e42;
  font-weight: 600;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background: #3e3e52;
}

.row-clickable {
  cursor: pointer;
}

.preview-table tr:nth-child(even) {
  background: #262637;
}

.preview-table tr:hover {
  background: #3e3e52;
}

/* Actions cell */
.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.view {
  background: #3b82f6;
  color: white;
}

.action-btn.view:hover {
  background: #2563eb;
}

.action-btn.edit {
  background: #8b5cf6;
  color: white;
}

.action-btn.edit:hover {
  background: #7c3aed;
}

.action-btn.delete {
  background: #ef4444;
  color: white;
}

.action-btn.delete:hover {
  background: #dc2626;
}

/* Button */
.submit-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background: #6b21a8;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #aaa;
}

.empty-state-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #ddd;
}

/* Modal */
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
  background: #1e1e28;
  border: 1px solid #444;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.large {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid #444;
}

.modal-header h2 {
  font-size: 1.5rem;
  color: #fff;
}

.close-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
}

.close-btn:hover {
  color: #fff;
}

.modal-body {
  padding: 2rem;
}

/* Form styles */
.account-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid #444;
  border-radius: 12px;
  padding: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 1rem;
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

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.875rem;
  color: #ccc;
  font-weight: 500;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem;
  background: #2e2e42;
  border: 1px solid #555;
  border-radius: 6px;
  color: #fff;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.form-textarea {
  resize: vertical;
}

.risk-indicator,
.health-indicator {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.risk-indicator.low,
.health-indicator.excellent {
  color: #10b981;
}

.risk-indicator.medium,
.health-indicator.good {
  color: #f59e0b;
}

.risk-indicator.high,
.health-indicator.fair,
.health-indicator.poor {
  color: #ef4444;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  text-decoration: none;
}

.btn-primary {
  background: #7c3aed;
  color: white;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);
}

.btn-primary:hover {
  background: #6d28d9;
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(124, 58, 237, 0.4);
}

.btn-secondary {
  background: #2e2e42;
  color: #fff;
  border: 1px solid #555;
}

.btn-secondary:hover {
  background: #3e3e52;
  border-color: #7c3aed;
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

/* Responsive */
@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .filter-bar {
    flex-direction: column;
  }
  
  .filter-input,
  .filter-select {
    width: 100%;
    max-width: none;
  }
  
  .form-section {
    padding: 1rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-cell {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style>