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
        <span style="width: 100%; margin: 8px;">
          <span style="margin-bottom: 8px;">{{ lang('Uploaded files') }}</span><br>
          <div v-if="!attachedFiles.length" class="ce-gray-color-italic attachedFiles-container">
            {{ lang('There is no file attached') }}
          </div>
          <div
            v-for="(file, index) in attachedFiles"
            :key="index"
            class="attachedFiles-container"
          >
            <a
              class="ce-link"
              :href="prePath + file.fileName"
              :download="reqNo + '_attachment_' + file.originalName"
              target="_blank"
            >
              <div class="inline-flex">
                <File class="mr-1" />
                {{ file.originalName }}
              </div>
            </a>
          </div>
          <el-button
            v-if="!showUploadFiles"
            :disabled="showUploadFiles"
            plain
            type="primary"
            style="margin-bottom: 12px;"
            @click="uploadAgain"
          >
            {{ lang('Upload again') }}
          </el-button>
        </span>
        <UploadFiles
          v-if="showUploadFiles"
          :size="size"
          :plain="plain"
          @get-children="getAttachedFiles"
        />
      </el-form-item>
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { File } from '@/icons/common/'
import { lang } from '@/hooks/useCommon'
import { UploadFiles } from '@/components'
import { useNewReqStore } from '@/store/new-request'
import { Notice, PrintReqTable, ManualReqTable, PlantRadios } from './components'
const store = useNewReqStore()
const refreshCode = ref(0)      //提供子組件判斷是否需要重新向 store 取值
const prePath = `${import.meta.env.VITE_APP_BASE_URL}/uploads/attached_files/`
const reqNo = useRoute().params.reqNo
const attachedFiles = ref([])   //儲存附件的資訊
//UploadFiles 組件變數
const size = 'small'
const plain = true
//取得子組件傳來的 needRefresh
const getNeedRefresh = (needRefresh) => { if (needRefresh) refreshCode.value++ }
//從子組件 UploadFiles.vue 中取得附件資訊
const getAttachedFiles = async ($attachedFiles) => {
  store.setAttachedFiles($attachedFiles)
}
const showUploadFiles = ref(false)
const uploadAgain = () => {
  ElMessageBox.confirm(
    lang('Are you sure to upload attached file again?'),
    'Warning',
    {
      confirmButtonText: lang('OK'),
      cancelButtonText: lang('Cancel'),
      type: 'warning',
      dangerouslyUseHTMLString: true
    }
  )
    .then(() => showUploadFiles.value = true )
    .catch(() => ElMessage.info(lang('Action cancelled')))
}
//儲存 attachedFiles 預設值到 store 中
onMounted(() => {
  attachedFiles.value = store.getAttachedFiles
  store.setAttachedFiles(attachedFiles.value)
})
</script>

<style lang="scss" scoped>
a {
  width: 100%;
  line-height: 24px;
}
.attachedFiles-container {
  margin-bottom: 0.25rem;
}
</style>
