<template>
  <div :class='{ dark: settings.theme === "Dark" }' class='theme-wrapper'>
    <Settings/>
    <Game/>
  </div>
</template>

<script setup>
import Game from '@/components/Game.vue';
import Settings from '@/components/Settings.vue';
import {useSettingsStore} from '@/stores/settings.js';

const settings = useSettingsStore();
</script>
