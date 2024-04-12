<template>
  <span class="mr-4">
    <strong class="mr-2">{{ lang('Load all data') }}:</strong>
    <el-switch
      v-model="isAll"
      :loading="loading"
      :style="style"
    />
  </span>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
const isAll = ref(false)
const loading = ref(false)
const style = ref('--el-switch-off-color: #cccccc')
defineExpose({ isAll, loading, style })
const emits = defineEmits([ 'get-is-all' ])
const props = defineProps({
  isAll: { type: Boolean },
  loading: { type: Boolean },
  style: {
    type: String,
    default: () => {
      return '--el-switch-off-color: #cccccc'
    }
  }
})
watch(props, () => {
  style.value = props?.style
  isAll.value = props?.isAll
  loading.value = props?.loading
})
watch(isAll, () => emits('get-is-all', isAll.value))
</script>
