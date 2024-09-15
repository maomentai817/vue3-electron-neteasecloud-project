import instance from '@/utils/instance'

// 获取用户歌单信息
export const getUserPlayList = (uid) =>
  instance.get(`/user/playlist?uid=${uid}`)
