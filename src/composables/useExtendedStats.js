import {ref, watchEffect} from 'vue';

import {db} from '@/stores/db.js';

const totalWords = ref(0);
const totalDuration = ref(0);
const languagePercentages = ref([]);
const maxLevel = ref(0);


async function fetchStats() {
    const all = await db.results.toArray();

    totalWords.value = all.reduce((sum, r) =>
        sum + (r.correctWordsCount || 0) + (r.wrongWordsCount || 0), 0
    );

    totalDuration.value = all.reduce((sum, r) => sum + r.rawDuration, 0);

    const langCounts = all.reduce((acc, r) => {
        acc[r.language] = (acc[r.language] || 0) + 1;
        return acc;
    }, {});

    const totalGames = all.length;
    languagePercentages.value = Object.entries(langCounts).map(([lang, count]) => ({
        language: lang,
        percent: ((count / totalGames) * 100).toFixed(1)
    }));

    maxLevel.value = all.reduce((max, r) => Math.max(max, r.attempt || 0), 0);
}

watchEffect(fetchStats);

export function useExtendedStats() {
    return {
        totalWords,
        totalDuration,
        languagePercentages,
        maxLevel,
        fetchStats
    };
}

