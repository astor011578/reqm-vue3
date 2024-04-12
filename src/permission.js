import router from '@/router'
import { ElLoading } from 'element-plus'
import { lang } from '@/hooks/useCommon'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import { useNewReqStore } from '@/store/new-request'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/getPageTitle'
import settings from './settings'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false })

const loadingInstance = ElLoading.service({
  fullscreen: true,
  lock: true,
  background: '#00000011',
  text: `${lang('Loading')}...`
})

//whitelist which's no need to redirect
const whiteList = ['/login', '/401', '/404', '/500']

//router guard
router.beforeEach(async (to, from, next) => {
  //start progress bar when route changes
  if (settings.isNeedNprogress) NProgress.start()

  //set page title
  document.title = getPageTitle(to.meta.title)

  //store instances
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const newReqStore = useNewReqStore()

  //在變換路由前重置 newReqStore 中的資訊
  newReqStore.resetApplication()
  newReqStore.resetValidate()

  if (getToken()) {
    //1. 如果已經取得 token (通行證)
    if (to.path === '/login') {
      //1-1. 如果現在在 `/login` 路由, 但已取得通行證, 則放行至 `/` 路由
      next({ path: '/' })
    } else {
      //1-2. 如果現在不在 `/login` 路由
      const { hasUserInfo } = permissionStore
      switch (hasUserInfo) {
        //it had fetched user info, no need to redirect
        case true: {
          next()
          break
        }
        //it had not fetched user info, sending request to server
        case false: {
          try {
            let accessRoutes = []
            //get user roles
            const { roles } = await userStore.getAuth()
            accessRoutes = await permissionStore.generateRoutes(roles)

            //setting constantRoutes and accessRoutes to pinia, in order to display links in sideBar
            permissionStore.setRoutes(accessRoutes)
            //adding accessible routes dynamically
            accessRoutes.forEach(route => router.addRoute(route))
            //already get userInfo
            permissionStore.setHasUserInfo(true)
            //hack method to ensure that addRoutes is complete
            //set the replace: true, so the navigation will not leave a history record
            next({ ...to, replace: true })
            
          } catch (err) {
            await userStore.resetState()
            next(`/login?redirect=${to.fullPath}`)
            if (settings.isNeedNprogress) NProgress.done()
            loadingInstance.close()
          }
          break
        }
      }
    }
  } else {
    //2. 如果尚未取得 token (通行證)
    //藉由 router 的 `to.path` 是否在白名單中, 來判斷此路由是否需要取得 token 才可查看
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`)
      if (settings.isNeedNprogress) NProgress.done()
      loadingInstance.close()
    }
  }
})

router.afterEach(() => {
  if (settings.isNeedNprogress) NProgress.done()
  loadingInstance.close()
})
