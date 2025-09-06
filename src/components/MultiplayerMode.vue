<script setup>
import {useWebRTC} from '@/composables/useWebRTC.js';
import {useGameStore} from '@/stores/game.js';

const params = new URLSearchParams(location.search);

let roomId = params.get('room');

const gameStore = useGameStore();

const {
  status,
  inviteLink,
  createRoom,
  joinRoom,
  send,
  startAutoSend,
  stopAutoSend,
  regenerateRoom
} = useWebRTC(roomId, msg => {
  console.log(msg);
  gameStore.opponentIsReady = msg?.isReady ?? false;
});

async function start() {
  if (!roomId) {
    roomId = await createRoom();
    console.log('Share link with opponent:', inviteLink.value);
  } else {
    await joinRoom();
  }
}

function startSync() {
  console.log('multi: ', status.value ==='connected');
  console.log('multi: ', status.value);
  console.log('is', gameStore.isMultiplayer);
  if (status.value === 'connected' && gameStore.isMultiplayer) {
    gameStore.isReady = true;
    startAutoSend(500, () => ({
      ...gameStore
    }));
  }
}

function stopSync() {
  stopAutoSend();
}

async function handleRegenerate() {
  roomId = await regenerateRoom();
  console.log('Новая ссылка:', inviteLink.value);
}

start();


defineExpose({
  startSync
});

</script>

<template>
  <button
      @click='gameStore.toggleMultiplayer'
      v-if='!gameStore.isMultiplayer && !roomId'
  >
    Multiplayer
  </button>

  <div v-if='gameStore.isMultiplayer || roomId'>
    <p>Статус: {{ status }}</p>
    <p v-if='inviteLink && status!=="connected"'>
      Link for your opponent:
      <a :href='inviteLink'>{{ inviteLink }}</a>
    </p>
    <button v-if='!params.get("room")' @click='handleRegenerate'>Regenerate room</button>
    <br/>
    <button v-if='status==="connected"' @click='startSync'>Set Ready</button>
  </div>
</template>
