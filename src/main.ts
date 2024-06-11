import './assets/main.css'
import { Quasar, Notify } from 'quasar'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Quasar, {
  plugins: { Notify }
})

app.mount('#app')
