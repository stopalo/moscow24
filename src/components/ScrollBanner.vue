
<template>
  <section class="horse-banner" aria-hidden="true">
    <div class="horse-banner__track">
      <div class="horse-banner__pattern"></div>
      <div class="horse-banner__pattern" ></div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "../styles/mixins" as *;
@use "../styles/_variables" as *;
.horse-banner {
  height: 100px;
  overflow: hidden;
  @include media-768 {
    display: none;
  }
}

.horse-banner__track {
  display: flex;
  width: max-content;
  height: 100%;
  gap: 90px;
  will-change: transform;
  padding: 0 0 0 75px;
}

.horse-banner__pattern {
  flex: 0 0 auto;
  width: 1332px;
  height: 100%;
  background-image: url('/images/horses.webp');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

@keyframes horse-banner-move {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(800px);
  }
}

@supports (animation-timeline: scroll()) {
  .horse-banner__track {
    animation-name: horse-banner-move;
    animation-duration: auto;
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-timeline: scroll(root block);
  }
}
</style>
