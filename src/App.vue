<script setup></script>

<template>
  <div id="app">
    <router-view />
  </div>
  <el-button>1212</el-button>
  <a-button danger>1212</a-button>
  <button class="btn btn-info">Info</button>
  <button class="btn btn-outline btn-info">Info</button>
  <button class="btn btn-outline btn-success">Success</button>
  <button class="btn btn-outline btn-warning">Warning</button>
  <button class="btn btn-outline btn-error">Error</button>
  <label class="swap swap-flip text-9xl">
    <!-- this hidden checkbox controls the state -->
    <input type="checkbox" />

    <div class="swap-on">😈</div>
    <div class="swap-off">😇</div>
  </label>
  <div class="window-container">1111111111111111111</div>
</template>

<style scoped>
/* electron 无边框拖动窗口 */
.window-container {
  -webkit-app-region: drag;
}
.no-drag {
  -webkit-app-region: no-drag !important;
}
</style>
