<template>
  <div>
    <span class="ce-title-lg">{{ lang('Fill the schedule') }}</span>
    <TypeRadios @get-need-refresh="getNeedRefresh" />
    <div class="mb-8">
      <ScheduleTable :refresh-code="refreshCode" />
    </div>
  </div>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
import TypeRadios from './components/TypeRadios.vue'
import ScheduleTable from './components/ScheduleTable.vue'
const refreshCode = ref(0)    //提供子組件判斷是否需要重新向 store 取值

//取得子組件傳來的 needRefresh
const getNeedRefresh = (needRefresh) => { if (needRefresh) refreshCode.value++ }
</script>
