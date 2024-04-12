<template>
  <div @click="toggleClick">
    <font-awesome-icon icon="fa-solid fa-indent" :class="{ 'is-active': isActive }" class="hamburger-style" />
  </div>
</template>

<script setup>
defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggleClick'])
const toggleClick = () => emit('toggleClick')
</script>

<style scoped lang="scss">
div:has(.hamburger-style) {
  line-height: 56px;
  padding: 6px 8px 0 20px;
}

.hamburger-style {
  color: var(--hamburger-color);
  width: var(--hamburger-width);
  height: var(--hamburger-height);
  cursor: pointer;

  :hover {
    color: var(--hamburger-color-hover)
  }
}

.hamburger-style.is-active {
  transform: rotate(180deg);
}
</style>
