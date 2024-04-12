<template>
  <button
    id="toBottom"
    :style="isHidden ? 'display: none' : ''"
    @click="toBottom"
  >
    <ChevronUp />
  </button>
</template>

<script setup>
import { ChevronUp } from '@/icons/common/'
window.onresize = () => {
  getHasScrollY()
  isHidden.value = hasScrollY.value ? false : true
}

const isHidden = ref(true)    // 是否要隱藏
watch(isHidden, () => {
  const toBottomDOM = document.getElementById('toBottom')
  toBottomDOM.hidden = isHidden.value
})
const toBottom = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  })
  isHidden.value = true
}

const scrollY = ref(0)        // 綁定目前滾輪高度
window.addEventListener('scroll', () => scrollY.value = window.scrollY)
watch(scrollY, () => isHidden.value = (scrollY.value < 110) ? false : true)
const rootDOM = document.getElementsByTagName('html')[0]
const scrollHeight = ref(0)   // 頁面高度
const clientHeight = ref(0)   // 用戶瀏覽器高度
const hasScrollY = ref(false) // 是否有出現縱向滾軸
watch(scrollHeight, () => getHasScrollY())

const getHasScrollY = () => {
  scrollHeight.value = rootDOM.scrollHeight
  clientHeight.value = rootDOM.clientHeight
  hasScrollY.value = scrollHeight.value > clientHeight.value ? true : false
  if (hasScrollY.value) isHidden.value = false
}

onMounted(() => setTimeout(() => getHasScrollY(), 1000))
</script>

<style lang="scss">
#toBottom {
  right: 35px;
  bottom: 35px;
  position: fixed;
  align-items: center;
  justify-content: center;
  z-index: var(--to-bottom-z-index);
  font-size: 20px;
  padding: 5px;
  background-color: var(--el-menu-bg-color);
  border-radius: 50%;
  border: none;
  line-height: 20px;
  color: #fff;
  box-shadow: rgba(84, 110, 122, 0.3) 4px 4px, rgba(84, 110, 122, 0.2) 8px 8px, rgba(84, 110, 122, 0.1) 12px 12px;
}

#toBottom:hover {
  cursor: pointer;
  background-color: var(--hover);
  box-shadow: rgba(255, 179, 65, 0.3) 4px 4px, rgba(255, 179, 65, 0.2) 8px 8px, rgba(255, 179, 65, 0.1) 12px 12px;
}

#toBottom svg {
  transform: rotate(180deg);
}
</style>
