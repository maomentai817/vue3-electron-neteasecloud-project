/**
 * 定义全局懒加载指令
 */
import { useIntersectionObserver } from '@vueuse/core'

export const lazyPlugin = {
  install(app) {
    // 懒加载指令逻辑
    app.directive('img-lazy', {
      mounted(el, binding) {
        const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
          // 图片进入视口区域
          if (isIntersecting) {
            el.src = binding.value
            stop()
          }
        })
      }
    })
  }
}
