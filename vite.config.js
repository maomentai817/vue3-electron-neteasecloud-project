import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import * as path from 'path'
// import electron from 'vite-plugin-electron/simple'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'
import { presetUno } from 'unocss'
import { presetDaisy } from 'unocss-preset-daisy'
import optimizer from 'vite-plugin-optimizer'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    port: 5173
  },
  mode: 'development',
  plugins: [
    vue(),
    optimizer({
      electron: `const { ipcRenderer } = require('electron'); export { ipcRenderer };`
    }),
    UnoCSS({ presets: [presetUno(), presetDaisy()] }),
    AutoImport({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass'
        })
      ]
    }),
    Components({
      // resolvers: [ElementPlusResolver()]
      // 配置 element-plus 采用 sass 主题配色方案
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
    })
    // electron
    // electron({
    //   main: {
    //     entry: 'electron/index.cjs'
    //   },
    //   preload: {
    //     // Must be use absolute path, this is the limit of rollup
    //     input: path.join(__dirname, 'electron/preload.cjs')
    //   }
    //   // renderer: {}
    // })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 2. 自动导入定制化样式文件进行样式覆盖
        additionalData: `
          @use "@/styles/element/index.scss" as *; $SASS_WARN_DEPRECATION: false;
        `
      }
    }
  }
  // build: {
  //   emptyOutDir: false, // 必须配置，否则electron相关文件将不会生成build后的文件
  //   commonjsOptions: {
  //     transformMixedEsModules: true
  //   }
  // }
})
