import {Language} from '@/types/language.js';

export const LEVELS_COUNT = 7;

const baseConfig = {
    1: {spawnInterval: 800, scoresPerAction: 5},
    2: {spawnInterval: 900, scoresPerAction: 5},
    3: {spawnInterval: 1200, scoresPerAction: 10},
    4: {spawnInterval: 1500, scoresPerAction: 12},
    5: {spawnInterval: 2000, scoresPerAction: 15},
    6: {spawnInterval: 2500, scoresPerAction: 18},
    7: {spawnInterval: 2800, scoresPerAction: 20},
    default: {spawnInterval: 3000, scoresPerAction: 25}
};

const modules = import.meta.glob('./*.js', { eager: true });

const levelWords = Object.values(Language).reduce((acc, langCode) => {
    const fileKey = `./${langCode.toLowerCase()}.js`;
    acc[langCode] = modules[fileKey]?.default || modules[`${Language.EN}./.js`].default;
    return acc;
}, {});


export function getConfig(language, level) {
    const wordsForLang = levelWords[language] || levelWords[Language.EN];
    const words = wordsForLang[level] || wordsForLang.default;
    const config = baseConfig[level] || baseConfig.default;
    return {...config, words};
}
