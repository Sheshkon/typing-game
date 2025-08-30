<template>
  <svg-icon type='mdi' :path='path'></svg-icon>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMusic } from '@mdi/js';

export default {
  name: 'MusicIcon',
  components: {
    SvgIcon
  },
  data() {
    return {
      path: mdiMusic,
    };
  }
};
</script>
