<script setup>
import { useMusicStore } from '@/stores'

defineProps({
  lyric: {
    type: String,
    default: ''
  }
})

const musicStore = useMusicStore()
</script>

<template>
  <div class="lyric-part f-b wh-full" v-if="musicStore.songInfo?.id">
    <div class="cover-img w-50% relative">
      <div
        class="pic w-320 h-320 m-0-auto f-c relative"
        :class="musicStore.stop ? 'animation-pause' : ''"
      >
        <img
          :src="musicStore.songInfo?.al.picUrl"
          alt=""
          class="w-210 h-210 rounded-50%"
        />
      </div>
      <div
        class="pointer absolute top--30% left-45% translate-x--100% w-300 h-200 cp"
        :class="musicStore.stop ? '' : 'pointer-on'"
      ></div>
    </div>
    <!-- <div class="lyric-content f-1 cp">{{ lyric }}</div> -->
  </div>
</template>

<style lang="scss" scoped>
.lyric-part {
  .cover-img {
    .animation-pause {
      animation-play-state: paused !important;
    }
    .pic {
      animation: imgRotate 35s linear infinite;
      animation-play-state: running;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(255, 255, 255, 0.1);
        width: 320px;
        height: 320px;
        transform: scale(1.05);
        z-index: 1;
        border-radius: 50%;
      }
      &::after {
        content: '';
        background-image: url('@/assets/bg1.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: absolute;
        top: 0;
        left: 0;
        width: 320px;
        height: 320px;
        z-index: 0;
      }
    }
    .pointer {
      background-image: url('@/assets/bg2.png');
      background-repeat: no-repeat;
      transform: scale(0.9);
      transform-origin: 15px 15px;
      transition: all 0.5s;
    }
    .pointer-on {
      transform: rotate(30deg) scale(0.9);
    }
  }
}
@keyframes imgRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
