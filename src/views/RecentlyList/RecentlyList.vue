<script setup>
import { ref, onMounted } from 'vue'
import { getRecentlyPlayed } from '@/api/music'
import recentContent from './components/recentContent.vue'

const activeName = ref('song')
const songs = ref([])
const djs = ref([])
const playlists = ref([])
const albums = ref([])
const videos = ref([])

const init = async () => {
  try {
    const [songRes, djRes, playlistRes, albumRes, videoRes] = await Promise.all(
      [
        getRecentlyPlayed('song'),
        getRecentlyPlayed('dj'),
        getRecentlyPlayed('playlist'),
        getRecentlyPlayed('album'),
        getRecentlyPlayed('video')
      ]
    )
    songs.value = songRes.data
    djs.value = djRes.data
    playlists.value = playlistRes.data
    albums.value = albumRes.data
    videos.value = videoRes.data
  } catch (error) {
    console.error('xixi', error)
  }
}

onMounted(async () => {
  songs.value = []
  djs.value = []
  playlists.value = []
  albums.value = []
  videos.value = []

  await init()
})
</script>

<template>
  <div class="recently-container p-x-30">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane name="song">
        <template #label>
          <span class="label">单曲</span>
          <span class="count fw-400 fs-12 translate-y--30%">{{
            songs.total
          }}</span>
        </template>
        <div class="song-list-container">
          <ListContent :songList="songs.list" :isRecently="true"></ListContent>
        </div>
      </el-tab-pane>
      <el-tab-pane name="dj">
        <template #label>
          <span class="label">播客</span>
          <span class="count fw-400 fs-12 translate-y--30%">{{
            djs.total
          }}</span>
        </template>
        <div class="dj-container">
          <recentContent type="dj" :list="djs.list"></recentContent>
        </div>
      </el-tab-pane>
      <el-tab-pane name="playlist">
        <template #label>
          <span class="label">歌单</span>
          <span class="count fw-400 fs-12 translate-y--30%">{{
            playlists.total
          }}</span>
        </template>
        <div class="playlist-container">
          <recentContent type="playlist" :list="playlists.list"></recentContent>
        </div>
      </el-tab-pane>
      <el-tab-pane name="album">
        <template #label>
          <span class="label">专辑</span>
          <span class="count fw-400 fs-12 translate-y--30%">{{
            albums.total
          }}</span>
        </template>
        <div class="album-container">
          <recentContent type="album" :list="albums.list"></recentContent>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane name="video">
        <template #label>
          <span class="label">视频</span>
          <span class="count fw-400 fs-12 translate-y--30%">{{
            videos.total
          }}</span>
        </template>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tabs__nav-wrap) {
  &::after {
    height: 0;
  }
}
:deep(.el-tabs__item) {
  font-size: 16px;
  color: #d2d2d2cc;
  &.is-active {
    color: #fff;
    font-size: 18px;
    font-weight: 800;
  }
}
:deep(.el-tabs__active-bar) {
  background-color: #ec4141;
  height: 2px;
}
:deep(.el-loading-mask) {
  background-color: transparent;
}
</style>
