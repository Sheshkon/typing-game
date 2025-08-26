<script setup>
import {storeToRefs} from 'pinia';
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';

import {useSettingsStore} from '@/stores/settings';

const settings = useSettingsStore();
const {isSoundEnabled, language, theme} = storeToRefs(settings);
const {toggleSound, setLanguage, setTheme} = settings;

const {t} = useI18n();

const languageOptions = [
  {label: 'English', value: 'EN'},
  {label: 'Русский', value: 'RU'}
];

const themeOptions = computed(() => [
  {label: t('labels.dark'), value: 'Dark'},
  {label: t('labels.light'), value: 'Light'}
]);

</script>

<template>
  <div class='settings'>
    <div class='field'>
      <v-select
          id='lang'
          v-model='language'
          @update:modelValue='setLanguage'
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
          v-model='theme'
          @update:modelValue='setTheme'
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
          type='checkbox'
          id='sound'
          class='sound-toggle-checkbox'
          :checked='isSoundEnabled'
          @change='toggleSound'
      />
    </div>
  </div>
</template>

<style scoped>
.settings {
  position: absolute;
  display: flex;
  font-weight: bold;
  flex-direction: column;
  top: 1rem;
  right: 1rem;
}

.sound-toggle {
  display: flex;
  margin-left: 7px;
  margin-top: 7px;
  gap: 1.4rem;
}

.sound-toggle-checkbox {
  margin: 0;
}

.field {
  display: flex;
}
</style>
