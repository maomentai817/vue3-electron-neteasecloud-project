<script setup>
import { HeartFilled, HeartOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores'
import { computed } from 'vue'

const userStore = useUserStore()

const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  index: {
    type: Number,
    default: 0
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
</script>

<template>
  <div class="list-item-container p-x-20 hover:bg-#ffffff0f! hover:rounded-10">
    <div class="item-content f-s h-70 fs-14 fw-600 color-#969696">
      <div class="id w-45">{{ index.toString().padStart(2, '0') }}</div>
      <div class="title f-c w-45% mr-2% text-overflow">
        <div class="cover-img wh-50 rounded-8 mr-10 bgc-#d2d2d2">
          <!-- <img :src="item.al.picUrl" alt="" class="wh-full rounded-8" /> -->
          <img v-img-lazy="item.al.picUrl" alt="" class="wh-full rounded-8" />
        </div>
        <div class="song-info f-1">
          <div class="song-name color-#d2d2d2 text-overflow">
            {{ item.name }}
          </div>
          <div class="singers f-s">
            <span class="singer" v-for="(singer, i) in item.ar" :key="i">
              <span class="hover:color-#d2d2d2 cursor-pointer">{{
                singer.name
              }}</span>
              <span class="empty m-x-4">{{
                i === item.ar.length - 1 ? '' : '/'
              }}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="album w-35% mr-1% text-overflow">{{ item.al.name }}</div>
      <div class="handle w-55 mr-20 flex align-center pl-5">
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
      <div class="time w-10%">{{ formatTime(item.dt) }}</div>
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
</style>
