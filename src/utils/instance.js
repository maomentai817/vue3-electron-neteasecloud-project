import axios from 'axios'
import { ElMessage } from 'element-plus'

const baseURL = import.meta.env.VITE_APP_WEB_URL

const instance = axios.create({
  baseURL,
  timeout: 15000
})

const ignoreState = ['/login/qr/check']
// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 请求前操作
    // TODO: 添加token / 设置请求头
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    // const token = localStorage.getItem('token')
    if (!config.params) {
      config.params = {}
    }
    const cookie = localStorage.getItem('MUSIC_U')
    if (cookie) {
      config.params.cookie = `MUSIC_U=${cookie}`
    }

    // POST 请求 url 必须添加时间戳,使每次请求 url 不一样,不然请求会被缓存
    /* 由于接口做了缓存处理 ( 缓存 2 分钟,不缓存数据极容易引起网易服务器高频 ip 错误 , 可在 app.js 设置 ,
      可能会导致登录后获取不到 cookie), 相同的 url 会在两分钟内只向网易服务器发一次请求 ,
     如果遇到不需要缓 存结果的接口 , 可在请求 url 后面加一个时间戳参数使 url 不同 */
    config.params.timestamp = Date.now()
    return config
  },
  (err) => {
    // 错误处理
    return Promise.reject(err)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO: 业务处理失败操作
    // if (res.status !== 200) {
    //   return Promise.reject(new Error(res.statusText))
    // }
    // TODO: 摘取核心响应数据
    const {
      status,
      data: { code }
    } = res
    const url = res?.config.url?.split('?')[0]
    if (!ignoreState.includes(url) && (status !== 200 || code !== 200)) {
      ElMessage({
        type: 'error',
        message: res?.data.message || `请求出现错误, 当前状态码为 ${code}`
      })
      return Promise.reject(res?.data)
    }
    return res?.data
  },
  (err) => {
    ElMessage({
      type: 'error',
      message: err.message
    })
    // TODO: 处理 401 错误 -- token 失效
    if (err.response && err.response.status === 401) {
      // TODO: 跳转登录页
      // TODO: 清除token
    }
    return Promise.reject(err.response.data)
  }
)

export default instance
