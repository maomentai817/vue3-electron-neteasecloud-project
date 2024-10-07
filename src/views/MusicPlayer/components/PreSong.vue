<script setup>
import { computed } from 'vue'
import { useMusicStore, useGlobalStore } from '@/stores'
import { useRouter } from 'vue-router'

const props = defineProps({
  song: {
    type: Object,
    default: () => {}
  }
})

const timerTansform = (seconds) => {
  // 将秒转换为 xx:xx
  seconds = parseInt(seconds)
  const minutes = Math.floor(seconds / 60)
  const secondLeft = seconds % 60
  return `${('0' + minutes).slice(-2)}:${('0' + secondLeft).slice(-2)}`
}

// 识别标志
const musicStore = useMusicStore()
const globalStore = useGlobalStore()
const selectFlag = computed(() => {
  return +props.song.id === +musicStore.songInfo?.id
})

// 跳转歌手页面
const router = useRouter()
const navigateToSinger = (singer) => {
  router.push(`/singer?id=${singer.id}&name=${singer.name}`)
}
const navigateToMV = (id) => {
  router.push(`/mv?id=${id}`)
}

const open = () => {
  window.$player.show(props.song?.id)
}
</script>

<template>
  <div
    class="pre-song f-s p-x-15 p-y-8 hover:bg-#ffffff1a rounded-5 duration-300"
    @dblclick="open"
  >
    <div class="cover-img wh-50 rounded-8 m-r-10 relative flex-shrink-0">
      <img :src="song?.al?.picUrl" alt="" class="wh-full rounded-8" />
      <div
        class="msk absolute top-0 left-0 opacity-0 wh-full rounded-8 bg-#0000003f f-c pl-5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          class="wh-24"
          fill="#fff"
        >
          <path
            d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
          />
        </svg>
      </div>
    </div>
    <div
      class="song-info f-1 color-#fff max-w-65%"
      :class="selectFlag ? 'playing' : ''"
    >
      <div class="name text-overflow fw-600">
        <span>{{ song.name }}</span>
      </div>
      <div class="singers f-s text-overflow">
        <span class="f-s color-#ff3a3a">
          <div
            class="vip fs-11 rounded-3 bo-#ec4141 mr-5 p-x-2"
            v-if="song?.fee === 1"
          >
            vip
          </div>
          <div
            class="mv fs-11 rounded-3 bo-#ec4141 mr-5 p-x-2 cp"
            v-if="song?.mv !== 0"
            @click.stop="navigateToMV(song.mv)"
          >
            mv&#9654;
          </div>
          <div
            class="origin fs-11 rounded-3 bo-#ec4141 mr-5 p-x-2"
            v-if="song?.originCoverType === 1"
          >
            原唱
          </div>
        </span>
        <span class="singer" v-for="(singer, i) in song.ar" :key="i">
          <span
            class="cursor-pointer fs-13 fw-500 enable-singer"
            v-if="singer.id !== 0"
            @click="navigateToSinger(singer)"
            >{{ singer?.name }}</span
          >
          <span v-else>{{ singer?.name }}</span>
          <span class="empty m-x-4">{{
            i === song.ar.length - 1 ? '' : '/'
          }}</span>
        </span>
      </div>
    </div>
    <div class="right">
      <div class="duration w-60 text-center fs-12">
        {{ timerTansform(song?.dt / 1000) }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pre-song {
  .playing {
    color: #fc3d49 !important;
  }
  &:hover {
    .cover-img {
      .msk {
        opacity: 1;
      }
    }
  }
  .song-info {
    .singers {
      .singer {
        .enable-singer {
          &:hover {
            color: v-bind('globalStore.color');
            filter: brightness(200%);
          }
        }
      }
    }
  }
}
</style>
