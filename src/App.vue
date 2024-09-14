<script setup></script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
/* electron 无边框拖动窗口 */
.window-container {
  -webkit-app-region: drag;
}
.no-drag {
  -webkit-app-region: no-drag !important;
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
