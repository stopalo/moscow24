<script setup lang="ts">
import ScrollBanner from './components/ScrollBanner.vue';
import HistoryList from './components/HistoryList.vue';
</script>

<template>
  <main class="page">
    <ScrollBanner />
    <div class="page__container">
      <h1 class="page__title">ИСТОРИЯ МОСКОВСКОГО ИППОДРОМА</h1>
      <HistoryList />
    </div>
  </main>
</template>

<style lang="scss" scoped>
@use "./styles/mixins" as *;
@use "./styles/_variables" as *;

.page {
  width: 100%;
  background: $bg;
  min-height: 100vh;
  padding: 80px 0 0 0;
  @include media-768 {
    padding: 32px 0 0 0;
  }
  &__container {
    max-width: 1170px;
    margin: 0 auto;
    padding: 80px 24px 250px 24px;
    box-sizing: content-box;
    @include media-768 {
      padding: 0 20px;
    }
  }
  &__title {
    font: 800 85px/1.1em $font-family-extraBold;
    color: $white;
    @include media-768 {
      font: 800 24px/1.25em $font-family-extraBold;
      text-align: center;
    }
  }
}
</style>