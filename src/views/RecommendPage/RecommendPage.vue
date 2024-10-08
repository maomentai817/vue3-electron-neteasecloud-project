<script setup>
import { ref, onMounted } from 'vue'
import {
  getBanner,
  getRecommendResource,
  getRecommendSongs,
  getPersonalized,
  getTopList,
  getTopListDetail,
  getNewSongs
} from '@/api/recommend'
import recommendSwiper from './components/recommendSwiper.vue'
import { useUserStore } from '@/stores'
import { ArrowRightBold, ArrowLeftBold } from '@element-plus/icons-vue'

const bannerList = ref([])
// 每日推荐歌单
const resourceList = ref([])
// 每日推荐歌曲
const songsList = ref([])
// 推荐歌单
const personalizedList = ref([])
// 精选歌单
const topList = ref([])
// 榜单简略数据
const rankList = ref([])
// 推荐新音乐
const newSongs = ref([])

onMounted(async () => {
  try {
    const [res, res2, res3, res4, res5, res6, res7] = await Promise.all([
      getBanner(),
      getRecommendResource(),
      getRecommendSongs(),
      getPersonalized(),
      getTopList(),
      getTopListDetail(),
      getNewSongs(12)
    ])

    // 处理请求结果
    bannerList.value = res?.banners
    resourceList.value = res2?.recommend
    songsList.value = res3?.data?.dailySongs
    // 截断songslist
    const num = Math.floor(songsList?.value.length / 6) * 6
    songsList.value = songsList.value?.slice(0, num)

    personalizedList.value = res4?.result
    topList.value = res5?.playlists
    rankList.value = res6?.list?.filter((item, index) => index < 4)
    newSongs.value = res7?.result
  } catch (error) {
    console.error('Error loading resources:', error)
  }
})

const userStore = useUserStore()

// swiper 切换
const swiper = ref(null)
const scrollLeft = () => {
  swiper.value.prev()
}
const scrollRight = () => {
  swiper.value.next()
}
const swiper1 = ref(null)
const scrollLeft1 = () => {
  swiper1.value.prev()
}
const scrollRight1 = () => {
  swiper1.value.next()
}
</script>

<template>
  <div class="recommend-container fd-col p-x-20 p-b-50">
    <div class="swiper-container mb-10">
      <el-carousel :interval="4000" type="card" class="wh-full" height="200px">
        <el-carousel-item
          v-for="item in bannerList"
          :key="item"
          class="wh-full rounded-12"
        >
          <img :src="item.imageUrl" alt="" class="wh-full rouned-12" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="recommend-floor" v-if="userStore.isLogin">
      <div class="floor">
        <recommendSwiper title="每日推荐" :list="resourceList" />
      </div>

      <div class="floor">
        <recommendSwiper title="精选歌单" :list="topList" />
      </div>
      <div class="floor">
        <div class="re-song-header f-s fw-600 fs-18 mb-15">
          <span>每天听点好音乐</span>
        </div>
        <div class="re-song-content">
          <div class="re-swiper f-c">
            <div class="arrow cursor-pointer" @click="scrollLeft">
              <el-icon><ArrowLeftBold /></el-icon>
            </div>
            <div class="swiper f-1 m-x-15">
              <el-carousel
                arrow="never"
                :loop="false"
                :autoplay="false"
                indicator-position="none"
                ref="swiper"
              >
                <el-carousel-item v-for="i in songsList.length / 6" :key="i">
                  <template v-for="(item, index) in songsList" :key="index">
                    <div
                      class="single-container"
                      v-if="index >= 6 * (i - 1) && index < 6 * i"
                    >
                      <div class="song-box w-50% mb-15">
                        <RecommendSong :item="item"></RecommendSong>
                      </div>
                    </div>
                  </template>
                </el-carousel-item>
              </el-carousel>
            </div>
            <div class="arrow cursor-pointer" @click="scrollRight">
              <el-icon><ArrowRightBold /></el-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="floor">
        <div class="rank-container fd-col">
          <div class="rank-header f-s fw-600 fs-18 mb-15">
            <span>榜单精选</span>
            <el-icon class="f-c ml-5"><ArrowRightBold /> </el-icon>
          </div>
          <div class="rank-content f-b flex-wrap">
            <template v-for="item in rankList" :key="item">
              <div class="rank-box w-50% mb-15">
                <RankItem :item="item" :title="item.name"></RankItem>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="floor">
        <div class="re-song-header f-s fw-600 fs-18 mb-15">
          <span>听点不一样的</span>
        </div>
        <div class="re-song-content">
          <div class="re-swiper f-c">
            <div class="arrow cursor-pointer" @click="scrollLeft1">
              <el-icon><ArrowLeftBold /></el-icon>
            </div>
            <div class="swiper f-1 m-x-15">
              <el-carousel
                arrow="never"
                :loop="false"
                :autoplay="false"
                indicator-position="none"
                ref="swiper1"
              >
                <el-carousel-item v-for="i in newSongs.length / 6" :key="i">
                  <template v-for="(item, index) in newSongs" :key="index">
                    <div
                      class="single-container"
                      v-if="index >= 6 * (i - 1) && index < 6 * i"
                    >
                      <div class="song-box w-50% mb-15">
                        <RecommendSong :item="item.song"></RecommendSong>
                      </div>
                    </div>
                  </template>
                </el-carousel-item>
              </el-carousel>
            </div>
            <div class="arrow cursor-pointer" @click="scrollRight1">
              <el-icon><ArrowRightBold /></el-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="floor">
        <recommendSwiper
          :title="`${userStore.profile.nickname}的雷达歌单`"
          :list="personalizedList"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-carousel__item {
  background-color: transparent;
  display: flex;
  flex-wrap: wrap;
}

.re-swiper {
  svg {
    transform: scaleY(2);
  }
}
.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}
</style>
