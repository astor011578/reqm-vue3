<template>
  <el-form-item
    v-for="(value, key) in formInputs"
    :key="key"
    :label="lang(value.label)"
  >
    <el-row class="form-row-width">
      <el-col :span="12">
        <el-input
          v-model="reqTable[key]"
          :type="value.type"
          :rows="value.rows"
          @change="inputListener"
        />
      </el-col>
      <el-col :span="12">
        <ValidateText
          :key-outer="'reqTable'"
          :key-inner="key"
        />
      </el-col>
    </el-row>
  </el-form-item>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
import { ValidateText } from '@/components'
import { useNewReqStore } from '@/store/new-request'
const addNewStore = useNewReqStore()
const reqTable = ref({})    //綁定各個 el-input 裡的值
const props = defineProps({ refreshCode: { type: Number, default: 0 } })
//渲染表單輸入項用
const formInputs = {
  reqName: { label: 'Request name', type: 'textarea', rows: '1'},
  stage: { label: 'Stage' },
  customer: { label: 'Customer' },
  device: { label: 'Device' },
  tester: { label: 'Tester' },
  equipment: { label: 'Equipment' },
  system: { label: 'System' },
  purpose: { label: 'Purpose', type: 'textarea', rows: '5' }
}

//監聽輸入項的值是否被變更
const inputListener = (inputValue) => addNewStore.setReqTable(reqTable.value)
onMounted(() => reqTable.value = addNewStore.getReqTable)

//監聽 props.refreshCode 是否有改變
watch(props, (value) => reqTable.value = addNewStore.getReqTable)
</script>
