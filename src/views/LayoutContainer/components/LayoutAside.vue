<script setup>
import { User } from '@element-plus/icons-vue'
import { h, ref, watch } from 'vue'
import {
  HomeFilled,
  CustomerServiceFilled,
  DownloadOutlined,
  ClockCircleFilled,
  CloudFilled,
  HeartFilled
} from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore, useGlobalStore } from '@/stores'
import { getDominantColor } from '@/utils/getMainColor'

const asideConfigRecommend = [
  {
    key: '1',
    icon: () => h(HomeFilled),
    label: '为我推荐',
    title: '为我推荐',
    path: '/home'
  },
  {
    key: '2',
    icon: () => h(CustomerServiceFilled),
    label: '云音乐精选',
    title: '云音乐精选',
    path: '/recommend'
  }
]
const asideConfigLike = [
  {
    key: '3',
    icon: () => h(HeartFilled),
    label: '我喜欢的音乐',
    title: '我喜欢的音乐',
    path: '/play-list'
  }
]
const asideConfigMy = [
  {
    key: '4',
    icon: () => h(DownloadOutlined),
    label: '本地与下载',
    title: '本地与下载',
    path: '/local'
  },
  {
    key: '5',
    icon: () => h(ClockCircleFilled),
    label: '最近播放',
    title: '最近播放',
    path: '/history'
  },
  {
    key: '6',
    icon: () => h(CloudFilled),
    label: '我的音乐云盘',
    title: '我的音乐云盘',
    path: '/cloud'
  }
]

const selectedKeys = ref(['1'])

const router = useRouter()
const route = useRoute()
const MenuClick = (e) => {
  activeIndex.value = '-1'
  const musicTitleRegex = /喜欢的音乐$/ // 匹配以'喜欢的音乐'结尾的字符串

  if (musicTitleRegex.test(e.item.title)) {
    const playlist = userStore.userPlayListInfo.find((item) =>
      musicTitleRegex.test(item.name)
    )

    if (playlist) {
      router.push(`${e.item.path}?id=${playlist.id}`)
    }
  } else {
    router.push(e.item.path)
  }
}

const login = () => {
  window.$login.show()
}
const userStore = useUserStore()
const globalStore = useGlobalStore()
const navgateToUserCenter = async () => {
  if (Object.keys(userStore.userInfo).length === 0)
    await userStore.getUserDetailInfo()
  router.push(`/user?uid=${userStore.profile.userId}`)
  selectedKeys.value = ['0']
  activeIndex.value = '-1'
  if (userStore.profile.avatarUrl) {
    getDominantColor(userStore.profile.avatarUrl).then((color) => {
      globalStore.setBackgroundStyle(color)
    })
  }
}

const activeIndex = ref(route.query?.id || '-1')
watch(
  () => route.query,
  (newVal) => {
    if (newVal) {
      if (newVal.like === 'true') {
        selectedKeys.value = ['3']
      } else {
        activeIndex.value = newVal.id
      }
    }
  }
)
watch(
  () => route.path,
  (newVal) => {
    if (newVal === '/user') {
      selectedKeys.value = ['0']
      activeIndex.value = '-1'
    }
  }
)
const listClick = (i, item) => {
  selectedKeys.value = ['0']
  activeIndex.value = item.id

  router.push(`/play-list?id=${item.id}&count=${item.trackCount}`)
  if (userStore.userPlayListInfo[i].coverImgUrl) {
    getDominantColor(userStore.userPlayListInfo[i].coverImgUrl).then(
      (color) => {
        globalStore.setBackgroundStyle(color)
      }
    )
  }
}

const collapseKey = ref(['1', '2'])
</script>

<template>
  <div class="aside-container fd-col p-y-10 fw-600">
    <div class="user-container p-x-25">
      <div class="user-info-box h-80 w-full f-s cursor-pointer">
        <div class="no-login f-s" v-if="!userStore.isLogin" @click="login">
          <div class="avatar-box f-c wh-27 rounded-50% bg-#ffffff1a">
            <el-icon :size="22"><User /></el-icon>
          </div>
          <span class="text m-l-8 color-hue">未登录</span>
        </div>
        <div class="login f-s" v-else @click="navgateToUserCenter">
          <div class="avatar-box f-c wh-40 rounded-50% bg-#ffffff1a">
            <el-avatar :src="userStore.profile.avatarUrl" />
          </div>
          <span class="text m-l-8 color-hue">{{
            userStore.profile.nickname
          }}</span>
        </div>
      </div>
    </div>
    <div class="menu-container p-x-20 p-b-20 f-1 overflow-y-auto">
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        class="bg-transparent color-hue"
        :items="asideConfigRecommend"
        @click="MenuClick"
      />
      <div class="line h-1 m-x-10 m-y-15 bgc-#ffffff1a"></div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        class="bg-transparent color-hue"
        :items="asideConfigLike"
        @click="MenuClick"
        v-if="userStore.isLogin"
      />
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        class="bg-transparent color-hue"
        :items="asideConfigMy"
        @click="MenuClick"
      />
      <div class="login-menu-list" v-if="userStore.isLogin">
        <div class="line h-1 m-x-10 m-y-15 bgc-#ffffff1a"></div>

        <a-collapse v-model:activeKey="collapseKey" ghost>
          <a-collapse-panel key="1" header="创建的歌单" :showArrow="false">
            <div class="collapse-content1 fd-col p-0!">
              <template v-for="(item, index) in userStore.userPlayListInfo">
                <div
                  class="created-list-item"
                  :key="index"
                  v-if="!item.subscribed && !/喜欢的音乐$/.test(item.name)"
                >
                  <div
                    class="list-item-content f-s mb-10 h-40 cursor-pointer"
                    @click="listClick(index, item)"
                    :class="{
                      active: +item.id === +activeIndex
                    }"
                  >
                    <div class="cover-img wh-34 mr-10 rounded-6">
                      <img
                        v-img-lazy="item.coverImgUrl"
                        alt=""
                        class="wh-full rounded-6"
                      />
                    </div>
                    <div class="title text-overflow f-1 fw-600 color-#d2d2d2">
                      {{ item.name }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </a-collapse-panel>
        </a-collapse>
        <div class="line h-1 m-x-10 m-y-15 bgc-#ffffff1a"></div>

        <a-collapse v-model:activeKey="collapseKey" ghost>
          <a-collapse-panel key="2" header="收藏的歌单" :showArrow="false">
            <div class="collapse-content1 fd-col p-0!">
              <template v-for="(item, index) in userStore.userPlayListInfo">
                <div
                  class="collect-list-item"
                  :key="index"
                  v-if="item.subscribed"
                >
                  <div
                    class="list-item-content f-s mb-10 h-40 cursor-pointer"
                    @click="listClick(index, item)"
                    :class="{
                      active: +item.id === +activeIndex
                    }"
                  >
                    <div class="cover-img wh-34 mr-10 rounded-6">
                      <img
                        v-img-lazy="item.coverImgUrl"
                        alt=""
                        class="wh-full rounded-6"
                      />
                    </div>
                    <div class="title text-overflow f-1 fw-600 color-#d2d2d2">
                      {{ item.name }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </a-collapse-panel>
        </a-collapse>
        <div class="line h-1 m-x-10 m-y-15 bgc-#ffffff1a"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-menu-item) {
  color: #fff;
  font-size: 14px;
  margin: 7px 0;
  font-family: 'Orbitron', sans-serif !important;
  &:hover {
    color: #fff !important;
    background-image: linear-gradient(#ff1168, #fc3d49);
  }
}
:deep(.ant-menu-item-selected) {
  color: #fff !important;
  background-color: transparent;
  background-image: linear-gradient(#ff1168, #fc3d49);
}
:deep(.ant-menu-item-active) {
  color: #fff !important;
  background-image: linear-gradient(#ff1168, #fc3d49);
}
.list-item-content {
  padding-left: 14px;
  border-radius: 8px;
  &:hover {
    color: #fff !important;
    background-image: linear-gradient(#ff1168, #fc3d49);
  }
}
.aside-container {
  font-family: 'Orbitron', sans-serif !important;
}
.cover-img {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 1;
}
.active {
  color: #fff !important;
  background-image: linear-gradient(#ff1168, #fc3d49);
}
.color-hue {
  color: #f75d64;
  animation: animate 8s linear infinite;
}
@keyframes animate {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}
:deep(.ant-collapse-header) {
  padding: 0 !important;
}
:deep(.ant-collapse-header-text) {
  font-size: 14px;
  font-family: 'Orbitron', sans-serif !important;
  color: #969696;
  font-weight: 600;
  margin-bottom: 15px;
  margin-left: 10px;
  padding: 0 !important;
}
:deep(.ant-collapse-content-box) {
  padding: 0 !important;
  padding-right: 16px !important;
}
.menu-container {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
