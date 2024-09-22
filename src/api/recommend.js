import instance from '@/utils/instance'

// 获取首页轮播图
export const getBanner = () => instance.get('/banner')

// 获取每日推荐歌单
export const getRecommendResource = () => instance.get('/recommend/resource')

// 获取每日推荐歌曲
export const getRecommendSongs = () => instance.get('/recommend/songs')

// 获取推荐歌单
export const getPersonalized = (limit = 10) =>
  instance.get(`/personalized?limit=${limit}`)

// 网友精选碟
export const getTopList = (limit = 10, order = 'hot') =>
  instance.get(`/top/playlist?limit=${limit}&order=${order}`)

// 获取所有榜单摘要
export const getTopListDetail = () => instance.get('/toplist/detail')
