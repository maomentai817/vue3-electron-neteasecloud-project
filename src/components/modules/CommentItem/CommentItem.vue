<script setup>
import { LikeOutlined } from '@ant-design/icons-vue'
import { Share, ChatLineRound } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

defineProps({
  comment: {
    type: Object,
    default: () => {}
  }
})

// 跳转用户中心
const router = useRouter()
const navgateToUserCenter = (uid) => {
  router.push(`/user?uid=${uid}`)
}
</script>

<template>
  <div class="comment-item-container flex p-t-20 p-b-15 bb-1-#ffffff1a">
    <div class="left mr-15">
      <div
        class="user-avatar wh-50 rounded-50% bg-#d2d2d2 cursor-pointer"
        @click="navgateToUserCenter(comment.user?.userId)"
      >
        <img
          v-img-lazy="comment.user?.avatarUrl"
          alt=""
          class="wh-full rounded-50%"
        />
      </div>
    </div>
    <div class="right f-1">
      <div class="user-name f-s">
        <span
          class="color-#9875b2 cursor-pointer"
          @click="navgateToUserCenter(comment.user?.userId)"
          >{{ comment.user?.nickname }}</span
        >
        <div
          class="vip h-20 ml-10"
          v-if="comment.user?.vipRights?.associator?.iconUrl"
        >
          <img
            :src="comment.user?.vipRights?.associator?.iconUrl"
            alt=""
            class="wh-full"
          />
        </div>
      </div>
      <div class="comment-content m-b-15 m-t-10 fs-16 fd-col">
        <span class="mb-10">{{ comment.content }}</span>
        <span
          class="floor flex bl-1-#ffffff1f pl-10"
          v-if="comment.beReplied && comment.beReplied.length"
        >
          <div
            class="name color-#5975b2 cursor-pointer"
            @click="navgateToUserCenter(comment.beReplied[0]?.user?.userId)"
          >
            @{{ comment.beReplied[0]?.user?.nickname }}
          </div>
          <div class="content ml-10 color-#d2d2d2cc f-1">
            {{ comment.beReplied[0]?.content }}
          </div>
        </span>
      </div>
      <div class="footer1 f-b color-#d2d2d2cc">
        <div class="time fs-12">
          <span class="mr-8">{{ comment.timeStr }}</span>
          <span>{{ comment.ipLocation.location }}</span>
        </div>
        <div class="handle f-e mr-20">
          <div class="like f-c ml-15">
            <div class="count fs-12 text-center mr-5 f-c">
              {{ comment.likedCount }}
            </div>
            <LikeOutlined class="item" />
          </div>
          <div class="share f-c ml-15">
            <el-icon class="item"><Share /></el-icon>
          </div>
          <div class="reply f-c ml-15">
            <el-icon class="item"><ChatLineRound /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item {
  cursor: pointer;
  &:hover {
    color: #fff;
  }
}
</style>
