<template>
  <span v-if="hasProperty(reqr)" class="flex">
    <el-input v-model="reqr.name" disabled />
  </span>
</template>

<script setup>
import { hasProperty } from '@/hooks/useValidate';
import { useNewReqStore } from '@/store/new-request'
const store = useNewReqStore()
const userId = ref(localStorage.getItem('userId'))
const reqr = ref({})      //綁定 requester 的資料

//向服務端請求 requester 資訊
onMounted(async () => {
  reqr.value = await store.fetchUserInfo(userId.value)
  store.setReqr(reqr.value)
})
</script>
