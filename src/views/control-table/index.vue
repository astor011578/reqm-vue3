<template>
  <div class="ce-main-container">
    <!-- Toolbar -->
    <div class="ce-toolbar ml-0 mr-0">
      <span>
        <SelectStatus @get-children="getSelected" />
        <SearchBar :is-reset="isReset" :loading="loading" @get-children="getSearchWords" />
      </span>
      <span>
        <ExportXlsx :resource="resource" :title="switchTable" />
      </span>
    </div>
    <!-- Table -->
    <div id="table-container">
      <vxe-table
        ref="tableRef"
        border
        align="center"
        size="mini"
        height="100%"
        auto-resize
        :loading="loading"
        :data="resultData"
        :empty-render="{ name: 'NoData' }"
        show-header-overflow
        show-overflow
        :tooltip-config="{ showAll: true }"
        :row-class-name="highlightRow"
        :row-config="{ isHover: true }"
        :column-config="{ resizable: true }"
        :sort-config="{ defaultSort: sorting }"
        @filter-change="filterListener"
      >
        <vxe-column field="reqNo" :title="lang('ReqNo')" width="90" sortable fixed="left">
          <template #default="{ row }">
            <a class="ce-link" :href="`#/detail/${row.reqNo}`" target="_blank">{{ row.reqNo }}</a>
          </template>
        </vxe-column>
        <vxe-column
          field="reqName"
          :title="lang('Request name')"
          width="350"
          sortable
          header-align="center"
          align="left"
          fixed="left"
        />
        <vxe-column field="buyoffStatus" :title="lang('Status')" width="116" fixed="left">
          <template #default="{ row }">
            <span v-if="row.buyoffStatus === 'Done' || row.buyoffStatus === 'Cancel'" class="ce-italic">
              {{ row.buyoffStatus }}
            </span>
            <span v-else class="ce-italic">
              {{ row.buyoffStatus }}
            </span>
          </template>
        </vxe-column>
        <vxe-column field="approveDate" :title="lang('Review date')" width="115" sortable>
          <template #default="{ row }">
            <span v-if="row.approveDate === ''" class="ce-gray-color-italic">N/A</span>
            <span v-else>{{ row.approveDate }}</span>
          </template>
        </vxe-column>
        <vxe-column field="reviewDuration" :title="`${lang('Review duration (day)')}`" width="100" sortable />
        <vxe-column field="leadTime" :title="`${lang('Lead time (day)')}`" width="110" sortable>
          <template #default="{ row }">
            <span v-if="row.leadTime < 0" class="ce-gray-color-italic">N/A</span>
            <span v-else>{{ row.leadTime }}</span>
          </template>
        </vxe-column>
        <vxe-colgroup :title="`${lang('Rescheduling (times)')}`">
          <vxe-column field="rescheduleIT" title="IT" width="79" sortable />
          <vxe-column field="rescheduleReqr" :title="lang('Requester')" width="99" sortable />
        </vxe-colgroup>
        <vxe-column field="type" :title="lang('Type')" width="85" sortable :filters="typeList" :filter-method="filterHandler">
          <template #default="{ row }">
            <span v-if="row.type">{{ row.type }}</span>
            <span v-else class="ce-gray-color-italic">N/A</span>
          </template>
        </vxe-column>
        <vxe-column
          field="plant"
          :title="lang('Plant')"
          width="87"
          sortable
          :filters="plantList"
          :filter-method="filterHandler"
        />
        <vxe-column field="reqr" :title="lang('Requester')" min-width="100" sortable>
          <template #default="{ row }">{{ row.reqr }}</template>
        </vxe-column>
        <vxe-column
          v-if="ITList.length"
          field="pgr"
          title="IT"
          width="100"
          sortable
          :filters="ITList"
          :filter-method="filterHandler"
        />
        <vxe-column field="issueDate" :title="lang('Issue date')" width="99" sortable />
        <vxe-column field="turnOnDate" title="Turn on" width="66" />
        <vxe-colgroup v-for="(item, index) in _schedule" :key="index" :title="item.title">
          <vxe-column :field="`${item.prefix}Exp`" :title="lang('Expect')" width="71" />
          <vxe-column :field="`${item.prefix}Act`" :title="lang('Actual')" width="71" />
        </vxe-colgroup>
      </vxe-table>
    </div>
    <!-- Search result -->
    <span>
      {{ lang('Total') }}
      <span class="ce-blue-color ce-text-bold">{{ totalPage }}</span>
      {{ totalPage > 1 ? lang('records') : lang('record') }}
    </span>
  </div>
</template>

<script setup>
import XEUtils from 'xe-utils'
import { lang } from '@/hooks/useCommon'
import { SelectStatus, SearchBar, ExportXlsx } from './components'
import { getUsersReq } from '@/api/user'
import { getRequests } from '@/api/request'
const tableRef = ref(null)          //綁定 vxe-table 的 ref
const resource = ref([])            //從服務端請求過來的 raw data
const resultData = ref([])          //經過 filter / keyword-searching 過濾後的 data
const loading = ref(false)          //是否要開啟 loading 效果 (ps. 搜尋或選單組件的值變動時會啟動 loading)
const isReset = ref(false)          //判斷搜尋欄是否需要重置
const totalPage = ref(0)            //資料總筆數
const switchTable = ref('Weekly')   //綁定選單組件選中的值, 預設選項為 'Weekly'
const sorting = reactive({ field: 'reqNo', order: 'desc' })   //綁定排序的值, 預設排序為 reqNo 降序

//渲染表頭用
const _schedule = [
  { title: 'IT buyoff (UAT1)', prefix: 'UAT1' },
  { title: 'User buyoff (UAT2)', prefix: 'UAT2' },
  { title: 'Release', prefix: 'release' },
  { title: 'Monitor 1 lot', prefix: 'monitor' }
]

/**
 * @description 資料格的特殊標記
 * Rejected, Cancel, Done: 整行灰底
 *  若是當天 Cancel / Rejected: 額外標紅字
 *  若是當天 Done: 額外標藍字
 * Delay: 整行紅底紅字
 * 當日新增: 整行藍字 (維持白底)
 */
const highlightRow = ({ row }) => {
  if (row.newOnToday) return 'ce-blue-color'

  if (row.thisWeek) {
    if (row.status === 'Done') return row.doneOnToday ? 'row-closed ce-blue-color' : 'row-closed'
    if (row.status === 'Cancel') return row.cancelOnToday ? 'row-closed ce-red-color' : 'row-closed'
    if (row.status === 'Rejected') return row.rejectedOnToday ? 'row-closed ce-red-color' : 'row-closed'
  } else {
    if (row.status === 'Done' || row.status === 'Cancel' || row.status === 'Rejected') return 'row-closed'
  }

  if (row.status === 'Proceeding') {
    const step = row.buyoffStatus.split(' ')[1]
    if (row[`${step}IsDue`]) return 'row-delay'
  }

  return ''
}

//vxe-table 的 filter 值
const typeList = [
  { label: 'Project', value: 'Project' },
  { label: 'OneTime', value: 'OneTime' },
  { label: 'Undefined', value: undefined }
]
const plantList = [
  { label: 'P1', value: 'P1' },
  { label: 'P2', value: 'P2' },
  { label: 'P3', value: 'P3' }
]
let ITList = ref([])

//vxe-table filter 監聽器
const filterListener = () => {
  const $visibleData = tableRef.value.getTableData().visibleData
  totalPage.value = $visibleData.length
}

//vxe-table filter 處理器
const filterHandler = ({ value, row, column }) => {
  return row[column.field] === value
}

//向服務端請求獲取資料 (每次選單選項有改變, 就會送ㄧ次請求)
const selectPageReq = () => {
  isReset.value = true
  loading.value = true

  setTimeout(() => {
    getRequests(switchTable.value)
      .then(res => {
        resource.value = res.data
        resultData.value = res.data
        totalPage.value = res?.data.length

        //每次送出請求就重置篩選與搜尋欄的設置
        if (tableRef.value) {
          tableRef.value.reloadData(resource.value)
          tableRef.value.sort('reqNo', 'desc')
        }
        isReset.value = false
        loading.value = false
      })
  }, 1000)
}

//get selected option from children component (SelectStatus.vue)
const getSelected = (_option) => switchTable.value = _option
//onMounted 時, 向服務端請求取得資料
onMounted(async () => {
  selectPageReq()
  await getUsersReq('IT')
    .then((res) => {
      const { data } = res
      ITList.value = []
      if (data && data.length) {
        const ITs = data.map(IT => {
          const { nameEn } = IT
          return { label: nameEn, value: nameEn }
        })
        ITList.value = ITs
      }
    })
})
//listen to switchTable
watch(switchTable, () => selectPageReq())

//get filtered results from children component (SearchBar.vue)
const getSearchWords = (_searchInfo) => {
  const keywords = XEUtils.toValueString(_searchInfo.keywords).trim().toLowerCase()
  const searchFields = Object.assign([], _searchInfo.searchFields)
  tableRef.value.clearFilter()

  if (keywords) {
    const rest = resource.value.filter((item) =>
      searchFields.some((key) => XEUtils.toValueString(item[key]).toLowerCase().indexOf(keywords) > -1)
    )
    resultData.value = rest.map((row) => {
      const item = Object.assign({}, row)
      return item
    })
  } else {
    resultData.value = resource.value
  }
  totalPage.value = resultData.value.length
}
</script>

<style lang="scss" scoped>
$outer-space: calc(var(--navbar-height) + 1rem * 2 + 24.38px + 24px * 2 + 1px * 2 + 14px);

:deep(#loading-mask) {
  height: calc(100vh - var(--navbar-height) - 12px * 2 - 4px - 8px);
  background-color: rgba(236, 239, 241, 0.5);
  color: #409eff;
  > div {
    width: 40px;
    height: 40px;
  }
}

#table-container {
  padding-top: 0.75rem;
  margin-bottom: calc(10px + 24px);   //vxe-table 的 scrollbar 為 10px;
  height: calc(100vh - $outer-space);
}
:deep(.row-closed) {
  background-color: rgb(200, 200, 200, 0.75) !important;
}
:deep(.row-delay) {
  background-color: rgb(253, 178, 178, 0.5) !important;
  color: #f56c6c !important;
}
</style>
@/api/request
