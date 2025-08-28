<script setup>
import {storeToRefs} from 'pinia';
import {computed} from 'vue';

import {useGameResults} from '@/composables/useGameResults';
import {locales} from '@/locales/locale.js';
import {useSettingsStore} from '@/stores/settings.js';

const {options, items, totalItems, isLoading} = useGameResults();
const {theme, language} = storeToRefs(useSettingsStore());

const headers = computed(() => {
  const {labels} = locales[language.value];

  return [
    // {title: 'id', key: 'id', nowrap: true},
    {title: labels.score, key: 'score', nowrap: true},
    {title: labels.accuracy, key: 'accuracy', nowrap: true},
    {title: labels.language, key: 'language', nowrap: true},
    {title: labels.heal, key: 'healCount', nowrap: true},
    {title: labels.combo, key: 'comboCount', nowrap: true},
    {title: labels.start, key: 'startTime', nowrap: true},
    {title: labels.duration, key: 'duration', nowrap: true}
  ];
});

</script>

<template>
  <v-data-table-server
      v-show='totalItems > 0'
      v-model:options='options'
      search=''
      :headers='headers'
      :items='items'
      :items-length='totalItems'
      :loading='isLoading'
      :items-per-page='7'
      :theme='theme'
      :hide-no-data='true'
      :hide-default-footer='false'
      :hide-default-header='false'
      class='small-table'
      :show-select='false'
      :header-props='{ style: "font-weight: bold;" }'
      :cell-props='{ style: "padding: 0; text-align: center; height: 10px;" }'
  />
</template>

<style>

.v-data-table-footer__items-per-page {
  display: none;
}

.v-data-table-footer {
  height: 4rem;
  padding: 0;
}
</style>
