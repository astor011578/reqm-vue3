<template>
  <div
    v-show="resource.length"
    class="ma ml-3 flex justify-center"
  >
    <el-button
      type="primary"
      plain
      @click="openDialog"
    >
      {{ `${lang('Select')}...` }}
    </el-button>
    <el-dialog
      v-model="dialogState"
      :title="lang('Please select')"
      width="420px"
    >
      <!-- 搜尋框 -->
      <span class="w-100 p-8 pb-4 pt-0 rowSC inline-flex">
        <el-input
          v-model="keyword"
          :prefix-icon="loading ? Loading : Search"
          size="small"
          :placeholder="lang('Keyword search')"
          @input="inputChange"
        />
      </span>
      <!-- 搜尋結果 -->
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="filteredData"
        height="224"
        scrollbar-always-on
        highlight-current-row
        class="pr-4 pl-4"
        element-loading-background="rgba(168, 171, 178, 0.3)"
        @selection-change="selectHandler"
      >
        <el-table-column type="selection" width="60" align="center" />
        <el-table-column prop="id" :label="lang('User ID')" width="105" align="center" />
        <el-table-column prop="name" :label="lang('User name')" width="175" align="center" />
      </el-table>
      <!-- Submit button -->
      <div class="ce-dialog-footer-btn">
        <el-button type="primary" @click="submitPgr">{{ lang('Submit') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { lang } from '@/hooks/useCommon'
import { Search, Loading } from '@/icons/common/'
import { useNewReqStore } from '@/store/new-request'
const props = defineProps({ dept: { type: String } })
const emits = defineEmits([ 'get-user-info' ])
const dialogState = ref(false)  //綁定 dialog 是否開啟
const tableRef = ref(null)      //綁定 el-table
const loading = ref(false)      //綁定 el-table loading 值
const keyword = ref('')         //綁定搜尋欄中的值
const selected = ref({})        //選中的 user 值
const resource = ref([])        //user list 的 raw data
const filteredData = ref([])    //經 keyword 篩選過後的 user list

//開啟 dialog, 同時重置搜尋欄 keyword
const openDialog = () => {
  dialogState.value = true
  keyword.value = ''
}
//利用 keyword 篩選出符合條件的 user list,
//當搜尋欄 input 失焦 或 使用者按下 'Enter' 時啟動
const inputChange = ($keyword) => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    switch ($keyword.trim() !== '') {
      case true: {
        /**
         * @description iterate 'ALL' elements in user list array
         * @param { String } queryString
         * @returns { Boolean } values that fit the queryString
         */
        const createFilter = (queryString) => {
          return (user) => {
            const { name, id } = user
            const _query = queryString.toLowerCase()
            const searchInName = name.toLowerCase().indexOf(_query)
            const searchInId = id.toLowerCase().indexOf(_query)
            return (
              //有兩種過濾方式: 
              //(1) 遍歷所有元素, 有符合 $keyword 都行
              //user.name.toLowerCase().includes(queryString.toLowerCase()) === true  // 使用 includes()
              //user.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1  // 使用 indexOf()
              //(2) 從第一個字開始遍歷
              searchInName === 0 || searchInId === 0
            )
          }
        }
        filteredData.value = resource.value.filter(createFilter($keyword))
        break
      }
      case false: {
        filteredData.value = resource.value
        keyword.value = ''
      }
    }
  }, 1000)
}

//selection handler: 選擇框只能單選的設定
const selectHandler = (selection) => {
  if (selection.length > 1) {
    tableRef.value.clearSelection()
    tableRef.value.toggleRowSelection(selection[selection.length - 1])
  }
  selected.value = selection[selection.length - 1]
}

//mounted 時將 user list data query 出來
onMounted(() => {
  loading.value = true
  setTimeout(async () => {
    const searchQuery = props.dept ? props.dept : null
    resource.value = await useNewReqStore().fetchUsers(searchQuery)
    resource.value = resource.value.filter(user => { return user.name })
    filteredData.value = resource.value
  }, 1500)
  loading.value = false
})

//按下送出按鈕後關閉 modal, 並 store user 的資訊
const submitPgr = async () => {
  const isEmpty = Object.keys(selected.value).length === 0    //是否沒有選擇任何一個 user
  if (isEmpty) {
    ElMessage.error(lang('Please select user'))
  } else {
    dialogState.value = false
    emits('get-user-info', selected.value)
  }
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
