import Notifications from '@kyvg/vue3-notification';
import {createPinia} from 'pinia';
import {createApp} from 'vue';
import VueSelect from 'vue-select';

import {vuetify} from '@/plugins/vuetify.js';

import App from './App.vue';
import {i18n} from './i18n';
import './style.css';

createApp(App)
    .use(createPinia())
    .use(i18n)
    .use(Notifications)
    .use(vuetify)
    .component('v-select', VueSelect)
    .mount('#app');
