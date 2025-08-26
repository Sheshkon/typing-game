<script setup>
import { useI18n } from 'vue-i18n';

import { COMBO_ATTACK_COST, COMBO_HEAL_COST } from '@/constants.js';

const { t, tm } = useI18n();

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
    <h2>{{ t('rules.title') }}</h2>
    <ul>
      <li v-for='(text, index) in tm("rules.items")' :key='index'>
        <span v-if='index === 4'>
          {{ t('rules.items[4]', { combo: comboCost }) }}
        </span>
        <span v-else-if='index === 5'>
          {{ t('rules.items[5]', { heal: healCost }) }}
        </span>
        <span v-else>
          {{ text }}
        </span>
      </li>
    </ul>
  </section>
</template>


<style scoped>
.rules {
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
