<template>
  <el-tooltip :content="greeting" placement="left" effect="light">
    <div>
      <el-dropdown trigger="click" size="medium">
        <div class="avatar-wrapper" @mouseover="mouseover" @mouseleave="mouseleave">
          <font-awesome-icon
            class="user-avatar"
            :icon="isHovered === true ? 'fa-solid fa-child-reaching' : 'fa-solid fa-child'"
          />
          <font-awesome-icon
            class="user-caret"
            icon="fa-solid fa-caret-down"
          />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">{{ lang('Logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-tooltip>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { lang } from '@/hooks/useCommon'

/**
 * show userID in tooltip of avatar
 */
const greeting = ref('Hi!')
if (localStorage.userId) greeting.value = `Hi! ${localStorage.userId}`

/**
 * logout
 */
const router = useRouter()
const logout = () => {
  const userStore = useUserStore()
  userStore.logout().then(() => {
    ElMessage({ message: lang('Logout successfully'), type: 'success' })
    router.push(`/login?redirect=/`)
  })
}

/**
 * avatar hover animation
 */
const isHovered = ref(false)
const mouseover = () => isHovered.value = true
const mouseleave = () => isHovered.value = false
</script>

<style lang="scss">
.avatar-wrapper {
  margin-top: 5px;
  position: relative;
  color: var(--navbar-icon-color);

  .user-avatar {
    width: 30px;
    height: 30px;
    border-radius: 10px;
  }

  .user-caret {
    font-size: 12px;
    width: 1em;
    height: 1em;
    margin-left: 4px;
  }
}
</style>