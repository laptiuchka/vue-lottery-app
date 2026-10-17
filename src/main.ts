import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import { initRouter } from './app/providers/router'
import { registerServices } from './app/providers/services'
import { setupUI } from './app/providers/ui'

import 'primeicons/primeicons.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

registerServices()
setupUI(app)

const router = initRouter()
app.use(router)

app.mount('#app')