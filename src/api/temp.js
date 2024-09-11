import instance from '@/utils/instance.js'

export const getTemp = (params) => {
  return instance.get('/api/temp', {
    params
  })
}
