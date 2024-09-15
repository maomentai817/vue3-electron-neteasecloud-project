import instance from '@/utils/instance'

// 二维码 key 生成接口
export const getLoginQrKey = () => instance.get('/login/qr/key')

// 二维码生成接口
export const getLoginQr = (key, qrimg) =>
  instance.get('/login/qr/create', { params: { key, qrimg } })

// 二维码监测扫码状态接口
export const getLoginQrSta = (key) =>
  instance.get(`/login/qr/check?key=${key}&noCookie=true`)
