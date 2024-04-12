<template>
  <div>
    <div class="ce-toolbar">
      <span></span>
      <LoadAll
        :is-all="loadAll"
        :loading="loading"
        @get-is-all="getIsAll"
      />
    </div>
    <div class="barchart-parent">
      <div id="weekly-request-barchart" class="barchart-container"></div>
    </div>
  </div>
</template>

<script setup>
import { LoadAll } from '@/components'
import * as echarts from 'echarts/core'
import { TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { BarChart, LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
const props = defineProps({
  resource: {
    type: Array,
    required: true
  }
})
let barChart                    //用來綁定 bar-chart 實例
const canvasID = ref(null)      //畫布 dom ID
const canvasWidth = ref(0)      //畫布 width
let allData = reactive({})      //all data
let filterData = reactive({})   //last 10 data
let loading = ref(false)        //是否啟用 loading 動畫
const loadAll = ref(false)      //是否要獲取所有資料
const getIsAll = (isAllFromChild) => loadAll.value = isAllFromChild

//echarts setting
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition
])

//初始化 echart 實例
onMounted(async () => {
  canvasID.value = document.getElementById('weekly-request-barchart')
  canvasWidth.value = canvasID.value.clientWidth
  if (props.resource) {
    let p = new Promise((resolve, reject) => {
      allData = loadData(true, props.resource)
      filterData = loadData(false, props.resource)
      resolve(null)
    })
    p.then((res) => {
      barChart = echarts.init(canvasID.value)
      initChart(barChart, filterData)
    })
  }
})

//watch if loadAll value changed
watch(loadAll, (newVal, oldVal) => {
  loading.value = true
  barChart.showLoading()
  setTimeout(() => {
    loading.value = false
    barChart.hideLoading()
    switch (newVal) {
      case true: initChart(barChart, allData); break;
      case false: initChart(barChart, filterData); break;
    }
  }, 1500)
})

/**
 * @description get data in charts
 * @param { Boolean } isNeedAll: load all or part of data
 * @param { Array } resource: resource data from props
 * @returns { Array } _loadData: loaded data
 */
const loadData = (isNeedAll, resource) => {
  let _startIdx = isNeedAll ? 0 : resource.length > 10 ? resource.length - 10 : 0
  let _loadData = {
    weeks: [],
    prcds: [],
    dones: [],
    reviewings: [],
    cancels: [],
    delays: [],
    rejecteds: [],
    totals: []
  }
  for (let i = _startIdx; i < resource.length; i++) {
    _loadData.weeks.push(resource[i].simpleWeek)
    _loadData.prcds.push(resource[i].prcd)
    _loadData.dones.push(resource[i].done)
    _loadData.reviewings.push(resource[i].reviewing)
    _loadData.cancels.push(resource[i].cancel)
    _loadData.delays.push(resource[i].delay)
    _loadData.rejecteds.push(resource[i].rejected)
    _loadData.totals.push(resource[i].total)
  }
  return _loadData
}

//初始化 echart 實例
const initChart = (chart, resource) => {
  chart.setOption({
    title: {
      text: 'Weekly summary of requests',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: true },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    legend: {
      top: '8%',
      data: ['Proceeding', 'Done', 'Cancel', 'Delay', 'Reviewing', 'Rejected', 'Total']
    },
    color: [
      "#5470c6",
      "#91cc75",
      "#fac858",
      "#ee6666",
      "#73c0de",
      "#fc8452",
      "#3ba272",
      "#9a60b4",
      "#ea7ccc"
    ],
    xAxis: [
      {
        type: 'category',
        data: resource.weeks,
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        name: 'Request (cases)',
        type: 'value',
        minInterval: 1,
        min: 0,
        max: (value) => { return value.max + 1 }
      }
    ],
    series: [
      {
        name: 'Proceeding',
        type: 'bar',
        tooltip: {
          valueFormatter: (value) => { return value > 1 ? value + ' cases' : value + ' case' }
        },
        data: resource.prcds
      },
      {
        name: 'Done',
        type: 'bar',
        tooltip: {
          valueFormatter: (value) => { return value > 1 ? value + ' cases' : value + ' case' }
        },
        data: resource.dones
      },
      {
        name: 'Cancel',
        type: 'bar',
        tooltip: {
          valueFormatter: (value) => { return value > 1 ? value + ' cases' : value + ' case' }
        },
        data: resource.cancels
      },
      {
        name: 'Delay',
        type: 'bar',
        tooltip: {
          valueFormatter: (value) => { return value > 1 ? value + ' cases' : value + ' case' }
        },
        data: resource.delays
      },
      {
        name: 'Reviewing',
        type: 'bar',
        tooltip: {
          valueFormatter: (value) => { return value > 1 ? value + ' cases' : value + ' case' }
        },
        data: resource.reviewings
      },
      {
        name: 'Rejected',
        type: 'bar',
        tooltip: {
          valueFormatter: (value) => { return value > 1 ? value + ' cases' : value + ' case' }
        },
        data: resource.rejecteds
      },
      {
        name: 'Total',
        type: 'line',
        yAxisIndex: 0,
        tooltip: {
          valueFormatter: function (value) { return value > 1 ? value + ' cases' : value + ' case' }
        },
        data: resource.totals
      }
    ]
  })
}

window.addEventListener('resize', () => {
  canvasWidth.value = canvasID.value.clientWidth
  barChart.resize()
})
</script>
