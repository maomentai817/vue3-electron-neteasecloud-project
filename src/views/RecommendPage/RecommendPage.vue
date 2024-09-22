<script setup>
import { ref, onMounted } from 'vue'
import {
  getBanner,
  getRecommendResource,
  getRecommendSongs,
  getPersonalized,
  getTopList,
  getTopListDetail
} from '@/api/recommend'
import recommendSwiper from './components/recommendSwiper.vue'
import { useUserStore } from '@/stores'
import { ArrowRightBold } from '@element-plus/icons-vue'

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
onMounted(async () => {
  const res = await getBanner()
  bannerList.value = res.banners
  const res2 = await getRecommendResource()
  resourceList.value = res2.recommend
  const res3 = await getRecommendSongs()
  songsList.value = res3.data.dailySongs
  const res4 = await getPersonalized()
  personalizedList.value = res4.result
  const res5 = await getTopList()
  topList.value = res5.playlists

  const res6 = await getTopListDetail()
  rankList.value = res6.list.filter((item, index) => index < 4)
})

const userStore = useUserStore()
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
    <div class="recommend-floor">
      <div class="floor">
        <recommendSwiper title="每日推荐" :list="resourceList" />
      </div>

      <div class="floor">
        <recommendSwiper title="精选歌单" :list="topList" />
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
        <recommendSwiper
          :title="`${userStore.profile.nickname}的雷达歌单`"
          :list="personalizedList"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
