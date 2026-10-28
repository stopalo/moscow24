
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';

import HistoryItem from './HistoryItem.vue';
import { historyItems } from '../data/history';

const swiperInstance = ref<SwiperInstance | null>(null);
const isMobile = ref(false);

let mediaQuery: MediaQueryList | null = null;

const updateLayout = (event: MediaQueryListEvent | MediaQueryList) => {
  isMobile.value = event.matches;
};

function onSwiper(swiper: SwiperInstance) {
  swiperInstance.value = swiper;
}

onMounted(() => {
  mediaQuery = window.matchMedia('(max-width: 768px)');
  updateLayout(mediaQuery);
  mediaQuery.addEventListener('change', updateLayout);
});

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', updateLayout);
});
</script>

<template>
  <div class="history-list">
    <div
        v-if="isMobile"
        class="history-list__slider-wrapper"
    >
      <button
          class="history-list__arrow history-list__arrow--prev"
          type="button"
          aria-label="Предыдущий слайд"
          @click="swiperInstance?.slidePrev()"
      >
        «
      </button>

      <Swiper
          :modules="[Pagination]"
          :slides-per-view="1"
          :space-between="24"
          :auto-height="true"
          :pagination="{ clickable: true }"
          :allow-touch-move="true"
          class="history-list__slider"
          @swiper="onSwiper"
      >
        <SwiperSlide
            v-for="item in historyItems"
            :key="item.id"
        >
          <HistoryItem
              :title="item.title"
              :description="item.description"
              :image="item.image"
              :reverse="false"
          />
        </SwiperSlide>
      </Swiper>

      <button
          class="history-list__arrow history-list__arrow--next"
          type="button"
          aria-label="Следующий слайд"
          @click="swiperInstance?.slideNext()"
      >
        »
      </button>
    </div>

    <template v-else>
      <HistoryItem
          v-for="item in historyItems"
          :key="item.id"
          :title="item.title"
          :description="item.description"
          :image="item.image"
          :reverse="item.reverse"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/mixins" as *;
@use "../styles/_variables" as *;

.history-list {
  max-width: 880px;
  margin: 0 auto;
  padding: 57px 0 0 0;
  background: $bg;
  box-sizing: content-box;
  @include media-768 {
    padding: 26px 0 0 0;
  }
  &__slider {
    width: 100%;
    overflow: hidden;
    padding: 0 0 65px 0;
  }
}
.history-list__slider-wrapper {
  position: relative;
  padding: 0 0 70px;
}

.history-list__arrow {
  position: absolute;
  z-index: 2;
  top: 31%;
  transform: translateY(-50%);

  border: 0;
  padding: 0;
  color: $brown;
  background: transparent;
  font-size: 48px;
  line-height: 1;
  cursor: pointer;

  &--prev {
    left: -10px;
  }

  &--next {
    right: -12px;
  }
}

.history-list__slider {
  :deep(.swiper-pagination) {
    bottom: 0;
  }

  :deep(.swiper-pagination-bullet) {
    width: 18px;
    height: 18px;
    margin: 0 10px;
    border: 1px solid $brown-dark;
    background: transparent;
    opacity: 1;
  }

  :deep(.swiper-pagination-bullet-active) {
    border-color: $brown-dark;
    background: $brown;
  }
}
</style>
