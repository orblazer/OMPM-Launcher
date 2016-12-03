/**
 * OMPM_launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 25/11/2016
 */
import VueRouter from 'vue-router'
import AuthStore from './store/AuthStore'
import Initialize from './pages/initialize/index.vue'
import Login from './pages/login/index.vue'
import ModPacks from './pages/modPacks/index.vue'
import Manage from './pages/manage/index.vue'
import Console from './pages/console/index.vue'
import Settings from './pages/settings/index.vue'

export default (Vue) => {
  Vue.use(VueRouter)

  const routes = [{
    name: 'initialize',
    path: '/initialize',
    component: Initialize,
    meta: { customRender: true }
  }, {
    name: 'login',
    path: '/login',
    component: Login,
    meta: { customRender: true }
  }, {
    name: 'modPacks',
    path: '/modPacks',
    component: ModPacks,
    meta: { requiresAuth: true, needOnline: true }
  }, {
    name: 'instances',
    path: '/instances'
    // component: require('./components/instances/index').default
  }, {
    name: 'manage',
    path: '/manage',
    component: Manage,
    meta: { requiresAuth: true, needOnline: true }
  }, {
    name: 'console',
    path: '/console',
    component: Console
  }, {
    name: 'settings',
    path: '/settings',
    component: Settings
  }, {
    name: 'logout',
    path: '/logout',
    beforeEnter (from, to, next) {
      AuthStore.dispatch('logout').then(() => {
        require('./store/AlertStore').default.dispatch('alert', {
          message: Vue.t('auth.logout')
        }).then(() => {
          next('/instances')
        })
      })
    }
  }, {
    name: 'default',
    path: '*',
    redirect: '/initialize'
  }]

  /**
   * Instance vue router
   */
  const router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes
  })
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!AuthStore.getters.loggedIn) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
      next()
    } else {
      next()
    }
  })

  return router
}
