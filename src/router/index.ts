// src/router/index.ts - Performance Optimized
import { createRouter, createWebHistory } from 'vue-router'

// Eagerly load critical/frequently accessed views
import RiskDashboardView from '@/views/RiskDashboardView.vue'
import Deal360View from '@/views/Deal360View.vue'
import LegalHubView from '@/views/LegalHubView.vue'

// Lazy load less critical views
const AccountsView = () => import('@/views/AccountsView.vue')
const SupportDashboard = () => import('@/views/SupportDashboard.vue')

// Preload important Deal360 components
const LeadsView = () => import(/* webpackChunkName: "deal360" */ '@/views/deal360/LeadsView.vue')
const DealsView = () => import(/* webpackChunkName: "deal360" */ '@/views/deal360/DealsView.vue')
const ContractsView = () => import(/* webpackChunkName: "deal360" */ '@/views/deal360/ContractsView.vue')

// Group Legal Hub components for better caching
const ContractsManagement = () => import(/* webpackChunkName: "legal-hub" */ '@/views/legalhub/ContractsManagement.vue')
const LitigationCompliance = () => import(/* webpackChunkName: "legal-hub" */ '@/views/legalhub/LitigationCompliance.vue')
const LegalIntelligence = () => import(/* webpackChunkName: "legal-hub" */ '@/views/legalhub/LegalIntelligence.vue')

// Group contract management components
const AllContracts = () => import(/* webpackChunkName: "contracts" */ '@/views/legalhub/contracts/AllContracts.vue')
const AssignedContracts = () => import(/* webpackChunkName: "contracts" */ '@/views/legalhub/contracts/AssignedContracts.vue')
const ContractGenerator = () => import(/* webpackChunkName: "contracts" */ '@/views/legalhub/contracts/ContractGenerator.vue')
const ClauseRepository = () => import(/* webpackChunkName: "contracts" */ '@/views/legalhub/contracts/ClauseRepository.vue')

// Group litigation components
const MatterIntake = () => import(/* webpackChunkName: "litigation" */ '@/views/legalhub/litigation/MatterIntake.vue')
const ActiveCases = () => import(/* webpackChunkName: "litigation" */ '@/views/legalhub/litigation/ActiveCases.vue')
const AssignedCases = () => import(/* webpackChunkName: "litigation" */ '@/views/legalhub/litigation/AssignedCases.vue')
const LegalTimeline = () => import(/* webpackChunkName: "litigation" */ '@/views/legalhub/litigation/LegalTimeline.vue')
const DisputeAnalytics = () => import(/* webpackChunkName: "litigation" */ '@/views/legalhub/litigation/DisputeAnalytics.vue')

// Group intelligence components
const RegulatoryFeed = () => import(/* webpackChunkName: "intelligence" */ '@/views/legalhub/intelligence/RegulatoryFeed.vue')
const PlaybooksTraining = () => import(/* webpackChunkName: "intelligence" */ '@/views/legalhub/intelligence/PlaybooksTraining.vue')

const routes = [
  {
    path: '/',
    name: 'Risk360',
    component: RiskDashboardView,
    meta: {
      title: 'Risk 360 Dashboard',
      description: 'Real-time corporate risk intelligence and heat maps',
      preload: true // Mark for preloading
    }
  },
  {
    path: '/deal360',
    name: 'Deal360',
    component: Deal360View,
    meta: {
      title: 'Deal 360',
      description: 'Deal-to-Contract unified workflow management',
      preload: true
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
        component: ContractsView,
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
      description: 'Comprehensive legal operations management',
      preload: true
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
        meta: {
          title: 'Contracts Management',
          description: 'Contract lifecycle management'
        },
        children: [
          {
            path: '',
            redirect: '/legalhub/contracts/all'
          },
          {
            path: 'all',
            name: 'AllContracts',
            component: AllContracts,
            meta: {
              title: 'All Contracts',
              description: 'View all contracts'
            }
          },
          {
            path: 'assigned',
            name: 'AssignedContracts',
            component: AssignedContracts,
            meta: {
              title: 'Assigned Contracts',
              description: 'Contracts assigned to you'
            }
          },
          {
            path: 'generator',
            name: 'ContractGenerator',
            component: ContractGenerator,
            meta: {
              title: 'Contract Generator',
              description: 'Generate new contracts'
            }
          },
          {
            path: 'repository',
            name: 'ClauseRepository',
            component: ClauseRepository,
            meta: {
              title: 'Clause Repository',
              description: 'Manage contract clauses'
            }
          }
        ]
      },
      {
        path: 'litigation',
        name: 'LitigationCompliance',
        component: LitigationCompliance,
        meta: {
          title: 'Litigation & Compliance',
          description: 'Legal case and compliance management'
        },
        children: [
          {
            path: '',
            redirect: '/legalhub/litigation/intake'
          },
          {
            path: 'intake',
            name: 'MatterIntake',
            component: MatterIntake,
            meta: {
              title: 'Matter Intake',
              description: 'New matter intake'
            }
          },
          {
            path: 'active',
            name: 'ActiveCases',
            component: ActiveCases,
            meta: {
              title: 'Active Cases',
              description: 'Active legal cases'
            }
          },
          {
            path: 'assigned',
            name: 'AssignedCases',
            component: AssignedCases,
            meta: {
              title: 'Assigned Cases',
              description: 'Cases assigned to you'
            }
          },
          {
            path: 'timeline',
            name: 'LegalTimeline',
            component: LegalTimeline,
            meta: {
              title: 'Legal Timeline',
              description: 'Case timeline and milestones'
            }
          },
          {
            path: 'analytics',
            name: 'DisputeAnalytics',
            component: DisputeAnalytics,
            meta: {
              title: 'Dispute Analytics',
              description: 'Legal analytics and insights'
            }
          }
        ]
      },
      {
        path: 'intelligence',
        name: 'LegalIntelligence',
        component: LegalIntelligence,
        meta: {
          title: 'Legal Intelligence',
          description: 'Legal research and intelligence'
        },
        children: [
          {
            path: '',
            redirect: '/legalhub/intelligence/regulatory'
          },
          {
            path: 'regulatory',
            name: 'RegulatoryFeed',
            component: RegulatoryFeed,
            meta: {
              title: 'Regulatory Feed',
              description: 'Regulatory updates and news'
            }
          },
          {
            path: 'playbooks',
            name: 'PlaybooksTraining',
            component: PlaybooksTraining,
            meta: {
              title: 'Playbooks & Training',
              description: 'Legal playbooks and training materials'
            }
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
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// Performance optimizations
router.beforeEach((to, from, next) => {
  // Set document title
  document.title = to.meta?.title
    ? `${to.meta.title} | Consola360`
    : 'Consola360 | Unified LegalOps Platform'
  
  next()
})

// Preload critical routes on app startup
router.beforeResolve(async (to) => {
  // Preload routes marked for preloading
  if (to.meta?.preload && to.matched.some(record => record.components?.default)) {
    try {
      await Promise.all(
        to.matched.map(record => {
          if (typeof record.components?.default === 'function') {
            return record.components.default()
          }
        }).filter(Boolean)
      )
    } catch (error) {
      console.warn('Route preloading failed:', error)
    }
  }
})

router.onError((error) => {
  console.error('Router error:', error)
  router.push('/')
})

export default router
