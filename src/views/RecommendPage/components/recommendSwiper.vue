<script setup>
import swiperItem from './swiperItem.vue'

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
</script>

<template>
  <div class="re-container fd-col m-y-20">
    <div class="re-header fs-18 mb-15">{{ title }}</div>
    <div class="re-swiper">
      <div class="carousel carousel-center rounded-box f-s w-full">
        <div class="carousel-item w-20%" v-for="item in list" :key="item">
          <swiperItem
            :item="item"
            :img="item.picUrl ? item.picUrl : item.coverImgUrl"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
