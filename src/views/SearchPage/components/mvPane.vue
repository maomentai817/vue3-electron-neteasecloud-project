<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import mvBox from '@/views/SingerCenter/components/mvBox.vue'

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
      emit('loadMore', 1004)
    }
  }
})
</script>

<template>
  <div class="mv-pane-container">
    <div class="mv-pane-content flex flex-wrap">
      <template v-for="(item, i) in list" :key="i">
        <div class="mv-pane-item w-33%">
          <mvBox
            :mv="item"
            :img="item?.cover"
            :kw="$route.query.keywords"
            @click="$router.push(`/mv?id=${item.id}`)"
          />
        </div>
      </template>
      <div class="line h-1" ref="line"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
