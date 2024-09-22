<script setup>
import recentItem from './recentItem.vue'

defineProps({
  type: {
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
  <div class="re-container">
    <div
      class="re-header fs-14 h-35 color-#969696 flex items-center justify-around p-x-20 fw-600"
    >
      <div class="title-item id w-8% pl-10">#</div>
      <div class="title-item title text-overflow f-1">标题</div>
      <div class="djer w-13%" v-if="type === 'dj'">主播</div>
      <div class="duation w-13%" v-if="type === 'dj'">声音数</div>
      <div class="count w-20%" v-if="type === 'playlist'">创建者</div>
      <div class="author w-13%" v-if="type === 'album'">作者</div>
      <div class="title-item playtime w-13%">播放日期</div>
    </div>
    <div class="re-content fd-col">
      <template v-for="(item, index) in list" :key="index">
        <recentItem
          :item="item.data"
          :index="index + 1"
          :type="type"
          :playtime="item.playTime"
        />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
