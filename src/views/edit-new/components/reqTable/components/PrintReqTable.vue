<template>
  <el-form-item :label="lang('Upload excel')" class="block">
    <el-upload
      ref="uploadRef"
      :limit="1"
      :on-remove="removeTemplate"
      :auto-upload="false"
      :on-exceed="exceedHandler"
      :on-change="readExcel"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
    >
      <template #trigger>
        <el-button type="primary" plain>
          {{ `${lang('Select file')}...` }}
        </el-button>
      </template>
    </el-upload>
  </el-form-item>
</template>

<script setup>
import * as XLSX from 'xlsx/xlsx.mjs'
import { genFileId, ElMessage } from 'element-plus'
import { lang } from '@/hooks/useCommon'
import { useNewReqStore } from '@/store/new-request'
const uploadRef = ref(null)   //綁定 el-upload
const addNewStore = useNewReqStore()
const emits = defineEmits(['get-need-refresh'])
//將 file 移出 file list 時觸發
const removeTemplate = (files) => {
  uploadRef.value.clearFiles()
  files.raw = null
  addNewStore.setReqTable({
    reqName: '',
    stage: '',
    customer: '',
    device: '',
    tester: '',
    equipment: '',
    system: '',
    purpose: ''
  })
  emits('get-need-refresh', true)
}

//超出 file list 上限時觸發
const exceedHandler = (files, uploadFiles) => {
  !uploadRef.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  !uploadRef.value.handleStart(file)
}

//read .xlsx file
const readExcel = (files) => {
  if (!files.raw) return
  let file = files.raw
  let reader = new FileReader()

  reader.onloadend = (event) => {
    let arrayBuffer = reader.result
    let options = { type: 'array' }
    let workbook = XLSX.read(arrayBuffer, options)
    let sheetName = workbook.SheetNames
    let sheet = workbook.Sheets[sheetName]
    let sheet_json = XLSX.utils.sheet_to_json(sheet)
    for (let r = 2; r <= 9; r++) {
      if (sheet[XLSX.utils.encode_cell({ r: r, c: 3 })] === undefined) {
        ElMessage.error(lang('You have not completed the request table yet'))
        removeTemplate(files)
        return
      }
    }
    addNewStore.setReqTable({
      reqName: sheet[XLSX.utils.encode_cell({ r: 2, c: 3 })].v,
      stage: sheet[XLSX.utils.encode_cell({ r: 3, c: 3 })].v,
      customer: sheet[XLSX.utils.encode_cell({ r: 4, c: 3 })].v,
      device: sheet[XLSX.utils.encode_cell({ r: 5, c: 3 })].v,
      tester: sheet[XLSX.utils.encode_cell({ r: 6, c: 3 })].v,
      equipment: sheet[XLSX.utils.encode_cell({ r: 7, c: 3 })].v,
      system: sheet[XLSX.utils.encode_cell({ r: 8, c: 3 })].v,
      purpose: sheet[XLSX.utils.encode_cell({ r: 9, c: 3 })].v
    })
    emits('get-need-refresh', true)
    // console.log(sheet_json);   // for debugging
  }
  reader.readAsArrayBuffer(file)
}
</script>

<style scoped lang="scss">
:deep(.el-upload) {
  margin: 4px 0;
  display: block;
}
:deep(ul) {
  padding-left: 0 !important;
}
</style>
