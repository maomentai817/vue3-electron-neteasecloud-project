import instance from '@/utils/instance'

// 获取歌曲详情
export const getSongDetail = (ids) => instance.get(`/song/detail?ids=${ids}`)

// 获取音乐 url
export const getSongUrl = (id, level = 'standard') =>
  instance.get(`/song/url/v1?id=${id}&level=${level}`)

// 获取歌词
export const getLyric = (id) => instance.get(`/lyric/new?id=${id}`)
