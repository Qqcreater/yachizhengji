import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err, info)
}

window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('is not a function')) {
    event.preventDefault()
    console.warn('Suppressed non-critical error:', event.message)
  }
})

window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault()
  console.warn('Unhandled promise rejection:', event.reason)
})

app.use(createPinia())
app.use(router)

app.mount('#app')
