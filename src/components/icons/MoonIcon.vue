<template>
  <svg-icon type='mdi' :path='path'></svg-icon>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMoonWaningCrescent } from '@mdi/js';

export default {
  name: 'MoonIcon',
  components: {
    SvgIcon
  },
  data() {
    return {
      path: mdiMoonWaningCrescent,
    };
  }
};
</script>
