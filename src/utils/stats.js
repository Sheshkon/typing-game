export function getAccuracy(stats) {
    return Math.floor(stats.last.correctWordsCount / (stats.last.wrongWordsCount + stats.last.correctWordsCount) * 100);
}
