<template>
  <el-form-item :label="lang('Plant')">
    <el-row class="form-row-width">
      <el-col :span="12">
        <el-radio-group v-model="plant">
          <el-radio label="P1" size="small" class="pl-2">P1</el-radio>
          <el-radio label="P2" size="small">P2</el-radio>
          <el-radio label="P3" size="small">P3</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="12">
        <ValidateText
          :key-outer="'reqTable'"
          :key-inner="'plant'"
        />
      </el-col>
    </el-row>
  </el-form-item>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
import { ValidateText } from '@/components'
import { useNewReqStore } from '@/store/new-request'
const newReqStore = useNewReqStore()
const plant = ref('')   //綁定 el-radio 中的值
//取得 plant 初始值
onMounted(() => plant.value = newReqStore.getPlant)
//監聽 plant 數值的變化, 有改變就 set 回 store
watch(plant, (value) => newReqStore.setPlant(plant.value))
</script>
