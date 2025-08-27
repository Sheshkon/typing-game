import {locales} from '@/locales/locale.js';
import {Theme} from '@/types/theme.js';

export function getThemeOptions(lang) {
    const dict = locales[lang] || locales.EN;
    return [
        { value: Theme.Dark, label: dict.dark },
        { value: Theme.Light, label: dict.light }
    ];
}
