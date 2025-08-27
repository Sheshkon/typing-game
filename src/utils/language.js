import {locales} from '@/locales/locale.js';

export function getLanguageOptions() {
    return Object.entries(locales).map(([code, data]) => ({
        value: code,
        label: data.language
    }));
}