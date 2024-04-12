<template>
  <div class="submit-container">
    <el-button
      type="danger"
      :loading="loading"
      @click="notApprove('Rejected')"
    >
      {{ lang('Reject') }}
    </el-button>
    <el-button
      type="warning"
      :loading="loading"
      @click="notApprove('Returned')"
    >
      {{ lang('Return') }}
    </el-button>
    <el-button
      type="success"
      :loading="loading"
      @click="validateInputs"
    >
      {{ lang('Approve') }}
    </el-button>
  </div>
</template>

<script setup>
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { lang } from '@/hooks/useCommon'
import { useNewReqStore } from '@/store/new-request'
const reqNo = useRoute().params.reqNo
const newReqStore = useNewReqStore()
const router = useRouter()
const loading = ref(false)    //是否啟用 loading 效果

//退回或拒絕
const notApprove = (result) => {
  const content = `Please leave a reason for rejection or sending back this request`
  ElMessageBox.prompt(lang(content), 'Warning', {
    confirmButtonText: lang('Submit'),
    cancelButtonText: lang('Cancel'),
    dangerouslyUseHTMLString: true,
    inputValidator: (input) => {
      const errorMessage = 'Please fill in this field'
      switch (true) {
        case result === 'Returned': return true
        case typeof input === 'string' && input.trim() === '': return lang(errorMessage)
        case typeof input !== 'string': return lang(errorMessage)
        default: return true
      }
    }
  })
    .then(async ({ value }) => await submit(result, value?.trim()))
    .catch(() => ElMessage.info(lang('Action cancelled')))
}

//輸入驗證與送出表單
const validateInputs = async () => {
  await newReqStore.checkEmpty(true)
  await newReqStore.checkIllegalDate()
  const validates = newReqStore.getValidate
  let isPass = false    //是否所有欄位都通過輸入驗證
  for await (const [key, val] of Object.entries(validates.schedule)) {
    isPass = val !== '' ? false : true
    if (val !== '') return
  }
  // console.log('isPass?', isPass)
  if (isPass) await submit('Approved')
}

//提交表單至服務端
const submit = async (reviewResult, message) => {
  //啟用 el-button loading 動畫與全螢幕 loading mask 效果
  loading.value = true
  const loadingMask = ElLoading.service({
    lock: true,
    text: lang('Loading'),
    background: 'rgba(168, 171, 178, 0.3)'
  })
  setTimeout(async () => {
    const isSuccess = await newReqStore.reviewApplication(reqNo, reviewResult, message)
    if (isSuccess) {
      ElMessage.success(lang('Review a request successfully'))
      router.replace({ path: '/tables' })
    } else {
      ElMessage.error(lang('Failed to review a request'))
      router.push({ path: '/reload' })
    }
    loadingMask.close()
    loading.value = false
  }, 2000)
}
</script>

<style scoped lang="scss">
:deep(.el-col) {
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.submit-container {
  padding-top: 1rem;
  padding-bottom: 1rem;
  width: 365px;
  text-align: right;
}
</style>
