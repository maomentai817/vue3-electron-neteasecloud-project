<script setup>
import { useRouter } from 'vue-router'

defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  title: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const navigateToPlaylist = (id) => {
  router.push(`/play-list?id=${id}`)
}
</script>

<template>
  <div
    class="rank-item-container rounded-15 bg-#ffffff1f p-x-20 p-y-15 m-x-15 overflow-hidden cursor-pointer"
    @click="navigateToPlaylist(item.id)"
  >
    <div class="rank-item-header f-b mb-10">
      <div class="title fw-600 fs-20">{{ title }}</div>
      <div class="status fs-13 color-#d2d2d2cc">{{ item.updateFrequency }}</div>
    </div>
    <div class="rank-item-content f-a w-full">
      <div class="cover-img wh-120 rounded-20 flex-shrink-0">
        <img :src="item.coverImgUrl" alt="" class="wh-full rounded-20" />
      </div>
      <div class="rank ml-20 fd-col h-120 f-1 justify-between p-y-10">
        <template v-for="(item, index) in item.tracks" :key="index">
          <div class="list-single f-s">
            <div class="id w-20 flex-shrink-0 fw-600">{{ index + 1 }}</div>
            <div class="name flex-shrink-0">{{ item.first }}&nbsp;-&nbsp;</div>
            <div class="author text-overflow color-#d2d2d29f">
              {{ item.second }}
            </div>
          </div>
        </template>
      </div>
      <div class="empty w-5% h-120 flex-shrink-0"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
