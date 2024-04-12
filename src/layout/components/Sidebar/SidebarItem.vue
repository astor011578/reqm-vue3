<template>
  <template v-if="!item.hidden">
    <template v-if="showSidebarItem(item.children, item)">
      <Link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
      <el-menu-item
        :index="resolvePath(onlyOneChild.path)"
        :class="{ 'submenu-title-noDropdown': !isNest }"
      >
        <item :meta="onlyOneChild.meta || item.meta" />
        <template #title>{{ lang(onlyOneChild.meta?.title) }}</template>
      </el-menu-item>
      </Link>
    </template>
    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template v-if="item.meta" #title>
        <item :meta="item.meta" class="sidebar-item" />
        <span>{{ lang(item.meta.title) }}</span>
      </template>
      <SidebarItem
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </template>
</template>

<script setup>
import Link from './Link.vue'
import Item from './Item'
import path from 'path'
import { isExternal } from '@/utils/validate'
import { lang } from '@/hooks/useCommon'

const props = defineProps({
  //every each router item
  item: { type: Object, required: true },
  //to judge whether is child item
  isNest: { type: Boolean, default: false },
  //base path, using for concat full path
  basePath: { type: String, default: '' }
})

let onlyOneChild = ref(null)
const showSidebarItem = (children = [], parent) => {
  const showingChildren = children.filter((item) => {
    if (item.hidden) return false
    onlyOneChild.value = item
    return true
  })
  if (showingChildren.length === 1 && !parent?.alwaysShow) return true
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noChildren: true }
    return true
  }
  return false
}
const resolvePath = (routePath) => {
  if (isExternal(routePath)) return routePath
  if (isExternal(props.basePath)) return props.basePath
  return path.resolve(props.basePath, routePath)
}
</script>