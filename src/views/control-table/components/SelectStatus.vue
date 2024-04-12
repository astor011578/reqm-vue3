<template>
  <span id="select-menu" class="mr-4">
    <strong class="mr-2">{{ lang('Switch status') }}:</strong>
    <el-select
      v-model="selectedStatus"
      :placeholder="lang('Please select')"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </span>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
const emits = defineEmits([ 'get-children' ])
const selectedStatus = ref('Weekly')
const options = reactive([
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Reviewing', label: 'Reviewing' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Proceeding', label: 'Proceeding' },
  { value: 'Cancel', label: 'Cancel' },
  { value: 'Done', label: 'Done' }
])
//when v-model of select menu changes, sending new value to parent component
watch(selectedStatus, (val) => emits('get-children', selectedStatus.value))
</script>

<style lang="scss" scoped>
$select-menu-w: 240px;
$select-menu-h: 24px;

#select-menu {
  max-height: $select-menu-h;
  height: $select-menu-h;
  width: $select-menu-w;
  display: inline-block;
  strong {
    width: 82px;
    font-size: 12px;
    line-height: $select-menu-h;
  }
  .el-select {
    width: calc($select-menu-w - 1rem - 82px) !important;
  }
}
</style>
