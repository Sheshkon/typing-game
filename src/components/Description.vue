<script setup>
import {useI18n} from 'vue-i18n';

const {t, tm} = useI18n();
</script>

<template>
  <section class='description'>
    <h2>{{ t('description.title') }}</h2>
    <p v-for='(text, index) in tm("description.paragraphs")' :key='index'>
      {{ text }}
    </p>
  </section>
</template>

<style scoped>
.description {
  padding: 0 1rem;
  border-radius: 8px;
  max-width: 500px;
}

.description p {
  margin: 0.6rem 0;
  line-height: 1.4;
}
</style>
