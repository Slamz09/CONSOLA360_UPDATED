<template>
  <div class="litigation-compliance">
    <!-- Simple header -->
    <div class="litigation-header">
      <div class="header-content">
        <h2 class="heading-secondary">Legal Matter Management</h2>
      </div>
    </div>

    <!-- Stat boxes: Active, Closed this month, New this month -->
    <div class="litigation-stats">
      <div class="stat-item">
        <div class="stat-icon active-cases">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12l2 2 4-4"/>
          </svg>
        </div>
        <div>
          <div class="stat-number">{{ activeCases }}</div>
          <div class="stat-label">Active Cases</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon closed-month">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        </div>
        <div>
          <div class="stat-number">{{ closedThisMonth }}</div>
          <div class="stat-label">Closed This Month</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon new-month">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
            <path d="M12 14v6M9 17h6"/>
          </svg>
        </div>
        <div>
          <div class="stat-number">{{ newThisMonth }}</div>
          <div class="stat-label">New This Month</div>
        </div>
      </div>
    </div>

    <!-- Legal matter table -->
    <div class="table-container">
      <div class="table-header">
        <div class="cell">Case No</div>
        <div class="cell">Case Type</div>
        <div class="cell">Case Name</div>
        <div class="cell">Plaintiff</div>
        <div class="cell">Defendant</div>
        <div class="cell">Court</div>
      </div>

      <div
        v-for="matter in matters"
        :key="matter.id"
        class="table-row"
      >
        <div class="cell mono">{{ matter.id }}</div>
        <div class="cell">{{ matter.caseType || matter.type }}</div>
        <div class="cell strong">{{ matter.title }}</div>
        <div class="cell">{{ matter.plaintiff || 'N/A' }}</div>
        <div class="cell">{{ matter.defendant || 'N/A' }}</div>
        <div class="cell">{{ matter.court || 'N/A' }}</div>
      </div>

      <div v-if="matters.length === 0" class="table-empty">
        No matters available.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

/* Minimal sample data. Replace with your source or inject via props/store. */
const matters = ref([
  {
    id: 'MTR-2024-001',
    title: 'Employee Discrimination Complaint',
    type: 'Employment',
    caseType: 'Employment',
    plaintiff: 'Former Employee',
    defendant: 'Acme Corp',
    court: 'EEOC',
    status: 'New',
    createdAt: new Date('2024-12-01T09:30:00')
  },
  {
    id: 'MTR-2024-002',
    title: 'Vendor Contract Breach',
    type: 'Contract Dispute',
    caseType: 'Contract',
    plaintiff: 'Acme Corp',
    defendant: 'VendorCo LLC',
    court: 'N/A',
    status: 'Closed',
    createdAt: new Date('2024-11-28T14:15:00'),
    closedAt: new Date() // mark as closed this month
  },
  {
    id: 'MTR-2024-003',
    title: 'IP Infringement Claim',
    type: 'Intellectual Property',
    caseType: 'IP Litigation',
    plaintiff: 'Competitor Inc.',
    defendant: 'Acme Corp',
    court: 'US District Court',
    status: 'Pending Assignment',
    createdAt: new Date('2024-11-30T11:45:00')
  }
])

/* Dates for month calculations */
const now = new Date()
const thisYear = now.getFullYear()
const thisMonth = now.getMonth()

const activeCases = computed(() =>
  matters.value.filter(m => (m.status || '').toLowerCase() !== 'closed').length
)

const closedThisMonth = computed(() =>
  matters.value.filter(m => {
    if ((m.status || '').toLowerCase() !== 'closed') return false
    const d = m.closedAt instanceof Date ? m.closedAt : m.closedAt ? new Date(m.closedAt) : null
    return d && d.getFullYear() === thisYear && d.getMonth() === thisMonth
  }).length
)

const newThisMonth = computed(() =>
  matters.value.filter(m => {
    const d = m.createdAt instanceof Date ? m.createdAt : m.createdAt ? new Date(m.createdAt) : null
    return d && d.getFullYear() === thisYear && d.getMonth() === thisMonth
  }).length
)
</script>

<style scoped>
.litigation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
}
.header-content h2 { margin-bottom: 0.25rem; }

/* Stat boxes */
.litigation-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}
.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-icon.active-cases { background: rgba(34, 197, 94, 0.12); color: #22c55e; }
.stat-icon.closed-month { background: rgba(148, 163, 184, 0.2); color: #94a3b8; }
.stat-icon.new-month { background: rgba(124, 58, 237, 0.12); color: var(--secondary-accent); }
.stat-number { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
.stat-label { color: var(--text-secondary); font-size: 0.85rem; }

/* Table */
.table-container {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  overflow: hidden;
}
.table-header,
.table-row {
  display: grid;
  grid-template-columns:
    160px   /* Case No */
    180px   /* Case Type */
    1fr     /* Case Name */
    220px   /* Plaintiff */
    220px   /* Defendant */
    200px;  /* Court */
  align-items: center;
  min-width: 1100px;
}
.table-header {
  position: sticky;
  top: 0;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  z-index: 1;
  font-weight: 700;
  color: var(--text-primary);
}
.table-row { border-top: 1px solid var(--border-color); }
.cell {
  padding: 0.75rem 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-primary);
}
.cell.strong { font-weight: 700; }
.cell.mono { font-family: 'Space Grotesk', monospace; }
.table-empty { padding: 1rem; color: var(--text-secondary); }

@media (max-width: 768px) {
  .table-header, .table-row {
    grid-template-columns:
      140px 160px 1fr 180px 180px 160px;
    min-width: 960px;
  }
}
</style>
