<script setup>
import { useRoute, useRouter } from 'vue-router'
import {
  getArtistDetail,
  getArtistAlbum,
  getArtistMv,
  getArtistDesc,
  getArtistSimi
} from '@/api/artist'
import { onMounted, ref, watch } from 'vue'
import { useGlobalStore } from '@/stores'
import { getDominantColor } from '@/utils/getMainColor'
import { useIntersectionObserver } from '@vueuse/core'
import simiSinger from './components/simiSinger.vue'
import mvBox from './components/mvBox.vue'

const globalStore = useGlobalStore()
const route = useRoute()
const artist = ref({})
const activeName = ref('songs')
const pageSize = 20
const page = ref([0, 0, 0, 0])
// const songList = ref([])
// const songTotal = ref(0)
const hotSongs = ref([])

const init = async () => {
  page.value = [0, 0, 0, 0]
  loading.value = false
  activeName.value = 'songs'
  const res = await getArtistDetail(route.query.id)
  artist.value = res.artist
  hotSongs.value = res.hotSongs
  if (artist.value.picUrl) {
    getDominantColor(artist.value.picUrl).then((color) => {
      globalStore.setBackgroundStyle(color)
    })
  }
  // 获取分页专辑数据
  const res1 = await getArtistAlbum(
    route.query.id,
    pageSize,
    page.value[0] * pageSize
  )
  artist.value.albumInfo = res1.hotAlbums
  // 分页获取 MV 数据
  const res2 = await getArtistMv(
    route.query.id,
    pageSize,
    page.value[1] * pageSize
  )
  artist.value.mvInfo = res2.mvs
  // 获取歌手介绍
  const descRes = await getArtistDesc(route.query.id)
  artist.value.desc = descRes
  // 获取相似歌手信息
  const simiRes = await getArtistSimi(route.query.id)
  artist.value.simiArtist = simiRes.artists
  // // 获取歌手全部歌曲
  // const songRes = await getArtistSongs(
  //   route.query.id,
  //   pageSize,
  //   page.value[2] * pageSize
  // )
  // songList.value = songRes.songs
  // songTotal.value = songRes.total
}
onMounted(async () => {
  await init()
})

watch(
  () => route.query.id,
  async () => {
    await init()
  }
)

// 无限滚动
const loading = ref(false)
const albumRef = ref(null)
useIntersectionObserver(albumRef, async ([{ isIntersecting }]) => {
  if (isIntersecting) {
    // 触底
    // 判断是否加载完毕
    if (artist.value.albumInfo?.length < artist.value.albumSize) {
      loading.value = true
      // 请求下一页
      page.value[0] += 1
      const albumRes = await getArtistAlbum(
        route.query.id,
        pageSize,
        page.value[0] * pageSize
      )
      artist.value.albumInfo = [
        ...artist.value.albumInfo,
        ...albumRes.hotAlbums
      ]
      loading.value = false
    }
  }
})
// mv
const mvRef = ref(null)
useIntersectionObserver(mvRef, async ([{ isIntersecting }]) => {
  if (isIntersecting) {
    // 触底
    // 判断是否加载完毕
    if (artist.value.mvInfo?.length < artist.value.mvSize) {
      loading.value = true
      // 请求下一页
      page.value[1] += 1
      const mvRes = await getArtistMv(
        route.query.id,
        pageSize,
        page.value[1] * pageSize
      )
      artist.value.mvInfo = [...artist.value.mvInfo, ...mvRes.mvs]
      loading.value = false
    }
  }
})

const router = useRouter()
// 跳转专辑页面
const navigateToAlbum = (id) => {
  console.log(id)
}
// 跳转 mv 页面
const navigateToMV = (id) => {
  console.log(id)
}
// 跳转歌手个人中心
const navigateToSinger = () => {
  if (artist.value.accountId) {
    router.push(`/user?uid=${artist.value.accountId}`)
  } else {
    ElNotification.warning({
      message: '此歌手暂无网易云音乐账号'
    })
  }
}
</script>

<template>
  <div class="singer-center-contain">
    <div class="singer-card flex rounded-20 duration-400">
      <CardContainer class="wh-full">
        <div class="content flex p-20 fw-600">
          <div class="avatar-box f-c wh-200 rounded-10 bg-#ffffff1a">
            <img :src="artist.picUrl" alt="" class="wh-full rounded-10" />
          </div>
          <div class="singer-detail m-l-30 f-1">
            <div class="name fw-600 mb-10 fs-25">
              <span class="mr-15">{{ artist.name }}</span>
              <span
                class="alias ml-5 fs-18"
                v-for="(item, index) in artist.alias"
                :key="index"
                >{{ item }}
                <span v-if="index < artist.alias.length - 1">/</span>
              </span>
            </div>
            <div class="handle">
              <div class="btn bgi" @click="navigateToSinger()">歌手主页</div>
              <div class="btn" v-if="!artist.followed">关注</div>
              <div class="btn" v-else>已关注</div>
            </div>
            <div class="count mt-15">
              <span class="mr-15" v-if="artist.albumSize"
                >专辑数: {{ artist.albumSize }}</span
              >
              <span class="mr-15" v-if="artist.mvSize"
                >MV数: {{ artist.mvSize }}</span
              >
              <span class="mr-15" v-if="artist.musicSize"
                >单曲数: {{ artist.musicSize }}</span
              >
            </div>
          </div>
        </div>
      </CardContainer>
    </div>
    <div class="list-card m-y-30 m-x-15">
      <CardContainer class="wh-full">
        <div class="list-content p-20 p-t-0">
          <el-tabs v-model="activeName" class="demo-tabs" v-loading="loading">
            <el-tab-pane name="songs">
              <template #label>
                <span>热门单曲</span>
              </template>
              <div class="song-list-container">
                <ListContent :songList="hotSongs"></ListContent>
              </div>
            </el-tab-pane>
            <el-tab-pane name="album">
              <template #label>
                <span>专辑</span>
                <span class="s-count fw-400 fs-12">{{ artist.albumSize }}</span>
              </template>
              <div class="list-container flex flex-wrap justify-start">
                <div
                  class="item w-25%"
                  v-for="(item, index) in artist.albumInfo"
                  :key="index"
                >
                  <musicBox
                    :music="item"
                    :img="item.picUrl"
                    @click="navigateToAlbum(item.id)"
                  ></musicBox>
                </div>
                <div class="album-bottom h-1" ref="albumRef"></div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="MV" name="mv">
              <template #label>
                <span>MV</span>
                <span class="s-count fw-400 fs-12">{{ artist.mvSize }}</span>
              </template>
              <div class="list-container flex flex-wrap justify-start">
                <div
                  class="item w-33%"
                  v-for="(item, index) in artist.mvInfo"
                  :key="index"
                >
                  <mvBox
                    :mv="item"
                    :img="item.imgurl"
                    @click="navigateToMV(item.id)"
                  ></mvBox>
                </div>
                <div class="mv-bottom h-1" ref="mvRef"></div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="歌手详情" name="desc">
              <div class="desc-container fd-col">
                <div class="brief-desc">
                  <div class="desc-title">{{ artist.name }}简介</div>
                  <div class="desc-content">
                    <p
                      class="txt"
                      v-for="(item, index) in artist.desc?.briefDesc.split(
                        '\n'
                      )"
                      :key="index"
                    >
                      {{ item }}
                    </p>
                  </div>
                </div>
                <div class="main-desc">
                  <template
                    v-for="(item, index) in artist.desc?.introduction"
                    :key="index"
                  >
                    <div class="desc-title">{{ item?.ti }}</div>
                    <div class="desc-content">
                      <p
                        class="txt"
                        v-for="(p, i) in item?.txt.split('\n')"
                        :key="i"
                      >
                        {{ p }}
                      </p>
                    </div>
                  </template>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="相似歌手" name="similar">
              <div class="simi-container flex flex-wrap justify-start">
                <div
                  class="item w-25%"
                  v-for="(singer, i) in artist.simiArtist"
                  :key="i"
                >
                  <simiSinger :singer="singer" />
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </CardContainer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.singer-center-contain {
  font-family: 'Orbitron', sans-serif !important;
}
.singer-card {
  width: calc(87vw - 180px);
  margin: 0 auto;
  box-shadow: 0 5px 15px 5px rgb(0 0 0 / 10%);
}
.btn {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid #ffffff33;
  padding: 3px 20px;
  font-size: 18px;
  margin-right: 15px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
.bgi {
  background-image: linear-gradient(#ff1168, #fc3d49);
}
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

.desc-title {
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 18px;
}
.desc-content {
  .txt {
    margin-bottom: 8px;
    color: #d2d2d2cc;
  }
}
:deep(.s-count) {
  transform: translate(30%, -30%);
}
</style>
