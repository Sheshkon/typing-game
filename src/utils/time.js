import {i18n} from '@/i18n.js';
import {locales} from '@/locales/locale.js';

export function getFormattedDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
        return `${hours}h ${mins}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
}

export function formatDate(dateValue) {
    const {locale} = locales[i18n.global.locale.value];
    
    if (!dateValue) return '';
    const date = new Date(dateValue);

    return date.toLocaleString(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

