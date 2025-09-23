import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as stores from './stores'   // ✅ మీ అన్ని stores ఇక్కడ
import { createPinia } from 'pinia'   // ✅ Pinia import

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import './style.css'
import { FontAwesomeIcon } from './utils/fontawesome'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Import Poppins font
import '@fontsource/poppins/300.css'; // Light
import '@fontsource/poppins/400.css'; // Regular
import '@fontsource/poppins/500.css'; // Medium
import '@fontsource/poppins/700.css'; // Bold


const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light'
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
          mdi,
        },
    }
})

const app = createApp(App)

const pinia = createPinia()   // ✅ Pinia instance create

const toastOptions = {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
}

app.use(router)
app.use(pinia)   // ✅ Pinia inject
app.use(vuetify)
app.use(Toast, toastOptions)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
