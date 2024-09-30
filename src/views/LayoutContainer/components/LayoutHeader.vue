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
import { onMounted, ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore, useSearchStore } from '@/stores'
import SearchBox from './SearchBox.vue'
import { getDefaultSearchResult, getSearchSuggest } from '@/api/search'

library.add(faWindowMaximize, faWindowRestore)

// let ipcRenderer = null
// const isElectron = () => {
//   return (
//     typeof window !== 'undefined' &&
//     typeof window.process === 'object' &&
//     window.process.type === 'renderer'
//   )
// }

// 使用异步函数来处理 ipcRenderer 的动态导入
const loadIpcRenderer = async () => {
  // if (isElectron()) {
  //   ipcRenderer = await import('electron').then(
  //     (electron) => electron.ipcRenderer
  //   )
  // }
}

onMounted(async () => {
  await loadIpcRenderer()
  const {
    data: { showKeyword, realkeyword: realKeyword }
  } = await getDefaultSearchResult()
  placeholder.value = { showKeyword: showKeyword || 'Search', realKeyword }
})

// 最小化窗口函数
const minimize = async () => {
  // await loadIpcRenderer() // 确保 ipcRenderer 加载完成
  // if (ipcRenderer) {
  //   ipcRenderer.send('minimize')
  // }
  window.electronAPI.minimize()
}
// 关闭窗口函数
const close = async () => {
  // await loadIpcRenderer() // 确保 ipcRenderer 加载完成
  // if (ipcRenderer) {
  //   ipcRenderer.send('close')
  // }
  window.electronAPI.close()
}

// 最大化窗口函数
const isFullScreen = ref(false)
const maximizeToggle = async () => {
  await loadIpcRenderer() // 确保 ipcRenderer 加载完成
  // if (ipcRenderer) {
  //   if (isFullScreen.value) ipcRenderer.send('unmaximize')
  //   else ipcRenderer.send('maximize')
  //   isFullScreen.value = !isFullScreen.value
  // }
  if (isFullScreen.value) {
    window.electronAPI.unmaximize()
  } else {
    window.electronAPI.maximize()
  }
  isFullScreen.value = !isFullScreen.value
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

// 搜索框
const keyword = ref('')
const placeholder = ref({
  showKeyword: 'Search',
  realKeyword: ''
})
const globalStore = useGlobalStore()
const searchbox = ref(null)
// 解决聚焦时, drag优先级高于blur
const noDrag = ref(false)

// ctrl + k 聚焦
const searchInput = ref(null)
const handleKeyDown = (event) => {
  if (event.ctrlKey && event.key === 'k') {
    event.preventDefault()
    searchInput.value.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
const handleFocus = () => {
  noDrag.value = true
  searchbox.value.open()
}
const handleBlur = (e) => {
  if (e.relatedTarget?.tagName === 'BUTTON') return
  // 延时失焦事件, 使搜索点击可以触发
  setTimeout(() => {
    noDrag.value = false
    searchbox.value.close()
  }, 200)
}

const suggestion = ref({})
const isSearch = ref(false)
let composing = false
const inputValue = ref('')

// 防抖函数
const debounce = (func, delay) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
const suggest = async (e) => {
  inputValue.value = composing ? e.data : keyword.value // 处理拼音输入和普通输入

  if (inputValue.value) {
    isSearch.value = true
    // 发起请求
    const rq =
      inputValue.value?.length > keyword.value?.length
        ? inputValue.value
        : keyword.value
    const [pcRes, moRes] = await Promise.all([
      getSearchSuggest(rq),
      getSearchSuggest(rq, 'mobile')
    ])
    suggestion.value = {
      allMatch: moRes?.result?.allMatch?.map((i) => i.keyword),
      playlist: pcRes?.result?.playlists?.map((i) => i.name),
      artists: pcRes?.result?.artists?.map((i) => i.name),
      albums: pcRes?.result?.albums?.map((i) => i.name),
      songs: pcRes?.result?.songs?.map((i) => i.name)
    }
  } else {
    isSearch.value = false // 清空输入时隐藏建议
  }
}

// 将 suggest 函数进行防抖处理
const debouncedSuggest = debounce(suggest, 100) // 100毫秒延迟

const handleCompositionStart = () => {
  composing = true
}

const handleCompositionEnd = (e) => {
  composing = false
  suggest(e) // 在拼音确认时调用 suggest
}

const clearkw = () => {
  keyword.value = ''
  isSearch.value = false
}
// 亮度计算函数
const adjustColor = () => {
  // 提取 RGB 值
  const rgbArray = globalStore.color.match(/\d+/g).map(Number)
  const [r, g, b] = rgbArray

  // 计算颜色亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 255000

  // 判断颜色是否偏黑
  return brightness < 0.3 ? 'rgb(255, 255, 255)' : globalStore.color
}

const searchStore = useSearchStore()
const handleSearch = (keywords) => {
  if (keywords) {
    keyword.value = keywords
    router.push(`/search?keywords=${keywords}`)
    searchbox.value.close()
    searchStore.pushHistory(keywords)
  } else {
    if (placeholder.value.realKeyword) {
      keyword.value = placeholder.value.realKeyword
      router.push(`/search?keywords=${placeholder.value.realKeyword}`)
      searchbox.value.close()
      searchStore.pushHistory(placeholder.value.realKeyword)
    }
  }
}
</script>

<template>
  <div class="header-container">
    <div class="window-container" :class="{ 'no-drag': noDrag }">
      <div class="header-content f-b p-y-10">
        <div class="left-part no-drag f-c mt-5">
          <div class="history-nav f-c h-full m-r-10 cursor-pointer">
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
          <div class="search-container w-390 fd-col relative">
            <div
              class="input input-bordered flex items-center gap-2 color-#fff"
            >
              <svg
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="pointer-events-none absolute z-10 my-3.5 ms-4 stroke-current opacity-60 text-base-content color-#fff"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <input
                type="text"
                class="grow ml-30 mr-10"
                :placeholder="placeholder.showKeyword"
                v-model="keyword"
                ref="searchInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @input="debouncedSuggest"
                @compositionstart="handleCompositionStart"
                @compositionend="handleCompositionEnd"
                @keyup.enter="handleSearch(keyword)"
              />
              <kbd class="kbd kbd-sm">ctrl</kbd>
              <kbd class="kbd kbd-sm">K</kbd>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 48 48"
                class="ml-5 cursor-pointer"
                @click="clearkw"
              >
                <defs>
                  <mask id="ipTClearFormat0">
                    <g fill="none" stroke="#fff">
                      <path
                        fill="#555"
                        stroke-linejoin="round"
                        stroke-width="4.302"
                        d="M44.782 24.17L31.918 7.1L14.135 20.5L27.5 37l3.356-2.336z"
                      ></path>
                      <path
                        stroke-linejoin="round"
                        stroke-width="4.302"
                        d="m27.5 37l-3.839 3.075l-10.563-.001l-2.6-3.45l-6.433-8.536L14.5 20.225"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-width="4.5"
                        d="M13.206 40.072h31.36"
                      ></path>
                    </g>
                  </mask>
                </defs>
                <path
                  :fill="adjustColor()"
                  d="M0 0h48v48H0z"
                  mask="url(#ipTClearFormat0)"
                ></path>
              </svg>
            </div>
            <SearchBox
              class="absolute top-3.8em z-999"
              ref="searchbox"
              :keywords="keyword"
              :suggestion="suggestion"
              :isSearch="isSearch"
              :inputValue="inputValue"
              @search="handleSearch"
            ></SearchBox>
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
    color: #96969699 !important;
    cursor: not-allowed;
  }
  .arrow {
    border: 1px solid #d2d2d2cc;
    color: #fff;
    margin: 0 6px;
    padding: 12px 6px;
    border-radius: 10px;
  }
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

.input {
  height: 2.4em;
  padding-right: 0.4em;
  background-color: transparent;
  background: linear-gradient(
    135deg,
    rgba(24, 29, 43, 0.75),
    rgba(37, 27, 39, 0.75)
  );
  input {
    background-color: transparent;
  }
  .kbd {
    background-color: #6c6c71;
  }
}
</style>
