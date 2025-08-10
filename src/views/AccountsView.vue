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

    <!-- Placeholder Accounts Table -->
    <div v-if="sortedAccounts.length" class="live-table">
      <h2 class="live-heading">
        Accounts ({{ sortedAccounts.length }} rows)
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
            </tr>
          </thead>
          <tbody>
            <tr v-for="(acct, i) in sortedAccounts" :key="i">
              <td v-for="col in accountColumns" :key="col">
                {{ acct[col] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-state-icon">📊</div>
      <h3>No Accounts Found</h3>
      <p>{{ searchQuery ? 'No accounts match your filter.' : 'Start by adding an account.' }}</p>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: "AccountsView" })
import { ref, computed } from "vue"

const searchQuery = ref("")
const filterType = ref("all")
const sortKey = ref("")
const sortAsc = ref(true)

const accounts = ref([
  {
    companyName: "Acme Corp",
    accountType: "customer",
    industry: "Technology",
    annualRevenue: "$50M",
    primaryContact: "Jane Doe",
    email: "jane@acme.com"
  },
  {
    companyName: "Globex Inc",
    accountType: "vendor",
    industry: "Manufacturing",
    annualRevenue: "$120M",
    primaryContact: "John Smith",
    email: "john@globex.com"
  }
])

const accountColumns = computed(() =>
  accounts.value.length ? Object.keys(accounts.value[0]) : []
)

function sortBy(col) {
  if (sortKey.value === col) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = col
    sortAsc.value = true
  }
}

const filteredAccounts = computed(() => {
  let filtered = accounts.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(row =>
      Object.values(row).some(v =>
        String(v).toLowerCase().includes(q)
      )
    )
  }
  if (filterType.value !== "all") {
    filtered = filtered.filter(acc => acc.accountType === filterType.value)
  }
  return filtered
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
</script>

<style scoped>
/* You can reuse your original CSS styles from the previous file */
</style>
