<template>
  <el-backtop :right="30" :bottom="30">
    <div id="backTop">
      <ChevronUp />
    </div>
  </el-backtop>
</template>

<script setup>
import { ChevronUp } from '@/icons/common/'
// for debugging
// window.addEventListener('scroll', () => {
//   console.log(`目前滾輪高度: ${window.scrollY}`)
// })
</script>

<style lang="scss">
div:has(#backTop) {
  background-color: transparent;
  box-shadow: none;
  z-index: var(--back-top-z-index);
}

#backTop {
  font-size: 20px;
  padding: 5px;
  background-color: var(--el-menu-bg-color);
  border-radius: 50%;
  line-height: 20px;
  color: #fff;
  box-shadow: rgba(84, 110, 122, 0.3) 4px 4px, rgba(84, 110, 122, 0.2) 8px 8px, rgba(84, 110, 122, 0.1) 12px 12px;
}

#backTop:hover {
  background-color: var(--hover);
  box-shadow: rgba(255, 179, 65, 0.3) 4px 4px, rgba(255, 179, 65, 0.2) 8px 8px, rgba(255, 179, 65, 0.1) 12px 12px;
}
</style>
