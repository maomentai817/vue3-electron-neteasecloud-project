import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMusicStore = defineStore('music', () => {
  // state
  const musicUrl = ref('') // 用户当前播放歌曲的url
  const songInfo = ref({}) // 用户当前播放歌曲的信息
  const currentTime = ref(0)
  const mode = ref(1) // 播放模式 1: 顺序播放 2: 单曲循环 3: 随机播放

  // actions
  // 更新信息
  const updateInfo = (url, info) => {
    musicUrl.value = url
    songInfo.value = info
  }
  // 更新播放时间
  const updateTime = (time) => {
    currentTime.value = time
  }
  // 模式切换
  const modeChange = () => {
    mode.value = ((mode.value + 1) % 3) + 1
  }

  // getters
  return {
    musicUrl,
    songInfo,
    currentTime,
    mode,
    updateInfo,
    updateTime,
    modeChange
  }
})
