<template>
  <div>
    <vxe-table
      size="mini"
      height="340"
      border
      align="center"
      show-header-overflow
      show-overflow
      :row-config="{ isHover: true }"
      :cell-class-name="highlightCell"
      :tooltip-config="tipForWeek"
      :data="props.loadAll ? allData : filterData"
      :loading="props.loading"
      :loading-config="{ text: `${lang('Loading')}...` }"
      :empty-render="{ name: 'NoData' }"
    >
      <vxe-column field="simpleWeek" :title="lang('Week')" />
      <vxe-column field="total" :title="lang('Total')" />
      <vxe-colgroup :title="lang('Status')">
        <vxe-column field="reviewing" title="Reviewing" />
        <vxe-column field="prcd" title="Proceeding" />
        <vxe-column field="done" title="Done" />
        <vxe-column field="cancel" title="Cancel" />
        <vxe-column field="delay" title="Delay" />
        <vxe-column field="rejected" title="Rejected" />
      </vxe-colgroup>
    </vxe-table>
  </div>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
const props = defineProps({
  resource: { type: Array, required: true },
  loadAll: Boolean,
  loading: Boolean
})

let allData = reactive([])      //all data
let filterData = reactive([])   //last 10 data
//get allData & filterData
if (props.resource) {
  allData = Object.assign([], props.resource)
  let startIdx = allData.length > 10 ? allData.length - 10 : 0
  for (let i = startIdx; i < allData.length; i++) {
    filterData.push(allData[i])
  }
}

/**
 * @description tooltips config
 */
const tipForWeek = {
  showAll: true,
  enterable: true,
  contentMethod: ({ type, column, row, items, _columnIndex }) => {
    const { field } = column
    if (field === 'simpleWeek') {
      if (type !== 'header' && type !== 'footer') {
        return `${row['fullWeek'].toString().slice(0, 4)} ${row['simpleWeek']}`
      }
    }
    return null
  }
}

/**
 * @description highlighting cells
 */
const highlightCell = ({ row, column }) => {
  if (column.field === 'done' && row.done > 0) return 'ce-highlight'
  if (
    (column.field === 'cancel' && row.cancel > 0) ||
    (column.field === 'delay' && row.delay > 0) ||
    (column.field === 'rejected' && row.rejected > 0)
  ) {
    return 'ce-lowlight'
  }
  return ''
}
</script>
