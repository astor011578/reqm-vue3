<template>
  <el-config-provider
    :locale="lang[appStore.language]"
    namespace="el"
    size="small"
  >
    <router-view :key="$route.fullPath" />
  </el-config-provider>
</template>

<script setup>
import { useAppStore } from '@/store/app'
import zh from 'element-plus/es/locale/lang/zh-tw'
import en from 'element-plus/es/locale/lang/en'
const appStore = useAppStore()
const lang = { zh, en }

onMounted(() => {
  const { M_language } = appStore
  const hasDefaultLang = localStorage.getItem('language') ? true : false
  const browserLang = navigator.language !== 'zh-TW' ? 'en' : 'zh'
  const defaultLang = hasDefaultLang ? localStorage.getItem('language') : browserLang
  localStorage.setItem('language', defaultLang)
  M_language(defaultLang)
})
</script>

<style lang="scss">
* {
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-button {
    display: none;
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--blue-grey-lighten-4);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    -webkit-box-shadow: inset 0 0 10px var(--blue-grey-lighten-2);
  }

  ::-webkit-scrollbar-track {
    background-color: var(--blue-grey-lighten-5);
  }

  ::-webkit-scrollbar-corner {
    background-color: var(--blue-grey-lighten-4);
  }
}
</style>
