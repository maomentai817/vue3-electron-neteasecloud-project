import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserAccount } from '@/api/user'
import { getUserPlayList } from '@/api/music'

export const useUserStore = defineStore(
  'user',
  () => {
    // state
    const profile = ref(
      JSON.parse(localStorage.getItem('profile')) || {
        avatarUrl: '', // 头像
        backgroundUrl: '', // 背景图
        nickname: '', // 昵称
        createTime: null,
        vipType: null,
        userId: null
      }
    )
    const isLogin = ref(JSON.parse(localStorage.getItem('isLogin')) || false) // 是否登录
    const userPlayListInfo = ref(
      JSON.parse(localStorage.getItem('userPlayListInfo')) || []
    ) // 用户歌单信息
    const userLikeIds = ref(
      JSON.parse(localStorage.getItem('userLikeIds')) || []
    ) // 用户喜欢的歌曲id
    const volume = ref(JSON.parse(localStorage.getItem('volume')) || 1) // 用户当前播放器音量
    // actions

    const getUserInfo = async () => {
      const res = await getUserAccount()
      updateProfile(res.profile)
    }

    const getPlayList = async () => {
      // TODO: 获取用户歌单信息
      const data = await getUserPlayList(profile.value.userId)
      console.log(data)
      updateUserPlayList(data.playlist)
    }

    const updateProfile = (val) => {
      if (!val || !val.userId) {
        window.$login.show()
        //todo 游客登录, 待完成
        return
      }
      for (const valKey in profile.value) {
        if (val[valKey]) {
          profile.value[valKey] = val[valKey]
        }
      }
      isLogin.value = true
    }

    const updateUserPlayList = (val) => {
      userPlayListInfo.value = val
    }
    // getters
    return {
      profile,
      isLogin,
      userPlayListInfo,
      userLikeIds,
      volume,
      updateProfile,
      updateUserPlayList,
      getUserInfo,
      getPlayList
    }
  },
  // 本地持久化
  {
    persist: true
  }
)
