import instance from '@/utils/instance'

// 获取歌手详情
export const getArtistDetail = (id) => instance.get(`/artists/?id=${id}`)

// 获取歌手专辑
export const getArtistAlbum = (id, limit, offset) =>
  instance.get(`/artist/album?id=${id}&limit=${limit}&offset=${offset}`)

// 获取歌手 MV
export const getArtistMv = (id, limit, offset) =>
  instance.get(`/artist/mv?id=${id}&limit=${limit}&offset=${offset}`)

// 获取歌手介绍
export const getArtistDesc = (id) => instance.get(`/artist/desc?id=${id}`)
