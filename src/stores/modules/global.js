import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore(
  'global',
  () => {
    // state
    const pointer = ref(0) // 指示当前使用的背景层
    const bgLayer1Style = ref({
      backgroundImage: 'linear-gradient(to bottom, #13131a, #13131a)',
      opacity: '1'
    })
    const bgLayer2Style = ref({
      backgroundImage: 'linear-gradient(to bottom, #13131a, #13131a)',
      opacity: '0'
    })

    // actions
    const setBackgroundStyle = (rgbColor) => {
      const newStyle = {
        backgroundImage: `linear-gradient(to bottom, #13131a, ${rgbColor})`,
        // backgroundImage: `linear-gradient(to bottom, ${rgbColor}, #13131a)`,
        opacity: '1'
      }

      if (pointer.value === 0) {
        bgLayer1Style.value = newStyle
        bgLayer1Style.value.opacity = '1'
        bgLayer2Style.value.opacity = '0'
        pointer.value = 1
      } else {
        bgLayer2Style.value = newStyle
        bgLayer2Style.value.opacity = '1'
        bgLayer1Style.value.opacity = '0'
        pointer.value = 0
      }
    }

    // getters
    return {
      bgLayer1Style,
      bgLayer2Style,
      setBackgroundStyle
    }
  },
  // 本地持久化
  {
    persist: true
  }
)
