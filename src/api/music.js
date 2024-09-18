import instance from '@/utils/instance'

// 获取用户歌单信息
export const getUserPlayList = (uid) =>
  instance.get(`/user/playlist?uid=${uid}`)

// 获取歌单详情
export const getPlayListDetail = (id) =>
  instance.get(`/playlist/detail?id=${id}`)

// 通过歌单 id 分页获取歌曲信息
export const getSongListDetail = (id, offset = 0, limit = 50) =>
  instance.get(`/playlist/track/all?id=${id}&offset=${offset}&limit=${limit}`)

// 设置喜欢的歌曲
export const setLikeSong = (id, like = true) =>
  instance.get(`/like?id=${id}&like=${like}`)

// 获取喜欢列表
export const getLikeList = (uid) => instance.get(`/likelist?uid=${uid}`)
