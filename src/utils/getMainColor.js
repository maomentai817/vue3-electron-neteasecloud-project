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
        const rgbColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`
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

// colorThief.getPalette 获取并筛选出两个色差最大的颜色

/**
 * 提取图片的调色板，并筛选出两个色差最大的颜色
 * @param {string} imgUrl 图片的 URL
 * @param {number} colorCount 提取的颜色数量
 * @returns {Promise<Array<Array<number>>>} 返回两个 RGB 值数组
 */
export function getMaxColorDifference(imgUrl, colorCount = 5) {
  return new Promise((resolve, reject) => {
    const colorThief = new ColorThief()
    const img = new Image()

    img.crossOrigin = 'Anonymous' // 允许跨域加载图片
    img.src = imgUrl

    img.onload = () => {
      try {
        const palette = colorThief.getPalette(img, colorCount) // 获取调色板

        if (palette.length < 2) {
          reject('Not enough colors in the palette.')
          return
        }

        let maxDifference = 0
        let colorPair = []

        // 遍历所有颜色对，计算色差
        for (let i = 0; i < palette.length - 1; i++) {
          for (let j = i + 1; j < palette.length; j++) {
            const color1 = palette[i]
            const color2 = palette[j]
            const difference = getColorDifference(color1, color2)

            if (difference > maxDifference) {
              maxDifference = difference
              colorPair = [color1, color2]
            }
          }
        }

        resolve(colorPair) // 返回两个色差最大的颜色
      } catch (error) {
        reject(`Failed to get colors from image: ${error}`)
      }
    }

    img.onerror = (error) => {
      reject(`Image failed to load: ${error}`)
    }
  })
}

/**
 * 计算两个 RGB 颜色之间的欧几里得距离（色差）
 * @param {Array<number>} color1 第一个颜色的 RGB 数组
 * @param {Array<number>} color2 第二个颜色的 RGB 数组
 * @returns {number} 返回色差的大小
 */
function getColorDifference(color1, color2) {
  const rDiff = color1[0] - color2[0]
  const gDiff = color1[1] - color2[1]
  const bDiff = color1[2] - color2[2]
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff)
}
