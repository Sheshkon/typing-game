import Dexie from 'dexie';

export const db = new Dexie('GameStatsDB');

db.version(6).stores({
    results: `
        ++id,
        language,
        attempt,
        score,
        startTime,
        endTime,
        rawDuration,
        duration,
        accuracy,
        comboCount,
        healCount,
        correctWordsCount,
        wrongWordsCount,
        level
    `
});
