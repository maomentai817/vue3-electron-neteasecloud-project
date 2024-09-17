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
