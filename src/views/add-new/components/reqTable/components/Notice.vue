<template>
  <el-alert
    type="info"
    :title="lang('How to fill out this form?')"
    show-icon
    :closable="false"
  >
    <template #default>
      {{ lang('You can download') }}
      <a
        :href="templatePath"
        class="ce-link"
        download="reqm-template"
      >
        {{ lang('template file') }}
      </a>
      {{ lang(', then upload it after you complete it') }}<br />
      {{ lang('Without uploading the template, you can complete these fields then submit it') }}
    </template>
  </el-alert>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
import settings from '@/settings'
const envPath = settings.viteBasePath
const isDevPath = envPath === './'
const basePath = '/application/template.xlsx'
const templatePath = isDevPath ? basePath : `/reqm-vue3${basePath}`
</script>

<style lang="scss" scoped>
:deep(.el-alert__title) {
  font-size: 14px;
}
:deep(.el-alert__description) {
  font-size: 12px;
}
</style>
