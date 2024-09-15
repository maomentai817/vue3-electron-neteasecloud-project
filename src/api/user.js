import instance from '@/utils/instance'

// 获取用户信息
export const getUserDetail = (uid) => instance.get(`/user/detail?uid=${uid}`)

// 获取账号信息
export const getUserAccount = () => instance.get('/user/account')

// 获取歌手详情
export const getArtistDetail = (id) => instance.get(`/artist/detail?id=${id}`)

// 获取用户绑定信息
export const getUserBinding = (uid) => instance.get(`/user/binding?uid=${uid}`)
