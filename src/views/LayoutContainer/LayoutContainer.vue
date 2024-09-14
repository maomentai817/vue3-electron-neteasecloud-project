<script setup>
import LayoutAside from './components/LayoutAside.vue'
import LayoutHeader from './components/LayoutHeader.vue'
</script>

<template>
  <a-layout class="min-h-screen layout-style">
    <a-layout-sider class="aside-style color-hue">
      <layout-aside></layout-aside>
    </a-layout-sider>
    <a-layout class="layout-style">
      <a-layout-header class="header-style">
        <layout-header></layout-header>
      </a-layout-header>
      <a-layout-content class="content-style">
        <!-- 二级路由出口 -->
        <router-view></router-view
      ></a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style lang="scss" scoped>
.layout-style {
  background-color: #13131a;
  color: #d2d2d2;
  .aside-style {
    background-color: rgba(255, 255, 255, 0.03);
  }
  .header-style {
    background-color: #13131a;
    color: #d2d2d2;
    padding-right: 20px;
  }
}
</style>
