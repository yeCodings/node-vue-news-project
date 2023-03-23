import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    // 是否获取到路由权限
    isGetterRouter: false,
    // 左侧菜单栏是否折叠
    isCollapsed: false,
    userInfo: {}
  },
  getters: {
  },
  mutations: {
    changeGetterRouter(state, value) {
      state.isGetterRouter = value;
    },
    // 控制侧边栏的展开
    changeCollapsed(state) {
      state.isCollapsed = !state.isCollapsed
    },
    changeUserInfo(state, value) {
      state.userInfo = {
        ...state.userInfo,
        ...value
      }
    },
    clearUserInfo(state, value) {
      state.userInfo = {};
    }
  },
  plugins: [
    createPersistedState({
      // isCollapsed 数据持久化
      paths: ['isCollapsed', 'userInfo']
    })
  ],
  actions: {
  },
  modules: {
  }
})
