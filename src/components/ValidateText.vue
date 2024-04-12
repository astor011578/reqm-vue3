<template>
  <div :class="props.overrideClass ? props.overrideClass : 'ce-validate pl-2'">
    {{ lang(validate) }}
  </div>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
import { useNewReqStore } from '@/store/new-request'
const newReqStore = useNewReqStore()
const validate = ref('')
const validateCode = ref(0)

//賦值給 validateCode
watch(newReqStore, () => validateCode.value = newReqStore.getValidateCode)
//監聽 validateCode 的變化, 有改變時則重新獲取 validate 的值
watch(validateCode, async () => await getValidateString())
//賦予 validate 初始值
onMounted(async () => await getValidateString())

//父組件傳來的 key, 會分別對應到 newReqStore 中的 state.validate 的外、內層 key
const props = defineProps({
  keyOuter: { type: String, default: null },      //對應 store 中 state.validate 的第一層 key
  keyInner: { type: String, default: null },      //對應 store 中 state.validate 的第二層 key
  overrideClass: { type: String, default: null }, //父組件有傳此值則表示要更改字的 class name
  injectString: { type: String, default: null }   //父組件有傳此值則表示要直接帶入此 string value, 不用從 store 帶入
})

//複用程式碼: 向 store 取得 validate 的值
const getValidateString = async () => {
  const { keyOuter, keyInner, injectString } = props
  if (!injectString) {
    if (!keyOuter) return validate.value = await newReqStore.getValidate
    if (!keyInner) return validate.value = await newReqStore.getValidate[keyOuter]
    return validate.value = await newReqStore.getValidate[keyOuter][keyInner]
  }
  return validate.value = await props.injectString
}
</script>
