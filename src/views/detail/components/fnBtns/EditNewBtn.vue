<template>
  <span class="mr-3">
    <!-- Edit new request button -->
    <el-tooltip
      :content="lang(props.tip)"
      placement="bottom"
      effect="dark"
    >
      <el-button
        :icon="props.icon"
        plain
        circle
        type="primary"
        :disabled="!permission"
        @click="toRevNew"
      />
    </el-tooltip>
  </span>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
import { useReqStore } from '@/store/request'
const props = defineProps({
  icon: { type: Object, required: true },
  tip: { type: String, required: true }
})
const store = ref({})
const permission = ref(false)
const router = useRouter()
const reqNo = useRoute().params.reqNo
const toRevNew = () => router.push({ path: `/edit/${reqNo}`, replace: true })
onMounted(() => store.value = useReqStore())
watch(store, async (val) => permission.value = await store.value.getPermission.editNew)
</script>

<style lang="scss" scoped>
a {
  display: inline-flex;
  width: 290px;
  height: 24px;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
