<template>
  <span id="upload-container" :class="size">
    <el-upload
      drag
      multiple
      action="#"
      :file-list="fileList"
      :auto-upload="false"
      :on-change="uploadChange"
      :on-remove="uploadRemove"
      :class="disabled ? 'is-disabled' : ''"
      :disabled="disabled"
    >
      <Loading v-if="loading" class="el-icon--upload" :auto-height="true" />
      <UploadCloud v-else class="el-icon--upload" />
      <div class="el-upload__text">
        {{ lang('Drop your files here, or') }}
        <em>{{ lang('click to select files') }}</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          {{ lang('Total file size should be less than 10MB') }}
        </div>
      </template>
    </el-upload>
  </span>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { UploadCloud, Loading } from '@/icons/common'
import { lang } from '@/hooks/useCommon'
let loading = ref(false)
let size = ref('')
let plain = ref(true)
let disabled = ref(false)

//Props & Emits
const props = defineProps({
  size: {
    type: String,
    required: true
  },
  plain: {
    type: Boolean
  },
  step: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['get-children'])

if (props.size) {
  size.value = props.size
  if (props.size === 'large') plain.value = false
}

//判斷重複檔案名稱, 以及第一步的檔案預覽
let fileList = ref([])
//要上傳的檔案
let uploadList = ref([])

//upload on-change handler
const uploadChange = (file, files) => {
  if (files.length) {
    let extArr = []
    let totalSize = 0
    const sizeLimit = 1024 * 1024 * 10
    for (const [key, val] of Object.entries(files)) {
      extArr.push(val.name.replace(/.+\./, '')) //get file's extension
      totalSize += val.size                     //get total file size
    }

    //check illegal extension
    for (const item of extArr) {
      let isLegalExt = ['exe', 'iso', 'zip', 'gzip', '7z', 'rar', 'tar', 'wim'].indexOf(item.toLowerCase()) === -1
      if (isLegalExt === false) {
        ElMessage.error(lang("It doesn't allow to attach .EXE or .ISO or compressed files"))
        while (files.length) files.pop()
        while (extArr.length) extArr.pop()
        while (fileList.value.length) fileList.value.pop()
        while (uploadList.value.length) uploadList.value.pop()
        return false
      }
    }

    //check illegal total file size
    if (totalSize > sizeLimit) {
      ElMessage.error(lang('Total file size should be less than 10MB'))
      while (files.length) files.pop()
      while (extArr.length) extArr.pop()
      while (fileList.value.length) fileList.value.pop()
      while (uploadList.value.length) uploadList.value.pop()
      return false
    }
    
    //check duplicate file
    const existedIndex = files.findIndex(item => item.name === file.name)
    const existedLastIndex = files.findLastIndex(item => item.name === file.name)
    if(existedIndex !== existedLastIndex) {
      ElMessage.info(lang('Duplicate file'))
      files.pop()
      return false
    } else {
      fileList.value = JSON.parse(JSON.stringify(files))
      uploadList.value.push(file)
    }
  } else {
    uploadList.value = []
  }
  emits('get-children', uploadList.value)
}

//upload on-remove handler
const uploadRemove = (file, files) => {
  fileList.value = JSON.parse(JSON.stringify(files))
  uploadList.value.forEach((item, index) => {
    if (item.name === file.name) uploadList.value.splice(index, 1)
  })
  emits('get-children', uploadList.value)
}
</script>

<style lang="scss">
#upload-container.large {
  width: 350px;
  display: block;
  margin: 0 auto;

  .el-icon--upload {
    font-size: 75px;

    svg {
      width: 75px;
    }
  }

  .el-upload__tip {
    text-align: center;
  }

  .el-upload-dragger {
    padding: 10px 5px !important;
  }

  #upload-submitBtn {
    text-align: center;
    padding-top: 0.5rem;
  }
}

#upload-container.small {
  display: block;

  .el-upload-dragger {
    display: inline-flex;
    height: calc(45px + 0.5rem * 2);
    padding: 0.5rem 0.75rem;

    .el-icon--upload {
      position: absolute;
      font-size: 35px;

      svg {
        width: 35px;
      }
    }

    .el-upload__text {
      margin-left: 45px;
      font-size: 12px;
      line-height: 45px;
    }
  }

  .el-upload__tip {
    margin-left: 0.5rem;
    text-align: left;
  }

  #upload-submitBtn {
    text-align: left;
    margin-left: 0.5rem;
  }
}

#upload-container {
  ul {
    padding-left: 0 !important;
  }

  .is-disabled .el-upload-dragger {
    cursor: not-allowed;
  }

  .el-upload-list__item-file-name {
    white-space: nowrap;
  }

  .el-upload__tip {
    color: var(--el-color-info);
  }

  #upload-submitBtn {
    width: 100%;
  }
}
</style>
