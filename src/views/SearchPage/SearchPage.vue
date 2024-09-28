<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { getSearchAllResult, getSearchResult } from '@/api/search'
import { getArtistFollowerCount } from '@/api/artist'
import allPane from './components/allPane.vue'

const route = useRoute()
// 数据
const allResultList = ref([]) // 综合
const songList = ref([]) // 歌曲
const playList = ref([]) // 歌单
const artistList = ref([]) // 歌手
// -- 声音播单暂不提供
const lyricList = ref([]) // 歌词
const albumList = ref([]) // 专辑
const mvList = ref([]) // mv
const userList = ref([]) // 用户

// 分页预备
// const pageSize = 30
const page = ref([0, 0, 0, 0, 0, 0, 0])

const counts = ref([0, 0, 0, 0, 0, 0, 0])
// 定义字典
const typeMap = {
  首单曲: 0,
  个歌单: 1,
  位歌手: 2,
  篇歌词: 3,
  张专辑: 4,
  个MV: 5,
  个用户: 6
}

const activeName = ref('all')
const loading = ref(false)
const init = async (kw) => {
  try {
    const [
      allRes,
      songListRes,
      playListRes,
      artistListRes,
      lyricListRes,
      albumListRes,
      mvListRes,
      userListRes
    ] = await Promise.all([
      getSearchAllResult(kw),
      getSearchResult(kw, 1),
      getSearchResult(kw, 1000),
      getSearchResult(kw, 100),
      getSearchResult(kw, 1006),
      getSearchResult(kw, 10),
      getSearchResult(kw, 1004),
      getSearchResult(kw, 1002)
    ])

    allResultList.value = allRes.result
    counts.value = [
      songListRes.result.songCount,
      playListRes.result.playlistCount,
      artistListRes.result.artistCount,
      lyricListRes.result.songCount,
      albumListRes.result.albumCount,
      mvListRes.result.mvCount,
      userListRes.result.userprofileCount
    ]
    songList.value = songListRes.result.songs
    playList.value = playListRes.result.playlists
    artistList.value = artistListRes.result.artists
    lyricList.value = lyricListRes.result.songs
    albumList.value = albumListRes.result.albums
    mvList.value = mvListRes.result.mvs
    userList.value = userListRes.result.userprofiles
  } catch (error) {
    console.log(error)
  }
}

const followerCount = ref(0)
const artistShow = ref({})
onMounted(async () => {
  loading.value = true
  // 初始化
  activeName.value = 'all'
  page.value = [0, 0, 0, 0, 0, 0, 0]
  const kw = route.query.keywords
  await init(kw)
  // 综合页获取首个歌手粉丝数
  artistShow.value = allResultList.value?.artist?.artists[0]
  const {
    data: { fansCnt }
  } = await getArtistFollowerCount(artistShow.value?.id)
  followerCount.value = fansCnt
  loading.value = false
})

watch(
  () => route.query.keywords,
  async (newVal) => {
    loading.value = true
    await init(newVal)
    // 综合页获取首个歌手粉丝数
    artistShow.value = allResultList.value?.artist?.artists[0]
    const {
      data: { fansCnt }
    } = await getArtistFollowerCount(artistShow.value?.id)
    followerCount.value = fansCnt
    loading.value = false
  }
)

const paneChange = (e) => {
  console.log(e)
  activeName.value = e
}
</script>

<template>
  <div class="search-page-container p-x-40 p-b-50">
    <div class="header mb-15 color-#d2d2d2cc fs-13">
      <span class="kw fw-600 fs-24 color-#fff mr-10">{{
        route.query.keywords
      }}</span>
      <span>的相关搜索如下</span>
      <span
        class="extra"
        v-show="!['all', 'voice', 'video'].includes(activeName)"
        >,找到{{ counts[typeMap[activeName]] }}{{ activeName }}</span
      >
    </div>
    <div class="search-res-content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="综合" name="all">
          <allPane
            :data="allResultList"
            :first="artistShow"
            :follower="followerCount"
            :kw="route.query.keywords"
            :mv="mvList.slice(0, 3)"
            v-loading="loading"
            @pane="paneChange"
          ></allPane>
        </el-tab-pane>
        <el-tab-pane label="单曲" name="首单曲"> </el-tab-pane>
        <el-tab-pane label="歌单" name="个歌单"> </el-tab-pane>
        <el-tab-pane label="歌手" name="位歌手"> </el-tab-pane>
        <el-tab-pane label="声音" name="voice">无 </el-tab-pane>
        <el-tab-pane label="播客" name="video">无 </el-tab-pane>
        <el-tab-pane label="歌词" name="篇歌词"> </el-tab-pane>
        <el-tab-pane label="专辑" name="张专辑"> </el-tab-pane>
        <el-tab-pane label="MV" name="个MV"> </el-tab-pane>
        <el-tab-pane label="用户" name="个用户"> </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tabs__nav-wrap) {
  &::after {
    height: 0;
  }
}
:deep(.el-tabs__item) {
  font-size: 16px;
  color: #969696;
  &.is-active {
    color: #fff;
    font-size: 18px;
    font-weight: 800;
  }
}
:deep(.el-tabs__active-bar) {
  background-color: #ec4141;
  height: 2px;
}
:deep(.el-loading-mask) {
  background-color: transparent;
}
</style>
