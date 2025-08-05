import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Account {
  id: string
  name: string
  type: string
  location: string
  status: string
  riskScore?: number
  healthScore?: number
  contracts?: number
  tags?: string[]
  industry?: string
  primaryContact?: string
  email?: string
  phone?: string
  website?: string
  risk?: number
  health?: number
  revenueRange?: string
  notes?: string
  createdDate?: string
}

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([
    {
      id: '1',
      name: 'Acme Corporation',
      type: 'Customer',
      location: 'California, USA',
      status: 'Active',
      riskScore: 72,
      healthScore: 85,
      contracts: 12,
      tags: ['Enterprise', 'High-Value', 'Technology']
    },
    {
      id: '2',
      name: 'Global Logistics Inc',
      type: 'Vendor',
      location: 'Texas, USA',
      status: 'Active',
      riskScore: 45,
      healthScore: 92,
      contracts: 8,
      tags: ['Logistics', 'International', 'Preferred']
    },
    {
      id: '3',
      name: 'TechStart Solutions',
      type: 'Partner',
      location: 'New York, USA',
      status: 'Active',
      riskScore: 23,
      healthScore: 78,
      contracts: 5,
      tags: ['Startup', 'Technology', 'Innovation']
    },
    {
      id: '4',
      name: 'Enterprise Holdings',
      type: 'Customer',
      location: 'London, UK',
      status: 'Active',
      riskScore: 67,
      healthScore: 71,
      contracts: 15,
      tags: ['International', 'Enterprise', 'Finance']
    },
    {
      id: '5',
      name: 'Digital Dynamics',
      type: 'Vendor',
      location: 'California, USA',
      status: 'Under Review',
      riskScore: 89,
      healthScore: 45,
      contracts: 3,
      tags: ['High Risk', 'Compliance Review']
    },
    {
      id: '6',
      name: 'Supply Chain Masters',
      type: 'Vendor',
      location: 'Chicago, IL',
      status: 'Active',
      riskScore: 34,
      healthScore: 88,
      contracts: 10,
      tags: ['Supply Chain', 'Midwest']
    }
  ])

  function addAccount(accountData: Omit<Account, 'id'>) {
    const newAccount: Account = {
      ...accountData,
      id: Date.now().toString(),
      riskScore: accountData.risk || 50,
      healthScore: accountData.health || 75,
      contracts: 0
    }
    accounts.value.push(newAccount)
  }

  function updateAccount(id: string, updates: Partial<Account>) {
    const index = accounts.value.findIndex(a => a.id === id)
    if (index !== -1) {
      accounts.value[index] = { ...accounts.value[index], ...updates }
    }
  }

  function deleteAccount(id: string) {
    const index = accounts.value.findIndex(a => a.id === id)
    if (index !== -1) {
      accounts.value.splice(index, 1)
    }
  }

  function getAccountById(id: string) {
    return accounts.value.find(a => a.id === id)
  }

  return {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    getAccountById
  }
})