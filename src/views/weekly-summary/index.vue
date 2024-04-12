<template>
  <div>
    <div class="mb-5">
      <!-- title -->
      <TopTitle>
        <template #title>{{ lang('Request weekly report') }}</template>
      </TopTitle>
      <div class="ce-main-container">
        <!-- toolbar -->
        <div class="ce-toolbar">
          <span>
            <strong class="mr-2">{{ lang('Switch status') }}:</strong>
            <SelectMenu
              :options="options"
              :selected="selected"
              @get-selected-option="getSelectedOption"
            />
          </span>
          <span>
            <span class="mr-4">
              <LoadAll
                :is-all="isAll"
                :loading="loading"
                @get-is-all="getIsAll"
              />
            </span>
            <ExportXlsx v-if="resource.length" :resource="resource" />
          </span>
        </div>
        <!-- contents -->
        <div>
          <SortByType
            v-if="typeSum.length && selected === '#1'"
            :resource="typeSum"
            :loading="loading"
            :load-all="isAll"
            @get-children="getTableInfo"
          />
          <SortByPlant
            v-if="plantSum.length && selected === '#2'"
            :resource="plantSum"
            :loading="loading"
            :load-all="isAll"
          />
          <SortByPlantMix
            v-if="plantSum.length && selected === '#3'"
            :resource="plantSum"
            :loading="loading"
            :load-all="isAll"
          />
          <BarChart
            v-if="typeSum.length"
            :resource="typeSum"
            class="pt-4"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LoadAll, SelectMenu, TopTitle } from '@/components'
import { getReqSummary } from '@/api/summary'
import { lang } from '@/hooks/useCommon'
import { SortByType, SortByPlant, SortByPlantMix, BarChart, ExportXlsx } from './components'
const selected = ref('#1')    //連動目前 select menu 中被選取的 option
const isAll = ref(false)      //是否要讀取所有資料
const getIsAll = (isAllFromChild) => isAll.value = isAllFromChild
//選單裡面的選項
const options = reactive([
  { value: '#1', label: 'Sort by status' },
  { value: '#2', label: 'Plant & status (grouped)' },
  { value: '#3', label: 'Plant & status (ungrouped)' }
])
const getSelectedOption = (selectedFromChild) => selected.value = selectedFromChild
//如果 selected 值發生改變, 啟動 loading
const loading = ref(false)
watch(selected, async (val) => {
  loading.value = true
  setTimeout(() => loading.value = false, 1000)
})

//表格與圖表的資料
const resource = ref([])        //raw data, 同時也是 ExportXlsx 組件的 data
const typeSum = reactive([])    //第一個表格的 data
const plantSum = reactive([])   //第二個與第三個表格的 data

onMounted(async () => {
  await getReqSummary()
    .then((res) => {
      switch (res.code) {
        case 200: {
          resource.value = Object.assign([], res.data)
          resource.value.forEach((doc) => {
            typeSum.push({
              fullWeek: doc.week,
              simpleWeek: 'W' + doc.week.toString().slice(4),
              total: doc.total,
              reviewing: doc.reviewing,
              prcd: doc.prcd,
              done: doc.done,
              cancel: doc.cancel,
              delay: doc.delay,
              rejected: doc.rejected
            })

            plantSum.push({
              fullWeek: doc.week,
              simpleWeek: 'W' + doc.week.toString().slice(4),
              total: doc.total,
              totalP1: doc.P1.total,
              totalP2: doc.P2.total,
              totalP3: doc.P3.total,
              reviewingP1: doc.P1.reviewing,
              reviewingP2: doc.P2.reviewing,
              reviewingP3: doc.P3.reviewing,
              prcdP1: doc.P1.prcd,
              prcdP2: doc.P2.prcd,
              prcdP3: doc.P3.prcd,
              doneP1: doc.P1.done,
              doneP2: doc.P2.done,
              doneP3: doc.P3.done,
              cancelP1: doc.P1.cancel,
              cancelP2: doc.P2.cancel,
              cancelP3: doc.P3.cancel,
              delayP1: doc.P1.delay,
              delayP2: doc.P2.delay,
              delayP3: doc.P3.delay,
              rejectedP1: doc.P1.rejected,
              rejectedP2: doc.P2.rejected,
              rejectedP3: doc.P3.rejected
            })
          })
          break
        }
        default: break
      }
    })
})
</script>

<style scoped lang="scss">
//override font color in el-button
:deep(.el-button) {
  color: #fff;
}
//bar-chart container 設定
:deep(.barchart-parent) {
  margin-left: 1.5rem;
  margin-right: 1.5rem;
}
:deep(.barchart-container) {
  height: 375px;
  margin: 0 auto;
  div:has(canvas) {
    margin: 0 auto !important;
  }
}
</style>
