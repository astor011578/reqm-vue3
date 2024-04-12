<template>
  <div class="ce-main-container">
    <!-- Toolbar -->
    <div class="ce-toolbar ml-0 mr-0">
      <!-- Select menu -->
      <span class="mr-4">
        <strong class="mr-2">{{ lang('Switch status') }}:</strong>
        <el-select
          v-model="selected"
          :placeholder="lang('Please select')"
          @change="queryData"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </span>
    </div>
    <!-- Table -->
    <div id="revTable-container">
      <vxe-table
        ref="tableRef"
        border
        align="center"
        size="mini"
        height="100%"
        :loading="loading"
        show-header-overflow
        show-overflow
        :data="tableData"
        :empty-render="{ name: 'NoData' }"
        :row-config="{ isHover: true }"
        :column-config="{ resizable: true }"
        :tooltip-config="tableTooltips"
      >
        <vxe-column field="reqNo" :title="lang('ReqNo')" width="90" sortable fixed="left">
          <template #default="{ row }">
            <a class="ce-link" :href="`#/detail/${row.reqNo}`" target="_blank">{{ row.reqNo }}</a>
          </template>
        </vxe-column>
        <vxe-column field="category" :title="lang('Category')" width="110" sortable/>
        <vxe-column field="applyDate" :title="lang('Received date')" width="120" />
        <vxe-column field="reqName" :title="lang('Request name')" header-align="center" align="left" />
        <vxe-column field="applicant" :title="lang('Applicant')" width="110" />
        <vxe-column field="recipient" :title="lang('Recipient')" width="110">
          <template #default="{ row }">{{ row.recipient[0] }}</template>
        </vxe-column>
        <vxe-column field="type" :title="lang('Type')" width="75">
          <template #default="{ row }">
            <span v-if="row.type">{{ row.type }}</span>
            <span v-else class="ce-gray-color-italic">N/A</span>
          </template>
        </vxe-column>
        <vxe-column field="action" :title="lang('Action')" width="105" header-align="center" align="center">
          <template #default="{ row }">
            <Dialog v-if="row.category === 'Cancellation'" :reqNo="row.reqNo" :data="row" />
            <el-button
              v-else-if="row.category === 'Reviewing'"
              :icon="Pen"
              :disabled="row.recipient[1] === userStore.userId ? false : true"
              type="info"
              plain
              class="p-2"
              @click="toReviewNew(row.reqNo, row.recipient[1])"
            >
              {{ lang('Review') }}
            </el-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <!-- Search result -->
    <span>
      {{ lang('Total') }}
      <span class="ce-blue-color ce-text-bold">{{ totalPage }}</span>
      {{ totalPage > 1 ? lang('records') : lang('record') }}
    </span>
  </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import { getPendings } from '@/api/request'
import { useUserStore } from '@/store/user'
import { lang } from '@/hooks/useCommon'
import { Pen } from '@/icons/common/'
import { Dialog } from './components'
const router = useRouter()
const tableRef = ref(null)
const tableData = ref([])
const totalPage = ref(0)
const loading = ref(false)
const userStore = useUserStore()
const isHighest = ref(false)    //user.roles 是否包含 'Administrator'

/**
 * @description tooltips config
 */
const tableTooltips = {
  contentMethod: ({ type, column, row }) => {
    switch (type) {
      case 'body': {
        if (column.field === 'action') return lang('Review this application')
        if (column.field === 'recipient') return row[column.field][0]
        return row[column.field]
      }
      case 'header': return column.title
    }
  }
}

//get requests which are pending for approval
const queryData = async () => {
  loading.value = true
  await getPendings(userStore.userId, selected.value)
    .then(res => {
      tableData.value = res.data
      totalPage.value = tableData.value.length
    })
  setTimeout(() => loading.value = false, 1000)
}

onMounted(async () => {
  isHighest.value = userStore.roles.includes('Administrator') ? true : false
  if (isHighest.value) {
    options.value.push(
      { value: 'total', label: 'Total' },
      { value: 'reviewing', label: 'Reviewing' },
      { value: 'cancellation', label: 'Cancellation' }
    )
  } else {
    options.value.push({ value: 'reviewing', label: 'Reviewing' })
  }
  selected.value = options.value[0].value
  await queryData()
})

/**
 * @description values related to select menu
 */
const selected = ref('')   //default value
const options = ref([])

const toReviewNew = (reqNo, recipientId) => {
  if (recipientId === userStore.userId) {
    router.push({ path: `/review/new/${reqNo}` })
  } else {
    ElMessage.warning(lang('Permission denied'))
  }
}
</script>

<style lang="scss" scoped>
$outer-space: calc(var(--navbar-height) + 1rem * 2 + 24.38px + 24px * 2 + 1px * 2 + 14px);
#revTable-container {
  padding-top: 0.75rem;
  margin-bottom: calc(10px + 24px);   //vxe-table 的 scrollbar 為 10px;
  height: calc(100vh - $outer-space);
}
</style>
