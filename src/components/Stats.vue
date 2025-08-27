<script setup>
import {useI18n} from 'vue-i18n';

import {useGameStore} from '@/stores/game.js';

const gameStore = useGameStore();
const { t } = useI18n();
</script>

<template>
  <div class='stats'>
    <div>{{ t('labels.lives') }}: <span class='hearts'>❤️ {{ gameStore.stats.lives }}</span></div>
    <div>{{ t('labels.score')}}: <b>{{ gameStore.stats.score }}</b></div>
    <div>{{ t('labels.combo') }}: <b>{{ gameStore.stats.combo }}</b></div>
    <div>{{ t('labels.level') }}: <b>{{ gameStore.level }}</b></div>
  </div>

</template>

<style scoped>
.stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px
}
</style>
