import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore(
  'global',
  () => {
    // state
    const color = ref('rgb(210,210,210)')
    const colors = ref([])
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
        // backgroundImage: `linear-gradient(to bottom, #13131a, ${rgbColor})`,
        backgroundImage: `linear-gradient(to bottom, ${rgbColor}, #13131a)`,
        opacity: '1'
      }
      color.value = rgbColor
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
    const setColor = (rgbColor) => {
      color.value = rgbColor
    }
    const setColors = (c1, c2) => {
      colors.value = [c1, c2]
    }

    // getters
    return {
      color,
      colors,
      bgLayer1Style,
      bgLayer2Style,
      setBackgroundStyle,
      setColor,
      setColors
    }
  },
  // 本地持久化
  {
    persist: true
  }
)
