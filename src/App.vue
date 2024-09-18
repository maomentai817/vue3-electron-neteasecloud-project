<script setup></script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  background-color: #13131a;
  position: relative;
  height: 100%;
}
/* electron 无边框拖动窗口 */
.window-container {
  -webkit-app-region: drag;
}
.no-drag {
  -webkit-app-region: no-drag !important;
}

.no-select {
  -webkit-user-select: none; /* 针对 Safari 和 Chrome */
  -moz-user-select: none; /* 针对 Firefox */
  -ms-user-select: none; /* 针对 IE 和 Edge */
  user-select: none; /* 标准属性 */
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
</style>
