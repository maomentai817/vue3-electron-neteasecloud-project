// 将 components 文件夹下的所有组件进行全局化注册
import TempComponent from './modules/TempComponent/TempComponent.vue'
import CardContainer from './modules/CardContainer/CardContainer.vue'

export const componentPlugin = {
  install(app) {
    app.component('TempComponent', TempComponent)
    app.component('CardContainer', CardContainer)
  }
}
