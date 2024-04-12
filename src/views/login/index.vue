<template>
  <div class="login-container columnCC">
    <div class="login-bg"></div>
    <div class="login-pane">
      <div class="login-logo"></div>
      <el-form class="login-form" :model="loginForm">
        <div class="login-title-container">
          <h3 class="title text-center">{{ settings.title }}</h3>
        </div>
        <el-form-item prop="userId">
          <div class="rowSC">
            <User class="icon-container" />
            <el-input
              class="test"
              v-model="loginForm.userId"
              :placeholder="lang('User ID')"
              @keyup="clearTipMsg"
            />
          </div>
        </el-form-item>
        <el-form-item prop="password">
          <div class="rowSC flex-1">
            <Lock class="icon-container" />
            <el-input
              :key="pwdType"
              ref="pwdRef"
              v-model="loginForm.password"
              :type="pwdType"
              :placeholder="lang('Password')"
              @keyup="clearTipMsg"
              @keyup.enter="loginHandler"
            />
            <span class="show-pwd" @click="showPwd">
              <component :is="pwdType === 'password' ? EyeSlash : Eye" />
            </span>
          </div>
        </el-form-item>
        <div class="tip-message">{{ lang(tipMessage) }}</div>
        <el-row class="row-bg" justify="center">
          <el-button
            :loading="loading"
            type="primary"
            size="default"
            @click="loginHandler"
          >
            {{ lang('Login') }}
          </el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { lang, sleepTimeout } from '@/hooks/useCommon'
import { useUserStore } from '@/store/user'
import { User, Lock, Eye, EyeSlash } from '@/icons/common/'
import settings from '@/settings'
const route = useRoute()
const router = useRouter()

//form reactive
let loginForm = reactive({ userId: '999999', password: '999999' })
//route reactive
let state = reactive({ otherQuery: {}, redirect: undefined })

//monitor the changing of router
let getOtherQuery = (query) => {
  return Object.keys(query).reduce((acc, cur) => {
    if (cur !== 'redirect') acc[cur] = query[cur]
    return acc
  }, {})
}
watch(
  () => route.query,
  (query) => {
    if (query) {
      state.redirect = query.redirect
      state.otherQuery = getOtherQuery(query)
    }
  },
  { immediate: true }
)

//login relative
const loading = ref(false)
const tipMessage = ref('')
const loginHandler = async () => {
  const { userId, password } = loginForm
  const hasUserId = userId.trim().length ? true : false
  const hasPassword = password.trim().length ? true : false
  switch (true) {
    case !hasUserId: return tipMessage.value = 'Please input user ID'
    case !hasPassword: return tipMessage.value = 'Please input password'
    default: await loginReq(); break;
  }
}

//send login request
const loginReq = async () => {
  loading.value = true
  localStorage.setItem('userId', loginForm.userId)
  const userStore = useUserStore()
  await userStore.login(loginForm)
    .then(() => {
      ElMessage.success(lang('Login successfully'))
      router.push({ path: state.redirect || '/', query: state.otherQuery })
    })
    .catch((res) => {
      sleepTimeout(30)
        .then(() => {
          tipMessage.value = 'User ID or password is incorrect'
          loading.value = false
        })
    })
}

//clear tip message if it's not empty
const clearTipMsg = () => { return tipMessage.value && tipMessage.value.trim() !== '' ? tipMessage.value = '' : null }

//show or hidden password
const pwdType = ref('password')
const pwdRef = ref(null)
const showPwd = () => {
  pwdType.value = pwdType.value === 'password' ? '' : 'password'
  nextTick(() => pwdRef.value.focus())
}
</script>

<style lang="scss" scoped>
$bg-gradient: linear-gradient(180deg, rgb(237, 235, 253) 0%, rgb(209, 209, 239) 100%);
$title: #616161;
$error: var(--error);
$gray: #757575;
$lightgray: #e0e0e0;

:deep(.el-form-item__content) {
  display: block;
}

.login-container {
  height: 100vh;
  position: relative;
  overflow-y: hidden;
  width: 100%;

  background: {
    image: $bg-gradient;
  }

  :deep(.el-input__wrapper) {
    background-color: transparent;
    box-shadow: none;
    border-radius: 50px;
  }

  .el-form-item:has(input:focus) {
    outline: 3px double var(--cyan-lighten-4);
  }

  :deep(.el-form-item) {
    border: 1px solid #e0e0e0;
    background: #fff;
    border-radius: 50px;
    color: #999;

    .el-form-item__content {
      position: relative;
    }

    .el-form-item__error {
      padding-left: 40px;
    }
  }

  :deep(.el-input input) {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 50px;
    padding: 10px 5px 10px 35px;
    color: #999;
    height: 42px;
    caret-color: #999;
  }

  //hidden the input border
  :deep(.el-input__inner) {
    box-shadow: none !important;
  }

  .login-pane {
    position: relative;
    .login-logo {
      position: absolute;
      top: 0;
      left: 50%;
      z-index: 0;
      transform: translateY(-110%) translateX(-50%);
      width: 90px;
      height: 90px;

      background: {
        image: url('@/icons/logo/logo.png');
        size: 90px 90px;
        repeat: no-repeat;
      }
    }
  }

  .login-form {
    width: 320px;
    margin-top: 10px;
    padding: 40px 30px;
    background: #fff;
    box-shadow: 0px 4px 16px rgba(25, 105, 105, 0.15);
    border-radius: 8px;
    position: relative;
    z-index: 10;
  }

  .login-title-container {
    .title {
      font-size: 22px;
      color: $title;
      margin: 0px auto 30px auto;
      text-align: center;
      font-weight: 700;
      text-shadow: 2px 2px 5px $lightgray;
    }
  }
}

.login-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
}

.icon-container {
  padding-left: 16px;
  color: $gray;
  text-align: center;
  width: 30px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

//error message
.tip-message {
  color: $error;
  height: 30px;
  margin-top: -10px;
  text-align: center;
  font-size: 12px;
}

.show-pwd {
  width: 50px;
  font-size: 16px;
  color: $gray;
  cursor: pointer;
  text-align: center;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
