<script setup>
import {Notifications} from '@kyvg/vue3-notification';
import {UseFullscreen} from '@vueuse/components';
import {Fullscreen} from 'lucide-vue-next';
import {nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';

import Description from '@/components/Description.vue';
import ExtendedStatistics from '@/components/ExtendedStatistics.vue';
import GameSync from '@/components/MultiplayerMode.vue';
import Results from '@/components/Results.vue';
import Rules from '@/components/Rules.vue';
import Settings from '@/components/Settings.vue';
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

const multiplayerMode = ref(null);

let loopController = null;
let typeController = new TypeController();

function setupCanvas() {
  ctx.value = canvas.value.getContext('2d', {alpha: true});
  canvas.value.width = gameStore.field.w;
  canvas.value.height = gameStore.field.h;
  canvas.value.style.width = gameStore.field.vw + 'px';
  canvas.value.style.height = gameStore.field.vh + 'px';
}

function toggleFullscreen(toggle) {
  toggle();
  postToggleFullscreen();
}

function postToggleFullscreen() {
  setTimeout(() => {
    input.value?.focus();
    input.value?.scrollIntoView();
  }, 100);
}

function handleKeyDown(e) {
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

async function start() {
  loopController.stop();
  multiplayerMode.value.startSync();
  gameStarted.value = true;
  await nextTick(() => input.value.focus());
  loopController.start();
}

async function restart() {
  loopController.restart();
  await nextTick(() => input.value.focus());
}

watch(() => gameStore.input, (newValue) => {
  if (newValue.endsWith(' ')) {
    typeController.checkTyped();

    nextTick(() => {
      gameStore.input = '';
    });
  }
});

onUnmounted(() => {
  start();
});

onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyDown));

onMounted(async () => {
  await setUp();
  document.addEventListener('fullscreenchange', postToggleFullscreen);
  loopController = new LoopController(ctx.value);
});
</script>

<template>
  <GameSync ref='multiplayerMode'/>
  <div class='game'>
    <h1>{{ t('game.title') }}</h1>
    <Setup v-show='!gameStarted' :on-action='start'/>
    <Description/>
    <Rules/>

    <UseFullscreen
        v-show='gameStarted'
        v-slot='{ toggle }'
        teleport='false'
        pageOnly='true'
        class='theme-wrapper fullscreen-mode'
    >
      <notifications dangerouslySetInnerHtml :close-on-click='true'/>
      <div class='game-field'>
        <Stats/>
        <Settings :style='{flexDirection: "row", justifyContent: "center", margin: "0.5rem" }'/>
        <div class='layout'>
          <div class='side left'>
            <ExtendedStatistics/>
          </div>

          <div class='center'>
            <button
                class='restart-btn'
                v-show='gameStore.gameOver'
                @click='restart'
            >
              {{ t('labels.restart') }}
            </button>
            <canvas ref='canvas' class='battlefield'></canvas>
            <button class='fullscreen-btn' @click='toggleFullscreen(toggle)'>
              <Fullscreen/>
            </button>
            <input
                ref='input'
                v-model='gameStore.input'
                @keydown='handleKeyDown'
                :placeholder='t("game.placeholder")'
                class='typebox theme-wrapper'
                autocomplete='off'
                autocapitalize='none'
                spellcheck='false'
                autofocus
            />
            <p class='hint' v-html='t("game.hint")'/>
          </div>
          <div class='side right'>
            <Results/>
          </div>
        </div>

      </div>
    </UseFullscreen>
  </div>
</template>

<style>
.game {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 1rem;
  border-radius: 1rem;
}

.layout {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: start;
  justify-items: center;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.side {
  min-width: 200px;
  max-width: 300px;
  width: 100%;
  box-sizing: border-box;
}

.left,
.right {
  display: flex;
  justify-content: center;
}

.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.battlefield {
  display: block;
  border: 2px solid #111;
  background-image: url('@/assets/background-compressed.png');
  background-size: cover;
  height: auto !important;
  border-radius: 1rem;
}

.typebox {
  width: min(55vh, 55vw);
  font-size: 18px;
  padding: 10px;
  border: 2px solid #111;
  border-radius: 1rem;
  color: black;
}

.hint {
  text-align: center;
}

.fullscreen-btn {
  margin-bottom: 0.25rem;
  border: none;
  cursor: pointer;
  background: none;
}

.fullscreen-mode:fullscreen {
  padding: 1rem;
  box-sizing: border-box;
}

.fullscreen-mode:fullscreen canvas.battlefield {
  width: calc(min(100vh - 15rem, 100vw - 15rem)) !important;
  height: auto !important;
  display: block;
  margin: 0 auto;
}

.game-field {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.restart-btn {
  position: absolute;
  border: none;
  padding: 0.25rem 1.2rem 0.3rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 0.5rem;
  cursor: pointer;
  color: black;
  background: linear-gradient(135deg, #7bff00, #dc2626);
}

</style>
