<script setup>
import LayoutAside from './components/LayoutAside.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LoginBox from './components/LoginBox.vue'
import { onMounted, ref } from 'vue'
import { useGlobalStore } from '@/stores'

const refresh = ref(0) // 登录成功后强制刷新页面
const loginBoxRef = ref(null)
const globalStore = useGlobalStore()
onMounted(() => {
  // 初始化全局挂载 $audio
  // 初始化 全局变量 $login
  window.$login = loginBoxRef.value
})
</script>

<template>
  <a-layout class="min-h-screen layout-style h-full">
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
      class="aside-style no-select bgc-#ffffff08! h-full"
      width="235px"
    >
      <layout-aside class="h-full"></layout-aside>
    </a-layout-sider>
    <a-layout class="layout-style fd-col h-full">
      <a-layout-header class="header-style h-90! bg-transparent! p-x-20!">
        <layout-header></layout-header>
      </a-layout-header>
      <a-layout-content class="content-style no-select f-1!">
        <!-- 二级路由出口 -->
        <router-view v-slot="{ Component }">
          <!--          <keep-alive>-->
          <component :key="refresh" :is="Component"></component>
          <!--          </keep-alive>-->
        </router-view>
        <LoginBox ref="loginBoxRef" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style lang="scss" scoped>
.layout-style {
  color: #d2d2d2;
  z-index: 2;
  background-color: inherit;
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
  scrollbar-width: none;
  &:state(webkit-scrollbar) {
    display: none;
  }
}
</style>
