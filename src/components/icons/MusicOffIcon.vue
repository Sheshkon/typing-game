<template>
  <svg-icon type='mdi' :path='path'></svg-icon>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMusicOff } from '@mdi/js';

export default {
  name: 'MusicOffIcon',
  components: {
    SvgIcon
  },
  data() {
    return {
      path: mdiMusicOff,
    };
  }
};
</script>
