<template>
  <div class="samurai" :class="{ attack: isAttacking, hurt: isHurt }">🧑‍🦲⚔️</div>
</template>

<script setup>
defineProps({ isAttacking: Boolean, isHurt: Boolean })
</script>

<style scoped>
.samurai {
  position: absolute;
  left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  transition: transform 0.25s ease;
}
.samurai.attack { transform: translate(-50%, -50%) rotate(-18deg); }
.samurai.hurt { animation: shake 0.22s linear 1; }
@keyframes shake {
  0% { transform: translate(-50%, -50%) }
  25% { transform: translate(-52%, -50%) }
  50% { transform: translate(-48%, -50%) }
  75% { transform: translate(-51%, -50%) }
  100% { transform: translate(-50%, -50%) }
}
</style>
