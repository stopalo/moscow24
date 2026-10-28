
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

interface Props {
  title: string;
  description: string;
  image: string;
  reverse?: boolean;
}

withDefaults(defineProps<Props>(), {
  reverse: false,
});

const cardElement = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const isLightboxOpen = ref(false);
let previousBodyOverflow = '';

function openLightbox() {
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  isLightboxOpen.value = true;
  window.addEventListener('keydown', handleLightboxKeydown);
}

function closeLightbox() {
  isLightboxOpen.value = false;
  document.body.style.overflow = previousBodyOverflow;
  window.removeEventListener('keydown', handleLightboxKeydown);
}

function handleLightboxKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeLightbox();
  }
}

let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!cardElement.value) return;

  observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.value = entry.isIntersecting;
      },
      {
        threshold: 0.25,
      },
  );

  observer.observe(cardElement.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  window.removeEventListener('keydown', handleLightboxKeydown);
  if (isLightboxOpen.value) {
    document.body.style.overflow = previousBodyOverflow;
  }
});
</script>

<template>
  <article
      ref="cardElement"
      class="history-item"
      :class="{ 'history-item--reverse': reverse,
                'history-item--visible': isVisible,
                }"
  >
    <div class="history-item__visual">
      <div class="history-item__photo-wrapper">
        <img
            class="history-item__photo"
            :src="image"
            :alt="title"
            loading="lazy"
            role="button"
            tabindex="0"
            :aria-label="`Увеличить изображение: ${title}`"
            @click="openLightbox"
            @keydown.enter.prevent="openLightbox"
            @keydown.space.prevent="openLightbox"
        />
      </div>
      <img
          class="history-item__frame"
          src="/images/frame.png"
          alt=""
          aria-hidden="true"
      />
    </div>

    <div class="history-item__content">
      <h2 class="history-item__title">
        {{ title }}
      </h2>

      <p class="history-item__description">
        {{ description }}
      </p>
    </div>
  </article>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
          v-if="isLightboxOpen"
          class="lightbox"
          role="dialog"
          aria-modal="true"
          :aria-label="`Изображение: ${title}`"
          @click.self="closeLightbox"
      >
        <button
            class="lightbox__close"
            type="button"
            aria-label="Закрыть изображение"
            @click="closeLightbox"
        >
          &times;
        </button>

        <img
            class="lightbox__image"
            :src="image"
            :alt="title"
            @click.stop
        />
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use "../styles/mixins" as *;
@use "../styles/_variables" as *;

.history-item {
  display: flex;
  align-items: center;
  padding: 11px 0;
  @include media-768 {
    flex-wrap: wrap;
    justify-content: center;
    padding: 0;
  }

  &--visible {
    .history-item__photo {
      opacity: 1;
      transform: scale(1);
      transition-delay: 0.2s;
    }

    .history-item__frame {
      opacity: 1;
      transform: translate(-50%, -50%) rotate(0deg);
      transition-delay: 0s;
    }
  }

  &--reverse {
    .history-item__visual {
      order: 2;
    }

    .history-item__content {
      order: 1;
      padding: 0 70px 0 0;
      @include media-880 {
        padding: 0 35px 0 0;
      }
    }
  }

  &__visual {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 405px;
    aspect-ratio: 1;
    @include media-768 {
      width: 290px;
    }
  }

  &__photo-wrapper {
    width: 245px;
    aspect-ratio: 1;
    border: 55px solid $borders;
    outline: 2px solid $brown-light;
    outline-offset: 10px;
    border-radius: 50%;
    box-sizing: content-box;
    overflow: hidden;
    @include media-768 {
      width: 186px;
      border: 42px solid $borders;
      outline-offset: 8px;
    }
  }

  &__photo {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    opacity: 0;
    transform: scale(0.82);
    transition:
        opacity 0.9s ease,
        transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
    @include media-768 {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }

  &__frame {
    position: absolute;
    inset: 0;
    width: 79%;
    height: 79%;
    object-fit: contain;
    pointer-events: none;
    top: 50%;
    left: 50%;
    opacity: 0;
    transform: translate(-50%, -50%) rotate(-180deg);
    transform-origin: center;
    transition:
        opacity 0.4s ease,
        transform 1.3s cubic-bezier(0.22, 1, 0.36, 1);
    @include media-768 {
      width: 85%;
      height: 85%;
      opacity: 1;
      transform: translate(-50%, -50%);
      transition: none;

    }
  }

  &__content {
    width: calc(100% - 405px);
    padding: 0 0 0 70px;
    @include media-880 {
      padding: 0 0 0 35px;
    }
    @include media-768 {
      width: 100%;
      text-align: center;
      padding: 32px 0 0 0;
    }
  }

  &__title {
    margin: 0 0 24px;
    font: 800 36px/1.2em $font-family-extraBold;
    color: $brown;
    @include media-768 {
      margin: 0;
      font: 800 24px/1.2em $font-family-extraBold;
    }
  }

  &__description {
    margin: 0;
    font: 400 18px/1.55em $font-family;
    color: $brown;
    @include media-768 {
      margin: 18px 0 0 0;

    }
  }
}
@media (prefers-reduced-motion: reduce) {
  .history-item__photo,
  .history-item__frame {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 48px;
  background: rgb(0 0 0 / 85%);
  cursor: zoom-out;

  &__image {
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;

    border-radius: 4px;
    box-shadow: 0 8px 40px rgb(0 0 0 / 30%);
    cursor: default;
  }

  &__close {
    position: absolute;
    top: 20px;
    right: 28px;

    border: 0;
    padding: 0;

    color: $white;
    background: transparent;
    font-size: 44px;
    line-height: 1;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .lightbox {
    padding: 16px;

    &__close {
      top: 12px;
      right: 16px;
    }
  }
}
</style>
