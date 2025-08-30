<script setup>
import {computed} from 'vue';

import MoonIcon from '@/components/icons/MoonIcon.vue';
import MusicIcon from '@/components/icons/MusicIcon.vue';
import MusicOffIcon from '@/components/icons/MusicOffIcon.vue';
import SunIcon from '@/components/icons/SunIcon.vue';
import {useSettingsStore} from '@/stores/settings';
import {Theme} from '@/types/theme.js';
import {getLanguageOptions} from '@/utils/language.js';

const settings = useSettingsStore();
const languageOptions = computed(() => getLanguageOptions());

</script>

<template>
  <div class='settings'>
    <div class='field'>
      <v-select
          id='lang'
          v-model='settings.language'
          :reduce='option => option.value'
          :options='languageOptions'
          :clearable='false'
          :searchable='false'
          label='label'
          value='value'
      />
    </div>

      <button @click='settings.toggleTheme' class='btn'>
        <MoonIcon v-show='settings.theme === Theme.Dark'/>
        <SunIcon v-show='settings.theme === Theme.Light'/>
      </button>
      <button @click='settings.toggleSound' class='btn'>
        <MusicIcon v-show='settings.isSoundEnabled'/>
        <MusicOffIcon v-show='!settings.isSoundEnabled'/>
      </button>
  </div>
</template>

<style scoped>
.settings {
  display: flex;
  font-weight: bold;
  flex-direction: row;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.btn{
  margin-top: 0.25rem;
}
</style>
