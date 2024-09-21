import instance from '@/utils/instance'

// 获取专辑评论
export const getAlbumComment = (id, offset = 0, limit = 20) =>
  instance.get(`/comment/album?id=${id}&offset=${offset}&limit=${limit}`)

// 获取热评
// 0: 歌曲
// 1: mv
// 2: 歌单
// 3: 专辑
// 4: 电台节目
// 5: 视频
// 6: 动态
// 7: 电台
export const getHotComment = (id, type, before = 0, offset = 0, limit = 20) =>
  instance.get(
    `/comment/hot?id=${id}&type=${type}&offset=${offset}&limit=${limit}&before=${before}`
  )

// 最新版获取评论
export const getCommentList = (
  id,
  type,
  cursor = 0,
  pageSize = 20,
  pageNo = 1,
  sortType = 3
) =>
  instance.get(
    `/comment/new?id=${id}&type=${type}&cursor=${cursor}&pageSize=${pageSize}&pageNo=${pageNo}&sortType=${sortType}`
  )
