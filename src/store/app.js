import settings from '@/settings'
import { defineStore } from 'pinia'
import { i18n } from '@/lang'

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      sidebar: { opened: true },
      device: 'desktop',
      settings,
      cachedViews: [],
      cachedViewsDeep: [],
      language: localStorage.getItem('language') || settings.defaultLanguage
    }
  },

  actions: {
    M_settings(data) {
      this.$patch((state) => {
        state.settings = { ...state.settings, ...data }
      })
    },
    M_sidebar_opened(data) {
      this.$patch((state) => {
        state.sidebar.opened = data
      })
    },
    M_toggleSideBar() {
      this.$patch((state) => {
        state.sidebar.opened = !state.sidebar.opened
      })
    },

    //keepAlive cache
    M_ADD_CACHED_VIEW(view) {
      this.$patch((state) => {
        if (state.cachedViews.includes(view)) return
        state.cachedViews.push(view)
      })
    },
    M_DEL_CACHED_VIEW(view) {
      this.$patch((state) => {
        const index = state.cachedViews.indexOf(view)
        index > -1 && state.cachedViews.splice(index, 1)
      })
    },
    M_RESET_CACHED_VIEW() {
      this.$patch((state) => {
        state.cachedViews = []
      })
    },
    //third keepAlive
    M_ADD_CACHED_VIEW_DEEP(view) {
      this.$patch((state) => {
        if (state.cachedViewsDeep.includes(view)) return
        state.cachedViewsDeep.push(view)
      })
    },
    M_DEL_CACHED_VIEW_DEEP(view) {
      this.$patch((state) => {
        const index = state.cachedViewsDeep.indexOf(view)
        index > -1 && state.cachedViewsDeep.splice(index, 1)
      })
    },
    M_RESET_CACHED_VIEW_DEEP() {
      this.$patch((state) => state.cachedViewsDeep = [] )
    },

    A_sidebar_opened(data) {
      this.M_sidebar_opened(data)
    },

    M_language(language) {
      const { locale } = i18n.global
      this.language = language
      locale.value = language
    }
  }
})
