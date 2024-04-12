<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link v-if="!collapse" ref="expandRef" key="expand" class="sidebar-logo-link" to="/">
        <span class="sidebar-logo"></span>
        <h1 v-if="showTitle" class="sidebar-title">{{ title }}</h1>
      </router-link>
      <router-link v-else key="collapse" class="sidebar-logo-link" to="/">
        <span class="sidebar-logo"></span>
      </router-link>
    </transition>
  </div>
</template>

<script setup>
import setting from '@/settings'

defineProps({
  collapse: {
    type: Boolean,
    required: true
  }
})

/**
 * 解決 expand sidebar 後會有一瞬間樣式破版問題
 * setTimeout 的秒數須比 transition (0.3 sec.) 慢一點 (此處設為 0.31 sec.)
 */
const expandRef = ref(null)
let showTitle = ref(false)
watch(expandRef, (value) => {
  if (value) {
    setTimeout(() => {
      showTitle.value = true
    }, 310)
  } else {
    showTitle.value = false
  }
})

const state = reactive({
  title: setting.title,
  logo: '@/icons/logo/logo.png'
})

const { title, logo } = toRefs(state)
</script>

<style lang="scss">
/**
 * transition
 * enter-> enter-from
 * leave-> leave-from
 */
.sidebarLogoFade-enter-active {
  transition: opacity 2s;
}

.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: var(--sidebar-logo-height);
  line-height: var(--sidebar-logo-height);
  background: var(--sidebar-logo-background);
  padding-left: 10px;
  text-align: left;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      color: var(--sidebar-logo-color);
      width: 32px;
      height: 56px;

      background: {
        image: url('@/icons/logo/logo.png');
        repeat: no-repeat;
        size: 32px;
        position: center;
      }

      // width: var(--sidebar-logo-width);
      // height: var(--sidebar-logo-height);
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: var(--sidebar-logo-title-color);
      font-weight: 600;
      line-height: 50px;
      font-size: 12.5px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0;
    }
  }
}
</style>
