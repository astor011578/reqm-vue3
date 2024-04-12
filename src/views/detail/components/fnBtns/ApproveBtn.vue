<template>
  <span class="mr-3">
    <!-- Approve button -->
    <el-tooltip
      :content="lang(props.tip)"
      placement="bottom"
      effect="dark"
    >
      <el-button
        :icon="props.icon"
        plain
        circle
        type="success"
        :disabled="!permission"
        @click="showDialog = true"
      />
    </el-tooltip>
    <!-- Approve evidence dialog -->
    <el-dialog
      v-model="showDialog"
      :title="lang('Approve evidence')"
      width="500px"
    >
      <el-descriptions
        v-if="hasProperty(evidence)"
        id="uApprove-table"
        column="1"
        border
      >
        <el-descriptions-item :label="lang('Upload date')">
          {{ dateFormatter(evidence.updateDate) }}
        </el-descriptions-item>
        <el-descriptions-item :label="lang('Evidence')">
          <div
            v-for="(file, index) in evidence.uploadFiles"
            :key="index"
          >
            <a
              class="ce-link"
              target="_blank"
              :href="`${prePath}/${step}/${file.fileName}`"
              :download="file.originalName"
            >
              <File class="mr-1" />
              {{ file.originalName }}
            </a>
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <!-- Submit button (Reject / Approve) -->
      <div class="ce-dialog-footer-btn">
        <el-button
          :loading="loading"
          @click="reject"
        >
          {{ lang('Reject') }}
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="approve"
        >
          {{ lang('Approve') }}
        </el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { File } from '@/icons/common/'
import { useReqStore } from '@/store/request'
import { approveEvidence } from '@/api/request'
import { hasProperty } from '@/hooks/useValidate'
import { dateFormatter } from '@/hooks/useDate'
import { lang } from '@/hooks/useCommon'
const props = defineProps({
  icon: { type: Object, required: true },
  tip: { type: String, required: true }
})
const store = ref({})
const permission = ref(false)
const step = ref('')
const router = useRouter()
const reqNo = useRoute().params.reqNo
const prePath = `${import.meta.env.VITE_APP_BASE_URL}/uploads/${reqNo}`
const evidence = ref({})
const reqData = ref({})
const loading = ref(false)
const showDialog = ref(false)     //save state of dialog

const approve = async () => {
  reqData.value.reviewerReply.result = 'Approved'
  loading.value = true
  setTimeout(async () => {
    await approveEvidence(reqNo, reqData.value)
      .then(() => {
        ElMessage.success(lang('Approve evidence successfully'))
        router.push('/reload')
      })
  }, 2000)
}

const reject = async () => {
  ElMessageBox.prompt(lang('Please leave a reason for rejection'), lang('Reject evidence'), {
    confirmButtonText: lang('Submit'),
    cancelButtonText: lang('Cancel'),
    inputPlaceholder: lang('Please leave a reason for rejection'),
    inputType: 'textArea',
    buttonSize: 'small'
  })
    .then(({ value, action }) => {
      reqData.value.reviewerReply.result = 'Rejected'
      reqData.value.reviewerReply.comments = value
      loading.value = true

      setTimeout(async () => {
        await approveEvidence(reqNo, reqData.value)
          .then(() => {
            loading.value = false
            ElMessage.success(lang('Reject evidence successfully'))
            router.push('/reload')
          })
      }, 2000)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: lang('Action cancelled')
      })
    })
}

onMounted(() => store.value = useReqStore())
watch(store, async () => {
  permission.value = await store.value.getPermission.approve
  step.value = await store.value.getSimpleStep
  const _evidence = await store.value.getEvidence
  const reviewDate = new Date()

  if (step.value.length && hasProperty(_evidence)) {
    if (step.value !== 'Done' && step.value !== 'Cancel') {
      //要顯示在 dialog 表格中的資料
      evidence.value = {
        updateDate: _evidence[step.value].updateDate,
        uploadFiles: Object.assign({}, _evidence[step.value].uploadFiles)
      }
  
      //之後會被傳到服務端的 request data
      reqData.value = {
        step: step.value,
        reviewerReply: { reviewDate }
      }
  
      //for debugging
      // console.log('現在步驟是', step.value)
      // console.log('現在是否有 approve 的權限? ', permission.value)
    }
  }
})
</script>

<style scoped lang="scss">
a {
  display: inline-flex;
  width: 290px;
  height: 24px;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
