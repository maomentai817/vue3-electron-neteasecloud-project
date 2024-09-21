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
  }
})
</script>

<template>
  <div class="list-container">
    <div
      class="list-header fs-14 h-35 color-#969696 flex items-center justify-around p-x-20 fw-600"
    >
      <div class="title-item id w-5%">#</div>
      <div class="title-item title text-overflow w-40%">标题</div>
      <div class="title-item album text-overflow w-30%">专辑</div>
      <div class="title-item pop w-9%" v-if="isPop">热度</div>
      <div class="title-item handle w-8%">操作</div>
      <div class="title-item time w-8%" v-if="!isRecently">时长</div>
      <div class="title-item time w-8%" v-if="isRecently">播放时间</div>
    </div>
    <div class="list-content fd-col" v-loading="loading" v-if="!isRecently">
      <template v-for="(item, index) in songList" :key="index">
        <ListItem
          :item="item"
          :index="index + 1"
          :isPic="isPic"
          :isPop="isPop"
        />
      </template>
    </div>
    <div class="list-content fd-col" v-loading="loading" v-else>
      <template v-for="(item, index) in songList" :key="index">
        <ListItem
          :item="item.data"
          :index="index + 1"
          :isPic="isPic"
          :isPop="isPop"
          :isRecently="isRecently"
          :playTime="item.playTime"
        />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
