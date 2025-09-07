<script setup>
import {createPopper} from '@popperjs/core';
import {computed, onMounted, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';

import Multiplayer from '@/components/Multiplayer.vue';
import Settings from '@/components/Settings.vue';
import {LEVELS_COUNT} from '@/level/config.js';
import {useGameStore} from '@/stores/game.js';

import 'vue-select/dist/vue-select.css';

const {t} = useI18n();

const props = defineProps({
  onAction: Function,
});


const gameStore = useGameStore();
const selectedLevel = ref(null);
const multiplayerRef = ref(null);

const levels = computed(() => Array.from({length: LEVELS_COUNT}, (_, i) => ({
  label: `${t('labels.level')} ${i + 1}`,
  value: i + 1
})));

function withPopper(dropdownList, component, {width}) {
  dropdownList.style.width = width;
  createPopper(component.$refs.toggle, dropdownList, {
    placement: 'bottom',
    modifiers: [
      {name: 'flip', options: {fallbackPlacements: ['top']}},
      {name: 'offset', options: {offset: [0, -1]}}
    ]
  });
}

function onClickStart() {
  props.onAction();
  multiplayerRef.value.startSendDataToOpponent();
}

function onClickMultiplayer() {
  gameStore.toggleMultiplayer();
  multiplayerRef.value.createRoomForOpponent();
}

onMounted(() => {
  selectedLevel.value = gameStore.startLevel;
});

watch(selectedLevel, (newValue) => {
  gameStore.setStartLevel(newValue);
});

</script>

<template>
  <div class='setup'>
    <Multiplayer ref='multiplayerRef'/>
    <div class='play-btns'>
      <button v-if='!gameStore.isMultiplayer || (gameStore.isMultiplayer && gameStore.connectionStatus === "connected")'
              @click='onClickStart' class='start-btn'>▶️
        {{ t("labels.play") }}
      </button>

      <button
          @click='onClickMultiplayer'
          v-if='!gameStore.isMultiplayer && !gameStore.room'
      >
        Multiplayer 👥
      </button>
    </div>
    <div class='game-setup'>

      <v-select
          v-model='selectedLevel'
          :options='levels'
          label='label'
          :reduce='level => level.value'
          class='level-select'
          :clearable='false'
          true-value='top'
          append-to-body
          :searchable='false'
          :calculate-position='withPopper'
      />
      <Settings/>
    </div>
  </div>

</template>

<style>
.game-setup {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.start-btn {
  border: none;
  padding: 0.25rem 1.2rem 0.3rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 0.5rem;
  cursor: pointer;
  background: linear-gradient(135deg, #7bff00, #dc2626);
}

.start-btn:active {
  transform: scale(0.96);
}

.setup {
  display: flex;
  flex-direction: column;
  gap: 0.5rem
}

.play-btns {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: fit-content;
  align-items: center;
  justify-content: center;
  align-self: center;
}
</style>
