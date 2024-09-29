<script setup>
import { useRoute, useRouter } from 'vue-router'
import { getPlayListDetail, getSongListDetail } from '@/api/music'
import { watch, ref, onMounted } from 'vue'
import { formatTimestamp, formatNumber } from '@/utils/format'
import { useIntersectionObserver } from '@vueuse/core'
import { getDominantColor } from '@/utils/getMainColor'
import { useGlobalStore } from '@/stores'

const globalStore = useGlobalStore()
const route = useRoute()
const router = useRouter()
const playList = ref([])
// 分页获取歌单详情
const pageSize = 50
const page = ref(0)
const songList = ref([])
// loading
const loading = ref(false)
// 抽离请求函数
const init = async (id) => {
  try {
    loading.value = true
    // 页面挂载时,先行获取歌曲数据
    // 切换歌单重新获取数据
    page.value = 0
    songList.value = []
    const [playlistRes, songRes] = await Promise.all([
      getPlayListDetail(id),
      getSongListDetail(id, 0, pageSize)
    ])
    playList.value = playlistRes.playlist
    songList.value = songRes.songs
    loading.value = false
    // 设置主色
    if (playList.value.coverImgUrl) {
      getDominantColor(playList.value.coverImgUrl).then((color) => {
        globalStore.setBackgroundStyle(color)
      })
    }
  } catch (error) {
    console.error('xixi', error)
  }
}

onMounted(async () => {
  await init(route.query.id)
})
watch(
  () => route.query,
  async (newVal) => {
    if (newVal) {
      await init(newVal.id)
    }
  }
)
// 无限滚动
const listBottom = ref(null)
useIntersectionObserver(listBottom, async ([{ isIntersecting }]) => {
  if (isIntersecting) {
    // 触底
    // 判断是否加载完毕
    if (songList.value.length < playList.value.trackCount) {
      loading.value = true
      // 请求下一页
      page.value += 1
      const songRes = await getSongListDetail(
        route.query.id,
        page.value * pageSize,
        pageSize
      )
      songList.value = [...songList.value, ...songRes.songs]
      loading.value = false
    }
  }
})

// 跳转歌单创建者中心
const navigateToUserCenter = (id) => {
  router.push(`/user?uid=${id}`)
}
</script>

<template>
  <div
    class="play-list-container fd-col duration-1000 wh-full overflow-hidden overflow-y-auto"
  >
    <div class="play-list-header p-x-35 flex">
      <div class="cover-img wh-220 rounded-10 relative bgc-#d2d2d2">
        <img :src="playList.coverImgUrl" alt="" class="wh-full rounded-10" />
        <span class="count absolute top-8 right-10 fs-15 fw-600 color-#fff">
          {{ formatNumber(playList.playCount) }}
        </span>
      </div>
      <div class="play-list-info m-l-20 fd-col m-t-5 f-1 justify-around">
        <div class="songs-name f-s">
          <div
            class="tag fs-13 color-#ec4141 rounded-3 p-x-5 bo-#ec4141 fw-600"
          >
            歌单
          </div>
          <div class="name ml-10 fs-25 fw-600 color-#fff">
            {{ playList.name }}
          </div>
        </div>
        <div class="songs-desc m-y-10" v-if="playList.description">
          {{ playList.description }}
        </div>
        <div class="songs-info f-s fs-12 m-t-5">
          <div class="creator-avatar wh-25 rounded-50%">
            <img
              :src="playList?.creator?.avatarUrl"
              alt=""
              class="wh-full rounded-50"
            />
          </div>
          <div class="creator-info m-l-10 flex fw-600">
            <div
              class="creator-name color-#85b9e6 cursor-pointer hover: color-#96c8e6"
              @click="navigateToUserCenter(playList?.creator?.userId)"
            >
              {{ playList?.creator?.nickname }}
            </div>
            <div class="creator-create-time ml-10">
              {{ formatTimestamp(playList.createTime) }} 创建
            </div>
          </div>
        </div>
        <div class="songs-handle m-t-10">
          <div class="btn-group1">
            <div class="btn bgi ml-0!">播放全部</div>
            <div class="btn">收藏</div>
            <div class="btn">分享</div>
            <div class="btn">下载全部</div>
          </div>
        </div>
      </div>
    </div>
    <div class="play-list-content f-1 p-35" ref="playListContent">
      <ListContent :songList="songList" :loading="loading" />
      <div class="bottom h-1" ref="listBottom"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  margin-left: 10px;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid #ffffff33;
  padding: 3px 20px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
.bgi {
  background-image: linear-gradient(#ff1168, #fc3d49);
}
:deep(.el-loading-mask) {
  background-color: transparent;
}
.play-list-container {
  scrollbar-width: none;
  &:state(webkit-scrollbar) {
    display: none;
  }
}
.songs-desc {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 限定显示的行数，2 行为示例 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分用省略号表示 */
}
</style>
