<script setup>
import swiperItem from './swiperItem.vue'
import { ref } from 'vue'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  list: {
    type: Array,
    default: () => []
  }
})

// 控制键
const carousel = ref(null)
const scrollLeft = () => {
  carousel.value.scrollLeft -= carousel.value.offsetWidth / 2
}
const scrollRight = () => {
  carousel.value.scrollLeft += carousel.value.offsetWidth / 2
}
</script>

<template>
  <div class="re-container fd-col m-y-20">
    <div class="re-header fs-18 mb-15">{{ title }}</div>
    <div class="re-swiper f-b">
      <div class="arrow cursor-pointer" @click="scrollLeft">
        <el-icon><ArrowLeftBold /></el-icon>
      </div>
      <div
        class="carousel carousel-center rounded-box f-s w-full m-x-12"
        ref="carousel"
      >
        <div
          class="carousel-item w-20%"
          v-for="(item, index) in list"
          :key="index"
        >
          <swiperItem
            :item="item"
            :img="item.picUrl ? item.picUrl : item.coverImgUrl"
            :idx="index"
          />
        </div>
      </div>
      <div class="arrow cursor-pointer" @click="scrollRight">
        <el-icon><ArrowRightBold /></el-icon>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
svg {
  transform: scaleY(2);
}
</style>
