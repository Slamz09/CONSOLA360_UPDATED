<template>
  <div class="legal-timeline">
    <!-- Header -->
    <div class="timeline-header">
      <div class="header-content">
        <h3 class="heading-tertiary">Legal Timeline</h3>
        <p class="text-body">Comprehensive view of all legal events, deadlines, and case milestones</p>
      </div>
      <div class="header-actions">
        <button @click="showFiltersModal = true" class="btn btn-secondary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
          </svg>
          Filters
        </button>
        <button @click="showAddEventModal = true" class="btn btn-primary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
          Add Event
        </button>
      </div>
    </div>

    <!-- Timeline Overview -->
    <div class="timeline-overview">
      <div class="overview-card critical">
        <div class="overview-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
          </svg>
        </div>
        <div class="overview-content">
          <div class="overview-number">{{ timelineStats.urgentDeadlines }}</div>
          <div class="overview-label">Urgent Deadlines</div>
          <div class="overview-detail">Next 7 days</div>
        </div>
      </div>

      <div class="overview-card upcoming">
        <div class="overview-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        </div>
        <div class="overview-content">
          <div class="overview-number">{{ timelineStats.upcomingEvents }}</div>
          <div class="overview-label">Upcoming Events</div>
          <div class="overview-detail">Next 30 days</div>
        </div>
      </div>

      <div class="overview-card milestones">
        <div class="overview-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div class="overview-content">
          <div class="overview-number">{{ timelineStats.completedMilestones }}</div>
          <div class="overview-label">Completed This Month</div>
          <div class="overview-detail">{{ timelineStats.pendingMilestones }} pending</div>
        </div>
      </div>

      <div class="overview-card conflicts">
        <div class="overview-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="overview-content">
          <div class="overview-number">{{ timelineStats.schedulingConflicts }}</div>
          <div class="overview-label">Scheduling Conflicts</div>
          <div class="overview-detail">Require attention</div>
        </div>
      </div>
    </div>

    <!-- Critical Alerts -->
    <div v-if="criticalAlerts.length > 0" class="critical-alerts">
      <h4 class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
        </svg>
        Critical Timeline Alerts
      </h4>
      <div class="alerts-list">
        <div v-for="alert in criticalAlerts" :key="alert.id" :class="['alert-item', alert.severity]">
          <div class="alert-icon">
            <svg v-if="alert.type === 'deadline'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            <svg v-else-if="alert.type === 'conflict'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
            </svg>
          </div>
          <div class="alert-content">
            <h5>{{ alert.title }}</h5>
            <p>{{ alert.message }}</p>
            <div class="alert-meta">
              <span class="case-link" @click="viewCase(alert.caseId)">{{ alert.caseNumber }}</span>
              <span class="alert-time">{{ formatDate(alert.date) }}</span>
            </div>
          </div>
          <div class="alert-actions">
            <button @click="resolveAlert(alert)" class="alert-btn resolve">Resolve</button>
            <button @click="snoozeAlert(alert)" class="alert-btn snooze">Snooze</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline Controls -->
    <div class="timeline-controls">
      <div class="view-controls">
        <div class="view-tabs">
          <button 
            v-for="view in timelineViews" 
            :key="view.key"
            @click="activeView = view.key"
            :class="['view-tab', { active: activeView === view.key }]"
          >
            {{ view.label }}
          </button>
        </div>
      </div>

      <div class="filter-controls">
        <select v-model="eventTypeFilter" class="filter-select">
          <option value="">All Event Types</option>
          <option value="deadline">Deadlines</option>
          <option value="hearing">Hearings</option>
          <option value="deposition">Depositions</option>
          <option value="filing">Filings</option>
          <option value="milestone">Milestones</option>
          <option value="conference">Conferences</option>
        </select>

        <select v-model="caseFilter" class="filter-select">
          <option value="">All Cases</option>
          <option v-for="case_ in uniqueCases" :key="case_.id" :value="case_.id">
            {{ case_.caseNumber }} - {{ case_.title }}
          </option>
        </select>

        <select v-model="priorityFilter" class="filter-select">
          <option value="">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>

    <!-- Timeline View -->
    <div class="timeline-container">
      <!-- Calendar View -->
      <div v-if="activeView === 'calendar'" class="calendar-view">
        <div class="calendar-header">
          <button @click="previousMonth" class="nav-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>
          <h4>{{ formatMonth(currentMonth) }}</h4>
          <button @click="nextMonth" class="nav-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </button>
        </div>

        <div class="calendar-grid">
          <div class="calendar-weekdays">
            <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
          </div>
          <div class="calendar-days">
            <div 
              v-for="day in calendarDays" 
              :key="day.date"
              :class="['calendar-day', {
                'other-month': !day.isCurrentMonth,
                'today': day.isToday,
                'has-events': day.events.length > 0
              }]"
            >
              <div class="day-number">{{ day.day }}</div>
              <div v-if="day.events.length > 0" class="day-events">
                <div 
                  v-for="event in day.events.slice(0, 3)" 
                  :key="event.id"
                  :class="['event-dot', event.priority, event.type]"
                  @click="viewEvent(event)"
                  :title="event.title"
                ></div>
                <div v-if="day.events.length > 3" class="more-events">
                  +{{ day.events.length - 3 }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline View -->
      <div v-else-if="activeView === 'timeline'" class="timeline-view">
        <div class="timeline-events">
          <div v-for="event in filteredEvents" :key="event.id" class="timeline-event">
            <div class="event-date-column">
              <div class="event-date">{{ formatEventDate(event.date) }}</div>
              <div class="event-time">{{ formatEventTime(event.date) }}</div>
            </div>
            
            <div class="event-connector">
              <div :class="['event-marker', event.priority, event.type]"></div>
              <div class="connector-line"></div>
            </div>
            
            <div class="event-content">
              <div class="event-header">
                <h5 class="event-title">{{ event.title }}</h5>
                <div class="event-badges">
                  <span :class="['priority-badge', event.priority]">{{ event.priority }}</span>
                  <span :class="['type-badge', event.type]">{{ event.type }}</span>
                </div>
              </div>
              
              <p class="event-description">{{ event.description }}</p>
              
              <div class="event-details">
                <div class="event-meta">
                  <span class="case-link" @click="viewCase(event.caseId)">{{ event.caseNumber }}</span>
                  <span class="assigned-to">{{ event.assignedTo }}</span>
                  <span v-if="event.location" class="location">{{ event.location }}</span>
                </div>
                
                <div v-if="event.participants" class="participants">
                  <span class="participants-label">Participants:</span>
                  <span class="participants-list">{{ event.participants.join(', ') }}</span>
                </div>
                
                <div v-if="event.preparation" class="preparation">
                  <span class="prep-label">Preparation Required:</span>
                  <ul class="prep-list">
                    <li v-for="item in event.preparation" :key="item">{{ item }}</li>
                  </ul>
                </div>
              </div>
              
              <div class="event-actions">
                <button @click="editEvent(event)" class="event-btn edit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
                <button @click="markComplete(event)" class="event-btn complete" v-if="event.type === 'deadline' || event.type === 'milestone'">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  Complete
                </button>
                <button @click="rescheduleEvent(event)" class="event-btn reschedule">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gantt Chart View -->
      <div v-else-if="activeView === 'gantt'" class="gantt-view">
        <div class="gantt-header">
          <h4>Case Timeline Gantt Chart</h4>
          <p>Visual representation of case milestones and deadlines</p>
        </div>
        
        <div class="gantt-chart">
          <div class="gantt-timeline">
            <div class="timeline-header">
              <div v-for="month in ganttMonths" :key="month" class="timeline-month">
                {{ month }}
              </div>
            </div>
            
            <div class="gantt-rows">
              <div v-for="case_ in uniqueCases" :key="case_.id" class="gantt-row">
                <div class="row-header">
                  <span class="case-number">{{ case_.caseNumber }}</span>
                  <span class="case-title">{{ case_.title }}</span>
                </div>
                <div class="row-timeline">
                  <div 
                    v-for="event in getEventsForCase(case_.id)" 
                    :key="event.id"
                    :class="['gantt-event', event.type, event.priority]"
                    :style="getEventPosition(event)"
                    @click="viewEvent(event)"
                    :title="event.title"
                  >
                    <span class="event-label">{{ event.title }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Event Modal -->
    <div v-if="showAddEventModal" class="modal-overlay" @click="showAddEventModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Add Timeline Event</h3>
          <button @click="showAddEventModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addEvent" class="event-form">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Event Title *</label>
                <input v-model="newEvent.title" type="text" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Event Type *</label>
                <select v-model="newEvent.type" class="form-select" required>
                  <option value="">Select Type</option>
                  <option value="deadline">Deadline</option>
                  <option value="hearing">Court Hearing</option>
                  <option value="deposition">Deposition</option>
                  <option value="filing">Filing</option>
                  <option value="milestone">Milestone</option>
                  <option value="conference">Conference</option>
                  <option value="trial">Trial</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Priority</label>
                <select v-model="newEvent.priority" class="form-select">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Case *</label>
                <select v-model="newEvent.caseId" class="form-select" required>
                  <option value="">Select Case</option>
                  <option v-for="case_ in uniqueCases" :key="case_.id" :value="case_.id">
                    {{ case_.caseNumber }} - {{ case_.title }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Date *</label>
                <input v-model="newEvent.date" type="datetime-local" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Location</label>
                <input v-model="newEvent.location" type="text" class="form-input">
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea v-model="newEvent.description" class="form-textarea" rows="3"></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Assigned To</label>
              <input v-model="newEvent.assignedTo" type="text" class="form-input">
            </div>
            
            <div class="form-actions">
              <button type="button" @click="showAddEventModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Add Event</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// State
const showFiltersModal = ref(false)
const showAddEventModal = ref(false)
const activeView = ref('timeline')
const eventTypeFilter = ref('')
const caseFilter = ref('')
const priorityFilter = ref('')
const currentMonth = ref(new Date())

// Mock data
const timelineStats = ref({
  urgentDeadlines: 5,
  upcomingEvents: 23,
  completedMilestones: 12,
  pendingMilestones: 8,
  schedulingConflicts: 3
})

const criticalAlerts = ref([
  {
    id: 1,
    type: 'deadline',
    severity: 'critical',
    title: 'Discovery Deadline Tomorrow',
    message: 'Document production deadline for TechCorp case',
    caseId: 'CASE-2024-001',
    caseNumber: 'CV-2024-001',
    date: new Date('2024-12-10')
  },
  {
    id: 2,
    type: 'conflict',
    severity: 'warning',
    title: 'Scheduling Conflict',
    message: 'Two hearings scheduled at the same time',
    caseId: 'CASE-2024-002',
    caseNumber: 'EEOC-2024-002',
    date: new Date('2024-12-15')
  }
])

const timelineEvents = ref([
  {
    id: 1,
    title: 'Discovery Response Due',
    type: 'deadline',
    priority: 'critical',
    date: new Date('2024-12-10T17:00:00'),
    caseId: 'CASE-2024-001',
    caseNumber: 'CV-2024-001',
    description: 'Submit responses to plaintiff\'s discovery requests',
    assignedTo: 'Michael Chen',
    preparation: [
      'Review all responsive documents',
      'Prepare privilege log',
      'Coordinate with client for document production'
    ]
  },
  {
    id: 2,
    title: 'Mediation Conference',
    type: 'conference',
    priority: 'high',
    date: new Date('2024-12-15T10:00:00'),
    caseId: 'CASE-2024-002',
    caseNumber: 'EEOC-2024-002',
    description: 'Court-ordered mediation with neutral mediator',
    assignedTo: 'Emily Rodriguez',
    location: 'Mediation Center Downtown',
    participants: ['Client representative', 'Opposing counsel', 'Mediator']
  },
  {
    id: 3,
    title: 'Expert Witness Deposition',
    type: 'deposition',
    priority: 'high',
    date: new Date('2024-12-18T09:00:00'),
    caseId: 'CASE-2024-001',
    caseNumber: 'CV-2024-001',
    description: 'Deposition of plaintiff\'s technical expert',
    assignedTo: 'Michael Chen',
    location: 'Law Office Conference Room A',
    participants: ['Expert witness', 'Opposing counsel', 'Court reporter'],
    preparation: [
      'Review expert report thoroughly',
      'Prepare cross-examination questions',
      'Coordinate with technical consultant'
    ]
  },
  {
    id: 4,
    title: 'Motion Hearing',
    type: 'hearing',
    priority: 'medium',
    date: new Date('2024-12-20T14:00:00'),
    caseId: 'CASE-2024-001',
    caseNumber: 'CV-2024-001',
    description: 'Hearing on motion to compel discovery',
    assignedTo: 'Michael Chen',
    location: 'Superior Court Room 302'
  },
  {
    id: 5,
    title: 'Case Management Conference',
    type: 'conference',
    priority: 'medium',
    date: new Date('2024-12-22T11:00:00'),
    caseId: 'CASE-2024-003',
    caseNumber: 'IP-2024-003',
    description: 'Quarterly case management conference with judge',
    assignedTo: 'Robert Kim',
    location: 'Federal Court Room 1A'
  }
])

const newEvent = ref({
  title: '',
  type: '',
  priority: 'medium',
  date: '',
  caseId: '',
  description: '',
  location: '',
  assignedTo: ''
})

const timelineViews = [
  { key: 'timeline', label: 'Timeline' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'gantt', label: 'Gantt Chart' }
]

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Computed
const uniqueCases = computed(() => {
  const cases = new Map()
  timelineEvents.value.forEach(event => {
    if (!cases.has(event.caseId)) {
      cases.set(event.caseId, {
        id: event.caseId,
        caseNumber: event.caseNumber,
        title: 'Case Title' // In real app, would come from cases data
      })
    }
  })
  return Array.from(cases.values())
})

const filteredEvents = computed(() => {
  let filtered = timelineEvents.value

  if (eventTypeFilter.value) {
    filtered = filtered.filter(e => e.type === eventTypeFilter.value)
  }
  if (caseFilter.value) {
    filtered = filtered.filter(e => e.caseId === caseFilter.value)
  }
  if (priorityFilter.value) {
    filtered = filtered.filter(e => e.priority === priorityFilter.value)
  }

  return filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
})

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const firstSunday = new Date(firstDay)
  firstSunday.setDate(firstDay.getDate() - firstDay.getDay())
  
  const days = []
  const current = new Date(firstSunday)
  
  for (let i = 0; i < 42; i++) {
    const dayEvents = filteredEvents.value.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === current.toDateString()
    })
    
    days.push({
      date: new Date(current),
      day: current.getDate(),
      isCurrentMonth: current.getMonth() === month,
      isToday: current.toDateString() === new Date().toDateString(),
      events: dayEvents
    })
    
    current.setDate(current.getDate() + 1)
  }
  
  return days
})

const ganttMonths = computed(() => {
  const months = []
  const start = new Date()
  start.setMonth(start.getMonth() - 2)
  
  for (let i = 0; i < 12; i++) {
    months.push(start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))
    start.setMonth(start.getMonth() + 1)
  }
  
  return months
})

// Methods
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

function formatEventDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

function formatEventTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

function formatMonth(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(date)
}

function previousMonth() {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1)
}

function nextMonth() {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1)
}

function viewCase(caseId) {
  console.log('Viewing case:', caseId)
}

function resolveAlert(alert) {
  const index = criticalAlerts.value.findIndex(a => a.id === alert.id)
  if (index > -1) {
    criticalAlerts.value.splice(index, 1)
  }
}

function snoozeAlert(alert) {
  console.log('Snoozing alert:', alert.title)
}

function viewEvent(event) {
  console.log('Viewing event:', event.title)
}

function editEvent(event) {
  console.log('Editing event:', event.title)
}

function markComplete(event) {
  console.log('Marking complete:', event.title)
  event.completed = true
}

function rescheduleEvent(event) {
  console.log('Rescheduling event:', event.title)
}

function getEventsForCase(caseId) {
  return filteredEvents.value.filter(event => event.caseId === caseId)
}

function getEventPosition(event) {
  // Calculate position based on date for Gantt chart
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 2)
  const eventDate = new Date(event.date)
  const diffTime = eventDate.getTime() - startDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const totalDays = 365 // Approximate year span
  const leftPosition = Math.max(0, Math.min(100, (diffDays / totalDays) * 100))
  
  return {
    left: `${leftPosition}%`,
    width: '8px'
  }
}

function addEvent() {
  const event = {
    id: Date.now(),
    ...newEvent.value,
    date: new Date(newEvent.value.date)
  }
  
  // Find case info
  const case_ = uniqueCases.value.find(c => c.id === newEvent.value.caseId)
  if (case_) {
    event.caseNumber = case_.caseNumber
  }
  
  timelineEvents.value.push(event)
  showAddEventModal.value = false
  
  // Reset form
  newEvent.value = {
    title: '',
    type: '',
    priority: 'medium',
    date: '',
    caseId: '',
    description: '',
    location: '',
    assignedTo: ''
  }
}

onMounted(() => {
  // Load timeline data
})
</script>

<style scoped>
.legal-timeline {
  /* Inherits styles from parent */
}

.timeline-header {
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

.timeline-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.overview-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  border-left: 4px solid;
}

.overview-card.critical {
  border-left-color: var(--risk-high);
}

.overview-card.upcoming {
  border-left-color: var(--secondary-accent);
}

.overview-card.milestones {
  border-left-color: var(--health-excellent);
}

.overview-card.conflicts {
  border-left-color: var(--risk-medium);
}

.overview-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
}

.overview-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.overview-label {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.overview-detail {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.critical-alerts {
  margin-bottom: 3rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-item.critical {
  background: rgba(239, 68, 68, 0.1);
  border-left-color: #ef4444;
}

.alert-item.warning {
  background: rgba(245, 158, 11, 0.1);
  border-left-color: #f59e0b;
}

.alert-icon {
  color: var(--text-primary);
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-content h5 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.alert-content p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.alert-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
}

.case-link {
  color: var(--secondary-accent);
  cursor: pointer;
  font-weight: 500;
}

.case-link:hover {
  text-decoration: underline;
}

.alert-time {
  color: var(--text-secondary);
}

.alert-actions {
  display: flex;
  gap: 0.75rem;
}

.alert-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.alert-btn.resolve {
  background: var(--health-excellent);
  color: white;
}

.alert-btn.snooze {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.timeline-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
}

.view-tabs {
  display: flex;
  gap: 0.5rem;
  background: var(--bg-primary);
  padding: 0.5rem;
  border-radius: 8px;
}

.view-tab {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.view-tab.active {
  background: var(--primary-accent);
  color: white;
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-select {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.timeline-container {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  min-height: 600px;
}

/* Calendar View Styles */
.calendar-view {
  width: 100%;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.calendar-header h4 {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.25rem;
}

.nav-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.calendar-grid {
  width: 100%;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--border-color);
  margin-bottom: 1px;
}

.weekday {
  background: var(--bg-secondary);
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--border-color);
}

.calendar-day {
  background: var(--bg-primary);
  min-height: 120px;
  padding: 0.75rem;
  position: relative;
  transition: all 0.2s ease;
}

.calendar-day:hover {
  background: rgba(255, 255, 255, 0.02);
}

.calendar-day.other-month {
  background: rgba(255, 255, 255, 0.01);
  opacity: 0.5;
}

.calendar-day.today {
  background: rgba(124, 58, 237, 0.1);
  border: 2px solid var(--primary-accent);
}

.calendar-day.has-events {
  background: rgba(255, 255, 255, 0.03);
}

.day-number {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.calendar-day.today .day-number {
  color: var(--primary-accent);
  font-weight: 700;
}

.day-events {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.event-dot {
  width: 100%;
  height: 16px;
  border-radius: 3px;
  font-size: 0.7rem;
  padding: 0.125rem 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.event-dot:hover {
  transform: scale(1.02);
}

.event-dot.critical {
  background: rgba(239, 68, 68, 0.8);
}

.event-dot.high {
  background: rgba(245, 158, 11, 0.8);
}

.event-dot.medium {
  background: rgba(124, 58, 237, 0.8);
}

.event-dot.low {
  background: rgba(34, 197, 94, 0.8);
}

.more-events {
  color: var(--text-secondary);
  font-size: 0.7rem;
  text-align: center;
  margin-top: 0.25rem;
}

/* Timeline View Styles */
.timeline-view {
  width: 100%;
}

.timeline-events {
  position: relative;
}

.timeline-event {
  display: grid;
  grid-template-columns: 120px 40px 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: start;
}

.event-date-column {
  text-align: right;
  padding-top: 0.5rem;
}

.event-date {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.875rem;
}

.event-time {
  color: var(--text-secondary);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.event-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.event-marker {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid var(--bg-primary);
  z-index: 2;
}

.event-marker.critical {
  background: var(--risk-high);
}

.event-marker.high {
  background: var(--risk-medium);
}

.event-marker.medium {
  background: var(--secondary-accent);
}

.event-marker.low {
  background: var(--health-excellent);
}

.event-marker.deadline {
  border-style: dashed;
}

.connector-line {
  width: 2px;
  flex: 1;
  background: var(--border-color);
  min-height: 60px;
}

.event-content {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.event-title {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1rem;
}

.event-badges {
  display: flex;
  gap: 0.5rem;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-badge.critical {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.priority-badge.high {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.priority-badge.medium {
  background: rgba(124, 58, 237, 0.1);
  color: var(--secondary-accent);
}

.priority-badge.low {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
}

.event-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.event-details {
  margin-bottom: 1.5rem;
}

.event-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  flex-wrap: wrap;
}

.case-link {
  color: var(--secondary-accent);
  cursor: pointer;
  font-weight: 500;
}

.assigned-to {
  color: var(--text-primary);
  font-weight: 500;
}

.location {
  color: var(--text-secondary);
}

.participants {
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.participants-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.participants-list {
  color: var(--text-primary);
}

.preparation {
  font-size: 0.875rem;
}

.prep-label {
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
}

.prep-list {
  color: var(--text-primary);
  margin-left: 1rem;
}

.prep-list li {
  margin-bottom: 0.25rem;
}

.event-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.event-btn {
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

.event-btn.edit {
  background: var(--primary-accent);
  color: white;
}

.event-btn.complete {
  background: var(--health-excellent);
  color: white;
}

.event-btn.reschedule {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

/* Gantt Chart Styles */
.gantt-view {
  width: 100%;
}

.gantt-header {
  margin-bottom: 2rem;
}

.gantt-header h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.gantt-header p {
  color: var(--text-secondary);
}

.gantt-chart {
  overflow-x: auto;
}

.gantt-timeline {
  min-width: 800px;
}

.timeline-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1rem;
}

.timeline-month {
  padding: 1rem;
  text-align: center;
  font-weight: 500;
  color: var(--text-secondary);
  border-right: 1px solid var(--border-color);
}

.gantt-rows {
  display: flex;
  flex-direction: column;
}

.gantt-row {
  display: grid;
  grid-template-columns: 300px 1fr;
  border-bottom: 1px solid var(--border-color);
  min-height: 60px;
}

.row-header {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.case-number {
  color: var(--secondary-accent);
  font-weight: 500;
  font-size: 0.875rem;
}

.case-title {
  color: var(--text-primary);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.row-timeline {
  position: relative;
  padding: 1rem 0;
}

.gantt-event {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 20px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
}

.gantt-event:hover {
  transform: translateY(-50%) scale(1.05);
}

.gantt-event.critical {
  background: var(--risk-high);
}

.gantt-event.high {
  background: var(--risk-medium);
}

.gantt-event.medium {
  background: var(--secondary-accent);
}

.gantt-event.low {
  background: var(--health-excellent);
}

.event-label {
  color: white;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
}

.modal-body {
  padding: 2rem;
}

.event-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

@media (max-width: 768px) {
  .timeline-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .timeline-overview {
    grid-template-columns: repeat(2, 1fr);
  }

  .timeline-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-controls {
    width: 100%;
    flex-direction: column;
  }

  .timeline-event {
    grid-template-columns: 80px 20px 1fr;
    gap: 0.5rem;
  }

  .event-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .event-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .calendar-day {
    min-height: 80px;
    padding: 0.5rem;
  }

  .gantt-timeline {
    min-width: 600px;
  }

  .timeline-header,
  .gantt-row {
    grid-template-columns: 200px 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>