<template>
  <!-- evidence block -->
  <el-collapse-item name="5">
    <template #title>
      <div class="detail-collapse">
        <font-awesome-icon icon="fa-solid fa-thumbtack" />
        {{ lang('Evidence') }}
      </div>
    </template>
    <div v-if="hasProperty(evidence)">
      <el-descriptions
      v-for="(val, key) in evidence"
      :key="key"
      column="1"
      border
      >
        <template #title v-if="val.title">
          <div>
            <font-awesome-icon icon="fa-solid fa-paperclip" />
            {{ val.title }}
          </div>
        </template>
        <el-descriptions-item v-if="val.state" :label="lang('Status')">
          <el-tag v-if="val.state === 'Approved'" type="primary">
            {{ lang('Approved') }}
          </el-tag>
          <span v-else :class="val.class">
            {{ lang(val.state) }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item v-if="val.uploadReply === 'Rejected'" :label="lang('Rejection message')" >
          <span v-if="!val.comments" class="ce-gray-color-italic">
            {{ lang('There is no comments') }}
          </span>
          <span v-else>
            {{ val.comments }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item v-if="val.uploadReply && val.uploadReply !== 'Reviewing'" :label="lang('Last review date')">
          {{ dateFormatter(val.reviewDate) }}
        </el-descriptions-item>
        <el-descriptions-item v-if="val.uploadFiles.length" :label="lang('Last update date')">
          {{ dateFormatter(val.updateDate) }}
        </el-descriptions-item>
        <el-descriptions-item v-if="val.uploadFiles.length" :label="lang('Evidence')">
          <div
            v-for="(valInFiles, idxInFiles) in val.uploadFiles"
            :key="idxInFiles"
            class="evidence-container"
          >
            <a
              class="ce-link"
              :href="`${prePath}/${key}/${valInFiles.fileName}`"
              :download="valInFiles.originalName"
              target="_blank"
            >
              <div>
                <File class="mr-1" />
                {{ valInFiles.originalName }}
              </div>
              <div v-if="imgExt.indexOf(valInFiles.ext.toLowerCase()) !== -1">
                <img :src="`${prePath}/${key}/${valInFiles.fileName}`" />
              </div>
            </a>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-collapse-item>
</template>

<script setup>
import { dateFormatter } from '@/hooks/useDate'
import { lang } from '@/hooks/useCommon'
import { hasProperty } from '@/hooks/useValidate'
import { useReqStore } from '@/store/request'
import { File } from '@/icons/common/'
const store = useReqStore()
const reqNo = store.getReqNo
const evidence = ref({})
const prePath = `${import.meta.env.VITE_APP_BASE_URL}/uploads/${reqNo}`
const imgExt = ['jpg', 'jpeg', 'gif', 'png', 'svg']

onMounted(() => {
  const type = store.getReqType
  const _evidence = store.getEvidence
  evidence.value = Object.assign({}, _evidence)
  for (const [key, val] of Object.entries(_evidence)) {
    const { uploadFiles, uploadReply } = val
    if (key === 'release' || key === 'monitor') {
      if (type === 'OneTime') break
    }
    //get file extension
    if (uploadFiles.length) {
      uploadFiles.forEach((file, index) => {
        let extension = file.originalName.split('.').slice(-1)[0]
        evidence.value[key].uploadFiles[index].ext = extension
      })
    }

    //get state value
    if (!uploadReply) {
      evidence.value[key].state = 'Not uploaded yet'
      evidence.value[key].class = 'ce-gray-color-italic'
    } else {
      switch (uploadReply) {
        case 'Reviewing': {
          evidence.value[key].state = 'Pending approval'
          evidence.value[key].class = 'ce-gray-color-italic'
          break
        }
        case 'Rejected': {
          evidence.value[key].state = 'Rejected, re-uploading'
          evidence.value[key].class = 'ce-gray-color-italic'
          break
        }
        case 'Approved': {
          evidence.value[key].state = 'Approved'
          break
        }
      }
    }

    //get title value
    switch (key) {
      case 'UAT1': evidence.value[key].title = 'IT buyoff (UAT1)'; break;
      case 'UAT2': evidence.value[key].title = 'User buyoff (UAT2)'; break;
      case 'release': evidence.value[key].title = 'Release'; break;
      case 'monitor': {
        evidence.value[key].title = 'Monitor 1 lot'; break;
      }
    }
  }
})
</script>

<style lang="scss" scoped>
$subtitle-color: var(--cyan-darken-4);

.evidence-container:not(:last-child) {
  margin-bottom: 0.25rem;
}

img {
  width: 350px;
  height: auto;
}
img:hover {
  width: 600px;
  height: auto;
}

a {
  width: 100%;
  line-height: 24px;
  > :first-child {
    display: inline-flex !important;
    line-height: 24px;
  }
}

:deep(.el-descriptions) {
  margin-bottom: 28px;
  //描述列表 header (迴紋針 icon + 標題)
  .el-descriptions__header {
    padding: 0.675rem 0.5rem;
    margin-bottom: 0;
    line-height: 14px;
    .el-descriptions__title {
      color: $subtitle-color;
    }
  }
}
</style>
