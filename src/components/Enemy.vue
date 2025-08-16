<template>
  <div
      class="enemy"
      :class="{ dead: enemy.isDead }"
      :style="{ left: enemy.x + 'px', top: enemy.y + 'px' }"
  >
    <span class="icon" aria-hidden="true">🥷</span>
    <span class="word">{{ enemy.word }}</span>
  </div>
</template>

<script setup>
defineProps({
  enemy: { type: Object, required: true }
})
</script>

<style scoped>
.enemy {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: var(--enemy);
  border: 2px solid #dca3a3;
  border-radius: 8px;
  font-weight: 700;
  transition: transform 0.25s linear, opacity 0.25s linear;
  user-select: none;
}
.icon { filter: drop-shadow(0 1px 0 rgba(0,0,0,.15)); }
.enemy.dead {
  opacity: 0;
  transform: translateY(-12px) scale(0.85) rotate(-6deg);
}
</style>
