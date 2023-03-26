import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import MainBox from '../views/MainBox.vue'
import routesConfig from './config'
import store from '../store/index'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/mainbox',
    name: 'mainbox',
    component: MainBox
  },
]


const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局路由守卫，每次路由跳转之前
router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next();
  } else {
    // 如果用户已登录过了，next()放行
    // 如果没有，则重定向到 login 登录
    if (!localStorage.getItem('token')) {
      next({
        path: 'login'
      })
    } else {
      // 已经登录了，设置了token，还需要next()继续指定路由跳转
      if (!store.state.isGetterRouter) {

        // 先清空嵌套路由，否则会越来越多 ,removeRouter('mainbox)
        router.removeRoute('mainbox');
        RoutesConfig();
        next({
          path: to.fullPath
        })
      } else {
        next()
      }
    }
  }
})

const RoutesConfig = () => {

  if (!router.hasRoute('mainbox')) {
    router.addRoute({
      path: '/mainbox',
      name: 'mainbox',
      component: MainBox
    })
  }

  routesConfig.forEach(item => {
    checkPromise(item) && router.addRoute('mainbox', item)
  })

  // 在这里需要改变isGetterRouter = true
  store.commit('changeGetterRouter', true);
}

const checkPromise = (item) => {
  if (item.requireAdmin) {
    return store.state.userInfo.role === 1
  }
  return true;
}

export default router
