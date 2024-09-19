<script setup>
import { useRoute } from 'vue-router'
import { getArtistDetail } from '@/api/artist'
import { onMounted, ref } from 'vue'
import { useGlobalStore } from '@/stores'
import { getDominantColor } from '@/utils/getMainColor'

const globalStore = useGlobalStore()
const route = useRoute()
const artist = ref({})
const hotSongs = ref([])
onMounted(async () => {
  const res = await getArtistDetail(route.query.id)
  artist.value = res.artist
  hotSongs.value = res.hotSongs
  // console.log(artist.value)
  if (artist.value.picUrl) {
    getDominantColor(artist.value.picUrl).then((color) => {
      globalStore.setBackgroundStyle(color)
    })
  }
})
</script>

<template>
  <div class="singer-center-contain">
    <div class="singer-card flex rounded-20 duration-400">
      <CardContainer class="wh-full">
        <div class="content f-a p-20 fw-600">
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
              <div class="btn" v-if="!artist.followed">关注</div>
              <div class="btn" v-else>已关注</div>
            </div>
            <div class="count mt-15">
              <span class="mr-15" v-if="artist.albumSize"
                >专辑数: {{ artist.albumSize }}</span
              >
              <span class="mr-15" v-if="artist.mvSize"
                >MV 数: {{ artist.mvSize }}</span
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
          <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="专辑" name="album">
              <div class="list-container flex flex-wrap justify-start">
                <div
                  class="item w-25%"
                  v-for="(item, index) in playListInfo"
                  :key="index"
                  v-show="!item.subscribed"
                  @click="navigateToList(item)"
                >
                  <musicBox :music="item"></musicBox>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="MV" name="mv">
              <div class="list-container flex flex-wrap justify-start">
                <div
                  class="item w-25%"
                  v-for="(item, index) in playListInfo"
                  :key="index"
                  v-show="item.subscribed"
                  @click="navigateToList(item)"
                >
                  <musicBox :music="item"></musicBox>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="歌手详情" name="desc"> </el-tab-pane>
            <el-tab-pane label="相似歌手" name="similar"> </el-tab-pane>
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
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
