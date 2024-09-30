<script setup>
import { ref, onMounted, watch, watchEffect, nextTick } from 'vue'
import { getHotSearchList } from '@/api/search'
import { useSearchStore } from '@/stores'

const props = defineProps({
  keywords: {
    type: String,
    default: ''
  },
  suggestion: {
    type: Object,
    default: () => {}
  },
  isSearch: {
    type: Boolean,
    default: false
  },
  inputValue: {
    type: String,
    default: ''
  }
})

watchEffect(() => {
  // console.log(props.suggestion)
  // console.log(props.inputValue)
})

const showSearchBox = ref(false)
const sb = ref(null)
const open = () => {
  showSearchBox.value = true
}
const close = () => {
  sb.value.scrollTo(0, 0)
  sb.value.setScrollTop(0)
  showSearchBox.value = false
}

const hotlist = ref([])
const searchStore = useSearchStore()
onMounted(async () => {
  const { data } = await getHotSearchList()
  hotlist.value = data
})

const hiSuggestion = ref({})

watch(
  [() => props.inputValue, () => props.suggestion],
  ([newInputValue, newSuggestion]) => {
    if (newSuggestion) {
      // 如果 inputValue 有值，则高亮处理
      hiSuggestion.value = highlightData(newSuggestion, newInputValue)
    } else {
      // 如果没有输入值，清空高亮结果
      hiSuggestion.value = {}
    }
  }
)
watch(
  () => props.keywords,
  (newValue) => {
    if (newValue.length === 0) {
      hiSuggestion.value = {}
    }
  }
)

const highlightData = (data, keyword) => {
  const highlight = (str) => {
    const regex = new RegExp(`(${keyword})`, 'gi')
    return str.replace(regex, '<span class="highlight">$1</span>')
  }

  return Object.entries(data).reduce((acc, [key, values]) => {
    acc[key] = values?.map((item) => highlight(item)) // 添加高亮类
    return acc
  }, {})
}

// 提纯文本
const extractTextFromHTML = (htmlString) => {
  return htmlString.replace(/<[^>]*>/g, '')
}

const emit = defineEmits(['search'])
const handleSearch = (keywords) => {
  emit('search', keywords)
}

defineExpose({
  open,
  close
})

// 历史记录
const expanded = ref(false) // 控制展开和收回的状态
const showToggleButton = ref(false) // 控制按钮显示
const historyList = ref(null) // 引用容器元素

// 切换展开和收回状态
const toggleExpand = () => {
  expanded.value = !expanded.value
}

// 在挂载后检查是否需要显示「展开全部」按钮
const checkExpandButton = () => {
  const containerHeight = historyList.value?.clientHeight
  const contentHeight = historyList.value?.scrollHeight

  if (contentHeight > containerHeight) {
    showToggleButton.value = true
  } else {
    showToggleButton.value = false
  }
}
onMounted(() => {
  checkExpandButton()
})

// 监听搜索历史记录变化
watch(
  () => searchStore.searchHistory,
  async () => {
    // 等待 DOM 更新完成后再检查高度
    await nextTick()
    checkExpandButton()
  },
  { deep: true } // 深度监听，捕捉数组内容变化
)
</script>

<template>
  <div
    class="search-box w-390 h-600 color-white rounded-12 overflow-y-auto"
    v-show="showSearchBox"
  >
    <el-scrollbar ref="sb">
      <div class="search-list-container fd-col" v-if="isSearch">
        <div class="guess" v-if="hiSuggestion.allMatch?.length">
          <div class="title fs-17 fw-600 p-l-20 color-#969696 lh-48">
            猜你想搜
          </div>
          <div class="list fd-col">
            <div
              class="item lh-48 px-20"
              v-for="(item, index) in hiSuggestion.allMatch"
              :key="index"
              @click="handleSearch(extractTextFromHTML(item))"
            >
              <span v-html="item"></span>
            </div>
          </div>
        </div>
        <div class="songs" v-if="hiSuggestion.songs?.length">
          <div class="title fs-17 fw-600 p-l-20 color-#969696 lh-48">单曲</div>
          <div class="list fd-col">
            <div
              class="item lh-48 px-20"
              v-for="(item, index) in hiSuggestion.songs"
              :key="index"
              @click="handleSearch(extractTextFromHTML(item))"
            >
              <span v-html="item"></span>
            </div>
          </div>
        </div>
        <div class="artists" v-if="hiSuggestion.artists?.length">
          <div class="title fs-17 fw-600 p-l-20 color-#969696 lh-48">歌手</div>
          <div class="list fd-col">
            <div
              class="item lh-48 px-20"
              v-for="(item, index) in hiSuggestion.artists"
              :key="index"
              @click="handleSearch(extractTextFromHTML(item))"
            >
              <span v-html="item"></span>
            </div>
          </div>
        </div>
        <div class="albums" v-if="hiSuggestion.albums?.length">
          <div class="title fs-17 fw-600 p-l-20 color-#969696 lh-48">专辑</div>
          <div class="list fd-col">
            <div
              class="item lh-48 px-20"
              v-for="(item, index) in hiSuggestion.albums"
              :key="index"
              @click="handleSearch(extractTextFromHTML(item))"
            >
              <span v-html="item"></span>
            </div>
          </div>
        </div>
        <div class="playlists" v-if="hiSuggestion.playlists?.length">
          <div class="title fs-17 fw-600 p-l-20 color-#969696 lh-48">歌单</div>
          <div class="list fd-col">
            <div
              class="item lh-48 px-20"
              v-for="(item, index) in hiSuggestion.playlists"
              :key="index"
              @click="handleSearch(extractTextFromHTML(item))"
            >
              <span v-html="item"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="hot-list-container" v-else>
        <template v-if="searchStore.searchHistory.length">
          <div class="title fs-17 fw-600 p-l-20 p-r-30 color-#969696 lh-54 f-b">
            <span>搜索历史</span>
            <span class="cursor-pointer" @click="searchStore.clearSearchHistory"
              >🗑</span
            >
          </div>
          <div class="history-container relative p-l-20 p-r-35">
            <div
              ref="historyList"
              class="history-list overflow-hidden flex flex-wrap relative"
              :class="{ clamped: !expanded }"
            >
              <div
                class="tag fs-13 rounded-12 bg-#9696961f m-r-8 m-b-8 line-height-loose p-x-10 cursor-pointer flex-shrink-0"
                v-for="(item, index) in searchStore.searchHistory"
                :key="index"
                @click="handleSearch(item)"
              >
                {{ item }}
              </div>
              <!-- 展开/收回按钮 -->
              <button
                v-if="showToggleButton && expanded"
                @click="toggleExpand"
                class="rotate-90 rounded-12 bg-#9696961f m-r-8 m-b-8 line-height-loose p-x-10"
              >
                {{ expanded ? '<' : '>' }}
              </button>
            </div>
            <!-- 展开/收回按钮 -->
            <button
              v-if="showToggleButton && !expanded"
              @click="toggleExpand"
              class="rotate-90 rounded-12 bg-#9696961f m-r-8 m-b-8 line-height-loose p-x-10 translate-y--55%"
            >
              {{ expanded ? '<' : '>' }}
            </button>
          </div>
        </template>
        <div class="title fs-17 fw-600 p-l-20 color-#969696 lh-54">热搜榜</div>
        <div class="hot-list">
          <div
            class="item f-s p-l-20 hover:bg-#393944 cursor-pointer"
            v-for="(item, index) in hotlist"
            :key="index"
            @click="handleSearch(item.searchWord)"
          >
            <span class="index fw-600" :class="index < 3 ? 'red' : ''">{{
              index + 1
            }}</span>
            <span class="keywords mx-15">{{ item.searchWord }}</span>
            <span class="icon wh-16 f-c">
              <img :src="item.iconUrl" alt="" class="wh-full text-overflow" />
            </span>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.search-box {
  box-shadow: 0 5px 15px 5px rgb(0 0 0 / 10%);
  background-color: #2d2d38;
  .red {
    color: #ec4141;
  }
  .list {
    .item {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      :deep(.highlight) {
        color: #4d6190 !important;
      }
      &:hover {
        background-color: #393944;
      }
    }
  }
  .history-list {
    transition: max-height 0.3s ease-in-out;
    &.clamped {
      max-height: calc(4em + 12px);
    }
    &:not(.clamped) {
      max-height: none;
    }
  }
}
</style>
