import { createRouter, createWebHashHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import Layout from '@/layout'
const addNew = defineAsyncComponent(() => import('@/views/add-new/index.vue'))
const editNew = defineAsyncComponent(() => import('@/views/edit-new/index.vue'))
const reviewNew = defineAsyncComponent(() => import('@/views/review-new/index.vue'))
const review = defineAsyncComponent(() => import('@/views/review/index.vue'))

export const constantRoutes = [
  /* reload & redirect */
  {
    name: 'reload',
    path: '/reload',
    hidden: true,
    component: () => import('@/views/reload/index.vue')
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },

  /* error page */
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: '/500',
    component: () => import('@/views/error-page/500.vue'),
    hidden: true
  },

  /* constant page */
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/tables',
    children: [
      {
        path: 'tables',
        name: 'Tables',
        component: () => import('@/views/control-table/index.vue'),
        meta: { title: 'Control table', icon: 'fa-solid fa-table' }
      },
      {
        path: 'detail/:reqNo',
        name: 'Details',
        hidden: true,
        component: () => import('@/views/detail/index.vue'),
        meta: { title: 'Data details' }
      }
    ]
  },
  {
    path: '/add-new',
    component: Layout,
    children: [
      {
        path: '',
        component: addNew,
        name: 'AddNew',
        meta: { title: 'New a request', icon: 'fa-solid fa-pen-to-square' }
      }
    ]
  },
  {
    path: '/edit/:reqNo',
    component: Layout,
    children: [
      {
        path: '',
        component: editNew,
        name: 'EditNew',
        hidden: true,
        meta: { title: 'Edit request' }
      }
    ]
  },
  {
    path: '/weekly-summary',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/weekly-summary/index.vue'),
        name: 'WeeklySummary',
        meta: { title: 'Weekly summary', icon: 'fa-solid fa-chart-line' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  //如果具有 'Review request' 權限才會顯示
  {
    path: '/review',
    component: Layout,
    alwaysShow: false,
    name: 'Review',
    meta: {
      title: 'Review application',
      icon: 'fa-solid fa-file-pen',
      roles: ['Review request']
    },
    children: [
      {
        path: '',
        component: review,
        name: 'Review',
        hidden: true,
        meta: {
          roles: ['Review request']
        }
      },
      {
        path: 'new/:reqNo',
        component: reviewNew,
        name: 'ReviewNew',
        hidden: true,
        meta: {
          title: 'Review new request',
          roles: ['Review request']
        }
      }
    ]
  },
  //404 page must be placed at the end !!!
  //using pathMatch install of "*" in vue-router 4.0
  //未經授權 (roles.includes('Review request') === false 會重導至 /401)
  { path: '/:pathMatch(.*)', redirect: '/401', hidden: true }
]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes
})

export default router
