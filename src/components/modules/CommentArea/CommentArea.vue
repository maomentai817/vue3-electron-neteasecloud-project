<script setup>
import { ref, onMounted } from 'vue'
import { getCommentList, getHotComment } from '@/api/comment'
import CommentItem from '../CommentItem/CommentItem.vue'
import { ArrowRightBold } from '@element-plus/icons-vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useRouter } from 'vue-router'

const props = defineProps({
  isBrief: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: '0'
  },
  id: {
    type: String,
    default: ''
  }
})

const comments = ref([])
const page = ref(1)
const pageSize = 20
const total = ref(0)
const init = async (page) => {
  const cursor = comments.value.length
    ? comments.value[comments.value.length - 1].time
    : 0
  // 优先判断评论抓取种类
  if (props.title === '精彩评论') {
    const res = await getHotComment(
      props.id,
      props.type,
      cursor,
      page - 1,
      pageSize
    )
    comments.value = [...comments.value, ...res.hotComments]
    total.value = res.total
  }
  if (props.title === '最新评论') {
    const res = await getCommentList(
      props.id,
      props.type,
      cursor,
      pageSize,
      page,
      3
    )
    comments.value = [...comments.value, ...res.data.comments]
    total.value = res.data.totalCount
  }
}

onMounted(() => {
  page.value = 1
  comments.value = []
  total.value = 0
  init(page.value)
})

// 无限滚动
const bottomLine = ref(false)
useIntersectionObserver(bottomLine, async ([{ isIntersecting }]) => {
  if (isIntersecting) {
    // 触底
    // 判断是否加载完毕
    if (comments.value.length < total.value) {
      // 请求下一页
      page.value += 1
      await init(page.value)
    }
  }
})

const router = useRouter()
const navigateToWholeComment = () => {
  router.push({
    path: '/comment',
    query: {
      id: props.id,
      type: props.type,
      title: props.title
    }
  })
}
</script>

<template>
  <div class="comments-container" v-if="comments.length">
    <div class="comment-title relative">
      <span class="title fs-18 fw-600 color-#fff">{{ title }}</span>
      <span
        class="count fw-400 fs-12 translate-y--20% absolute"
        v-if="!isBrief"
        >{{ total }}</span
      >
    </div>
    <div class="comments-content fd-col">
      <template v-for="(comment, index) in comments" :key="index">
        <template v-if="isBrief">
          <template v-if="index < 10">
            <CommentItem :comment="comment"></CommentItem>
          </template>
        </template>
        <template v-else>
          <CommentItem :comment="comment"></CommentItem>
        </template>
      </template>
    </div>
    <div class="comment-footer f-c my-20" v-if="isBrief">
      <div class="btn f-c" @click="navigateToWholeComment">
        <span class="txt">更多{{ title }}</span>
        <el-icon><ArrowRightBold /></el-icon>
      </div>
    </div>
    <div class="bottom-line h-1" ref="bottomLine" v-if="!isBrief"></div>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid #ffffff33;
  padding: 0 15px;
  font-size: 14px;
  margin-right: 15px;
  border-radius: 25px;
  gap: 0;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
