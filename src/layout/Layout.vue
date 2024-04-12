<template>
  <div :class="classObj">
    <!-- left sidebar -->
    <Sidebar v-if="settings.showLeftMenu" class="sidebar-container" />
    <!-- right container -->
    <div class="main-container">
      <Navbar />
      <AppMain />
      <BackTop />
      <ToBottom />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Layout'
}
</script>

<script setup>
import { BackTop, ToBottom } from '@/components'
import { Sidebar, Navbar, AppMain } from './components'
import { useAppStore } from '@/store/app'
import ResizeHook from './hook/ResizeHandler'

const appStore = useAppStore()
const opened = computed(() => { return appStore.sidebar.opened })
const settings = computed(() => { return appStore.settings })
const classObj = computed(() => {
  return {
    closeSidebar: !opened.value,
    hideSidebar: !settings.value.showLeftMenu
  }
})
//listening the window size to open or close the left sidebar
ResizeHook()
</script>

<style lang="scss" scoped>
$sidebar-close-width: 54px;
.main-container {
  transition: margin-left 0.28s;
  margin-left: var(--sidebar-width);
  position: relative;
  min-width: calc(900px - $sidebar-close-width);
}

.sidebar-container {
  transition: width 0.28s;
  width: var(--sidebar-width) !important;
  background-color: var(--el-menu-bg-color);
  height: 100%;
  position: fixed;
  font-size: 0;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.closeSidebar {
  .sidebar-container {
    width: $sidebar-close-width !important;
  }
  .main-container {
    margin-left: $sidebar-close-width !important;
  }
}

.hideSidebar {
  .sidebar-container {
    width: 0 !important;
  }
  .main-container {
    margin-left: 0;
  }
}
</style>
