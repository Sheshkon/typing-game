<script setup>
import { useI18n } from 'vue-i18n';

import { useExtendedStats } from '@/composables/useExtendedStats';
import { getFormattedDuration } from '@/utils/time.js';

const { t } = useI18n();
const { totalWords, totalDuration, languagePercentages, maxLevel } = useExtendedStats();
</script>

<template>
  <div v-show='totalDuration > 0' class='extended-stats'>
    <div class='title'>{{ t('stats.extended') }}</div>

    <div class='stat-row'>
      <div class='label'>{{ t('stats.totalWords') }}</div>
      <div class='value'>{{ totalWords }}</div>
    </div>

    <div class='stat-row'>
      <div class='label'>{{ t('stats.totalDuration') }}</div>
      <div class='value'>{{ getFormattedDuration(totalDuration) }}</div>
    </div>

    <div class='stat-row'>
      <div class='label'>{{ t('stats.maxLevel') }}</div>
      <div class='value'>{{ maxLevel }}</div>
    </div>

    <div class='lang-table'>
      <div class='lang-header'>
        <div class='lang-cell'>{{ t('stats.language') }}</div>
        <div class='lang-cell'>{{ t('stats.percent') }}</div>
      </div>
      <div class='lang-row' v-for='l in languagePercentages' :key='l.language'>
        <div class='lang-cell'>{{ l.language }}</div>
        <div class='lang-cell'>{{ l.percent }}%</div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.extended-stats {
  font-size: 14px;
}

.title {
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
}

.value {
  text-align: right;
}

.lang-table {
  display: flex;
  flex-direction: column;
}

.lang-header {
  display: flex;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
}

.lang-row {
  display: flex;
  border-bottom: 1px solid #eee;
}

.lang-cell {
  flex: 1;
  padding: 2px 0;
}
</style>
