<template>
  <div class="errPage-container text-center">
    <div class="inline-flex pl-6">
      <div class="errPage-content text-left">
        <h1 class="mb-6 mt-6">401 Unauthorized</h1>
        <h2 class="m-2 mb-4">Oops!</h2>
        <h6 class="m-2">
          {{ lang('You might lack valid authentication credentials for the requested resource') }}<br>
          {{ lang('It will redirect to home page in 30 seconds automatically') }}
        </h6>
        <el-button
          class="m-2"
          :color="emphasizeColor"
          @click="back"
        >
          {{ lang('Back to home') }}
        </el-button>
      </div>
      <div class="errPage-logo" :style="background"></div>
    </div>
  </div>
</template>

<script setup>
import { lang } from '@/hooks/useCommon'
import errGif from '@/assets/401.gif'
const background = `background-image: url(${errGif})`
const emphasizeColor = '#19b4b9'
const router = useRouter()
const back = () => router.push('/')
setTimeout(() => router.push({ path: '/' }), 30000)
</script>
<style lang="scss" scoped>
$emphasize-color: #19b4b9;

.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;

  .errPage-content {
    height: 400px;
    width: 400px;
    line-height: 250px;

    h1 {
      font-size: 42px;
      font-weight: 700;
      color: #484848;
    }

    h2 {
      font-size: 24px;
      font-weight: 700;
      color: $emphasize-color;
    }

    h6 {
      font-size: 12px;
      line-height: 16px;
    }

    button {
      color: #fff;
    }
  }

  .errPage-logo {
    width: 365px;
    height: 400px;

    background: {
      size: 380px;
      repeat: no-repeat;
      position: right;
    }
  }
}
</style>
