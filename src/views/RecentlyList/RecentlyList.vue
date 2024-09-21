<script setup>
import { ref, onMounted } from 'vue'
import { getRecentlyPlayed } from '@/api/music'

const activeName = ref('song')
const songs = ref([])
const djs = ref([])
const playlists = ref([])
const albums = ref([])
const videos = ref([])

const init = async () => {
  const songRes = await getRecentlyPlayed('song')
  songs.value = songRes.data
  const djRes = await getRecentlyPlayed('dj')
  djs.value = djRes.data
  const playlistRes = await getRecentlyPlayed('playlist')
  playlists.value = playlistRes.data
  const albumRes = await getRecentlyPlayed('album')
  albums.value = albumRes.data
  const videoRes = await getRecentlyPlayed('video')
  videos.value = videoRes.data
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
      </el-tab-pane>
      <el-tab-pane name="playlist">
        <template #label>
          <span class="label">歌单</span>
          <span class="count fw-400 fs-12 translate-y--30%">{{
            playlists.total
          }}</span>
        </template>
      </el-tab-pane>
      <el-tab-pane name="album">
        <template #label>
          <span class="label">专辑</span>
          <span class="count fw-400 fs-12 translate-y--30%">{{
            albums.total
          }}</span>
        </template>
      </el-tab-pane>
      <el-tab-pane name="video">
        <template #label>
          <span class="label">视频</span>
          <span class="count fw-400 fs-12 translate-y--30%">{{
            videos.total
          }}</span>
        </template>
      </el-tab-pane>
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
  color: #969696;
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
