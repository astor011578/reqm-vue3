import { useAppStore } from '@/store/app'
import settings from '@/settings'
const { body } = document
const WIDTH = settings.triggerResizeWidth

export default function () {
  const appStore = useAppStore()
  const $_isMobile = () => {
    const rect = body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }
  const $_resizeHandler = () => {
    if (!document.hidden) {
      const isMobile = $_isMobile()
      if (isMobile) {
        //此處只做根據 window 尺寸來關閉 sidebar 功能
        appStore.M_sidebar_opened(false)
      } else {
        appStore.M_sidebar_opened(true)
      }
    }
  }
  onBeforeMount(() => {
    window.addEventListener('resize', $_resizeHandler)
  })
  onMounted(() => {
    const isMobile = $_isMobile()
    if (isMobile) {
      appStore.M_sidebar_opened(false)
    } else {
      appStore.M_sidebar_opened(true)
    }
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', $_resizeHandler)
  })
}
