<template>
  <div id="top-title" >
    <span class="ce-title-lg">
      <slot name="title">Title</slot>
      <span id="align-right" class="float-right">
        <slot name="align-right"></slot>
      </span>
    </span>
  </div>
</template>

<style scoped lang="scss">
#top-title {
  top: var(--navbar-height);
  width: calc(100%);
  position: -webkit-sticky;
  position: sticky;
  z-index: var(--top-title-z-index);
  background-color: rgba(255, 255, 255, 0.85);
  padding: 1rem 1.6875rem 0.25rem 1.6875rem;
}

#align-right {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}
</style>
