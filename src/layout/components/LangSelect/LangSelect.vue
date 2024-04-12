<template>
  <el-dropdown trigger="click" @command="setLangHandler">
    <div class="lang-wrapper">
      <font-awesome-icon icon="fa-solid fa-language" class="lang-icon" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in langOptions"
          :key="item.value"
          :command="item.value"
          :disabled="appStore.language === item.value"
        >
          <h3 class="pt-2 pb-2">{{ item.label }}</h3>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { useAppStore } from '@/store/app'
const state = reactive({
  langOptions: [
    { label: '繁體中文', value: 'zh' },
    { label: 'English', value: 'en' },
  ]
})
const appStore = useAppStore()
const setLangHandler = (lang) => {
  localStorage.setItem('language', lang)
  appStore.M_language(lang)
}
let { langOptions } = toRefs(state)
</script>

<style scoped lang="scss">
.lang-wrapper {
  margin-top: 5px;
  margin-right: 20px;
  color: var(--navbar-icon-color);

  .lang-icon {
    width: 30px;
    height: 30px;
  }
}
</style>
