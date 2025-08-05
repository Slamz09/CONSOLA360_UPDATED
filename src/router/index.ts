// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

// Main module views
import RiskDashboardView from '@/views/RiskDashboardView.vue'
import AccountsView from '@/views/AccountsView.vue'
import Deal360View from '@/views/Deal360View.vue'
import LegalHubView from '@/views/LegalHubView.vue'
import SupportDashboard from '@/views/SupportDashboard.vue'

// Deal 360 subviews
const LeadsView = () => import('@/views/deal360/LeadsView.vue')
const DealsView = () => import('@/views/deal360/DealsView.vue')
const Deal360ContractsView = () => import('@/views/deal360/Deal360ContractsView.vue')

// Legal Hub subviews
const ContractsManagement = () => import('@/views/legalhub/ContractsManagement.vue')
const LitigationCompliance = () => import('@/views/legalhub/LitigationCompliance.vue')
const LegalIntelligence = () => import('@/views/legalhub/LegalIntelligence.vue')

// Legal Hub - Contracts Management subviews
const AllContracts = () => import('@/views/legalhub/contracts/AllContracts.vue')
const AssignedContracts = () => import('@/views/legalhub/contracts/AssignedContracts.vue')
const ContractGenerator = () => import('@/views/legalhub/contracts/ContractGenerator.vue')
const ClauseRepository = () => import('@/views/legalhub/contracts/ClauseRepository.vue')

// Legal Hub - Litigation & Compliance subviews
const MatterIntake = () => import('@/views/legalhub/litigation/MatterIntake.vue')
const ActiveCases = () => import('@/views/legalhub/litigation/ActiveCases.vue')
const AssignedCases = () => import('@/views/legalhub/litigation/AssignedCases.vue')
const LegalTimeline = () => import('@/views/legalhub/litigation/LegalTimeline.vue')
const DisputeAnalytics = () => import('@/views/legalhub/litigation/DisputeAnalytics.vue')

// Legal Hub - Legal Intelligence subviews
const RegulatoryFeed = () => import('@/views/legalhub/intelligence/RegulatoryFeed.vue')
const PlaybooksTraining = () => import('@/views/legalhub/intelligence/PlaybooksTraining.vue')

const routes = [
  {
    path: '/',
    name: 'Risk360',
    component: RiskDashboardView,
    meta: {
      title: 'Risk 360 Dashboard',
      description: 'Real-time corporate risk intelligence and heat maps'
    }
  },
  {
    path: '/deal360',
    name: 'Deal360',
    component: Deal360View,
    meta: {
      title: 'Deal 360',
      description: 'Deal-to-Contract unified workflow management'
    },
    children: [
      {
        path: '',
        redirect: '/deal360/leads'
      },
      {
        path: 'leads',
        name: 'Leads',
        component: LeadsView,
        meta: {
          title: 'Leads Management',
          description: 'Lead qualification and screening'
        }
      },
      {
        path: 'deals',
        name: 'Deals',
        component: DealsView,
        meta: {
          title: 'Deals Pipeline',
          description: 'Active deals and pipeline management'
        }
      },
      {
        path: 'contracts',
        name: 'Deal360Contracts',
        component: Deal360ContractsView,
        meta: {
          title: 'Deal Contracts',
          description: 'Contract generation and lifecycle'
        }
      }
    ]
  },
  {
    path: '/legalhub',
    name: 'LegalHub',
    component: LegalHubView,
    meta: {
      title: 'Legal Hub',
      description: 'Comprehensive legal operations management'
    },
    children: [
      {
        path: '',
        redirect: '/legalhub/contracts'
      },
      {
        path: 'contracts',
        name: 'ContractsManagement',
        component: ContractsManagement,
        children: [
          {
            path: '',
            redirect: '/legalhub/contracts/all'
          },
          {
            path: 'all',
            name: 'AllContracts',
            component: AllContracts
          },
          {
            path: 'assigned',
            name: 'AssignedContracts',
            component: AssignedContracts
          },
          {
            path: 'generator',
            name: 'ContractGenerator',
            component: ContractGenerator
          },
          {
            path: 'repository',
            name: 'ClauseRepository',
            component: ClauseRepository
          }
        ]
      },
      {
        path: 'litigation',
        name: 'LitigationCompliance',
        component: LitigationCompliance,
        children: [
          {
            path: '',
            redirect: '/legalhub/litigation/intake'
          },
          {
            path: 'intake',
            name: 'MatterIntake',
            component: MatterIntake
          },
          {
            path: 'active',
            name: 'ActiveCases',
            component: ActiveCases
          },
          {
            path: 'assigned',
            name: 'AssignedCases',
            component: AssignedCases
          },
          {
            path: 'timeline',
            name: 'LegalTimeline',
            component: LegalTimeline
          },
          {
            path: 'analytics',
            name: 'DisputeAnalytics',
            component: DisputeAnalytics
          }
        ]
      },
      {
        path: 'intelligence',
        name: 'LegalIntelligence',
        component: LegalIntelligence,
        children: [
          {
            path: '',
            redirect: '/legalhub/intelligence/regulatory'
          },
          {
            path: 'regulatory',
            name: 'RegulatoryFeed',
            component: RegulatoryFeed
          },
          {
            path: 'playbooks',
            name: 'PlaybooksTraining',
            component: PlaybooksTraining
          }
        ]
      }
    ]
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: AccountsView,
    meta: {
      title: 'Account Intelligence',
      description: 'Unified 360° view of accounts with AI-powered insights'
    }
  },
  {
    path: '/support',
    name: 'Support',
    component: SupportDashboard,
    meta: {
      title: 'Support Dashboard',
      description: 'View and manage support tickets'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
    ? `${to.meta.title} | Consola360`
    : 'Consola360 | Unified LegalOps Platform'
  next()
})

export default router
