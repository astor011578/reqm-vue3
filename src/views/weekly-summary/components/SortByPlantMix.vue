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
      <vxe-colgroup title="Reviewing">
        <vxe-column field="reviewingP1" title="P1" />
        <vxe-column field="reviewingP2" title="P2" />
        <vxe-column field="reviewingP3" title="P3" />
      </vxe-colgroup>
      <vxe-colgroup title="Proceeding">
        <vxe-column field="prcdP1" title="P1" />
        <vxe-column field="prcdP2" title="P2" />
        <vxe-column field="prcdP3" title="P3" />
      </vxe-colgroup>
      <vxe-colgroup title="Done">
        <vxe-column field="doneP1" title="P1" />
        <vxe-column field="doneP2" title="P2" />
        <vxe-column field="doneP3" title="P3" />
      </vxe-colgroup>
      <vxe-colgroup title="Cancel">
        <vxe-column field="cancelP1" title="P1" />
        <vxe-column field="cancelP2" title="P2" />
        <vxe-column field="cancelP3" title="P3" />
      </vxe-colgroup>
      <vxe-colgroup title="Delay">
        <vxe-column field="delayP1" title="P1" />
        <vxe-column field="delayP2" title="P2" />
        <vxe-column field="delayP3" title="P3" />
      </vxe-colgroup>
      <vxe-colgroup title="Rejected">
        <vxe-column field="rejectedP1" title="P1" />
        <vxe-column field="rejectedP2" title="P2" />
        <vxe-column field="rejectedP3" title="P3" />
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
  if (
    (column.field === 'doneP1' && row.doneP1 > 0) ||
    (column.field === 'doneP2' && row.doneP2 > 0) ||
    (column.field === 'doneP3' && row.doneP3 > 0)
  ) {
    return 'ce-highlight'
  }

  if (
    (column.field === 'cancelP1' && row.cancelP1 > 0) ||
    (column.field === 'cancelP2' && row.cancelP2 > 0) ||
    (column.field === 'cancelP3' && row.cancelP3 > 0)
  ) {
    return 'ce-lowlight'
  }

  if (
    (column.field === 'delayP1' && row.delayP1 > 0) ||
    (column.field === 'delayP2' && row.delayP2 > 0) ||
    (column.field === 'delayP3' && row.delayP3 > 0)
  ) {
    return 'ce-lowlight'
  }

  if (
    (column.field === 'rejectedP1' && row.rejectedP1 > 0) ||
    (column.field === 'rejectedP2' && row.rejectedP2 > 0) ||
    (column.field === 'rejectedP3' && row.rejectedP3 > 0)
  ) {
    return 'ce-lowlight'
  }

  return ''
}
</script>
