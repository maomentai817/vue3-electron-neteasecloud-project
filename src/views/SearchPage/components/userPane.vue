<script setup>
import userItem from './userItem.vue'
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
      emit('loadMore', 1002)
    }
  }
})
</script>

<template>
  <div class="user-pane-container">
    <div class="user-pane-content flex flex-wrap">
      <template v-for="(item, index) in list" :key="index">
        <div class="user-item-container w-25%">
          <userItem
            :user="item"
            :kw="$route.query.keywords"
            @click="$router.push(`/user?uid=${item.userId}`)"
          />
        </div>
      </template>
      <div class="line h-1" ref="line"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
