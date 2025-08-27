<script setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';

import {useSettingsStore} from '@/stores/settings';
import {getLanguageOptions} from '@/utils/language.js';
import {getThemeOptions} from '@/utils/theme.js';

const settings = useSettingsStore();
const languageOptions = computed(() => getLanguageOptions());
const themeOptions = computed(() => getThemeOptions(settings.language));

const {t} = useI18n();

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

    <div class='field'>
      <v-select
          id='theme'
          v-model='settings.theme'
          :reduce='option => option.value'
          :options='themeOptions'
          :clearable='false'
          :searchable='false'
          label='label'
          value='value'
      />
    </div>

    <div class='sound-toggle'>
      <label for='sound'>{{ t('labels.sound') }}</label>
      <input
          v-model='settings.isSoundEnabled'
          type='checkbox'
          id='sound'
          class='sound-toggle-checkbox'
      />
    </div>
  </div>
</template>

<style scoped>
.settings {
  display: flex;
  font-weight: bold;
  flex-direction: column;
}

.sound-toggle {
  display: flex;
  margin-left: 7px;
  margin-top: 0.25rem;
  gap: 1.4rem;
}

.sound-toggle-checkbox {
  margin: 0;
}

.field {
  display: flex;
}
</style>
