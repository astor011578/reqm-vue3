<template>
  <el-alert
    type="info"
    :title="lang('How to fill out this form?')"
    show-icon :closable="false"
  >
    <template #default>
      {{ lang('You can download') }}
      <a
        href="/application/template.xlsx"
        class="ce-link"
        download="it-req-template"
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
</script>