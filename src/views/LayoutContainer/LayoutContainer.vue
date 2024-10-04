<script setup>
import LayoutAside from './components/LayoutAside.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LoginBox from './components/LoginBox.vue'
import { onMounted, ref } from 'vue'
import { useGlobalStore } from '@/stores'
import MusicPlayer from '../MusicPlayer/MusicPlayer.vue'
// import { ArrowUpBold } from '@element-plus/icons-vue'

const refresh = ref(0) // 登录成功后强制刷新页面
const loginBoxRef = ref(null)
const audio = ref(null)
const globalStore = useGlobalStore()
onMounted(() => {
  // 初始化全局挂载 $audio
  // 初始化 全局变量 $login
  window.$login = loginBoxRef.value
  window.$player = audio.value
})
</script>

<template>
  <a-layout class="min-h-screen layout-style h-full relative">
    <div
      id="opacity-bg1"
      class="background-layer fixed wh-full"
      :style="globalStore.bgLayer1Style"
    ></div>
    <div
      id="opacity-bg2"
      class="background-layer fixed wh-full"
      :style="globalStore.bgLayer2Style"
    ></div>
    <a-layout-sider
      class="aside-style no-select bgc-#ffffff08! h-full z-800"
      width="235px"
    >
      <layout-aside class="h-full"></layout-aside>
    </a-layout-sider>
    <a-layout
      class="layout-style fd-col h-full"
      :style="{ zIndex: audio?.songShow ? 'auto' : '800' }"
    >
      <a-layout-header
        class="header-style h-90! bg-transparent! p-x-20! z-auto!"
      >
        <layout-header></layout-header>
      </a-layout-header>
      <a-layout-content
        class="content-style no-select f-1! relative z-auto"
        :style="{ paddingBottom: audio?.playerVisible ? '11%' : '' }"
      >
        <!-- 二级路由出口 -->
        <router-view v-slot="{ Component }">
          <!-- <keep-alive> -->
          <el-scrollbar>
            <component :key="refresh" :is="Component"></component>
          </el-scrollbar>
          <!-- </keep-alive> -->
        </router-view>
        <LoginBox ref="loginBoxRef" />
        <!-- 返回顶部 -->
        <!-- <div
          class="top-btn w-5vw h-5vw rounded-50% f-c cursor-pointer"
          :style="{ backgroundColor: globalStore.color }"
          @click="scrollToTop"
          v-show="showButton"
        >
          <el-icon><ArrowUpBold /></el-icon>
        </div> -->
      </a-layout-content>
    </a-layout>
    <!-- 播放器 -->
    <music-player
      class="wh-full absolute left-0 bottom-0 z-auto!"
      ref="audio"
    ></music-player>
  </a-layout>
</template>

<style lang="scss" scoped>
.layout-style {
  color: #d2d2d2;
  z-index: 2;
  background-color: inherit;
  font-family: 'Orbitron', sans-serif !important;
}
.background-layer {
  transition: all 0.5s ease 0s;
  background-size: cover;
  // z-index: -1;
  filter: brightness(90%);
  // transform: translateY(-40%);
}

#opacity-bg1 {
  opacity: 1;
}
#opacity-bg2 {
  opacity: 0;
}
:deep(.el-dialog) {
  backdrop-filter: blur(60px) saturate(210%);
  background-color: rgba(40, 40, 40, 0.7);
  height: 300px;
}
:deep(.el-dialog__body) {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
:deep(.el-dialog__title) {
  color: #d2d2d2;
}
:deep(.ant-layout) {
  background: transparent !important;
}
.content-style {
  height: calc(100% - 60px);
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: 0;
  &:state(webkit-scrollbar) {
    display: none;
  }
}
.top-btn {
  font-size: 3vw;
}
</style>
