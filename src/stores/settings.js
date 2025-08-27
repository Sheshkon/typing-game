import {Howler} from 'howler';
import {defineStore} from 'pinia';
import {ref, watch} from 'vue';

import {i18n} from '@/i18n.js';
import {Language} from '@/types/language.js';
import {Theme} from '@/types/theme.js';

export const useSettingsStore = defineStore('settings', () => {
    const isSoundEnabled = ref(JSON.parse(localStorage.getItem('soundEnabled') ?? 'true'));
    const language = ref(localStorage.getItem('language') ?? Language.EN);
    const theme = ref(localStorage.getItem('theme') ?? Theme.Light);

    watch(theme, (newTheme) => {
        localStorage.setItem('theme', newTheme);
               document.querySelectorAll('.theme-wrapper').forEach(el => {
            el.classList.toggle('dark', newTheme === Theme.Dark);
        });
    }, {immediate: true});

    watch(isSoundEnabled, (value) => {
        localStorage.setItem('soundEnabled', JSON.stringify(value));
        Howler.mute(!value);
    }, {immediate: true});

    watch(language, (lang) => {
        localStorage.setItem('language', lang);
        i18n.global.locale.value = lang;
    }, {immediate: true});

    return {
        isSoundEnabled,
        language,
        theme
    };
});

