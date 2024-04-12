<template>
  <div class="navbar rowBC reset-el-dropdown">
    <div class="rowSC">
      <hamburger :is-active="opened" @toggle-click="toggleSideBar" />
      <breadcrumb class="breadcrumb-container" />
    </div>
    <div class="right-menu">
      <LangSelect />
      <Avatar />
    </div>
  </div>
</template>

<script setup>
import Breadcrumb from './Breadcrumb'
import Hamburger from './Hamburger'
import Avatar from './Avatar'
import LangSelect from './LangSelect'
import { useAppStore } from '@/store/app'
const appStore = useAppStore()
const toggleSideBar = () => appStore.M_toggleSideBar()
const opened = computed(() => {
  return appStore.sidebar.opened
})
</script>

<style lang="scss" scoped>
.navbar {
  height: var(--navbar-height);
  overflow: hidden;
  position: sticky;
  top: 0;
  z-index: var(--navbar-z-index);
  background: var(--navbar-background);
}

//drop-down
.right-menu {
  cursor: pointer;
  margin-right: 40px;
  display: inline-flex;

  :hover {
    color: var(--navbar-icon-hover);
  }
}
</style>
