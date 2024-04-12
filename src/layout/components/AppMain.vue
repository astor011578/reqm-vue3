<template>
  <div class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="key" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { useAppStore } from '@/store/app'
const route = useRoute()
const key = computed(() => route.path)
const cachedViews = computed(() => { return appStore.cachedViews })

/* listen the component name changing, then to keep-alive the page */
//cachePage: is true, keep-alive this Page
//leaveRmCachePage: is true, keep-alive remote when page leave
let oldRoute = {}
let deepOldRouter = null
const appStore = useAppStore()
const removeDeepChildren = (deepOldRouter) => {
  deepOldRouter.children?.forEach((fItem) => {
    appStore.M_DEL_CACHED_VIEW_DEEP(fItem.name)
  })
}

watch(
  () => route.name,
  () => {
    const routerLevel = route.matched.length
    //handle the second route
    if (routerLevel === 2) {
      if (deepOldRouter?.name) {
        if (deepOldRouter.meta?.leaveRmCachePage && deepOldRouter.meta?.cachePage) {
          appStore.M_DEL_CACHED_VIEW(deepOldRouter.name)
          //remove the deepOldRouter's children component
          removeDeepChildren(deepOldRouter)
        }
      } else {
        if (oldRoute?.name) {
          if (oldRoute.meta?.leaveRmCachePage && oldRoute.meta?.cachePage) {
            appStore.M_DEL_CACHED_VIEW(oldRoute.name)
          }
        }
      }

      if (route.name) {
        if (route.meta?.cachePage) {
          appStore.M_ADD_CACHED_VIEW(route.name)
        }
      }
      deepOldRouter = null
    }

    //handle the third route
    if (routerLevel === 3) {
      //三級時儲存當前路由的上一級
      const parentRoute = route.matched[1]
      //deepOldRouter 不為空值, 且 deepOldRouter 並非當前路由的父層時, 則需要清除 deepOldRouter 快取
      //通常是三級跳轉至另一個三級路由的情境
      if (deepOldRouter?.name && deepOldRouter.name !== parentRoute.name) {
        if (deepOldRouter.meta?.leaveRmCachePage && deepOldRouter.meta?.cachePage) {
          appStore.M_DEL_CACHED_VIEW(deepOldRouter.name)
          //remove the deepOldRouter's children component
          removeDeepChildren(deepOldRouter)
        }
      } else {
        //否則進入正常二級路由的流程
        if (oldRoute?.name) {
          if (oldRoute.meta?.leaveRmCachePage && oldRoute.meta?.cachePage) {
            appStore.M_DEL_CACHED_VIEW_DEEP(oldRoute.name)
          }
        }
      }

      //取的是二級的 name
      if (parentRoute.name && parentRoute.meta?.cachePage) {
        deepOldRouter = parentRoute
        appStore.M_ADD_CACHED_VIEW(deepOldRouter.name)
        if (route.name) {
          if (route.meta?.cachePage) {
            //和三級的 name 儲存快取
            appStore.M_ADD_CACHED_VIEW_DEEP(route.name)
          }
        }
      }
    }
    oldRoute = JSON.parse(JSON.stringify({ name: route.name, meta: route.meta }))
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
$sidebar-close-width: 54px;

.app-main {
  overflow-x: clip;
  position: relative;
  background-color: var(--app-main-background);
  width: 100%;
}

.show-tag-view {
  height: calc(100vh - #{var(--nav-bar-height)} - #{var(--tag-view-height)}) !important;
}

.fixed-header+.app-main {
  padding-top: 50px;
}
</style>
