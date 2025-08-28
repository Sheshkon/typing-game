import {db} from '@/stores/db.js';
import {getAccuracy} from '@/utils/stats.js';
import {formatDate, getFormattedDuration} from '@/utils/time.js';

export const GameResultsRepo = {
    async save(stats, language, additional) {
        return db.transaction('rw', db.results, async () => {
            const rawDuration = stats.last.endTime - stats.last.startTime;
            const result = {
                language,
                attempt: stats.last.attempt,
                score: stats.score,
                comboCount: stats.last.comboCount,
                healCount: stats.last.healCount,
                wrongWordsCount: stats.last.wrongWordsCount,
                correctWordsCount: stats.last.correctWordsCount,
                accuracy: getAccuracy(stats),
                startTime: formatDate(stats.last.startTime),
                endTime: formatDate(stats.last.endTime),
                duration: getFormattedDuration(rawDuration),
                rawDuration,
                ...additional
            };

            const id = await db.results.add(result);

            return await db.results.get(id);
        });
    },

    /**
     * @param {Object} options
     * @param {string} [options.sortBy='startTime']
     * @param {'asc'|'desc'} [options.order='desc']
     * @param {number} [options.page=1]
     * @param {number} [options.pageSize=10]
     * @returns {Promise<{data: Array, total: number, page: number, pageSize: number}>}
     */
    async getAll({ sortBy = 'id', order = 'desc', page = 1, pageSize = 10 } = {}) {
        let collection;

        if (sortBy === 'id') {
            collection = db.results.orderBy('id'); // Работает, если ++id
        } else {
            collection = db.results.orderBy(sortBy);
        }

        if (order === 'desc') {
            collection = collection.reverse();
        }

        const total = await collection.count();
        const data = await collection
            .offset((page - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        return { data, total, page, pageSize };
    },

    async clearAll() {
        await db.results.clear();
    }
};
