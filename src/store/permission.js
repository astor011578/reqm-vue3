import { defineStore } from 'pinia'
import { asyncRoutes, constantRoutes } from '@/router'

/**
 * @description 利用 routes 中的 meta.roles 屬性來判斷使用者是否有權限查看此 route
 * @param roles
 * @param route
 */
const hasPermission = (roles, route) => {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta?.roles?.includes(role))
  }
  return true
}

/**
 * @description 過濾 asyncRoutes
 * @param routes asyncRoutes
 * @param roles
 */
export const filterAsyncRoutes = (routes, roles) => {
  const res = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) tmp.children = filterAsyncRoutes(tmp.children, roles)
      res.push(tmp)
    }
  })
  return res
}

export const usePermissionStore = defineStore('permission', {
  state: () => {
    return {
      hasUserInfo: false, //是否已取得使用者資訊
      routes: [],         //集合經過過濾後的 asyncRoutes 與 constantRoutes
      addRoutes: []       //過濾後的 asyncRoutes
    }
  },

  actions: {
    setRoutes(routes) {
      this.$patch((state) => {
        //要被串接的 asyncRoutes
        state.addRoutes = routes
        //將 constantRoutes 與 asyncRoutes 串接在一個陣列中
        state.routes = constantRoutes.concat(routes)
      })
    },
    setHasUserInfo(data) {
      this.$patch(state => state.hasUserInfo = data)
    },
    generateRoutes(roles) {
      return new Promise(async (resolve) => {
        let accessedRoutes
        //filter by roles
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        resolve(accessedRoutes)
      })
    }
  }
})
