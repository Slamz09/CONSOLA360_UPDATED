<template>
  <div class="support-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="heading-primary">Customer Support Management</h1>
              </div>
      <div class="dashboard-actions">
        <button class="btn btn-secondary btn-small" @click="showCustomerPortal = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          Customer Portal
        </button>
        <button class="btn btn-primary btn-small" @click="showNewTicketModal = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
          Create Ticket
        </button>
      </div>
    </div>

    <!-- Support Metrics -->
    <div class="support-metrics">
      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-icon pending">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
          <div class="metric-trend">+12%</div>
        </div>
        <div class="metric-value risk-medium">47</div>
        <div class="metric-label">Open Tickets</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-icon urgent">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
            </svg>
          </div>
          <div class="metric-trend risk-high">+3</div>
        </div>
        <div class="metric-value risk-high">12</div>
        <div class="metric-label">Urgent Tickets</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-icon response">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </div>
          <div class="metric-trend health-excellent">-15min</div>
        </div>
        <div class="metric-value health-excellent">2.3h</div>
        <div class="metric-label">Avg Response Time</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-icon satisfaction">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </div>
          <div class="metric-trend health-excellent">+0.2</div>
        </div>
        <div class="metric-value health-excellent">4.7</div>
        <div class="metric-label">Customer Satisfaction</div>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="support-layout">
      <!-- Ticket Queue Sidebar -->
      <div class="ticket-queue">
        <div class="queue-header">
          <h3 class="heading-tertiary">Ticket Queue</h3>
          <div class="queue-filters">
            <button 
              @click="activeQueue = 'all'"
              :class="['filter-btn', { 'active': activeQueue === 'all' }]"
            >
              All ({{ allTickets.length }})
            </button>
            <button 
              @click="activeQueue = 'service'"
              :class="['filter-btn', { 'active': activeQueue === 'service' }]"
            >
              Service Requests ({{ serviceRequests.length }})
            </button>
            <button 
              @click="activeQueue = 'complaints'"
              :class="['filter-btn', { 'active': activeQueue === 'complaints' }]"
            >
              Complaints ({{ complaints.length }})
            </button>
            <button 
              @click="activeQueue = 'urgent'"
              :class="['filter-btn', { 'active': activeQueue === 'urgent' }]"
            >
              Urgent ({{ urgentTickets.length }})
            </button>
          </div>
        </div>

        <div class="ticket-list">
          <div 
            v-for="ticket in filteredTickets" 
            :key="ticket.id"
            @click="selectTicket(ticket)"
            :class="['ticket-item', { 'selected': selectedTicket?.id === ticket.id }]"
          >
            <div class="ticket-header">
              <div class="ticket-id">{{ ticket.id }}</div>
              <div :class="['priority-badge', ticket.priority.toLowerCase()]">
                {{ ticket.priority }}
              </div>
            </div>
            <div class="ticket-content">
              <h4 class="ticket-subject">{{ ticket.subject }}</h4>
              <p class="ticket-customer">{{ ticket.customerName }} • {{ ticket.accountName }}</p>
              <div class="ticket-meta">
                <span :class="['status-badge', 'status-' + ticket.status.toLowerCase().replace(' ', '-')]">
                  {{ ticket.status }}
                </span>
                <span class="ticket-time">{{ ticket.createdTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ticket Detail Panel -->
      <div class="ticket-detail">
        <div v-if="selectedTicket" class="ticket-detail-content">
          <!-- Ticket Header -->
          <div class="detail-header">
            <div class="header-left">
              <h2 class="heading-secondary">{{ selectedTicket.subject }}</h2>
              <div class="ticket-breadcrumb">
                <span class="ticket-id">{{ selectedTicket.id }}</span>
                <span class="separator">•</span>
                <span :class="['ticket-type', selectedTicket.type.toLowerCase()]">{{ selectedTicket.type }}</span>
                <span class="separator">•</span>
                <span class="ticket-account">{{ selectedTicket.accountName }}</span>
              </div>
            </div>
            <div class="header-actions">
              <select v-model="selectedTicket.status" class="status-select">
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending Customer">Pending Customer</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
              <select v-model="selectedTicket.priority" class="priority-select">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="customer-info-card">
            <div class="customer-header">
              <div class="customer-avatar">
                {{ selectedTicket.customerName.split(' ').map(n => n[0]).join('') }}
              </div>
              <div class="customer-details">
                <h4>{{ selectedTicket.customerName }}</h4>
                <p>{{ selectedTicket.customerEmail }}</p>
                <p>{{ selectedTicket.customerPhone || 'No phone on file' }}</p>
              </div>
              <RouterLink :to="`/accounts`" class="btn btn-ghost btn-small">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                View Account
              </RouterLink>
            </div>
            <div class="account-summary">
              <div class="summary-item">
                <span class="summary-label">Account Type:</span>
                <span class="summary-value">{{ selectedTicket.accountType }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Contract Value:</span>
                <span class="summary-value text-accent">{{ selectedTicket.contractValue }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Support Plan:</span>
                <span class="summary-value">{{ selectedTicket.supportPlan }}</span>
              </div>
            </div>
          </div>

          <!-- Conversation Thread -->
          <div class="conversation-thread">
            <h3 class="thread-title">Conversation</h3>
            <div class="message-list">
              <div 
                v-for="message in selectedTicket.messages" 
                :key="message.id"
                :class="['message', message.sender === 'customer' ? 'customer-message' : 'agent-message']"
              >
                <div class="message-header">
                  <div class="message-sender">
                    <div class="sender-avatar">
                      {{ message.senderName.split(' ').map(n => n[0]).join('') }}
                    </div>
                    <div class="sender-info">
                      <span class="sender-name">{{ message.senderName }}</span>
                      <span class="sender-role">{{ message.sender === 'customer' ? 'Customer' : 'Support Agent' }}</span>
                    </div>
                  </div>
                  <div class="message-time">{{ message.timestamp }}</div>
                </div>
                <div class="message-content">
                  {{ message.content }}
                </div>
                <div v-if="message.attachments" class="message-attachments">
                  <div v-for="attachment in message.attachments" :key="attachment.name" class="attachment">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                    </svg>
                    {{ attachment.name }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Reply Form -->
            <div class="reply-form">
              <div class="reply-header">
                <h4>Reply to Customer</h4>
                <div class="reply-actions">
                  <button class="btn btn-ghost btn-small">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                    </svg>
                    Attach File
                  </button>
                  <button class="btn btn-ghost btn-small">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2a3 3 0 0 0-3 3c0 1.5-1.5 3-3 3s-3 1.5-3 3 1.5 3 3 3c1.5 0 3 1.5 3 3a3 3 0 0 0 6 0c0-1.5 1.5-3 3-3s3-1.5 3-3-1.5-3-3-3c-1.5 0-3-1.5-3-3a3 3 0 0 0-3-3z"/>
                    </svg>
                    AI Suggest
                  </button>
                </div>
              </div>
              <textarea 
                v-model="replyMessage"
                placeholder="Type your response to the customer..."
                class="reply-textarea"
                rows="4"
              ></textarea>
              <div class="reply-footer">
                <div class="reply-options">
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="markResolved">
                    <span class="checkmark"></span>
                    Mark as Resolved
                  </label>
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="sendCopy">
                    <span class="checkmark"></span>
                    CC: Account Manager
                  </label>
                </div>
                <div class="reply-buttons">
                  <button class="btn btn-secondary">Save Draft</button>
                  <button class="btn btn-primary">Send Reply</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="no-ticket-selected">
          <div class="empty-state">
            <div class="empty-icon">🎫</div>
            <h3>Select a Ticket</h3>
            <p>Choose a ticket from the queue to view details and respond to customers</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Portal Modal -->
    <div v-if="showCustomerPortal" class="modal-overlay" @click="showCustomerPortal = false">
      <div class="modal-content customer-portal" @click.stop>
        <CustomerPortalView @close="showCustomerPortal = false" />
      </div>
    </div>

    <!-- New Ticket Modal -->
    <div v-if="showNewTicketModal" class="modal-overlay" @click="showNewTicketModal = false">
      <div class="modal-content new-ticket" @click.stop>
        <NewTicketForm @close="showNewTicketModal = false" @created="handleTicketCreated" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CustomerPortalView from './CustomerPortal.vue'
import NewTicketForm from './NewTicketForm.vue'

// Types
interface Ticket {
  id: string
  subject: string
  type: 'Service Request' | 'Complaint' | 'Technical Issue' | 'Billing Question'
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  status: 'New' | 'In Progress' | 'Pending Customer' | 'Resolved' | 'Closed'
  customerName: string
  customerEmail: string
  customerPhone?: string
  accountName: string
  accountType: string
  contractValue: string
  supportPlan: string
  createdTime: string
  assignedAgent?: string
  messages: Message[]
}

interface Message {
  id: string
  sender: 'customer' | 'agent'
  senderName: string
  content: string
  timestamp: string
  attachments?: { name: string, url: string }[]
}

// State
const activeQueue = ref<'all' | 'service' | 'complaints' | 'urgent'>('all')
const selectedTicket = ref<Ticket | null>(null)
const showCustomerPortal = ref(false)
const showNewTicketModal = ref(false)
const replyMessage = ref('')
const markResolved = ref(false)
const sendCopy = ref(false)

// Mock data
const allTickets = ref<Ticket[]>([
  {
    id: 'TK-2024-001',
    subject: 'Contract renewal pricing inquiry',
    type: 'Service Request',
    priority: 'Medium',
    status: 'New',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@acmecorp.com',
    customerPhone: '+1 (555) 123-4567',
    accountName: 'Acme Corporation',
    accountType: 'Enterprise',
    contractValue: '$18.5M',
    supportPlan: 'Premium',
    createdTime: '2 hours ago',
    assignedAgent: 'Mike Chen',
    messages: [
      {
        id: 'msg-1',
        sender: 'customer',
        senderName: 'Sarah Johnson',
        content: 'Hi, I need information about our contract renewal options and any updated pricing for the next term. Our current contract expires in March 2025.',
        timestamp: '2 hours ago'
      }
    ]
  },
  {
    id: 'TK-2024-002',
    subject: 'Billing discrepancy on November invoice',
    type: 'Complaint',
    priority: 'High',
    status: 'In Progress',
    customerName: 'David Kim',
    customerEmail: 'david.kim@globallogistics.com',
    accountName: 'Global Logistics Inc',
    accountType: 'Enterprise',
    contractValue: '$32M',
    supportPlan: 'Standard',
    createdTime: '4 hours ago',
    assignedAgent: 'Lisa Wang',
    messages: [
      {
        id: 'msg-2',
        sender: 'customer',
        senderName: 'David Kim',
        content: 'We noticed a $15,000 charge on our November invoice that doesn\'t match our contract terms. This needs immediate attention.',
        timestamp: '4 hours ago'
      },
      {
        id: 'msg-3',
        sender: 'agent',
        senderName: 'Lisa Wang',
        content: 'Hi David, I\'m looking into this billing discrepancy right now. I\'ve escalated to our billing team and will have an answer within 2 hours.',
        timestamp: '3 hours ago'
      }
    ]
  },
  {
    id: 'TK-2024-003',
    subject: 'AI contract analysis not working',
    type: 'Technical Issue',
    priority: 'Urgent',
    status: 'New',
    customerName: 'Jennifer Martinez',
    customerEmail: 'j.martinez@techstart.com',
    accountName: 'TechStart Solutions',
    accountType: 'SMB',
    contractValue: '$2.4M',
    supportPlan: 'Basic',
    createdTime: '30 minutes ago',
    messages: [
      {
        id: 'msg-4',
        sender: 'customer',
        senderName: 'Jennifer Martinez',
        content: 'The AI contract analysis feature has been down for 2 hours. We have a critical contract review deadline today. Please help!',
        timestamp: '30 minutes ago',
        attachments: [
          { name: 'error-screenshot.png', url: '#' }
        ]
      }
    ]
  }
])

// Computed
const serviceRequests = computed(() => 
  allTickets.value.filter(t => t.type === 'Service Request')
)

const complaints = computed(() => 
  allTickets.value.filter(t => t.type === 'Complaint')
)

const urgentTickets = computed(() => 
  allTickets.value.filter(t => t.priority === 'Urgent')
)

const filteredTickets = computed(() => {
  switch (activeQueue.value) {
    case 'service':
      return serviceRequests.value
    case 'complaints':
      return complaints.value
    case 'urgent':
      return urgentTickets.value
    default:
      return allTickets.value
  }
})

// Methods
function selectTicket(ticket: Ticket) {
  selectedTicket.value = ticket
}

function handleTicketCreated(newTicket: Ticket) {
  allTickets.value.unshift(newTicket)
  showNewTicketModal.value = false
  selectedTicket.value = newTicket
}
</script>

<style scoped>
.support-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 2rem;
}

.header-content h1 {
  margin-bottom: 0.5rem;
}

.support-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.metric-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.metric-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.metric-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
}

.metric-icon.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.metric-icon.urgent {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.metric-icon.response {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.metric-icon.satisfaction {
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
}

.metric-trend {
  font-size: 0.875rem;
  font-weight: 600;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.metric-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.support-layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
  height: calc(100vh - 400px);
}

.ticket-queue {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.queue-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.queue-filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.filter-btn {
  padding: 0.75rem 1rem;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-weight: 500;
}

.filter-btn:hover {
  border-color: var(--secondary-accent);
  color: var(--text-primary);
}

.filter-btn.active {
  background: rgba(124, 58, 237, 0.1);
  border-color: var(--primary-accent);
  color: var(--text-primary);
}

.ticket-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.ticket-item {
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ticket-item:hover {
  border-color: var(--secondary-accent);
  background: rgba(255, 255, 255, 0.02);
}

.ticket-item.selected {
  border-color: var(--primary-accent);
  background: rgba(124, 58, 237, 0.1);
}

.ticket-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.ticket-id {
  font-family: 'Space Grotesk', monospace;
  font-size: 0.875rem;
  color: var(--secondary-accent);
  font-weight: 600;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.priority-badge.low {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.priority-badge.medium {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.priority-badge.high {
  background: rgba(249, 115, 22, 0.2);
  color: #f97316;
}

.priority-badge.urgent {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.ticket-subject {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.ticket-customer {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.ticket-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
}

.ticket-time {
  color: var(--text-secondary);
}

.ticket-detail {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ticket-detail-content {
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 2rem;
}

.header-left h2 {
  margin-bottom: 0.5rem;
}

.ticket-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.separator {
  color: var(--border-color);
}

.ticket-type.service-request {
  color: #22c55e;
}

.ticket-type.complaint {
  color: #ef4444;
}

.ticket-type.technical-issue {
  color: #f59e0b;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.status-select,
.priority-select {
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.customer-info-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.customer-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.customer-avatar {
  width: 48px;
  height: 48px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  flex-shrink: 0;
}

.customer-details {
  flex: 1;
}

.customer-details h4 {
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.customer-details p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

.account-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.summary-value {
  color: var(--text-primary);
  font-weight: 500;
}

.conversation-thread {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.thread-title {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  max-height: 400px;
  overflow-y: auto;
}

.message {
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.customer-message {
  background: rgba(124, 58, 237, 0.05);
  border-color: rgba(124, 58, 237, 0.2);
}

.agent-message {
  background: rgba(34, 197, 94, 0.05);
  border-color: rgba(34, 197, 94, 0.2);
}

.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.message-sender {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sender-avatar {
  width: 32px;
  height: 32px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
}

.sender-info {
  display: flex;
  flex-direction: column;
}

.sender-name {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.875rem;
}

.sender-role {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.message-time {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.message-content {
  color: var(--text-primary);
  line-height: 1.6;
}

.message-attachments {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
}

.attachment {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.reply-form {
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
}

.reply-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.reply-header h4 {
  color: var(--text-primary);
}

.reply-actions {
  display: flex;
  gap: 0.5rem;
}

.reply-textarea {
  width: 100%;
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: inherit;
  resize: vertical;
  margin-bottom: 1rem;
}

.reply-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.reply-options {
  display: flex;
  gap: 1.5rem;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.checkbox-option input {
  display: none;
}

.checkmark {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  position: relative;
}

.checkbox-option input:checked + .checkmark {
  background: var(--primary-accent);
  border-color: var(--primary-accent);
}

.checkbox-option input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 2px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.reply-buttons {
  display: flex;
  gap: 1rem;
}

.no-ticket-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.empty-state {
  text-align: center;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

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
}

.modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

.modal-content.customer-portal {
  width: 800px;
}

.modal-content.new-ticket {
  width: 600px;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .support-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .support-layout {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .reply-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .modal-content {
    width: 95vw;
    margin: 1rem;
  }
}
</style>