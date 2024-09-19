<script setup>
import { useRouter } from 'vue-router'
defineProps({
  singer: {
    type: Object,
    default: () => ({})
  }
})

const router = useRouter()
const navigateToSinger = (id) => {
  router.push(`/singer?id=${id}`)
}
</script>

<template>
  <div
    class="simi-singer-container fd-col items-center cursor-pointer w-15vw mt-10 p-y-15 p-x-10 rounded-12"
    @click="navigateToSinger(singer.id)"
  >
    <div
      class="img-box rounded-50% f-c mb-10 relative"
      :style="{ backgroundImage: `url(${singer.picUrl})` }"
    >
      <div class="msk wh-full rounded-50% absolute f-c">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          fill="white"
        >
          <path
            d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
          />
        </svg>
      </div>
    </div>
    <div class="info fd-col items-center">
      <div class="name fs-18">{{ singer.name }}</div>
      <div class="count fw-400 fs-13 color-#d2d2d2cc">
        单曲: {{ singer.musicSize }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.simi-singer-container {
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 5px 15px 5px rgb(0 0 0 / 10%);
    :deep(.img-box .msk) {
      z-index: 2;
      opacity: 1;
    }
  }
  .img-box {
    width: calc(15vw - 30px);
    height: calc(15vw - 30px);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    .msk {
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: 0.3s ease;
      svg {
        width: 35%;
        height: 35%;
      }
    }
  }
}
</style>
