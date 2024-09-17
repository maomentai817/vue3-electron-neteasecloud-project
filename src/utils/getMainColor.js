import ColorThief from 'colorthief'

/**
 * 封装一个函数，用于提取图片的主色
 * @param {string} imgUrl 图片的 URL
 * @param {number} colorCount 提取的颜色数量
 * @param {number} brightnessThreshold 判断颜色亮度的阈值
 * @returns {Promise<string>} 返回提取到的颜色（rgb格式的字符串）
 */
export function getDominantColor(
  imgUrl,
  colorCount = 5,
  brightnessThreshold = 200
) {
  return new Promise((resolve, reject) => {
    const colorThief = new ColorThief()
    const img = new Image()

    img.crossOrigin = 'Anonymous' // 允许跨域加载图片
    img.src = imgUrl
    // 判断颜色是否太亮
    const isColorTooBright = (rgbColor) => {
      const [r, g, b] = rgbColor
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness > brightnessThreshold
    }

    // 当图片加载完成后，提取调色板并返回主色
    img.onload = () => {
      try {
        const palette = colorThief.getPalette(img, colorCount)
        const dominantColor =
          palette.find((color) => !isColorTooBright(color)) || palette[0]
        const rgbColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}, 1.2)`
        resolve(rgbColor)
      } catch (error) {
        reject(`Failed to get color from image: ${error}`)
      }
    }

    // 图片加载失败时，处理错误
    img.onerror = (error) => {
      reject(`Image failed to load: ${error}`)
    }
  })
}
