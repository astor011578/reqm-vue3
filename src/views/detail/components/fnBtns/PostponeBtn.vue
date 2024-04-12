<template>
  <span class="mr-3">
    <el-tooltip :content="lang(props.tip)" placement="bottom" effect="dark">
      <el-button
        :icon="props.icon"
        plain
        circle
        type="warning"
        :disabled="!permission"
        @click="showDialog = true"
      />
    </el-tooltip>
    <el-dialog v-model="showDialog" :title="lang('Re-schedule')" width="500" >
      <el-table id="postpone-table" :data="originSchedule" >
        <el-table-column align="center" prop="title" width="135" />
        <el-table-column align="center" prop="exp" :label="lang('Expect date')" width="95" />
        <el-table-column align="center" prop="rescheduling" :label="lang('Rescheduling times')" width="100" />
        <el-table-column align="center" :label="`${lang('Postpone to')}...`">
          <template #default="scope">
            <el-date-picker
              v-model="schedule[scope.row.stage]"
              type="date"
              size="small"
              format="YYYY/MM/DD"
              :placeholder="lang(datePicker[scope.row.state].placeholder)"
              :disabled="datePicker[scope.row.state].disabled"
              :clearable="false"
              :editable="false"
            />
            <div v-if="validate[scope.row.stage] !== ''" class="ce-validate p-1">
              {{ lang(validate[scope.row.stage]) }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="ce-dialog-footer-btn">
        <el-button type="primary" :loading="loading" @click="reschedule">{{ lang('Submit') }}</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { rescheduleRequest } from '@/api/request'
import { useReqStore } from '@/store/request'
import { hasProperty, validateDate } from '@/hooks/useValidate'
import { dateFormatter } from '@/hooks/useDate'
import { lang } from '@/hooks/useCommon'
const store = ref({})
const permission = ref(false)
const router = useRouter()
const reqNo = useRoute().params.reqNo
const reqType = useReqStore().getReqType
const loading = ref(false)          //是否要啟動 loading 動畫
const showDialog = ref(false)       //是否要顯示 re-schedule 的 dialog
const originSchedule = ref([])      //schedule table data

//re-scheduling dates
let schedule = reactive({
  UAT1: null,
  UAT2: null,
  release: null,
  monitor: null
})

const props = defineProps({
  icon: { type: Object, required: true },
  tip: { type: String, required: true }
})

onMounted(() => store.value = useReqStore())
watch(store, async (val) => {
  const _schedule = await store.value.getSchedule
  permission.value = await store.value.getPermission.postpone

  if (hasProperty(_schedule)) {
    //先清空 originSchedule 陣列
    while (originSchedule.value.length) originSchedule.value.pop()
    //賦值
    for (const [key, value] of Object.entries(_schedule)) {
      if (key === 'release' || key === 'monitor') {
        if (!_schedule[key]) break
      }
      originSchedule.value.push({
        stage: key,
        title: value.title,
        exp: value.exp.new ? dateFormatter(value.exp.new) : 'undefined',
        rescheduling: value.exp.old.length,
        state: value.state
      })
      schedule[key] = dateFormatter(value.exp.new)
    }
  }
})

//validate hint text
let validate = reactive({
  UAT1: '',
  UAT2: '',
  release: '',
  monitor: ''
})

//save state of date picker
const datePicker = {
  Proceeding: { disabled: false, placeholder: 'Pick a date' },
  Reviewing: { disabled: false,  placeholder: 'Pick a date' },
  Cancel: { disabled: true, placeholder: 'Item has been closed' },
  Done: { disabled: true, placeholder: 'Item has been closed' },
  Rejected: { disabled: false, placeholder: 'Pick a date' }
}

//提交 re-schedule 的 request 到服務端
const reschedule = async () => {
  if (!schedule.UAT1 && !schedule.UAT2 && !schedule.release && !schedule.monitor) {
    ElMessage.warning(lang('Please fill in this field'))
    validate = {
      UAT1: '',
      UAT2: '',
      release: '',
      monitor: ''
    }
  } else {
    let newSchedule = {
      UAT1: dateFormatter(schedule.UAT1),
      UAT2: dateFormatter(schedule.UAT2),
      release: dateFormatter(schedule.release),
      monitor: dateFormatter(schedule.monitor)
    }

    validate.UAT2 = validateDate(newSchedule.UAT1, newSchedule.UAT2, 'UAT1', 'UAT2')
    validate.release = reqType === 'Project' ? validateDate(newSchedule.UAT2, newSchedule.release, 'UAT2', 'Release') : ''
    validate.monitor = reqType === 'Project' ? validateDate(newSchedule.release, newSchedule.monitor, 'release', 'Monitor 1 lot') : ''

    if (!validate.UAT2.length && !validate.release.length && !validate.monitor.length) {
      const type = store.value.getReqType
      const requestData = Object.assign({ type }, newSchedule)
      loading.value = true

      setTimeout(async () => {
        await rescheduleRequest(reqNo, requestData)
          .then((res) => {
            loading.value = false
            switch (res.code) {
              case 200: {
                ElMessage.success(lang('Reschedule successfully'))
                router.push('/reload')
                break
              }
              default: {
                ElMessage.error(lang('Failed to reschedule'))
                schedule = {
                  UAT1: '',
                  UAT2: '',
                  release: '',
                  monitor: ''
                }
                break
              }
            }
          })
      }, 2000)
    }
  }
}
</script>

<style lang="scss">
#postpone-table {
  .el-input {
    width: 110px !important;
  }

  tbody {
    td {
      height: 46px;
    }
  }

  div {
    word-break: break-word;
  }
}
</style>
