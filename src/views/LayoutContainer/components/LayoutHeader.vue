<script setup>
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faWindowMaximize,
  faWindowRestore
} from '@fortawesome/free-regular-svg-icons'
import {
  CloseBold,
  SemiSelect,
  ArrowLeftBold,
  ArrowRightBold
} from '@element-plus/icons-vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

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

// 前进后退路由导航
const canGoBack = ref(false)
const canGoForward = ref(false)
const router = useRouter()

// 判断是否可以后退
const updateNavigationState = () => {
  canGoBack.value = window.history.state && window.history.length > 1
  canGoForward.value =
    window.history.state && router.options.history.state.forward
}

// 后退操作
const goBack = () => {
  if (canGoBack.value) {
    router.back()
  }
}
// 前进操作
const goForward = () => {
  if (canGoForward.value) {
    router.forward()
  }
}

// 监听页面导航变化，更新按钮状态
onMounted(() => {
  updateNavigationState()

  // 监听路由变化
  watch(
    () => router.currentRoute.value,
    () => {
      updateNavigationState()
    }
  )
})
</script>

<template>
  <div class="header-container">
    <div class="window-container">
      <div class="header-content f-b p-y-10">
        <div class="left-part no-drag f-c">
          <div class="history-nav f-c h-full m-r-10">
            <div
              class="back-item arrow f-c"
              :class="{ disabled: !canGoBack }"
              @click="goBack"
            >
              <el-icon><ArrowLeftBold /></el-icon>
            </div>
            <div
              class="go-item arrow f-c"
              :class="{ disabled: !canGoForward }"
              @click="goForward"
            >
              <el-icon><ArrowRightBold /></el-icon>
            </div>
          </div>
          <div class="search-container w-290">
            <a-input
              v-model="keyword"
              class="search-content bg-transparent border-#96969633 p-y-8 hover:border-#96969633"
            >
              <template #prefix>
                <SearchOutlined class="color-#969696 fs-20"></SearchOutlined>
              </template>
            </a-input>
          </div>
        </div>
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
.history-nav {
  .disabled {
    color: #96969666 !important;
  }
  .arrow {
    border: 1px solid #96969633;
    color: #ffffff80;
    margin: 0 6px;
    padding: 12px 6px;
    border-radius: 10px;
  }
}
:deep(.ant-input) {
  background-color: transparent;
  color: #fff;
  font-weight: 600;
}
:deep(.ant-input-affix-wrapper-focused) {
  border-color: none;
  box-shadow: none;
  color: #fff;
}
:deep(.ant-input-affix-wrapper) {
  &:hover {
    border-color: #96969633;
  }
}
</style>
