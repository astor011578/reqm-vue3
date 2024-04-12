<template>
  <div id="dialogs-container">
    <el-button
      :icon="Pen"
      type="info"
      plain
      class="p-2"
      @click="showDialog = true"
    >
      {{ lang('Review') }}
    </el-button>
    <el-dialog
      v-model="showDialog"
      :title="`${lang('Review application for cancelling')} #${props.reqNo}`"
      width="500px"
    >
      <el-descriptions column="1" border>
        <el-descriptions-item label="ReqNo">
          <template #default>
            <a class="ce-link" :href="`#/detail/${cancellation.reqNo}`" target="_blank">{{ cancellation.reqNo }}</a>
            <el-tag type="primary" class="ml-2">{{ cancellation.type }}</el-tag>
          </template>
        </el-descriptions-item>
        <el-descriptions-item :label="lang('Request name')">{{ cancellation.reqName }}</el-descriptions-item>
        <el-descriptions-item :label="lang('Received date')">{{ cancellation.applyDate }}</el-descriptions-item>
        <el-descriptions-item :label="lang('Applicant')">
          {{ cancellation.applicant }}
          <span class="ce-gray-color-italic">({{ cancellation.role }})</span>
        </el-descriptions-item>
        <el-descriptions-item :label="lang('Reason')">{{ cancellation.reason }}</el-descriptions-item>
      </el-descriptions>
      <div class="ce-dialog-footer-btn">
        <el-button :loading="loading" @click="reviewReq('Rejected')">
          {{ lang('Reject') }}
        </el-button>
        <el-button type="primary" :loading="loading" @click="reviewReq('Approved')">
          {{ lang('Approve') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import { Pen } from '@/icons/common/'
import { lang } from '@/hooks/useCommon'
import { reviewCancellation } from '@/api/request'
const router = useRouter()
const props = defineProps({
  reqNo: { type: String, required: true },
  data: { type: Object, required: true }
})
const loading = ref(false)
const showDialog = ref(false)
const cancellation = computed(() => { return props?.data })

/**
 * @description send reply to server
 * @param { String } reply: Approved || Rejected
 */
const reviewReq = async (reply) => {
  const emphasize = reply === 'Approved' ? 'APPROVE' : 'REJECT'
  const action = reply === 'Approved' ? 'Approve' : 'Reject'
  ElMessageBox.confirm(lang(`Are you sure to ${emphasize} this cancellation?`), 'Warning', {
    confirmButtonText: lang('OK'),
    cancelButtonText: lang('Cancel'),
    type: 'warning',
    showInput: reply === 'Rejected' ? true : false,
    inputPlaceholder: lang('Please leave a reason for rejection')
  })
    .then((input) => {
      loading.value = true
      let comments = input.value

      setTimeout(async () => {
        const requestData = {
          result: reply,
          comments: reply === 'Rejected' ? comments : ''
        }
        await reviewCancellation(cancellation.value.reqNo, requestData)
          .then(() => {
            loading.value = false
            ElMessage.success(lang(`${action} cancelling application successfully`))
          })
          .catch(() => {
            loading.value = false
            ElMessage.error(lang(`Failed to ${action.toLowerCase()} cancelling application`))
          })
        router.push('/reload')
      }, 2000)
    })
    .catch(() => ElMessage.info(lang('Action cancelled')))
}
</script>

<style lang="scss">
#dialogs-container {
  .el-descriptions__label {
    width: 110px;
  }
  .el-descriptions__content,
  .el-descriptions__label {
    white-space: pre-line;
    word-break: break-word;
  }
}
</style>
@/api/request
