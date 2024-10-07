import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMusicStore = defineStore(
  'music',
  () => {
    // state
    const musicUrl = ref('') // 用户当前播放歌曲的url
    const songInfo = ref({}) // 用户当前播放歌曲的信息
    const stop = ref(false) // 播放状态
    const currentTime = ref(0)
    const mode = ref(1) // 播放模式 1: 顺序播放 2: 单曲循环 3: 随机播放
    // 播放列表, 存放歌曲 id
    const preList = ref([])
    // 播放列表, 存放具体数据
    const preListInfo = ref([])

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
    // 添加歌曲 ID 至播放列表
    const addSong = (id) => {
      // 去重
      if (!preList.value.includes(id)) {
        preList.value.unshift(id)
      }
    }

    // 添加歌曲信息至播放列表
    const addSongInfo = (info) => {
      // 去重
      if (!preListInfo.value.some((song) => song.id === info.id)) {
        preListInfo.value.unshift(info)
      }
    }

    const clearList = () => {
      preList.value = []
      preListInfo.value = []
    }

    // getters
    return {
      musicUrl,
      songInfo,
      currentTime,
      mode,
      stop,
      preList,
      preListInfo,
      addSongInfo,
      addSong,
      updateInfo,
      updateTime,
      modeChange,
      clearList
    }
  },
  {
    persist: true
  }
)
