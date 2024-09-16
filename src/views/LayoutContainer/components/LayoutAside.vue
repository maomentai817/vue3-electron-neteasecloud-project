<script setup>
import { User } from '@element-plus/icons-vue'
import { h, ref } from 'vue'
import {
  HomeFilled,
  CustomerServiceFilled,
  DownloadOutlined,
  ClockCircleFilled,
  CloudFilled
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
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
const asideConfigMy = [
  {
    key: '3',
    icon: () => h(DownloadOutlined),
    label: '本地与下载',
    title: '本地与下载',
    path: '/local'
  },
  {
    key: '4',
    icon: () => h(ClockCircleFilled),
    label: '最近播放',
    title: '最近播放',
    path: '/history'
  },
  {
    key: '5',
    icon: () => h(CloudFilled),
    label: '我的音乐云盘',
    title: '我的音乐云盘',
    path: '/cloud'
  }
]

const selectedKeys = ref(['1'])

const router = useRouter()
const MenuClick = (e) => {
  router.push(e.item.originItemValue.path)
}

const login = () => {
  window.$login.show()
}
const userStore = useUserStore()
const globalStore = useGlobalStore()
const navgateToUserCenter = () => {
  userStore.getUserDetailInfo()
  router.push('/user')
  selectedKeys.value = ['0']
  if (userStore.profile.avatarUrl) {
    getDominantColor(userStore.profile.avatarUrl).then((color) => {
      globalStore.setBackgroundStyle(color)
    })
  }
}
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
    <div class="menu-container p-x-20 p-b-100 color-hue">
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        class="bg-transparent"
        :items="asideConfigRecommend"
        @click="MenuClick"
      />
      <div class="line h-1 m-x-10 m-y-15 bgc-#ffffff1a"></div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        class="bg-transparent"
        :items="asideConfigMy"
        @click="MenuClick"
      />
      <div class="login-menu-list color-hue-none" v-if="false">
        <div class="line h-1 m-x-10 m-y-15 bgc-#ffffff1a"></div>
        <div class="created-container fs-13 fw-400 p-l-10">
          <div class="created-title">创建的歌单</div>
        </div>
        <div class="line h-1 m-x-10 m-y-15 bgc-#ffffff1a"></div>
        <div class="collected-container fs-13 fw-400 p-l-10">
          <div class="collected-title">收藏的歌单</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-menu-item) {
  color: #fff;
  font-size: 14px;
  margin: 7px 0;
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
</style>
