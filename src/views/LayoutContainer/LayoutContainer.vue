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
  <a-layout class="min-h-screen layout-style">
    <div
      id="opacity-bg1"
      class="background-layer fixed wh-full duration-500"
      :style="globalStore.bgLayer1Style"
    ></div>
    <div
      id="opacity-bg2"
      class="background-layer fixed wh-full duration-500"
      :style="globalStore.bgLayer2Style"
    ></div>
    <a-layout-sider class="aside-style no-select bgc-#ffffff08!" width="235px">
      <layout-aside></layout-aside>
    </a-layout-sider>
    <a-layout class="layout-style">
      <a-layout-header class="header-style h-84! bg-transparent! p-x-20!">
        <layout-header></layout-header>
      </a-layout-header>
      <a-layout-content class="content-style no-select">
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
}
.background-layer {
  transition: all 0.5s ease;
  background-size: cover;
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
  background: transparent;
}
</style>
