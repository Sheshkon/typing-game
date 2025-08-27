<script setup>
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';

import Description from '@/components/Description.vue';
import Rules from '@/components/Rules.vue';
import Setup from '@/components/Setup.vue';
import Stats from '@/components/Stats.vue';
import {Effect} from '@/entity/effect.js';
import {TypeController} from '@/logic/attack.js';
import {LoopController} from '@/logic/loop.js';
import {loadAssets} from '@/sprites/spiteManager.js';
import {useGameStore} from '@/stores/game';
import {Animation} from '@/types/animation.js';

const {t} = useI18n();
const gameStore = useGameStore();
const canvas = ref(null);
const ctx = ref(null);
const input = ref(null);
const gameStarted = ref(false);

let loopController = null;
let typeController = new TypeController();

function setupCanvas() {
  ctx.value = canvas.value.getContext('2d', {alpha: true});
  canvas.value.width = gameStore.field.w;
  canvas.value.height = gameStore.field.h;
  canvas.value.style.width = gameStore.field.vw + 'px';
  canvas.value.style.height = gameStore.field.vh + 'px';
}

function handleEnter(e) {
  if (e.code === 'Enter') {
    e.preventDefault();
    typeController.checkTyped();
  }
}

async function setUp() {
  await loadAssets();
  gameStore.effects = {
    [Animation.COMBO]: new Effect(Animation.COMBO),
    [Animation.HEAL]: new Effect(Animation.HEAL)
  };
  setupCanvas();
}

onMounted(async () => {
  await setUp();
  loopController = new LoopController(ctx.value);
});

watch(() => gameStore.input, (newValue) => {
  if (newValue.endsWith(' ')) {
    typeController.checkTyped();

    nextTick(() => {
      gameStore.input = '';
    });
  }
});

async function restart() {
  loopController.stop();
  gameStarted.value = true;
  await nextTick(() => input.value.focus());
  loopController.start();
}

onUnmounted(() => restart());
</script>

<template>
  <div class='game' :style='{ "--max-width": `${gameStore.field.vw + 150}px` }'>
    <h1>{{ t('game.title') }}</h1>
    <Setup v-show='!gameStarted' :on-action='restart'/>
    <Description/>
    <Rules/>
    <div v-show='gameStarted'>
      <Stats/>
      <canvas ref='canvas' class='battlefield'/>
      <input
          ref='input'
          v-model='gameStore.input'
          @keydown='handleEnter'
          :placeholder='t("game.placeholder")'
          class='typebox'
          autocomplete='off'
          autocapitalize='none'
          spellcheck='false'
          autofocus
      />
      <p class='hint' v-html='t("game.hint")'/>
    </div>
  </div>
</template>

<style scoped>
.game {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 1rem;
  border-radius: 1rem;
}

.battlefield {
  display: block;
  border: 2px solid #111;
  margin: 0 auto 12px;
  background-image: url('@/assets/background-compressed.png');
  background-size: cover;
}

.typebox {
  width: 100%;
  font-size: 18px;
  padding: 10px 12px;
  border: 2px solid #111;
  border-radius: 12px;
  color: black;
}

.hint {
  text-align: center
}
</style>
