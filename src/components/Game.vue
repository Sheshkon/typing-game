<script setup>
import {Notifications} from '@kyvg/vue3-notification';
import {UseFullscreen} from '@vueuse/components';
import {Fullscreen} from 'lucide-vue-next';
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';

import Description from '@/components/Description.vue';
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
  setTimeout(() => {
    input.value?.focus();
    input.value?.scrollIntoView();
  }, 100);
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
  <div class='game'>
    <h1>{{ t('game.title') }}</h1>
    <Setup v-show='!gameStarted' :on-action='restart'/>
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
        <canvas ref='canvas' class='battlefield'/>
        <button class='fullscreen-btn' @click='toggleFullscreen(toggle)'>
          <Fullscreen/>
        </button>
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
    </UseFullscreen>
  </div>
</template>

<style>
.game {
  display: flex;
  align-items: center;
  flex-direction: column;
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
  width: calc(min(50vh, 50vw)) !important;
  height: auto !important;
}

.typebox {
  width: min(55vh, 55vw);
  font-size: 18px;
  padding: 10px;
  border: 2px solid #111;
  border-radius: 12px;
  color: black;
}

.hint {
  text-align: center
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
  height: calc(min(100vh - 14rem, 100vw - 14rem)) !important;
  width: auto !important;
  display: block;
  margin: 0 auto;
}

.game-field {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
