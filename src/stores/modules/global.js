import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore(
  'global',
  () => {
    // state
    const backgroundStyle = ref({
      backgroundImage: 'linear-gradient(to bottom, #13131a, #13131a)' // 默认渐变
    })
    // actions
    const setBackgroundStyle = (rgbColor) => {
      backgroundStyle.value = {
        backgroundImage: `linear-gradient(to bottom, ${rgbColor}, #13131a)`
      }
    }
    // getters
    return {
      backgroundStyle,
      setBackgroundStyle
    }
  },
  // 本地持久化
  {
    persist: true
  }
)
