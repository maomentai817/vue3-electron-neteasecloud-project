<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  index: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    default: ''
  },
  playtime: {
    type: Number,
    default: 0
  }
})
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

// 相关路由跳转
const router = useRouter()
const navigateToUser = (uid) => {
  router.push(`/user?uid=${uid}`)
}

const navigateTo = (id) => {
  if (props.type === 'album') router.push(`/album?id=${id}`)
  else if (props.type === 'playlist') router.push(`/play-list?id=${id}`)
}

const navigateToSinger = (id) => {
  router.push(`/singer?id=${id}`)
}
</script>

<template>
  <div class="re-item-container p-x-20 rounded-10">
    <div class="item-content f-a h-70 fs-14 fw-600 color-#969696">
      <div class="title-item id w-8% pl-10 relative">
        <span class="id-count opacity-100">{{
          index.toString().padStart(2, '0')
        }}</span>
        <span class="icon absolute top-0 left-10 opacity-0">
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
      <div
        class="title-item title text-overflow f-1 f-s cursor-pointer"
        @click="navigateTo(item.id)"
      >
        <div class="cover-img wh-50 rounded-8 mr-10 bgc-#d2d2d2">
          <img
            v-img-lazy="item.coverImgUrl"
            alt=""
            class="wh-full rounded-8"
            v-if="type === 'playlist'"
          />
          <img v-img-lazy="item.picUrl" alt="" class="wh-full rounded-8" />
        </div>
        <div class="info fw-600 hover:color-#d2d2d2">{{ item.name }}</div>
      </div>
      <div
        class="djer w-13% hover:color-#d2d2d2"
        v-if="type === 'dj'"
        @click="navigateToUser(item.dj?.userId)"
      >
        {{
          item.dj?.nickname === '因合作方要求该用户暂时下架'
            ? '封禁用户'
            : item.dj?.nickname
        }}
      </div>
      <div class="duation w-13%" v-if="type === 'dj'">
        {{ item.programCount }}个
      </div>
      <div
        class="count w-20% cursor-pointer hover:color-#d2d2d2"
        @click="navigateToUser(item.creator?.userId)"
        v-if="type === 'playlist'"
      >
        {{ item.creator?.nickname }}
      </div>
      <div
        class="author w-13% hover:color-#d2d2d2"
        v-if="type === 'album'"
        @click="navigateToSinger(item.artist?.id)"
      >
        {{ item.artist?.name }}
      </div>
      <div class="title-item playtime w-13% pl-5">{{ timeAgo(playtime) }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.re-item-container {
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
</style>
