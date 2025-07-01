import { createRouter, createWebHistory } from 'vue-router'
import DashboardCounting from '../pages/DashboardCounting.vue'
import Login from '../pages/Login.vue'
import DashboardBarcode from '../pages/DashboardBarcode.vue'
import Profile from '../pages/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard-counting',
    name: 'DashboardCounting',
    component: DashboardCounting,
  },
  {
    path: '/dashboard-barcode',
    name: 'DashboardBarcode',
    component: DashboardBarcode,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
