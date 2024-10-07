<script setup>
import { useMusicStore } from '@/stores'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import PreSong from './PreSong.vue'

const musicStore = useMusicStore()
const showFlag = ref(false)
const openDrawer = () => {
  showFlag.value = true
}

// 失焦关闭
const drawer = ref(null)
const blurHandler = (e) => {
  const openBtns = document.querySelectorAll('.list-draw')
  // 检查点击是否在 drawer 内部或者在按钮上
  if (
    drawer.value &&
    !drawer.value.contains(e.target) &&
    ![...openBtns].some((btn) => btn.contains(e.target))
  ) {
    // 如果点击不在 drawer 内部且不在任何按钮上，关闭 drawer
    showFlag.value = false
  } else if ([...openBtns].some((btn) => btn.contains(e.target))) {
    // 如果点击在按钮上，则切换 showFlag 的值
    showFlag.value = !showFlag.value
  }
}
onMounted(() => {
  document.addEventListener('click', blurHandler)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', blurHandler)
})

defineExpose({ openDrawer })
</script>

<template>
  <div
    class="play-drawer fixed z-2000 w-400 color-#fff right-0 top-10% translate-x-120% duration-400 overflow-hidden"
    :class="showFlag ? 'open' : ''"
    ref="drawer"
  >
    <div class="head f-b w-full height-60 p-x-20 p-t-15 m-b-10">
      <div class="left">
        <span class="text fw-600 fs-18">播放列表</span>
        <span class="count absolute translate-y--10% fs-12 m-l-3">{{
          musicStore.preList?.length
        }}</span>
      </div>
      <div class="right">
        <span class="cp" @click="musicStore.clearList">🗑 清空</span>
      </div>
    </div>
    <el-scrollbar>
      <div class="play-list p-b-60">
        <template v-for="(song, index) in musicStore.preListInfo" :key="index">
          <pre-song :song="song"></pre-song>
        </template>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.play-drawer {
  height: calc(100% - 200px);
  border-radius: 15px 0 0 15px;
  box-shadow: 0 5px 15px 5px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(60px) saturate(210%);
}
.open {
  transform: translateX(0) !important;
}
</style>
