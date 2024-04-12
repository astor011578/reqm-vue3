<template>
  <span class="mr-3">
    <!-- Upload evidence button -->
    <el-tooltip
      :content="lang(props.tip)"
      placement="bottom"
      effect="dark"
    >
      <el-button
        :icon="props.icon"
        plain
        circle
        type="primary"
        :disabled="!permission"
        @click="showUploadDialog = true"
      />
    </el-tooltip>
    <!-- Upload evidence dialog -->
    <el-dialog
      v-model="showUploadDialog"
      :title="lang('Upload evidence')"
      width="400px"
    >
      <UploadFiles
        :size="size"
        :plain="plain"
        :step="step"
        @get-children="getUploads"
      />
      <div class="ce-dialog-footer-btn">
        <el-button
          type="primary"
          :disabled="disabledButton"
          @click="submitEvidence"
        >
          {{ lang('Upload to server') }}
        </el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { UploadFiles } from '@/components'
import { uploadEvidence } from '@/api/upload'
import { updateEvidence } from '@/api/request'
import { useReqStore } from '@/store/request'
import { lang } from '@/hooks/useCommon'
const props = defineProps({
  icon: { type: Object, required: true },
  tip: { type: String, required: true }
})
const store = ref({})
const size = 'large'
const plain = false
const router = useRouter()
const permission = ref(false)
const reqNo = useRoute().params.reqNo
const step = ref('')
const disabledButton = ref(false)
const reqType = shallowRef('')
const evidences = ref([])             //要上傳的證明
const showUploadDialog = ref(false)   //是否顯示上傳證明的 dialog 框

//取得子組件傳回的上傳證明資訊 (UploadFiles.vue)
const getUploads = async (files) => {
  evidences.value = Object.assign([], files)
}

//提交上傳證明的資訊到服務端
const submitEvidence = async () => {
  disabledButton.value = true
  let result = []
  if (evidences.value.length) {
    const formData = new FormData()
    for await (const file of evidences.value) {
      formData.append('files', file.raw)
    }
    const res = await uploadEvidence(formData, reqNo, step.value)
    result = Object.assign([], res.data)
  } else {
    ElMessage.info(lang('No files selected'))
    return disabledButton.value = false
  }

  if (result.length) {  
    let uploadFiles = []
    result.forEach((resultFile) => {
      const { fileName, originalName } = resultFile
      uploadFiles.push({ fileName, originalName })
    })

    const requestData = {
      step: step.value,
      updateDate: new Date(),
      uploadFiles
    }

    await updateEvidence(reqNo, requestData)
      .then(() => {
        setTimeout(() => {
          ElMessage.success(lang('Upload to server successfully'))
          router.push('/reload')
        }, 1500)
      })
      .catch(() => {
        ElMessage.error(lang('Failed to upload files'))
        disabledButton.value = false
      })
  } else {
    disabledButton.value = false
  }
}

onMounted(() => store.value = useReqStore())
watch(store, async (val) => {
  permission.value = await store.value.getPermission.evidence
  step.value = await store.value.getSimpleStep
  reqType.value = await store.value.getReqType
  //for debugging
  // console.log(`現在在步驟 ${step.value}, 目前是否具有更新 evidence 的權限?`, permission.value)
})
</script>
