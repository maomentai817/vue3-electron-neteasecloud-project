<script setup>
import { useRoute } from 'vue-router'
import { getPlayListDetail } from '@/api/music'
import { watch, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { formatTimestamp } from '@/utils/formatTimestamp'

const userStore = useUserStore()
const playShortInfo = ref({})
const route = useRoute()
const playList = ref([])
onMounted(async () => {
  playShortInfo.value = userStore.userPlayListInfo.filter(
    (item) => +item.id === +route.query.id
  )[0]
  const res = await getPlayListDetail(route.query.id)
  playList.value = res.playlist
  console.log(playShortInfo)
})
watch(
  () => route.query,
  async (newVal) => {
    if (newVal) {
      playShortInfo.value = userStore.userPlayListInfo.filter(
        (item) => +item.id === +newVal.id
      )[0]
      const res = await getPlayListDetail(newVal.id)
      playList.value = res.playlist
    }
    console.log(playShortInfo)
  }
)
</script>

<template>
  <div class="play-list-container fd-col duration-1000">
    <div class="play-list-header p-x-35 flex">
      <div class="cover-img wh-220 rounded-10">
        <img
          :src="playShortInfo.coverImgUrl"
          alt=""
          class="wh-full rounded-10"
        />
        {{ playShortInfo }}
      </div>
      <div class="play-list-info m-l-20 fd-col m-t-5">
        <div class="songs-name f-s">
          <div
            class="tag fs-13 color-#ec4141 rounded-3 p-x-5 bo-#ec4141 fw-600"
          >
            歌单
          </div>
          <div class="name ml-10 fs-25 fw-600 color-#fff">
            {{ playShortInfo.name }}
          </div>
        </div>
        <div class="songs-info f-s fs-12 m-t-5">
          <div class="creator-avatar wh-25 rounded-50%">
            <img
              :src="playShortInfo?.creator?.avatarUrl"
              alt=""
              class="wh-full rounded-50"
            />
          </div>
          <div class="creator-info m-l-10 flex fw-600">
            <div
              class="creator-name color-#85b9e6 cursor-pointer hover: color-#96c8e6"
            >
              {{ playShortInfo?.creator?.nickname }}
            </div>
            <div class="creator-create-time ml-10">
              {{ formatTimestamp(playShortInfo.createTime) }} 创建
            </div>
          </div>
        </div>
        <div class="songs-handle m-t-10">
          <div class="btn-group1">
            <div class="btn bgi">播放全部</div>
            <div class="btn">创建</div>
            <div class="btn">分享</div>
            <div class="btn">下载全部</div>
          </div>
        </div>
      </div>
    </div>
    <div class="play-list-content f-1">歌单</div>
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
</style>
