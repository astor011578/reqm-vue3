<template>
  <div>
    <FullLoading :loading="loading" />
    <!-- top title & functional buttons -->
    <TopButtons v-if="!loading" />
    <!-- content -->
    <div v-if="!loading" class="ce-main-container">
      <el-collapse v-model="collapseKeys">
        <BasicInfo />
        <Cancellation />
        <Scope />
        <Schedule v-if="!reviewingStatuses.includes(status)" />
        <Evidence v-if="!reviewingStatuses.includes(status)" />
      </el-collapse>
    </div>
  </div>
</template>

<script setup>
import { FullLoading } from '@/components'
import { useReqStore } from '@/store/request'
import { useRoute } from 'vue-router'
import { TopButtons, BasicInfo, Scope, Schedule, Evidence, Cancellation } from './components'

const reqNo = useRoute().params.reqNo
const store = useReqStore()
const status = ref('')
const reviewingStatuses = ['Reviewing', 'Rejected', 'Returned']
const loading = ref(false)
//name of each collapse
const collapseKeys = ref(['1', '2', '3', '4', '5'])

onMounted(async () => {
  loading.value = true
  //儲存此需求的 reqNo
  store.setReqNo(reqNo)
  //向服務端請求此需求的資訊
  await store.getReqInfo()
  status.value = store.getReqStatus
  setTimeout(() => loading.value = false, 1500)
})
</script>

<style scoped lang="scss">
$border-color: #e4e7ed;
$collapse-title-color: var(--cyan-darken-3);
$collapse-pin-color: var(--cyan-darken-2);
$content-color: var(--el-text-color-primary);
$content-shadow: rgba(0, 0, 0, 0.15) 5px 5px 5px 0px;

:deep(*) {
  white-space: pre-wrap;
  word-break: break-word;
}

//隱藏摺疊面板的上下直線
:deep(.el-collapse) {
  --el-collapse-border-color: transparent;

  .el-collapse-item {
    margin-bottom: 25px;
  }
}

//摺疊面板 header (圖針 icon + 標題)
:deep(.el-collapse-item__header) {
  padding-left: 1rem;
  border: none;
  background-color: #f4f7fd !important;
  box-shadow: rgba(214, 217, 223, 0.75) 0px -50px 36px -28px inset;
  border-radius: 0.25rem;
}

:deep(.detail-collapse) {
  font-weight: 800;

  svg {
    margin-right: 6px;
    transform: rotate(-45deg);
    color: $collapse-pin-color;
  }
}

//timeline 內容
:deep(.el-card) {
  box-shadow: $content-shadow;
}

//摺疊面板 content
:deep(.el-collapse-item__content) {
  padding-bottom: 0;

  > div:first-child {
    margin: 0.5rem;
  }
}

//描述列表
:deep(.el-descriptions) {
  box-shadow: $content-shadow;
  
  //label
  .el-descriptions__label {
    width: 140px;
  }

  //content
  .el-descriptions__content {
    color: $content-color;
    min-width: 135px;
    width: calc((100% - 140px * 2) / 2);
  }
}
</style>
@/store/request
