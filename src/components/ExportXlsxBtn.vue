<template>
  <!-- 此組件只有包裝好外觀而已, 匯出 .xlsx 方法要另外實作 -->
  <span class="export-xlsx-container">
    <strong class="mr-2">{{ `${lang('Export')}:` }}</strong>
    <el-tooltip
      :content="lang('Export as xlsx file')"
      effect="dark"
      placement="bottom"
    >
      <el-button
        :icon="ExcelIcon"
        color="#c6c6c6"
        circle
        @click="exportXlsx"
      />
    </el-tooltip>
  </span>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
import { ExcelIcon } from '@/icons/common/'
const exportXlsx = ref(null)
const props = defineProps({
  onExport: {
    type: Function,
    require: true,
    default: () => {
      return null
    }
  }
})
watch(props, () => exportXlsx.value = props.onExport)
onMounted(() => exportXlsx.value = props.onExport)
</script>

<style lang="scss" scoped>
.export-xlsx-container {
  display: inline-block;
  //override font color in el-button
  .el-button {
    color: #fff;
  }
  strong {
    font-size: 12px;
  }
}
</style>
