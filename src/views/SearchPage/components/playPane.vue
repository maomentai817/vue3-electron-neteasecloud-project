<script setup>
import paneListItem from './paneListItem.vue'
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps({
  type: {
    type: String,
    default: 'playlist'
  },
  list: {
    type: Array,
    default: () => []
  },
  count: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['loadMore'])
const line = ref(null)
useIntersectionObserver(line, async ([{ isIntersecting }]) => {
  if (isIntersecting) {
    // 触底
    // 判断是否加载完毕
    if (props.list.length < props.count) {
      // 请求下一页
      emit('loadMore', props.type === 'playlist' ? 1000 : 10)
    }
  }
})
// 触底逻辑
</script>

<template>
  <div class="pane-container fd-col">
    <div class="pane-title f-b color-#d2d2d2cc bb-1-#96969611 pb-10 p-x-10">
      <div class="pane-id w-8%">#</div>
      <div class="pane-name f-1">标题</div>
      <template v-if="type === 'playlist'">
        <div class="pane-num w-12%">歌曲数</div>
        <div class="pane-creator w-20%">创建者</div>
        <div class="pane-count w-12%">播放量</div>
      </template>
      <template v-else-if="type === 'album'">
        <div class="pane-artist w-24%">作者</div>
        <div class="pane-publish w-20%">时间</div>
      </template>
    </div>
    <div class="pane-lists fd-col">
      <template v-for="(item, index) in list" :key="index">
        <paneListItem
          :item="item"
          :index="index + 1"
          :type="type"
          :kw="$route.query.keywords"
        />
      </template>
      <div class="line h-1" ref="line"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
