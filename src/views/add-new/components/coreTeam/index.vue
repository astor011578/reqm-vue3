<template>
  <div>
    <span class="ce-title-lg">{{ lang('Define core team member') }}</span>
    <div class="mt-3 mb-8">
      <!-- Requester name -->
      <el-form-item :label="lang('Requester name')">
        <el-row class="form-row-width">
          <el-col :span="12">
            <ReqrName />
          </el-col>
        </el-row>
      </el-form-item>
      <!-- IT name -->
      <el-form-item :label="lang('IT name')">
        <el-row class="form-row-width">
          <el-col :span="12">
            <PgrName />
          </el-col>
          <el-col :span="12">
            <ValidateText
              :key-outer="keyOuter"
              :key-inner="keyInner"
            />
          </el-col>
        </el-row>
      </el-form-item>
    </div>
  </div>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
import { ValidateText } from '@/components'
import ReqrName from './components/ReqrName.vue'
import PgrName from './components/PgrName.vue'
const keyOuter = 'coreTeam'
const keyInner = 'pgr'
</script>
