<template>
  <span></span>
</template>

<script setup>
import { ElLoading } from 'element-plus'
import { lang } from '@/hooks/useCommon'
const props = defineProps({ loading: Boolean })
const loadingInstance = ref(null)
onMounted(() => {
  loadingInstance.value = ElLoading.service({
    fullscreen: true,
    lock: true,
    background: '#00000011',
    text: `${lang('Loading')}...`
  })
})
watch(props, (value) => { if (!props.loading) loadingInstance.value.close() })
</script>

<style lang="scss" scoped>
span {
  display: flex;
}
</style>
