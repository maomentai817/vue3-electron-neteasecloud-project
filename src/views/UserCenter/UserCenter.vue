<script setup>
import { useUserStore, useGlobalStore } from '@/stores'
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getDominantColor } from '@/utils/getMainColor'
import { getUserPlayList } from '@/api/music'
import { getUserDetail } from '@/api/user'

const activeName = ref('created')
const userStore = useUserStore()
const globalStore = useGlobalStore()

const router = useRouter()
const navigateToList = (item) => {
  // 使用正则表达式匹配以'喜欢的音乐'结尾的名称
  const like = /喜欢的音乐$/.test(item.name)

  // 路由跳转，并传递 `id`、`trackCount` 以及 `like` 参数
  router.push(`/play-list?id=${item.id}&count=${item.trackCount}&like=${like}`)

  // 如果有封面图片，提取主色调并设置背景样式
  if (item.coverImgUrl) {
    getDominantColor(item.coverImgUrl).then((color) => {
      globalStore.setBackgroundStyle(color)
    })
  }
}

// 他人用户中心
const route = useRoute()
const playListInfo = ref([])
const userInfo = ref({})

const init = async () => {
  if (+route.query.uid !== userStore.profile.userId) {
    const { playlist } = await getUserPlayList(+route.query.uid)
    playListInfo.value = playlist
    const res = await getUserDetail(+route.query.uid)
    userInfo.value = res.profile
    userInfo.value.level = res.level
  } else {
    playListInfo.value = userStore.userPlayListInfo
    userInfo.value = userStore.userInfo.profile
    userInfo.value.level = userStore.userInfo.level
  }
  // 获取省份信息
  userInfo.value.cityName = await userStore.parseCode(userInfo.value.city)
  userInfo.value.provinceName = await userStore.parseCode(
    userInfo.value.province
  )
  if (userInfo.value.avatarUrl) {
    getDominantColor(userInfo.value.avatarUrl).then((color) => {
      globalStore.setBackgroundStyle(color)
    })
  }
}
onMounted(async () => {
  await init()
})
// 从他人用户页跳转本人用户中心
watch(
  () => route.query.uid,
  async () => {
    await init()
  }
)
//跳转歌手页
const navigateToSinger = () => {
  if (userInfo.value.artistId) {
    router.push(`/singer?id=${userInfo.value.artistId}`)
  } else {
    ElNotification.warning('该用户非入驻歌手')
  }
}
</script>

<template>
  <div class="user-center-container">
    <div class="user-card flex rounded-20">
      <CardContainer class="wh-full">
        <div class="content flex p-x-20 p-t-20 fw-600">
          <div class="avatar-box f-c wh-200 rounded-50% bg-#ffffff1a">
            <div
              class="avatar rounded-50%"
              :style="{
                backgroundImage: `url(${userInfo.avatarUrl})`
              }"
            ></div>
          </div>
          <div class="user-detail m-l-30 f-1">
            <div class="top-contain f-b">
              <div class="vip-info fd-col">
                <h2 class="name fs-22 m-b-15">
                  {{ userInfo.nickname }}
                </h2>
                <div class="level f-e fs-12 color-#13131a">
                  <span class="bg-#f0f0f0 rounded-10 p-x-7 p-y-1 fw-700"
                    >Lv{{ userInfo.level }}</span
                  >
                </div>
              </div>
              <div class="btn-group-container flex items-end">
                <div class="btn" @click="navigateToSinger">歌手页</div>
                <div class="btn">发私信</div>
                <div class="btn">已关注</div>
              </div>
            </div>
            <div class="line h-1 m-y-15 bgc-#ffffff1f w-full"></div>
            <div class="bottom-container fd-col">
              <div class="info-count f-s h-50">
                <div class="dynamic info">
                  <div class="count">
                    {{ userInfo.eventCount }}
                  </div>
                  <div class="title">动态</div>
                </div>
                <div class="line w-1 bgc-#ffffff1f! h-full m-x-20"></div>
                <div class="follow info">
                  <div class="count">
                    {{ userInfo.newFollows }}
                  </div>
                  <div class="title">关注</div>
                </div>
                <div class="line w-1 bgc-#ffffff1f! h-full m-x-20"></div>
                <div class="fans info">
                  <div class="count">
                    {{ userInfo.followeds }}
                  </div>
                  <div class="title">粉丝</div>
                </div>
              </div>
              <div class="region personal">
                <div class="title">所在地区:</div>
                <div class="content">
                  {{ userInfo.provinceName + '-' + userInfo.cityName }}
                </div>
              </div>
              <div class="social personal">
                <div class="title">社交网络:</div>
                <div class="content">未绑定</div>
              </div>
              <div class="hi personal">
                <div class="title">个人介绍:</div>
                <div class="content f-1">
                  {{ userInfo.signature || '暂无介绍' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContainer>
    </div>
    <div class="list-card m-y-30 m-x-15">
      <CardContainer class="wh-full">
        <div class="list-content p-20 p-t-0">
          <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="创建的歌单" name="created">
              <div class="list-container flex flex-wrap justify-start">
                <div
                  class="item w-25%"
                  v-for="(item, index) in playListInfo"
                  :key="index"
                  v-show="!item.subscribed"
                >
                  <musicBox
                    :music="item"
                    :img="item.coverImgUrl"
                    @click="navigateToList(item)"
                  ></musicBox>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="收藏的歌单" name="collect">
              <div class="list-container flex flex-wrap justify-start">
                <div
                  class="item w-25%"
                  v-for="(item, index) in playListInfo"
                  :key="index"
                  v-show="item.subscribed"
                >
                  <musicBox
                    :music="item"
                    :img="item.coverImgUrl"
                    @click="navigateToList(item)"
                  ></musicBox>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="创建的音乐专栏" name="music"
              >待补充
            </el-tab-pane>
          </el-tabs>
        </div>
      </CardContainer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-center-container {
  font-family: 'Orbitron', sans-serif !important;
}
.user-card {
  width: calc(87vw - 180px);
  margin: 0 auto;
  box-shadow: 0 5px 15px 5px rgb(0 0 0 / 10%);
  transition: 0.4s;
}
.avatar {
  width: 200px;
  height: 200px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
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
.personal {
  font-size: 13px;
  margin-bottom: 5px;
  display: flex;
  .content {
    color: #969696;
    margin-left: 10px;
  }
}
.info-count {
  margin-bottom: 15px;
  .info {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .count {
      font-size: 20px;
    }
    .title {
      font-size: 13px;
      color: #969696;
    }
  }
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
</style>
