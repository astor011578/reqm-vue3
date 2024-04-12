<template>
  <div>
    <span class="ce-title-lg">
      {{ lang('Fill the request table') }}
    </span>
    <!-- 提示 alert -->
    <div class="p-3">
      <Notice />
    </div>
    <!-- 填 Request table 可以有兩種方式:  -->
    <div class="mt-3 mb-8">
      <!-- 1. 讀 .xlsx 檔填表 -->
      <PrintReqTable @get-need-refresh="getNeedRefresh" />
      <!-- 2. 手動輸入各項欄位 -->
      <ManualReqTable :refresh-code="refreshCode" />
      <!-- 再來選擇此需求是哪個廠 -->
      <PlantRadios />
      <!-- 上傳附件 -->
      <el-form-item :label="lang('Attached files')">
        <UploadFiles
          :size="size"
          :plain="plain"
          @get-children="getAttachedFiles"
        />
      </el-form-item>
    </div>
  </div>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
import { Notice, PrintReqTable, ManualReqTable, PlantRadios } from './components'
import { UploadFiles } from '@/components'
import { useNewReqStore } from '@/store/new-request'
const newReqStore = useNewReqStore()
const refreshCode = ref(0)      //提供子組件判斷是否需要重新向 store 取值
const attachedFiles = ref([])   //儲存附件的資訊
//UploadFiles 組件變數
const size = 'small'
const plain = true
//取得子組件傳來的 needRefresh
const getNeedRefresh = (needRefresh) => { if (needRefresh) refreshCode.value++ }
//從子組件 UploadFiles.vue 中取得附件資訊
const getAttachedFiles = async ($attachedFiles) => {
  attachedFiles.value = Object.assign([], $attachedFiles)
  newReqStore.setAttachedFiles(attachedFiles.value)
}
//儲存 attachedFiles 預設值到 store 中
onMounted(() => newReqStore.setAttachedFiles(attachedFiles.value))
</script>
