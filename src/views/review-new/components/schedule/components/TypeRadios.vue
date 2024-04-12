<template>
  <div>
    <!-- radio of type -->
    <div class="mt-3">
      <el-form-item :label="lang('Request type')">
        <el-radio-group v-model="type" @change="setTypeAndRefresh(type)">
          <el-radio label="Project" />
          <el-radio label="OneTime" />
        </el-radio-group>
      </el-form-item>
    </div>
  </div>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
import { useNewReqStore } from '@/store/new-request'
const newReqStore = useNewReqStore()
const emits = defineEmits([ 'get-need-refresh' ])
//綁定 type radio 的值
const type = ref('Project')

//儲存 type 預設值到 store 中
onMounted(() => setTypeAndRefresh(type.value))

//將 type 數值的變化儲存到 store, 並告知父組件需要 refresh 數值
const setTypeAndRefresh = (type) => {
  newReqStore.setRequestType(type)
  emits('get-need-refresh', true)
}
</script>
