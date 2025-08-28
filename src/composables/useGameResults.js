import { ref, watchEffect } from 'vue';

import { GameResultsRepo } from '@/stores/repository.js';

const options = ref({
    page: 1,
    itemsPerPage: 5,
    sortBy: [{ key: 'id', order: 'desc' }]
});

const items = ref([]);
const totalItems = ref(0);
const isLoading = ref(false);

async function fetchData() {
    isLoading.value = true;
    const { page, itemsPerPage, sortBy } = options.value;
    const sort = sortBy?.[0] ?? { key: 'id', order: 'desc' };

    try {
        const { data, total } = await GameResultsRepo.getAll({
            sortBy: sort.key,
            order: sort.order,
            page,
            pageSize: itemsPerPage
        });
        items.value = data;
        totalItems.value = total;
    } finally {
        isLoading.value = false;
    }
}

watchEffect(fetchData);

export function useGameResults() {
    return { options, items, totalItems, isLoading, fetchData };
}
