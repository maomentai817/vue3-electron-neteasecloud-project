/**
 * @description 倒计时函数封装
 */
import { ref, computed, onUnmounted } from 'vue'
import dayjs from 'dayjs'
export const useCountDown = () => {
  // formatTime 格式化时间
  // start 函数启动
  const time = ref(0)
  let timer = null
  const formatTime = computed(() => {
    return dayjs.unix(time.value).format('mm分ss秒')
  })
  const start = (currentTimr) => {
    time.value = currentTimr
    timer = setInterval(() => {
      if (time.value > 0) {
        time.value--
      }
    }, 1000)
  }
  // 定时器销毁
  onUnmounted(() => {
    timer && clearInterval(timer)
  })
  return {
    formatTime,
    start
  }
}
