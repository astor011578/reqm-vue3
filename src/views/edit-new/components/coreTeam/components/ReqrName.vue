<template>
  <span class="flex">
    <el-input v-model="reqrName" disabled />
  </span>
</template>

<script setup>
import { useNewReqStore } from '@/store/new-request'
const store = useNewReqStore()
const reqrName = computed(() => { return store.application.coreTeam.reqr.name })
</script>
