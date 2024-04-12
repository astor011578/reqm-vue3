<template>
  <!-- schedule block -->
  <el-collapse-item name="4">
    <template #title>
      <div class="detail-collapse">
        <font-awesome-icon icon="fa-solid fa-thumbtack" />
        {{ lang('Schedule') }}
      </div>
    </template>
    <div v-if="hasProperty(schedule)" class="schedule-container">
      <el-timeline>
        <!-- Turn on date -->
        <el-timeline-item center>
          <el-card>
            <span>
              <h4>IT start coding</h4>
              <h5>({{ lang('Owner') }}: {{ turnOnDate.owner }})</h5>
            </span>
            <br />
            <span class="mt-2">
              <div class="schedule-details rounded p-2 m-2">
                <div>{{ lang('Turn on date') }}:</div>
                <div class="ce-blue-color ce-text-bold">{{ dateFormatter(turnOnDate.date) }}</div>
              </div>
            </span>
          </el-card>
        </el-timeline-item>
        <!-- UAT1 ~ Monitor 1 lot -->
        <el-timeline-item
          v-for="(val, key) in schedule"
          :key="key"
          :size="timeline[val.state].size"
          :icon="timeline[val.state].icon"
          :type="timeline[val.state].type"
          :color="timeline[val.state].color"
          center
        >
          <el-card>
            <span>
              <h4>{{ val.title }}</h4>
              <h5>({{ lang('Owner') }}: {{ val.owner }})</h5>
            </span>
            <br />
            <span class="mt-2">
              <div class="schedule-details">
                <div>{{ lang('Actual date') }}:</div>
                <div v-if="val.act" class="ce-blue-color ce-text-bold">
                  {{ dateFormatter(val.act) }}
                </div>
                <div v-else>
                  {{ val.state === 'Rejected' ? `${lang('Rejected,')}\n${lang('re-uploading')}` : val.state }}
                </div>
              </div>
              <div class="schedule-details">
                <div>{{ lang('Expect date') }}:</div>
                <div>
                  <div v-for="itemInOld in val.exp.old" :key="itemInOld" class="ce-line-through">
                    {{ dateFormatter(itemInOld) }}
                  </div>
                  <div class="ce-blue-color ce-text-bold">
                    {{ dateFormatter(val.exp.new) }}
                  </div>
                </div>
              </div>
              <div class="schedule-details">
                <div>KPI:</div>
                <div>
                  {{ lang('Rescheduling') }}:
                  <span :class="warningOverZero(val.KPI.reschedule) ? 'ce-red-color ce-text-bold' : ''">
                    {{ val.KPI.reschedule }}
                  </span>
                </div>
                <div>
                  {{ lang('Delay') }}:
                  <span :class="warningOverZero(val.KPI.delay) ? 'ce-red-color ce-text-bold' : ''">
                    {{ val.KPI.delay }}
                  </span>
                </div>
              </div>
            </span>
          </el-card>
        </el-timeline-item>
        <!-- Done -->
        <el-timeline-item center>
          <el-card>
            <h4>Done</h4>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-collapse-item>
</template>

<script setup>
import { MoreFilled } from '@element-plus/icons-vue'
import { useReqStore } from '@/store/request'
import { Check, Cancel } from '@/icons/common/'
import { dateFormatter } from '@/hooks/useDate'
import { lang } from '@/hooks/useCommon'
import { hasProperty } from '@/hooks/useValidate'

// timeline style
const timeline = {
  Proceeding: {
    size: 'large',
    type: 'primary',
    icon: MoreFilled
  },
  Done: {
    size: 'normal',
    type: 'success',
    icon: Check
  },
  Cancel: {
    size: 'normal',
    color: '#999',
    icon: Cancel
  },
  Reviewing: {
    size: 'large',
    type: 'warning',
    icon: MoreFilled
  },
  Rejected: {
    size: 'large',
    type: 'warning',
    icon: MoreFilled
  }
}
const store = useReqStore()
const schedule = ref({})
const turnOnDate = ref({})

onMounted(() => {
  turnOnDate.value = store.getTurnOnDate
  const _schedule = store.getSchedule
  for (const [key, value] of Object.entries(_schedule)) {
    if (key === 'release' || key === 'monitor') if (!_schedule[key]) break
    schedule.value[key] = _schedule[key]
  }
})

/**
 * @description 判斷 KPI 的值是否大於 0
 * @param { string } val: KPI 值
 * @returns { boolean } true 表示 KPI 大於 0, 需要 highlight
 */
const warningOverZero = (val) => { return parseInt(val, 10) > 0 ? true : false }
</script>

<style scoped lang="scss">
$info-icon-color: var(--cyan-darken-2);
$content-color: #838383;
$schedule-details-bg: var(--blue-grey-lighten-5);
$title-color: var(--blue-grey-darken-3);

.schedule-container {
  padding: 15px 25px;
  padding-bottom: 0;
}

:deep(.el-timeline) {
  padding-left: 0;
  .el-timeline-item__wrapper {
    padding-left: 42px;
  }

  h4 {
    font-weight: 700;
    color: $title-color;
  }

  h5 {
    margin-left: 0.5rem;
    color: $content-color;
  }

  span {
    display: inline-flex;
    .schedule-details {
      border-radius: 0.25rem;
      padding: 0.5rem;
      margin: 0.5rem;
      margin-right: 0.75rem;
      min-width: 115px;
      background-color: $schedule-details-bg;
      box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.25);
      font-size: 12px;
      line-height: 14px;
      color: $content-color;

      > div:first-child {
        color: $title-color;
        font-weight: 700;
        line-height: 18px;
      }

      > :not(:first-child) {
        line-height: 14px;
      }
    }
  }
}
</style>
