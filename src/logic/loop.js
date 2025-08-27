import {notify} from '@kyvg/vue3-notification';

import {NOTIFICATION_DURATION} from '@/constants.js';
import {i18n} from '@/i18n.js';
import {locales} from '@/locales/locale.js';
import {AnimationController} from '@/logic/animation.js';
import {MoveController} from '@/logic/move.js';
import {Spawner} from '@/logic/spawn.js';
import {stopSound} from '@/sound/sound.js';
import {useGameStore} from '@/stores/game.js';
import {getFormattedDuration} from '@/utils/time.js';

const getLabels = () => locales[i18n.global.locale.value].labels;

export class LoopController {
    constructor(ctx) {
        this.ctx = ctx;
        this.lastTime = 0;
        this.gameLoopId = null;
        this.animLoopId = null;
        this.spawnTimerId = null;
        this.isRunning = false;
        this.gameStore = useGameStore();
        this.moveController = new MoveController();
        this.animationCotroller = new AnimationController(ctx);
        this.spawner = new Spawner();
    }

    start() {
        if (this.isRunning) return;
        // playSound(Sound.BACKGROUND, true)
        this.stop();
        this.lastTime = performance.now();
        this.isRunning = true;

        this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
        this.animLoopId = requestAnimationFrame(() => this.animLoop());
        this.spawnLoop();
        this.gameStore.stats.last.startTime = Date.now();
        this.gameStore.stats.last.attempt++;
    }

    spawnLoop() {
        this.spawner.spawnEnemy();
        const delay = this.gameStore.levelConfig.spawnInterval;
        this.spawnTimerId = setTimeout(() => this.spawnLoop(), delay);
    }

    stop() {
        if (this.gameLoopId) cancelAnimationFrame(this.gameLoopId);
        if (this.animLoopId) cancelAnimationFrame(this.animLoopId);
        if (this.spawnTimerId) clearInterval(this.spawnTimerId);

        this.gameLoopId = this.animLoopId = this.spawnTimerId = null;
        this.isRunning = false;
    }

    gameLoop() {
        if (!this.isRunning) return;
        if (this.gameStore.gameOver) {
            stopSound();
            this.stop();
            this.gameStore.stats.last.endTime = Date.now();
            this.#notifyGameOver(this.gameStore.stats);
            this.gameStore.resetGame();
            this.start();
            this.gameStore.gameOver = false;
            return;
        }
        this.moveController.update(this.gameStore);
        this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
    }

    #notifyGameOver(stats) {
        const labels = getLabels();
        const msg = this.#buildGameOverNotificationMessage(stats, labels);
        console.log(msg);
        notify({
            type:  this.gameStore.stats.last.attempt % 2 ? 'warn' : 'success',
            duration: NOTIFICATION_DURATION,
            title: labels.results,
            text: msg,
        });
    }

    #buildGameOverNotificationMessage(stats, labels) {
        const accuracy = this.#getAccuracy(stats);
        const duration = getFormattedDuration(stats.last.endTime - stats.last.startTime);

        return `
            <b>${labels.attempt}:</b> #${stats.last.attempt}<br>
            <b>${labels.score}:</b> ${stats.score}<br>
            <b>${labels.combo}:</b> ${stats.last.comboCount}<br>
            <b>${labels.heal}:</b> ${stats.last.healCount}<br>
            <b>${labels.wrong}:</b> ${stats.last.wrongWordsCount}<br>
            <b>${labels.correct}:</b> ${stats.last.correctWordsCount}<br>
            <b>${labels.accuracy}:</b> ${accuracy}%<br>
            <b>${labels.duration}:</b> ${duration}<br>
    `;
    }

    #getAccuracy(stats) {
        return Math.floor(stats.last.correctWordsCount / (stats.last.wrongWordsCount + stats.last.correctWordsCount) * 100);
    }

    animLoop() {
        if (!this.isRunning) return;
        const delta = this.#getDelta();
        this.animationCotroller.update(delta);
        this.animLoopId = requestAnimationFrame(() => this.animLoop());
    }

    #getDelta() {
        const now = performance.now();
        const delta = now - this.lastTime;
        this.lastTime = now;
        return delta;
    }
}
