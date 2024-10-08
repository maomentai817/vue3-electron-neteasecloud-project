import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserAccount, getUserDetail } from '@/api/user'
import { getUserPlayList, getLikeList, setLikeSong } from '@/api/music'
import { getCity } from '@/api/user'

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
    const userInfo = ref({})
    const isLogin = ref(JSON.parse(localStorage.getItem('isLogin')) || false) // 是否登录
    const userPlayListInfo = ref(
      JSON.parse(localStorage.getItem('userPlayListInfo')) || []
    ) // 用户歌单信息
    const userLikeList = ref(
      JSON.parse(localStorage.getItem('userLikeList')) || []
    ) // 用户喜欢的歌曲id
    const volume = ref(JSON.parse(localStorage.getItem('volume')) || 1) // 用户当前播放器音量
    // actions

    const getUserInfo = async () => {
      const res = await getUserAccount()
      updateProfile(res.profile)
      // 获取用户歌单信息
      await getPlayList()
      // 获取用户详细信息
      await getUserDetailInfo()
      // 获取用户喜欢的歌曲
      await getLikeListInfo()
    }

    // 获取用户详情
    const getUserDetailInfo = async () => {
      const res = await getUserDetail(profile.value.userId)
      userInfo.value = res
      userInfo.value.cityName = await parseCode(userInfo.value.profile.city)
      userInfo.value.provinceName = await parseCode(
        userInfo.value.profile.province
      )
    }

    const getPlayList = async () => {
      // TODO: 获取用户歌单信息
      const data = await getUserPlayList(profile.value.userId)
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

    const parseCode = async (code) => {
      const res = await getCity(code)
      // console.log(res.data)
      if (res.data.districts.length === 0) return '未知'
      return res.data.districts[0].name
    }

    // 获取喜欢列表
    const getLikeListInfo = async () => {
      const res = await getLikeList(profile.value.userId)
      userLikeList.value = res
    }
    // 添加喜欢歌曲
    const addLikeSong = async (id, like = true) => {
      await setLikeSong(id, like)
      await getLikeListInfo()
    }
    // getters
    return {
      profile,
      isLogin,
      userPlayListInfo,
      userLikeList,
      volume,
      userInfo,
      updateProfile,
      updateUserPlayList,
      getUserInfo,
      getPlayList,
      getUserDetailInfo,
      getLikeListInfo,
      addLikeSong,
      parseCode
    }
  },
  // 本地持久化
  {
    persist: true
  }
)
