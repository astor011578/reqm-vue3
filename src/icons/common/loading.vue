<template>
  <div id="loading-style" :class="props.autoHeight ? 'auto-height' : ''">
    <font-awesome-icon icon="fa-solid fa-spinner" />
  </div>
</template>

<script setup>

const props = defineProps({
  autoHeight: {
    type: Boolean,
    required: true,
    default: () => {
      return false
    }
  }
})
</script>

<style lang="scss">
#loading-style {
  animation: rotation 1s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
}

.auto-height>svg {
  height: auto;
}
</style>