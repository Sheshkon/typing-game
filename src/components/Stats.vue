<script setup>
import {useGameStore} from '@/stores/game.js';

const gameStore = useGameStore();

</script>

<template>
  <div class='stats'>
    <div>Lives: <span class='hearts'>❤️ {{ gameStore.stats.lives }}</span></div>
    <div>Score: <b>{{ gameStore.stats.score }}</b></div>
    <div>Combo: <b>{{ gameStore.stats.combo }}</b></div>
    <div>Level: <b>{{ gameStore.level }}</b></div>
  </div>

</template>

<style scoped>
.stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px
}
</style>