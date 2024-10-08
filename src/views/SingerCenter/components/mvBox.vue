<script setup>
import { formatNumber, highlight } from '@/utils/format'
import { CaretRightFilled } from '@ant-design/icons-vue'
defineProps({
  mv: {
    type: Object,
    default: () => {}
  },
  img: {
    type: String,
    default: ''
  },
  kw: {
    type: String,
    default: ''
  }
})

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000)

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
</script>

<template>
  <div
    class="mv-container fd-col items-center cursor-pointer w-20vw mt-20 rounded-20"
  >
    <div
      class="img-box rounded-20 f-c mb-10 relative filter-brightness-90"
      :style="{ backgroundImage: `url(${img})` }"
    >
      <div class="msk wh-full rounded-20 absolute f-c">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          fill="#d2d2d2"
        >
          <path
            d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
          />
        </svg>
      </div>
      <div class="duration absolute right-6% bottom-2% fs-12 z-30 color-#fff">
        {{ formatTime(mv.duration) }}
      </div>
      <div
        class="play-count f-c fs-13 fw-600 z-30 absolute top-5% right-4% color-#fff"
      >
        <span class="icon f-c">
          <CaretRightFilled />
        </span>
        <span class="count ml-2">{{ formatNumber(mv.playCount) }}</span>
      </div>
    </div>
    <div class="mv-title fw-600 f-1 mb-10 p-x-15">
      <span v-html="highlight(mv.name, kw)"></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mv-container {
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    :deep(.img-box .msk) {
      z-index: 20;
      opacity: 1;
    }
  }
  .mv-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    &::after {
      content: '';
      display: inline-block;
      width: 100%;
      visibility: hidden; /* 隐藏的伪元素占用第二行空间 */
      line-height: inherit;
    }
  }
  .img-box {
    width: calc(20vw);
    height: calc(15vw - 30px);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    &:hover {
      box-shadow: 0 5px 15px 5px rgb(0 0 0 / 10%);
    }
    .msk {
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: 0.3s ease;
      svg {
        width: 25%;
        height: 25%;
      }
    }
  }
}
</style>
