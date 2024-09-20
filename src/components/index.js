// 将 components 文件夹下的所有组件进行全局化注册
import CardContainer from './modules/CardContainer/CardContainer.vue'
import musicBox from './modules/MusicBox/musicBox.vue'
import ListContent from './modules/ListContent/ListContent.vue'
import ListItem from './modules/ListItem/ListItem.vue'

export const componentPlugin = {
  install(app) {
    app.component('CardContainer', CardContainer)
    app.component('musicBox', musicBox)
    app.component('ListContent', ListContent)
    app.component('ListItem', ListItem)
  }
}
