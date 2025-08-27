import {Howler} from 'howler';
import {defineStore} from 'pinia';
import {ref, watch, watchEffect} from 'vue';

import {i18n} from '@/i18n.js';
import {Language} from '@/types/language.js';

export const useSettingsStore = defineStore('settings', () => {
    const isSoundEnabled = ref(JSON.parse(localStorage.getItem('soundEnabled') ?? 'true'));
    const language = ref(localStorage.getItem('language') ?? Language.EN);
    const theme = ref(localStorage.getItem('theme') ?? Language.RU);

    function toggleSound() {
        isSoundEnabled.value = !isSoundEnabled.value;
    }

    function setLanguage(lang) {
        language.value = lang;
        localStorage.setItem('language', lang);
        i18n.global.locale.value = lang;
    }

    function setTheme(newTheme) {
        theme.value = newTheme;
        localStorage.setItem('theme', newTheme);
    }

    watchEffect(() => {
        Howler.mute(!isSoundEnabled.value);
    });

    watch(isSoundEnabled, (val) => {
        localStorage.setItem('soundEnabled', JSON.stringify(val));
    });

    return {
        isSoundEnabled,
        language,
        theme,
        toggleSound,
        setLanguage,
        setTheme
    };
});
