// utils/formatDate.js
import dayjs from 'dayjs'

/**
 * 将时间戳格式化为 "YYYY-MM-DD HH:mm:ss" 格式的日期
 * @param {number} timestamp - 时间戳，单位为毫秒
 * @returns {string} 格式化后的日期字符串
 */
export const formatTimestamp = (timestamp) => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}
/**
 * 格式化数字为带万或亿的形式
 * @param {number} value - 传入的数值
 * @returns {string} 格式化后的字符串
 */
export const formatNumber = (value) => {
  if (value < 10000) {
    return value.toString()
  } else if (value < 100000000) {
    return (value / 10000).toFixed(1) + '万'
  } else {
    return (value / 100000000).toFixed(1) + '亿'
  }
}
