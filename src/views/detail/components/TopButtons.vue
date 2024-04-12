<template>
  <TopTitle>
    <template #title>{{ title }}</template>
    <template v-if="!reviewingStatuses.includes(status)" #align-right>
      <ApproveBtn
        :icon="fnBtn.icon.approve"
        :tip="fnBtn.tip.approve"
      />
      <EvidenceBtn
        :icon="fnBtn.icon.upload"
        :tip="fnBtn.tip.upload"
      />
      <PostponeBtn
        :icon="fnBtn.icon.postpone"
        :tip="fnBtn.tip.postpone"
      />
      <CancelBtn
        :icon="fnBtn.icon.cancel"
        :tip="fnBtn.tip.cancel"
      />
    </template>
    <template v-else #align-right>
      <RevNewBtn
        :icon="fnBtn.icon.revNew"
        :tip="fnBtn.tip.revNew"
      />
      <EditNewBtn
        :icon="fnBtn.icon.editNew"
        :tip="fnBtn.tip.editNew"
      />
    </template>
  </TopTitle>
</template>

<script setup>
import { TopTitle } from '@/components'
import { Check, Upload, Calendar, Cancel, Pen } from '@/icons/common/'
import { ApproveBtn, EvidenceBtn, PostponeBtn, CancelBtn, RevNewBtn, EditNewBtn } from './fnBtns'
import { useReqStore } from '@/store/request'
const reqNo = useRoute().params.reqNo
const title = `Request #${reqNo}`
const status = useReqStore().getReqStatus
const reviewingStatuses = ['Reviewing', 'Rejected', 'Returned']

//values of functional button bar
const fnBtn = {
  tip: {
    approve: 'Approve evidence',
    upload: 'Upload evidence',
    postpone: 'Reschedule',
    cancel: 'Cancel this request',
    revNew: 'Approve this request',
    editNew: 'Edit this request'
  },
  icon: {
    approve: Check,
    upload: Upload,
    postpone: Calendar,
    cancel: Cancel,
    revNew: Check,
    editNew: Pen
  }
}
</script>

<style lang="scss" scoped>
//reset el-dialog font-style
:deep(.el-dialog) {
  font-weight: normal !important;
}
</style>
