<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === levelList.length - 1" class="no-redirect">
          {{ lang(item.meta?.title) }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ lang(item.meta.title) }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import { compile } from 'path-to-regexp'
import { lang } from '@/hooks/useCommon'

const levelList = ref(null)
const route = useRoute()

const getBreadcrumb = () => {
  //only show routes with meta.title
  let matched = route.matched.filter(item => item.meta && item.meta.title)
  const first = matched[0]
  //it can replace the first page if not exits
  if (!isHome(first)) matched = [{ path: '/tables', meta: { title: 'Home' } }].concat(matched)
  levelList.value = matched.filter((item) => item.meta && item.meta.title && item.meta.breadcrumb !== false)
}
const isHome = (route) => {
  const name = route?.name
  if (!name) return false
  return name.trim().toLocaleLowerCase() === 'Home'.toLocaleLowerCase()
}
const pathCompile = (path) => {
  const { params } = route
  const toPath = compile(path)
  return toPath(params)
}
const router = useRouter()
const handleLink = (item) => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  if (path) router.push(pathCompile(path))
}
watch(
  () => route.path,
  () => {
    getBreadcrumb()
  },
  { immediate: true }
)
onBeforeMount(() => getBreadcrumb())
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  a {
    color: var(--breadcrumb-hyperlink);
  }
  a:hover {
    color: var(--breadcrumb-hyperlink-hover)
  }

  .no-redirect {
    color: var(--breadcrumb-no-redirect);
    cursor: text;
  }
}
</style>
