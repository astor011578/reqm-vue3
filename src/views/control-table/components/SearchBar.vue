<template>
  <span id="keyword-search-container" class="mr-4">
    <strong class="mr-2">{{ `${lang('Search')}:` }}</strong>
    <el-input
      v-model="keyword"
      :placeholder="props.loading ? `${lang('Now loading')}...` : `${lang('Keyword search')}...`"
      :disabled="props.loading"
      :prefix-icon="props.loading ? Loading : Search"
      @input="searchHandler"
    />
  </span>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
import { Search, Loading } from '@/icons/common/'

//props & emits
const emits = defineEmits(['get-children'])
const props = defineProps({
  loading: {
    type: Boolean,
    require: true,
    default: () => {
      return false
    }
  },
  isReset: {
    type: Boolean,
    require: true,
    default: () => {
      return false
    }
  }
})

/**
 * @description input word in search-bar
 */
const keyword = ref('')

/**
 * @description fields that will be filtered
 */
const searchFields = ref([
  'reqNo', 'reqName', 'type', 'plant',
  'reqr', 'pgr', 'approveDate', 'issueDate',
  'status', 'buyoffStatus', 'turnOn', 'UAT1Exp',
  'UAT1Act', 'UAT2Exp', 'UAT2Act', 'releaseExp',
  'releaseAct', 'monitorExp', 'monitorAct'
])

/**
 * @description search bar input event handler
 */
const searchHandler = (value) => {
  emits('get-children', {
    keywords: value,
    searchFields: searchFields.value
  })
}

//watch the change of props, and reset keyword value
watch(props, () => { if (props.isReset) keyword.value = '' })
</script>

<style lang="scss" scoped>
$search-bar-w: 240px;
$search-bar-h: 24px;
$search-bar-title-w: 45px;
#keyword-search-container {
  display: inline-block;
  height: $search-bar-h;
  max-height: $search-bar-h;
  width: $search-bar-w;
  strong {
    text-align: right;
    font-size: 12px;
    line-height: $search-bar-h;
    width: 45px;
  }
  .el-input {
    width: calc($search-bar-w - 1rem - 45px) !important;
  }
}
</style>
