import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'app',
    component: () => import('../views/app.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
