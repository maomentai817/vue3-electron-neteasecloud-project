import instance from '@/utils/instance'
import axios from 'axios'

// 获取用户信息
export const getUserDetail = (uid) => instance.get(`/user/detail?uid=${uid}`)

// 获取账号信息
export const getUserAccount = () => instance.get('/user/account')

// 获取歌手详情
export const getArtistDetail = (id) => instance.get(`/artist/detail?id=${id}`)

// 获取用户绑定信息
export const getUserBinding = (uid) => instance.get(`/user/binding?uid=${uid}`)

// 获取城市码
// - 此处调用为高德地图 apikey, 仅供学习, 请勿用于其他用途 (注册详见 README.md)
const key = 'xxx'
export const getCity = (code) => {
  return axios.get(
    `https://restapi.amap.com/v3/config/district?key=${key}&keywords=${code}&subdistrict=0`
  )
}
