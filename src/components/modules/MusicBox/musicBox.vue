<script setup>
defineProps({
  music: {
    type: Object,
    default: () => ({})
  },
  img: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="music-container fd-col items-center cursor-pointer w-15vw mt-20">
    <div class="img-box rounded-10 m-b-5 relative">
      <img v-img-lazy="img" alt="" class="wh-full rounded-10" v-if="img" />
      <div class="msk-img w-full rounded absolute top--15"></div>
      <div class="play-btn-box z-2 absolute f-c!">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          fill="red"
        >
          <path
            d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
          />
        </svg>
      </div>
    </div>
    <div class="title fw-600 f-1">{{ music.name }}</div>
  </div>
</template>

<style lang="scss" scoped>
.img-box {
  width: calc(15vw - 20px);
  height: calc(15vw - 20px);
  .msk-img {
    width: calc(15vw - 20px);
    height: calc(15vw - 20px);
    z-index: -1;
    background-image: url('@/assets/bg1.png');
    background-size: cover;
    background-repeat: no-repeat;
  }
  .play-btn-box {
    width: calc(5vw - 25px);
    height: calc(5vw - 25px);
    right: 10px;
    bottom: 10px;
    background-color: #fff;
    border-radius: 50%;
    opacity: 0;
    transition: 0.3s;
    svg {
      width: 60%;
      height: 60%;
      transform: translateX(8%);
      opacity: 0;
      transition: 0.3s;
    }
  }
  &:hover {
    .play-btn-box {
      opacity: 0.8;
      svg {
        opacity: 0.8;
      }
    }
  }
}
</style>
