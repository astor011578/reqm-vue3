import { defineStore } from 'pinia'
import { loginReq, logoutReq, authReq, getInfoReq, editInfoReq } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { asyncRoutes } from '@/router'
import { usePermissionStore } from '@/store/permission'

const resetRouter = () => {
  const asyncRouterNameArr = asyncRoutes.map((mItem) => mItem.name)
  asyncRouterNameArr.forEach((name) => {
    if (router.hasRoute(name)) router.removeRoute(name)
  })
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userId: '',
      roles: [],
      userInfo: {}
    }
  },

  getters: {
    getUserId: (state) => { return state.userId },
    getRoles: (state) => { return state.roles },
    getUserInfo: (state) => { return state.userInfo }
  },

  actions: {
    setUserId(userId) { this.$patch((state) => state.userId = userId) },
    setRoles(roles) { this.$patch((state) => state.roles = roles) },
    
    /**
     * login
     */
    async login(data) {
      return new Promise((resolve, reject) => {
        loginReq(data)
          .then(res => {
            const { code, message, status, authorization } = res
            switch (code) {
              case 200: {
                setToken(authorization)
                resolve(null)
                break
              }
              default: {
                reject(res)
                break
              }
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    /**
     * get user authorization
     */
    getAuth() {
      return new Promise((resolve, reject) => {
        //header 中夾帶 token, 到 server 端請求回傳 user info
        authReq()
          .then((response) => {
            const { data } = response
            //沒有 token
            if (!data) return reject('Verification failed, please LOGIN again')
            const { exp, iat, iss, userId, roles } = data

            if (roles && roles.length) {
              localStorage.setItem('exp', exp)
              localStorage.setItem('userId', userId)
            } else {
              return reject('Verification failed, please LOGIN again')
            }
            this.setUserId(userId)
            this.setRoles(roles)
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    /**
     * logout
     */
    logout() {
      return new Promise((resolve) => {
        logoutReq().then((res) => {
          this.resetState()
          resolve(null)
        })
      })
    },
    /**
     * reset State
     */
    resetState() {
      return new Promise((resolve) => {
        this.setUserId('')
        this.setRoles([])
        //must remove token first
        removeToken()
        //then remove all items except "language" in localStorage
        const language = localStorage.getItem('language')
        localStorage.clear()
        localStorage.setItem('language', language)
        resetRouter()
        const permissionStore = usePermissionStore()
        permissionStore.setHasUserInfo(false)
        resolve(null)
      })
    },
    /**
     * get user information
     */
    getInfo(data) {
      return new Promise((resolve, reject) => {
        //Send get user info request to server
        getInfoReq(data)
          .then((res) => {
            switch (res.code) {
              case 200: {
                resolve(res)
                break
              }
              default: {
                reject(res)
                break
              }
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    /**
     * submit to update user information
     */
    editInfo(data) {
      return new Promise((resolve, reject) => {
        editInfoReq(data)
          .then((res) => {
            switch (res.code) {
              case 200: {
                resolve(res)
                break
              }
              default: {
                reject(res)
                break
              }
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})
