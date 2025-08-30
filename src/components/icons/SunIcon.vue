<template>
  <svg-icon type='mdi' :path='path'></svg-icon>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiWhiteBalanceSunny } from '@mdi/js';

export default {
  name: 'SunIcon',
  components: {
    SvgIcon
  },
  data() {
    return {
      path: mdiWhiteBalanceSunny,
    };
  }
};
</script>
