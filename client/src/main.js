import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'


import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


const app = createApp(App)

app.use(router)

app.mount('#app')