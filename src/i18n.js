import { createI18n } from 'vue-i18n';

import {locales} from '@/locales/locale.js';

export const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('language') || 'EN',
    messages: locales,
    fallbackLocale: 'EN',
});
