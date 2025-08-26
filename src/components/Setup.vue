<script setup>
import { createPopper } from '@popperjs/core';
import { ref, watch } from 'vue';

import { useGameStore } from '@/stores/game.js';
import 'vue-select/dist/vue-select.css';

defineProps({
  onAction: Function
});

const gameStore = useGameStore();
const selectedLevel = ref(1);

const levels = Array.from({ length: 7 }, (_, i) => ({
  label: `Level ${i + 1}`,
  value: i + 1
}));

watch(selectedLevel, (newValue) => {
  gameStore.startLevel = newValue;
});

function withPopper(dropdownList, component, { width }) {
  dropdownList.style.width = width;
  createPopper(component.$refs.toggle, dropdownList, {
    placement: 'bottom',
    modifiers: [
      { name: 'flip', options: { fallbackPlacements: ['top'] } },
      { name: 'offset', options: { offset: [0, -1] } }
    ]
  });
}
</script>

<template>
  <div class='game-setup'>
    <button @click='onAction' class='start-btn'>▶️ Play</button>
    <v-select
        v-model='selectedLevel'
        :options='levels'
        label='label'
        :reduce='level => level.value'
        class='level-select'
        :clearable='false'
        true-value='top'
        append-to-body
        :calculate-position='withPopper'
    />
  </div>
</template>

<style>
.game-setup {
  display: flex;
  /* justify-content: center; */
  align-items: center;
  gap: 0.5rem;
}

.start-btn {
  border: none;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  background: none;
}
.start-btn:hover {
  background: linear-gradient(135deg, #7bff00, #dc2626);
}
.start-btn:active {
  transform: scale(0.96);
}

.level-select {
  padding-top: 2px;
  min-width: 100px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
}
.level-select option {
  min-width: 100px;
}

.vs__dropdown-menu {
  min-width: 100px;
  overflow-x: hidden;
}

.vs__dropdown-option {
  min-width: 100px;
  white-space: nowrap;
}

.vs__dropdown-toggle {
  border: none;
  box-shadow: none;
}

.vs__search {
  border: none;
  box-shadow: none;
}
</style>
