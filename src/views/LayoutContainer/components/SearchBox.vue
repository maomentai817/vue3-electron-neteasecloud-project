<script setup>
import { ref, onMounted, watch, watchEffect } from 'vue'
import { getHotSearchList } from '@/api/search'

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
const open = () => {
  showSearchBox.value = true
}
const close = () => {
  showSearchBox.value = false
}

const hotlist = ref([])
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

defineExpose({
  open,
  close
})
</script>

<template>
  <div
    class="search-box w-390 h-600 color-white rounded-12 z-999 overflow-y-auto"
    v-show="showSearchBox"
  >
    <el-scrollbar>
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
            >
              <span v-html="item"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="hot-list-container" v-else>
        <div class="title fs-18 fw-600 p-l-20 color-#969696 lh-54">热搜榜</div>
        <div class="hot-list">
          <div
            class="item f-s p-l-20 hover:bg-#393944"
            v-for="(item, index) in hotlist"
            :key="index"
            @click="close"
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
}
</style>
