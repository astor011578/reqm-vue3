<template>
  <!-- cancellation block -->
  <el-collapse-item v-if="hasProperty(cancellation)" name="2">
    <template #title>
      <div class="detail-collapse">
        <font-awesome-icon icon="fa-solid fa-thumbtack" />
        {{ lang('Cancellation') }}
      </div>
    </template>
    <div>
      <el-descriptions column="2" border>
        <el-descriptions-item :label="lang('Application date')">{{ dateFormatter(cancellation.applyDate) }}</el-descriptions-item>
        <el-descriptions-item :label="lang('Applicant')">{{ cancellation.applicantName }}</el-descriptions-item>
        <el-descriptions-item :label="lang('Reason')">
          <span v-if="!cancellation.reason || cancellation.reason === ''" class="ce-gray-color-italic">
            {{ lang('There is no reason') }}
          </span>
          <span v-else>
            {{ cancellation.reason }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item :label="lang('Status')">
          <el-tag :type="tagTypes[cancellation.result]">{{ lang(cancellation.result) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="cancellation.reviewDate" :label="lang('Review date')">
          {{ dateFormatter(cancellation.reviewDate) }}
        </el-descriptions-item>
        <el-descriptions-item v-if="cancellation.result === 'Rejected'" :label="lang('Rejection message')">
          <span v-if="!cancellation.comments || cancellation.comments === ''" class="ce-gray-color-italic">
            {{ lang('There is no comments') }}
          </span>
          <span v-else>
            {{ cancellation.comments }}
          </span>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-collapse-item>
</template>

<script setup>
import { useReqStore } from '@/store/request'
import { hasProperty } from '@/hooks/useValidate'
import { dateFormatter } from '@/hooks/useDate'
import { lang } from '@/hooks/useCommon'
const store = useReqStore()
const cancellation = ref({})
const tagTypes = {
  Approved: 'primary',
  Rejected: 'info',
  Reviewing: 'warning'
}
onMounted(() => {
  cancellation.value = store.getCancellation ? store.getCancellation : {}
})
</script>
