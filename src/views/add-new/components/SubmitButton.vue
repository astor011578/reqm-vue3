<template>
  <div class="add-new-submit-container">
    <el-button
      type="primary"
      :loading="loading"
      @click="validateAllInputs"
    >
      {{ lang('Submit') }}
    </el-button>
  </div>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
import { useNewReqStore } from '@/store/new-request'
import { ElMessage, ElLoading } from 'element-plus'
const newReqStore = useNewReqStore()
const router = useRouter()
const loading = ref(false)    //是否啟用 loading 效果

//輸入驗證與送出表單
const validateAllInputs = async () => {
  await newReqStore.checkEmpty(false)
  await iterateValidates()
}

//遍歷 newReqStore.state.validates.value, 如果有值則移動 y-scroll
const iterateValidates = async () => {
  const validates = await newReqStore.getValidate
  let isPass = false    //是否所有欄位都通過輸入驗證

  for await (const [outerKey, outerVal] of Object.entries(validates)) {
    for await (const [innerKey, innerVal] of Object.entries(outerVal)) {
      const benefitType = newReqStore.getBenefitType
      isPass = innerVal !== '' ? false : true
      if (innerVal !== '') {
        switch (innerKey) {
          case 'pgr': {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            break
          }
          case 'reqName':
          case 'stage':
          case 'customer': {
            const scrollHeight = benefitType === 'Efficiency' ? 510 : 560
            window.scrollTo({ top: scrollHeight, behavior: 'smooth' })
            break
          }
          case 'device':
          case 'tester':
          case 'equipment':
          case 'system':
          case 'purpose':
          case 'plant': {
            const scrollHeight = benefitType === 'Efficiency' ? 840 : 880
            window.scrollTo({ top: scrollHeight, behavior: 'smooth' })
            break
          }
          default: {
            break
          }
        }
        return
      }
    }
  }

  // console.log('isPass?', isPass)
  if (isPass) await submit()
}

//提交表單至服務端
const submit = async () => {
  //啟用 el-button loading 動畫與全螢幕 loading mask 效果
  loading.value = true
  const loadingMask = ElLoading.service({
    lock: true,
    text: lang('Loading'),
    background: 'rgba(168, 171, 178, 0.3)'
  })
  setTimeout(async () => {
    const isSuccess = await newReqStore.submitApplication()
    if (isSuccess) {
      ElMessage.success(lang('New a request successfully'))
      router.replace({ path: '/tables' })
    } else {
      ElMessage.error(lang('Failed to new a request'))
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
.add-new-submit-container {
  padding-top: 1rem;
  padding-bottom: 1rem;
  width: 300px;
  text-align: right;
}
</style>
