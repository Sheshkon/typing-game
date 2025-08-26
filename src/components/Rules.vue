<script setup>
import {COMBO_ATTACK_COST, COMBO_HEAL_COST} from '@/constants.js';
defineProps({
  comboCost: {
    type: Number,
    default: COMBO_ATTACK_COST
  },
  healCost: {
    type: Number,
    default: COMBO_HEAL_COST
  }
});
</script>

<template>
  <section class='rules'>
    <h2>Game Rules</h2>
    <ul>
      <li>The player is in the center of the field; enemies attack from all directions.</li>
      <li>
        To throw a shuriken — type the word above the enemy's head in the input field.
      </li>
      <li>
        If the enemy is too close, typing will trigger a sword attack instead.
      </li>
      <li>
        If an enemy reaches the player — the player loses 1 life.
      </li>
      <li>
        Word <strong>"combo"</strong> — destroys all enemies around.<br>
        Cost: <strong>{{ comboCost }}</strong> combo points.
      </li>
      <li>
        Word <strong>"heal"</strong> — restores 1 life.<br>
        Cost: <strong>{{ healCost }}</strong> combo points.
      </li>
    </ul>
  </section>
</template>

<style scoped>
.rules {
  background: rgba(255, 229, 229, 0.13);
  color: #000000;
  padding: 0 1rem;
  border-radius: 8px;
  max-width: 500px;
}

.rules ul {
  padding-left: 1.2rem;
}
.rules li {
  margin: 0.5rem 0;
}
</style>
