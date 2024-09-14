<script setup>
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faWindowMaximize,
  faWindowRestore
} from '@fortawesome/free-regular-svg-icons'
import { CloseBold, SemiSelect } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'

library.add(faWindowMaximize, faWindowRestore)

let ipcRenderer = null
const isElectron = () => {
  return (
    typeof window !== 'undefined' &&
    typeof window.process === 'object' &&
    window.process.type === 'renderer'
  )
}

// 使用异步函数来处理 ipcRenderer 的动态导入
const loadIpcRenderer = async () => {
  if (isElectron()) {
    ipcRenderer = await import('electron').then(
      (electron) => electron.ipcRenderer
    )
  }
}

onMounted(async () => {
  await loadIpcRenderer()
})

// 最小化窗口函数
const minimize = async () => {
  await loadIpcRenderer() // 确保 ipcRenderer 加载完成
  if (ipcRenderer) {
    ipcRenderer.send('minimize')
  }
}
// 关闭窗口函数
const close = async () => {
  await loadIpcRenderer() // 确保 ipcRenderer 加载完成
  if (ipcRenderer) {
    ipcRenderer.send('close')
  }
}

// 最大化窗口函数
const isFullScreen = ref(false)
const maximizeToggle = async () => {
  await loadIpcRenderer() // 确保 ipcRenderer 加载完成
  if (ipcRenderer) {
    if (isFullScreen.value) ipcRenderer.send('unmaximize')
    else ipcRenderer.send('maximize')
    isFullScreen.value = !isFullScreen.value
  }
}
</script>

<template>
  <div class="header-container">
    <div class="window-container">
      <div class="header-content f-b">
        <div class="left-part no-drag">搜索</div>
        <div class="center-part no-drag"></div>
        <div class="right-part no-drag color-hue">
          <div class="operator f-c">
            <div class="handler f-c" @click="minimize">
              <el-icon><SemiSelect /></el-icon>
            </div>
            <div class="handler f-c" @click="maximizeToggle">
              <font-awesome-icon
                :icon="['far', 'window-maximize']"
                v-if="!isFullScreen"
              />
              <font-awesome-icon :icon="['far', 'window-restore']" v-else />
            </div>
            <div class="handler f-c" @click="close">
              <el-icon><CloseBold /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.handler {
  padding: 0 15px;
  cursor: pointer;
}
</style>
