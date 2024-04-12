<template>
  <!-- basic information block -->
  <el-collapse-item name="1">
    <template #title>
      <div class="detail-collapse">
        <font-awesome-icon icon="fa-solid fa-thumbtack" />
        {{ lang('Basic Info') }}
      </div>
    </template>
    <div v-if="hasProperty(basicInfo)" class="m-2 multiple-el-descriptions">
      <el-descriptions column="2" border>
        <el-descriptions-item :label="lang('ReqNo')">{{ basicInfo.reqNo }}
        </el-descriptions-item>
        <el-descriptions-item :label="lang('Type')">
          <el-tag v-if="basicInfo.type" size="small">{{ basicInfo.type }}</el-tag>
          <span v-else class="ce-gray-color-italic">N/A</span>
        </el-descriptions-item>
        <el-descriptions-item :label="lang('Request name')">{{ basicInfo.reqName }}</el-descriptions-item>
        <el-descriptions-item :label="lang('Status')">
          <el-tag size="small" :type="status[basicInfo.status]">{{ basicInfo.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="lang('Requester')">{{ basicInfo.reqrName }}</el-descriptions-item>
        <el-descriptions-item :label="lang('IT')">{{ basicInfo.pgrName }}</el-descriptions-item>
        <el-descriptions-item :label="lang('Issue date')">{{ dateFormatter(basicInfo.issueDate) }}</el-descriptions-item>
        <el-descriptions-item :label="lang('Review date')">
          <span v-if="basicInfo.review.date">{{ dateFormatter(basicInfo.review.date) }}</span>
          <span v-else class="ce-gray-color-italic">N/A</span>
        </el-descriptions-item>
        <el-descriptions-item :label="lang('Lead time (day)')">
          <span v-if="basicInfo.leadTime < 0" class="ce-gray-color-italic">N/A</span>
          <span v-else>{{ basicInfo.leadTime }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="lang('Review duration (day)')">{{ basicInfo.reviewDuration }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions column="1" border>
        <el-descriptions-item v-if="basicInfo.status === 'Rejected' || basicInfo.status === 'Returned'" :label="lang('Review comments')">
          {{ basicInfo.approveComments }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-collapse-item>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
import { dateFormatter } from '@/hooks/useDate'
import { useReqStore } from '@/store/request'
import { hasProperty } from '@/hooks/useValidate'
const store = useReqStore()
const basicInfo = ref({})
//tag type of status
const status = reactive({
  Done: 'success',
  Cancel: 'info',
  Proceeding: 'primary',
  Rejected: 'danger',
  Returned: 'warning',
  Reviewing: 'warning'
})
onMounted(() => basicInfo.value = store.getBasicInfo)
</script>
