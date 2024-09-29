<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  count: {
    type: Number,
    default: 0
  }
})

// 触底
const line = ref(null)
const emit = defineEmits(['loadMore'])
useIntersectionObserver(line, async ([{ isIntersecting }]) => {
  if (isIntersecting) {
    // 触底
    // 判断是否加载完毕
    if (props.list.length < props.count) {
      // 请求下一页
      emit('loadMore', 1)
    }
  }
})
</script>

<template>
  <div class="songs-pane">
    <ListContent :songList="list"></ListContent>
    <div class="line h-1" ref="line"></div>
  </div>
</template>

<style lang="scss" scoped></style>
