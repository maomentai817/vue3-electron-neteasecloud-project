import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMusicStore = defineStore('music', () => {
  // state
  const musicUrl = ref('') // 用户当前播放歌曲的url
  const songInfo = ref({}) // 用户当前播放歌曲的信息
  const currentTime = ref(0)

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

  // getters
  return {
    musicUrl,
    songInfo,
    currentTime,
    updateInfo,
    updateTime
  }
})
