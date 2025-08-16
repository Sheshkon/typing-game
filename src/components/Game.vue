<template>
  <div class="game"
       :style="{'--max-width': `${FIELD_SIZE + 80}px`}"
  >
    <h1>⚔️ Typing Samurai</h1>

    <div class="stats">
      <div>Жизни: <span class="hearts">❤️ {{ lives }}</span></div>
      <div>Очки: <b>{{ score }}</b></div>
      <div>Комбо: <b>{{ combo }}</b></div>
      <button class="btn" @click="restart">Перезапуск</button>
    </div>

    <div class="battlefield"
         ref="fieldRef"
         :style="{'--width': `${FIELD_SIZE}px`, '--height': `${FIELD_SIZE}px` }"
    >
      <!-- Враги -->
      <Enemy v-for="e in enemies" :key="e.id" :enemy="e"/>
      <!-- Самурай -->
      <Samurai :isAttacking="isAttacking" :isHurt="isHurt"/>
      <!-- Сюрикены -->
      <div
          v-for="s in shurikens"
          :key="s.id"
          class="shuriken"
          :style="{ left: s.x+'px', top: s.y+'px' }"
      >🌀
      </div>
    </div>

    <input
        ref="inputRef"
        v-model="input"
        @keydown.space.prevent="attemptAttack"
        placeholder="Печатай слово врага и жми Space…"
        class="typebox"
        autocomplete="off"
        autocapitalize="none"
        spellcheck="false"
    />

    <p class="hint">
      Вводи слово врага + <kbd>Space</kbd> → катана (близко) или сюрикен (далеко).
    </p>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue'
import Enemy from './Enemy.vue'
import Samurai from './Samurai.vue'

/** === СЛОВА === */
const words = [
  'dojo', 'aza', 'op', 'left', 'ri', 'soo', 'up', 'honor', 'sensei', 'samurai'
]

/** === СОСТОЯНИЕ === */
const lives = ref(INITIAL_LIVES)
const score = ref(0)
const combo = ref(0)
const input = ref('')
const enemies = ref([])
const shurikens = ref([])
const isAttacking = ref(false)
const isHurt = ref(false)

const fieldRef = ref(null)
const inputRef = ref(null)

let enemyId = 0
let shurikenId = 0
let loopTimer = null
let spawnTimer = null
let clearTimer = null

/** === ПАРАМЕТРЫ === */
const FIELD_SIZE = 500
const CENTER_X = FIELD_SIZE / 2
const CENTER_Y = FIELD_SIZE / 2
const KATANA_RADIUS = 120
const INITIAL_LIVES = 5

const COMBO_LIMIT = 25
const COMBO_ATTACK_COST = 7
const COMBO_HEAL_COST = 5

function restart() {
  lives.value = INITIAL_LIVES
  score.value = 0
  combo.value = 0
  input.value = ''
  enemies.value = []
  shurikens.value = []
  enemyId = 0
  shurikenId = 0
  isAttacking.value = false
  isHurt.value = false
  clearAll()
  startLoops()
  requestAnimationFrame(() => inputRef.value?.focus())
}

function clear() {
  shurikens.value = shurikens.value.filter(s => {
    if (s.isDead) return false
    const dx = CENTER_X - s.x
    const dy = CENTER_Y - s.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    return dist < FIELD_SIZE
  })
  enemies.value = enemies.value.filter(e => {
    if (e.isDead) return false
    const dx = CENTER_X - e.x
    const dy = CENTER_Y - e.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    return dist < FIELD_SIZE
  })
}

/** === СПАВН ВРАГОВ === */
function spawnEnemy() {
  const word = words[Math.floor(Math.random() * words.length)]
  const angle = Math.random() * Math.PI * 2
  const radius = FIELD_SIZE / 2 - 20
  const x = CENTER_X + Math.cos(angle) * radius
  const y = CENTER_Y + Math.sin(angle) * radius
  const speed = 1 + Math.random() * 0.1
  enemies.value.push({id: ++enemyId, word, x, y, angle, speed, isDead: false})
}

/** === ДВИЖЕНИЕ === */
function moveEnemies() {
  enemies.value.forEach(e => {
    if (!e.isDead) {
      const dx = CENTER_X - e.x
      const dy = CENTER_Y - e.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      e.x += (dx / dist) * e.speed
      e.y += (dy / dist) * e.speed

      if (dist < 20) {
        lives.value--
        combo.value = 0
        flashHurt()
        e.isDead = true
      }
    }
  })

  // двигаем сюрикены
  shurikens.value.forEach(s => {
    s.x += s.vx
    s.y += s.vy
    // проверяем столкновение с врагами
    const hitEnemy = enemies.value.find(e => !e.isDead && e.id === s.targetId)
    if (hitEnemy) {
      const dx = hitEnemy.x - s.x
      const dy = hitEnemy.y - s.y
      if (Math.sqrt(dx * dx + dy * dy) < 20) {
        hitEnemy.isDead = true
        score.value += 15
        s.isDead = true
      }
    }
  })
  if (lives.value <= 0) endGame()
}

function comboAttack() {
  combo.value -= COMBO_ATTACK_COST;
  enemies.value
      .filter(e => {
        if (e.isDead) return false
        const dx = CENTER_X - e.x
        const dy = CENTER_Y - e.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        return dist < 400
      })
      .forEach(e => {
        e.isDead = true
        score.value += 15
      })
}

function heal() {
  combo.value -= COMBO_HEAL_COST
  lives.value++
}

/** === АТАКА === */
function attemptAttack() {
  const typed = input.value.trim().toLowerCase()
  if (!typed) return

  if (typed === 'combo') {
    if (combo.value >= COMBO_ATTACK_COST) {
      comboAttack()
    }
    input.value = ''
    return
  }

  if (typed === 'heal') {
    if (combo.value >= COMBO_HEAL_COST && lives.value < INITIAL_LIVES) {
      heal()
    }
    input.value = ''
    return
  }

  const target = enemies.value.find(e => e.word.toLowerCase() === typed)
  if (target) {
    const dx = target.x - CENTER_X
    const dy = target.y - CENTER_Y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist <= KATANA_RADIUS) {
      // катана: убиваем сразу
      target.isDead = true
      score.value += 10

      if (combo.value <= COMBO_LIMIT) combo.value++
      swing()
    } else {
      // сюрикен: летит в цель, но враг пока жив
      throwShuriken(dx, dy, target)
      combo.value++
    }
  } else {
    // // промах
    // lives.value--
    combo.value = 0
    // swing()
    flashHurt()
    // if (lives.value <= 0) {
    //   endGame()
    //   input.value = ''
    //   return
    // }
  }

  input.value = ''
}

function swing() {
  isAttacking.value = true
  setTimeout(() => (isAttacking.value = false), 220)
}

function throwShuriken(dx, dy, target) {
  const dist = Math.sqrt(dx * dx + dy * dy)
  shurikens.value.push({
    id: ++shurikenId,
    x: CENTER_X,
    y: CENTER_Y,
    vx: (dx / dist) * 6,
    vy: (dy / dist) * 6,
    targetId: target.id
  })
}

function flashHurt() {
  isHurt.value = true
  setTimeout(() => (isHurt.value = false), 220)
}

function startLoops() {
  loopTimer = setInterval(moveEnemies, 40)
  spawnTimer = setInterval(spawnEnemy, 2000)
  clearTimer = setInterval(clear, 40)
}

function endGame() {
  clearAll()
  setTimeout(() => alert(`Игра окончена! Очки: ${score.value}`), 0)
}

function clearAll() {
  clearInterval(clearTimer);
  clearTimer = null
  clearInterval(loopTimer);
  loopTimer = null
  clearInterval(spawnTimer);
  spawnTimer = null
}

onMounted(() => {
  startLoops()
  requestAnimationFrame(() => inputRef.value?.focus())
})

onUnmounted(() => {
  clearAll()
})
</script>

<style scoped>
.game {
  max-width: var(--max-width);
  margin: 24px auto;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, .06);
}

.stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.battlefield {
  position: relative;
  width: var(--width);
  height: var(--height);
  margin: 0 auto 12px;
  border: 2px solid #111;
  border-radius: 50%;
  background: var(--paper);
}

.typebox {
  width: 100%;
  font-size: 18px;
  padding: 10px 12px;
  border: 2px solid #111;
  border-radius: 12px;
}

.shuriken {
  position: absolute;
  font-size: 20px;
  pointer-events: none;
}
</style>
