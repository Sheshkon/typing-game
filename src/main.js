import {createPinia} from "pinia";
import {createApp} from 'vue'
import VueSelect from "vue-select";
import App from './App.vue'
import './style.css'

createApp(App)
    .use(createPinia())
    .component("v-select", VueSelect)
    .mount('#app')
