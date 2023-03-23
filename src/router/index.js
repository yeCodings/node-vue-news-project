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

// mainbox 嵌套路由 根据权限动态添加
// routesConfig.forEach(item => {
//   router.addRoute('mainbox', item)
// })

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
  routesConfig.forEach(item => {
    router.addRoute('mainbox', item)
  })

  // 在这里需要改变isGetterRouter = true
  store.commit('changeGetterRouter', true);
}

export default router
