<template>
  <div>
    <vxe-table
      size="mini"
      height="450"
      border
      align="center"
      show-header-overflow
      show-overflow
      :row-config="{ isHover: true }"
      :cell-class-name="highlightCell"
      :tooltip-config="tipForWeek"
      :data="props.loadAll ? allData : filterData"
      :merge-cells="props.loadAll ? allMerge : filterMerge"
      :loading="props.loading"
      :loading-config="{ text: `${lang('Loading')}...` }"
      :empty-render="{ name: 'NoData' }"
      :row-class-name="hoverRowsHandler"
      @cell-mouseenter="mouseEnter"
      @cell-mouseleave="mouseLeave"
    >
      <vxe-column field="simpleWeek" :title="lang('Week')" />
      <vxe-column field="plant" :title="lang('Plant')" />
      <vxe-column field="total" :title="lang('Total')" />
      <vxe-column field="reviewing" title="Reviewing" />
      <vxe-column field="prcd" title="Proceeding" />
      <vxe-column field="done" title="Done" />
      <vxe-column field="cancel" title="Cancel" />
      <vxe-column field="delay" title="Delay" />
      <vxe-column field="rejected" title="Rejected" />
    </vxe-table>
  </div>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
const props = defineProps({
  resource: {
    type: Array,
    required: true
  },
  loadAll: Boolean,
  loading: Boolean
})

let allData = reactive([])      //all data
let allMerge = reactive([])     //merge-cells for all data
let filterData = reactive([])   //last 15 data (5 weeks * 3 plants)
let filterMerge = reactive([])  //merge-cells for filtered data
//get allData & filterData
if (props.resource) {
  const plantArr = ['P1', 'P2', 'P3']
  props.resource.forEach((item) => {
    for (let i = 0; i < 3; i++) {
      allData.push({
        fullWeek: item.fullWeek,
        simpleWeek: item.simpleWeek,
        plant: plantArr[i],
        total: item[`total${plantArr[i]}`],
        reviewing: item[`reviewing${plantArr[i]}`],
        prcd: item[`prcd${plantArr[i]}`],
        done: item[`done${plantArr[i]}`],
        cancel: item[`cancel${plantArr[i]}`],
        delay: item[`delay${plantArr[i]}`],
        rejected: item[`rejected${plantArr[i]}`]
      })
    }
  })
  for (let i = 0; i < allData.length; i++) {
    if (i % 3 === 0) allMerge.push({ row: i, col: 0, rowspan: 3, colspan: 1 })
  }
  let startIdx = allData.length > 15 ? allData.length - 15 : 0
  for (let i = startIdx; i < allData.length; i++) {
    filterData.push(allData[i])
  }
  for (let i = 0; i < filterData.length; i++) {
    if (i % 3 === 0) filterMerge.push({ row: i, col: 0, rowspan: 3, colspan: 1 })
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

//Row-span hovering handler
const hoveringRows = ref('')
const hoverRowsHandler = ({ row }) => { return row.fullWeek === hoveringRows.value ? 'hover-span-rows' : '' }
const mouseEnter = ({ row }) => hoveringRows.value = row.fullWeek
const mouseLeave = () => hoveringRows.value = ''
</script>

<style lang="scss">
.hover-span-rows {
  background-color: #97b3ce66 !important;
}
</style>
