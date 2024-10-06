<script setup>
import { HeartFilled, HeartOutlined } from '@ant-design/icons-vue'
import { useUserStore, useMusicStore } from '@/stores'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { highlight } from '@/utils/format'

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
  },
  isRecently: {
    type: Boolean,
    default: false
  },
  playTime: {
    type: Number,
    default: 0
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

// 时间处理函数
const timeAgo = (timestamp) => {
  const now = Date.now()
  const diffInSeconds = Math.floor((now - timestamp) / 1000)

  const units = [
    { name: '年', seconds: 365 * 24 * 60 * 60 },
    { name: '月', seconds: 30 * 24 * 60 * 60 },
    { name: '天', seconds: 24 * 60 * 60 },
    { name: '小时', seconds: 60 * 60 },
    { name: '分钟', seconds: 60 },
    { name: '秒', seconds: 1 }
  ]

  for (const unit of units) {
    const value = Math.floor(diffInSeconds / unit.seconds)
    if (value >= 1) {
      return `${value} ${unit.name}前`
    }
  }

  return '刚刚' // 如果时间戳是现在或未来，则返回“刚刚”
}

// 播放
const musicStore = useMusicStore()
const selectFlag = computed(() => {
  return props.item?.id === musicStore.songInfo.id
})
const open = () => {
  window.$player.show(props.item?.id)
}

const navigateToMV = (id) => {
  router.push(`/mv?id=${id}`)
}

const playingIcon = ref(true)
setInterval(() => {
  playingIcon.value = !playingIcon.value
}, 400)
</script>

<template>
  <div class="list-item-container p-x-20 rounded-10" @dblclick="open">
    <div class="item-content f-a h-70 fs-14 fw-600 color-#969696">
      <div class="id w-5% relative">
        <span
          class="id-count opacity-100"
          v-show="!selectFlag || musicStore.stop"
          >{{ index.toString().padStart(2, '0') }}</span
        >
        <span
          class="icon absolute top-0 left-0 opacity-0"
          v-show="!selectFlag || musicStore.stop"
        >
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
        <span v-show="selectFlag && !musicStore.stop">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            v-show="playingIcon"
          >
            <g id="voice_2_line" fill="none" fill-rule="evenodd">
              <path
                d="M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z"
              />
              <path
                fill="#FF6252FF"
                d="M20 4a1 1 0 0 1 1 1v14a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1M10 7a1 1 0 0 1 1 1v11a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1m5 3a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0v-8a1 1 0 0 1 1-1M5 13a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1"
              />
            </g>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            v-show="!playingIcon"
          >
            <g id="voice_line" fill="none">
              <path
                d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z"
              />
              <path
                fill="#FF6252FF"
                d="M12 3a1 1 0 0 1 .993.883L13 4v16a1 1 0 0 1-1.993.117L11 20V4a1 1 0 0 1 1-1M8 6a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1m8 0a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1M4 9a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1m16 0a1 1 0 0 1 .993.883L21 10v4a1 1 0 0 1-1.993.117L19 14v-4a1 1 0 0 1 1-1"
              />
            </g>
          </svg>
        </span>
      </div>
      <div class="title f-c w-40% text-overflow">
        <div class="cover-img wh-50 rounded-8 mr-10 bgc-#d2d2d2" v-if="isPic">
          <img v-img-lazy="item.al?.picUrl" alt="" class="wh-full rounded-8" />
        </div>
        <div class="song-info f-1">
          <div class="song-name color-#d2d2d2 text-overflow">
            <span
              v-html="highlight(item.name, kw)"
              :class="selectFlag ? 'playing' : ''"
            ></span>
          </div>
          <div class="singers f-s" :class="selectFlag ? 'playing' : ''">
            <span class="f-s color-#ff3a3a">
              <div
                class="vip fs-11 rounded-3 bo-#ec4141 mr-5 p-x-2"
                v-if="item?.fee === 1"
              >
                vip
              </div>
              <div
                class="mv fs-11 rounded-3 bo-#ec4141 mr-5 p-x-2 cp"
                v-if="item?.mv !== 0"
                @click.stop="navigateToMV(item.mv)"
              >
                mv&#9654;
              </div>
              <div
                class="origin fs-11 rounded-3 bo-#ec4141 mr-5 p-x-2"
                v-if="item?.originCoverType === 1"
              >
                原唱
              </div>
            </span>
            <span class="singer" v-for="(singer, i) in item.ar" :key="i">
              <span
                class="hover:color-#d2d2d2 cursor-pointer fs-13 fw-500"
                v-if="singer.id !== 0"
                @click="navigateToSinger(singer)"
                v-html="highlight(singer.name, kw)"
              ></span>
              <span v-else v-html="highlight(singer.name, kw)"></span>
              <span class="empty m-x-4">{{
                i === item.ar.length - 1 ? '' : '/'
              }}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="album w-30% text-overflow hover:color-#d2d2d2 cursor-pointer">
        <span
          v-html="highlight(item.al.name, kw)"
          @click="navgateToAlbum(item.al.id)"
        ></span>
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
      <div class="time w-8%" v-if="!isRecently">{{ formatTime(item.dt) }}</div>
      <div class="time w-8% fs-13" v-if="isRecently">
        {{ timeAgo(playTime) }}
      </div>
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
.playing {
  color: #fc3d49 !important;
}
</style>
