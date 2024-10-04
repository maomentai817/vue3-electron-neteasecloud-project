import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia

// export * from './modules/xxx'
export * from './modules/user'
export * from './modules/global'
export * from './modules/search'
export * from './modules/music'
