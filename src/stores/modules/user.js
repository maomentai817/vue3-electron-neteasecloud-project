import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // state
    const profile = ref({
      avatarUrl: '', // 头像
      backgroundUrl: '', // 背景图
      nickname: '', // 昵称
      createTime: null,
      vipType: null,
      userId: null
    })
    const isLogin = ref(false) // 是否登录
    const userPlayListInfo = ref([]) // 用户歌单信息
    const userLikeIds = ref([]) // 用户喜欢的歌曲id
    const volume = ref(JSON.parse(localStorage.getItem('volume')) || 1) // 用户当前播放器音量
    // actions
    // getters
    return {
      profile,
      isLogin,
      userPlayListInfo,
      userLikeIds,
      volume
    }
  },
  // 本地持久化
  {
    persist: true
  }
)
