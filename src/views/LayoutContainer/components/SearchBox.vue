<script setup>
import { ref, onMounted } from 'vue'
import { getHotSearchList } from '@/api/search'

defineProps({
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
  }
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
        <div class="guess" v-if="suggestion.allMatch?.length">
          <div class="title fs-17 fw-600 p-l-20 color-#969696 lh-48">
            猜你想搜
          </div>
          <div class="list fd-col">
            <div
              class="item lh-48 px-20"
              v-for="(item, index) in suggestion.allMatch"
              :key="index"
            >
              <span>{{ item.keyword }}</span>
            </div>
          </div>
        </div>
        <div class="songs" v-if="suggestion.songs?.length">
          <div class="title fs-17 fw-600 p-l-20 color-#969696 lh-48">单曲</div>
          <div class="list fd-col">
            <div
              class="item lh-48 px-20"
              v-for="(item, index) in suggestion.songs"
              :key="index"
            >
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div class="artists" v-if="suggestion.artists?.length">
          <div class="title fs-17 fw-600 p-l-20 color-#969696 lh-48">歌手</div>
          <div class="list fd-col">
            <div
              class="item lh-48 px-20"
              v-for="(item, index) in suggestion.artists"
              :key="index"
            >
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div class="albums" v-if="suggestion.albums?.length">
          <div class="title fs-17 fw-600 p-l-20 color-#969696 lh-48">专辑</div>
          <div class="list fd-col">
            <div
              class="item lh-48 px-20"
              v-for="(item, index) in suggestion.albums"
              :key="index"
            >
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div class="playlists" v-if="suggestion.playlists?.length">
          <div class="title fs-17 fw-600 p-l-20 color-#969696 lh-48">歌单</div>
          <div class="list fd-col">
            <div
              class="item lh-48 px-20"
              v-for="(item, index) in suggestion.playlists"
              :key="index"
            >
              <span>{{ item.name }}</span>
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
      &:hover {
        background-color: #393944;
      }
    }
  }
}
</style>
