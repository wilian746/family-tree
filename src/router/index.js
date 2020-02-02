import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'app',
    component: () => import('../views/app.vue')
  },
  {
    path: '/family-tree',
    name: 'family-tree',
    component: () => import('../views/family-tree.vue')
  },
  {
    path: '/simple-conversation-tree',
    name: 'simple-conversation-tree',
    component: () => import('../views/simple-conversation-tree.vue')
  },
  {
    path: '/dynamic-conversation-tree',
    name: 'dynamic-conversation-tree',
    component: () => import('../views/dynamic-conversation-tree.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
