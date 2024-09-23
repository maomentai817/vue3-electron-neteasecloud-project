import instance from '@/utils/instance'

// 获取 mv 信息
export const getMvDetail = (id) => instance.get(`/mv/detail?mvid=${id}`)

// 获取 mv 点赞数评论数分享数信息
export const getMvInfo = (id) => instance.get(`/mv/detail/info?mvid=${id}`)

// 获取 mv 播放地址
export const getMvUrl = (id) => instance.get(`/mv/url?id=${id}`)
