import Notifications from '@kyvg/vue3-notification';
import {createPinia} from 'pinia';
import {createApp} from 'vue';
import VueSelect from 'vue-select';

import App from './App.vue';
import {i18n} from './i18n';
import './style.css';

createApp(App)
    .use(createPinia())
    .use(i18n)
    .use(Notifications)
    .component('v-select', VueSelect)
    .mount('#app');
