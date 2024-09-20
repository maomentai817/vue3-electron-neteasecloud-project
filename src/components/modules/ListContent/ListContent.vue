<script setup>
import ListItem from '../ListItem/ListItem.vue'
defineProps({
  songList: {
    type: Object,
    default: () => {}
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="list-container">
    <div
      class="list-header fs-14 h-35 color-#969696 flex items-center justify-around p-x-20 fw-600"
    >
      <div class="title-item id w-45">#</div>
      <div class="title-item title text-overflow m-r-2% w-45%">标题</div>
      <div class="title-item album text-overflow m-r-1% w-35%">专辑</div>
      <div class="title-item handle w-55 m-r-20">操作</div>
      <div class="title-item time w-10%">时长</div>
    </div>
    <div class="list-content fd-col" v-loading="loading">
      <template v-for="(item, index) in songList" :key="index">
        <ListItem :item="item" :index="index + 1" />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
q {
  background-color: #ffffff0f !important
  ;
}
</style>
