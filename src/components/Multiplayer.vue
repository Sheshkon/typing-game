<script setup>
import {Notifications, notify} from '@kyvg/vue3-notification';
import {inject, ref } from 'vue';

import {useWebRTC} from '@/composables/useWebRTC.js';
import {NOTIFICATION_DURATION} from '@/constants.js';
import {AnimationController} from '@/logic/animation.js';
import {useGameStore} from '@/stores/game.js';

const opponentCanvas = inject('opponentCanvas');

const params = new URLSearchParams(location.search);
const gameStore = useGameStore();
const linkCopied = ref(false);
let message = null;
let animationController = null;

gameStore.room = params.get('room');

const {
  inviteLink,
  createRoom,
  joinRoom,
  startAutoSend,
  regenerateRoom
} = useWebRTC(gameStore.room, msg => {
  message = msg;
  gameStore.opponentIsReady = true;
  if (!animationController) {
    const ctx = opponentCanvas.value.getContext('2d', {alpha: true});
    animationController = new AnimationController(ctx, true);
    opponentAnimationLoop();
  }

  gameStore.opponentCurrentScore = msg?.stats.score;
  if (gameStore.opponentBestScore < msg?.multiplayerBestScore) {
    gameStore.opponentBestScore = msg?.multiplayerBestScore;
  }
});

function opponentAnimationLoop() {
  animationController.update(null, message);
  requestAnimationFrame(() => opponentAnimationLoop());
}

async function createRoomForOpponent() {
  if (!gameStore.room) {
    gameStore.room = await createRoom();
    console.log('Share link with opponent:', inviteLink.value);
  }
}

function startSendDataToOpponent() {
  if (gameStore.isMultiplayer) {
    gameStore.isReady = true;
    startAutoSend(40, () => gameStore);
  }
}

async function handleRegenerate() {
  linkCopied.value = false;
  gameStore.room = await regenerateRoom();
  console.log('New link:', inviteLink.value);

}

defineExpose({
  startSendDataToOpponent,
  createRoomForOpponent,
});

if (gameStore.room) {
  joinRoom().then(() => console.log('Join to room ', gameStore.room));
  gameStore.isMultiplayer = true;
}

function copyInviteLink() {
  navigator.clipboard.writeText(inviteLink.value)
      .then(() => {
        notify({
          type: 'success',
          duration: NOTIFICATION_DURATION,
          text: 'Link is copied',
        });
        linkCopied.value = true;
      })
      .catch(err => {
        console.error('Error copy link:', err);
      });
}

</script>

<template>
  <notifications dangerouslySetInnerHtml :close-on-click='true'/>
  <div class='multiplayer' v-if='gameStore.isMultiplayer || gameStore.room'>
    <p>Status: {{ gameStore.connectionStatus }}</p>
    <p v-if='inviteLink && !linkCopied'>
      <button class='link-btn' @click='copyInviteLink'>Copy link for opponent</button>
    </p>
    <button class='link-btn' v-if='!params.get("room")' @click='handleRegenerate'>Regenerate link</button>
  </div>
</template>

<style scoped >
.multiplayer{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.link-btn {
  background: none;
  color: blue;
  padding: 0px;
}
</style>
