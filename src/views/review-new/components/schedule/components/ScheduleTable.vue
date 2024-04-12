<template>
  <div>
    <el-form-item
      v-for="(value, key) in formInputs"
      :key="key"
      :label="value.label"
    >
      <el-row class="form-row-width">
        <el-col :span="12">
          <el-date-picker
            v-model="schedule[key]"
            type="date"
            :placeholder="lang('Pick a date')"
            @change="dateListener"
          />
        </el-col>
        <el-col :span="12">
          <ValidateText
            :key-outer="'schedule'"
            :key-inner="key"
          />
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>

<script setup>
import { ValidateText } from '@/components'
import { useNewReqStore } from '@/store/new-request'
import { lang } from '@/hooks/useCommon'
import { dateFormatter } from '@/hooks/useDate'
const props = defineProps({ refreshCode: { type: Number, default: 0 } })
const store = useNewReqStore()
const requestType = ref('')       //需求類型
const formInputs = ref({})        //渲染表單用
//綁定 el-date-picker 的值
const schedule = ref({
  turnOnDate: '',
  UAT1: '',
  UAT2: '',
  release: '',
  monitor: ''
})

//賦予 formInputs 初始值
onMounted(async () => {
  await setFormInputs()
  setSchedule()
})
//監聽父組件的 refreshCode, 如果有改變則重新取得一次 type 的數值
watch(props, async (newVal, oldVal) => {
  await setFormInputs()
  setSchedule()
})

//formInputs 的數值會根據需求類型作更動
const setFormInputs = async () => {
  requestType.value = store.getRequestType
  formInputs.value = {
    turnOnDate: { label: 'Start coding date' },
    UAT1: { label: 'IT buyoff (UAT1)' },
    UAT2: { label: 'User buyoff (UAT2)' }
  }
  if (requestType.value === 'Project') {
    formInputs.value.release = { label: 'Release' }
    formInputs.value.monitor = { label: 'Monitor 1 lot' }
  }
}

//監聽 el-datePicker 的值是否被更改
 const dateListener = async (dateVal) => {
  for await (const [key, value] of Object.entries(schedule.value)) {
    schedule.value[key] = dateFormatter(value)
  }
  setSchedule()
}

//複用程式碼: 儲存 schedule 的值到 store 中
const setSchedule = () => {
  const { turnOnDate, UAT1, UAT2, release, monitor } = schedule.value
  if (requestType.value === 'OneTime') {
    store.setSchedule({
      turnOnDate,
      UAT1,
      UAT2,
      release: '',
      monitor: ''
    })
  } else {
    store.setSchedule({ turnOnDate, UAT1, UAT2, release, monitor })
  }
}
</script>
