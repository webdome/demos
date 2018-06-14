import Vue from 'vue'
import Router from 'vue-router'
import nearby from '@/components/nearby'
import ranking from '@/components/ranking'
import award from '@/components/award'
import history from '@/components/history'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'nearby',
      component: nearby
    },
    {
      path: '/nearby',
      name: 'nearby',
      component: nearby
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: ranking
    },
    {
      path: '/award',
      name: 'award',
      component: award
    },
    {
      path: '/history',
      name: 'history',
      component: history
    }
  ]
})
