<template>
  <span class="flex">
    <!-- 顯示 Programmer name 框 -->
    <el-input v-model="pgrName" disabled />
    <!-- 選擇 Programmer button 與搜尋對話框 -->
    <SearchUser :dept="'IT'" @get-user-info="getPgr" />
  </span>
</template>

<script setup>
import { useNewReqStore } from '@/store/new-request'
import { SearchUser } from '@/components'
//綁定 disabled input 中的 pgr name 值
const pgrName = computed(() => { return useNewReqStore().application.coreTeam.pgr.name })
const selected = ref({})        //選中的 user 值
const getPgr = ($pgrInfo) => {
  selected.value = $pgrInfo
  pgrName.value = $pgrInfo.name
  useNewReqStore().setPgr(selected.value)
}
</script>

<style scoped lang="scss">
:deep(.el-table) {
  //隱藏搜尋結果 table header 中的選擇框
  thead {
    .el-table-column--selection {
      .cell {
        display: none;
      }
    }
  }
}
</style>
