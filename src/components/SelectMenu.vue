<template>
  <span>
    <el-select
      v-model="selected"
      :placeholder="`${lang('Please select')}....`"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="lang(item.label)"
        :value="item.value"
      />
    </el-select>
  </span>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
const props = defineProps({
  options: {
    type: Array,
    require: true,
    default: () => {
      return []
    }
  },
  selected: {
    type: String,
    default: () => {
      return ''
    }
  }
})
const emits = defineEmits([ 'get-selected-option' ])
const options = ref([])
const selected = ref('')
watch(selected, () =>  emits('get-selected-option', selected.value))
onMounted(() => {
  options.value = Object.assign([], props.options)
  selected.value = props.selected
})
</script>

<style scoped lang="scss">
:deep(.el-select) {
  width: 100%;
}
</style>
