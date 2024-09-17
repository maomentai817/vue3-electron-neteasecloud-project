import instance from '@/utils/instance'

// 获取用户歌单信息
export const getUserPlayList = (uid) =>
  instance.get(`/user/playlist?uid=${uid}`)

// 获取歌单详情
export const getPlayListDetail = (id) =>
  instance.get(`/playlist/detail?id=${id}`)
