<script setup>
import { HeartFilled, HeartOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()

const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  index: {
    type: Number,
    default: 0
  },
  isPic: {
    type: Boolean,
    default: true
  },
  isPop: {
    type: Boolean,
    default: false
  }
})
const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000)

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 喜欢判断标志
const isLike = computed(() => {
  return userStore.userLikeList.ids?.some((item) => item === props.item.id)
})
const setLike = async () => {
  await userStore.addLikeSong(props.item.id, !isLike.value)
}

// 跳转歌手页面
const router = useRouter()
const navigateToSinger = (singer) => {
  router.push(`/singer?id=${singer.id}&name=${singer.name}`)
}

// 跳转专辑页面
const navgateToAlbum = (id) => {
  router.push(`/album?id=${id}`)
}
</script>

<template>
  <div class="list-item-container p-x-20 rounded-10">
    <div class="item-content f-a h-70 fs-14 fw-600 color-#969696">
      <div class="id w-5% relative">
        <span class="id-count opacity-100">{{
          index.toString().padStart(2, '0')
        }}</span>
        <span class="icon absolute top-0 left-0 opacity-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            class="wh-20"
            fill="#d2d2d2cc"
          >
            <path
              d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
            />
          </svg>
        </span>
      </div>
      <div class="title f-c w-40% text-overflow">
        <div class="cover-img wh-50 rounded-8 mr-10 bgc-#d2d2d2" v-if="isPic">
          <img v-img-lazy="item.al.picUrl" alt="" class="wh-full rounded-8" />
        </div>
        <div class="song-info f-1">
          <div class="song-name color-#d2d2d2 text-overflow">
            {{ item.name }}
          </div>
          <div class="singers f-s">
            <span class="singer" v-for="(singer, i) in item.ar" :key="i">
              <span
                class="hover:color-#d2d2d2 cursor-pointer"
                v-if="singer.id !== 0"
                @click="navigateToSinger(singer)"
                >{{ singer.name }}</span
              >
              <span v-else>{{ singer.name }}</span>
              <span class="empty m-x-4">{{
                i === item.ar.length - 1 ? '' : '/'
              }}</span>
            </span>
          </div>
        </div>
      </div>
      <div
        class="album w-30% text-overflow hover:color-#d2d2d2 cursor-pointer"
        @click="navgateToAlbum(item.al.id)"
      >
        {{ item.al.name }}
      </div>
      <div class="pop w-9%" v-if="isPop">
        <progress
          class="progress progress-error w-56"
          :value="item?.pop"
          max="100"
        ></progress>
      </div>
      <div class="handle w-8% flex align-center pl-5">
        <HeartFilled
          id="heart1"
          class="cursor-pointer"
          v-if="isLike"
          @click="setLike"
        />
        <HeartOutlined
          id="heart2"
          class="cursor-pointer"
          v-else
          @click="setLike"
        />
      </div>
      <div class="time w-8%">{{ formatTime(item.dt) }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(#heart1 svg) {
  fill: #eb4141;
}
.song-info {
  width: calc(45% - 50px);
}
.list-item-container {
  &:hover {
    background-color: #ffffff0f !important;
    .id-count {
      opacity: 0;
    }
    .icon {
      opacity: 1;
    }
  }
}
.pop-album {
  transform: translateX(-20%);
}
</style>
